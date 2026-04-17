import { execFile } from "node:child_process";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { parseFlags } from "./_shared/args";
import { db } from "@/db/client";
import {
  applications,
  fillFormDrafts,
  profiles,
  statusEvents,
  students,
} from "@/db/schema";
import { logDone, logError } from "./_shared/logger";
import { tailorCvForJd } from "./_shared/cv-tailor";
import { generateRuntimeDir, cleanupRuntimeDir } from "./_shared/runtime-dir";

const execFileAsync = promisify(execFile);
const thisDir = dirname(fileURLToPath(import.meta.url));

const flagsSchema = z.object({
  student: z.string().min(1),
  "job-url": z.string().min(1),
  debug: z.preprocess((v) => v === true || v === "true", z.boolean().default(false)),
});

// fill-forms stdout contract: JSON with application results
const fillFormsResultSchema = z.object({
  company_name: z.string().min(1),
  company_normalized: z.string().min(1),
  role_normalized: z.string().min(1),
  job_url: z.string().min(1),
  platform: z.string().min(1),
  screenshot_r2_keys: z.array(z.string()).default([]),
  missed_fields: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
      }),
    )
    .default([]),
  needs_human: z
    .array(
      z.object({
        key: z.string(),
        label: z.string(),
        reason: z.string(),
      }),
    )
    .default([]),
});

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  // --- Assert readiness -------------------------------------------------------
  const profileRows = await db
    .select({
      id: profiles.id,
      readiness_verdict: profiles.readiness_verdict,
      profile_md: profiles.profile_md,
    })
    .from(profiles)
    .where(eq(profiles.student_id, flags.student))
    .limit(1);

  const profile = profileRows[0];
  if (!profile) {
    logError("no_profile", "No profile found for student", {
      student_id: flags.student,
    });
  }
  if (profile.readiness_verdict !== "ready") {
    logError("not_ready", "Student readiness_verdict is not 'ready'", {
      student_id: flags.student,
      verdict: profile.readiness_verdict,
    });
  }

  // --- Verify student exists ---------------------------------------------------
  const studentRows = await db
    .select({ id: students.id })
    .from(students)
    .where(eq(students.id, flags.student))
    .limit(1);
  if (!studentRows[0]) {
    logError("student_not_found", "No students row for the given id", {
      student_id: flags.student,
    });
  }

  // --- Generate runtime dir ---------------------------------------------------
  const workspaceDir = await generateRuntimeDir(flags.student);

  let applicationCount = 0;

  try {
    // --- Tailor CV for the target JD -------------------------------------------
    const jdUrl = flags["job-url"];

    // Check idempotency: skip if we already have an application for this exact URL
    const existingAppRows = await db
      .select({ id: applications.id })
      .from(applications)
      .where(eq(applications.job_url, jdUrl))
      .limit(1);

    if (existingAppRows[0]) {
      logDone({
        student_id: flags.student,
        application_count: 0,
        skipped: true,
        reason: "application_exists_for_job_url",
      });
    }

    // Invoke fill-forms.mjs subprocess
    const fillFormsPath = resolve(
      thisDir,
      "../../../career-ops/bin/fill-forms.mjs",
    );

    const stdinPayload = JSON.stringify({
      candidate: {
        student_id: flags.student,
        profile_md: profile.profile_md,
      },
      application: {
        job_url: jdUrl,
      },
      workspaceDir,
    });

    let fillFormsStdout: string;
    try {
      const result = await execFileAsync("node", [fillFormsPath], {
        env: { ...process.env },
        maxBuffer: 10 * 1024 * 1024,
        timeout: 600_000, // 10 min max
        cwd: workspaceDir,
      });
      fillFormsStdout = result.stdout;
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : String(cause);
      logError("fill_forms_failed", `fill-forms subprocess failed: ${message}`, {
        student_id: flags.student,
      });
    }

    // Parse fill-forms output
    let fillResult: z.infer<typeof fillFormsResultSchema>;
    try {
      const parsed: unknown = JSON.parse(fillFormsStdout);
      fillResult = fillFormsResultSchema.parse(parsed);
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : String(cause);
      logError("fill_forms_parse_failed", `Could not parse fill-forms output: ${message}`, {
        student_id: flags.student,
      });
    }

    // --- Tailor CV using LLM ---------------------------------------------------
    // First, create the application row (needed for cv-tailor's application_id)
    const platformValue = normalizePlatform(fillResult.platform);

    const insertedApps = await db
      .insert(applications)
      .values({
        student_id: flags.student,
        company_name: fillResult.company_name,
        company_normalized: fillResult.company_normalized,
        role_normalized: fillResult.role_normalized,
        job_url: fillResult.job_url,
        platform: platformValue,
        status: "applied",
        applied_at: new Date(),
      })
      .onConflictDoNothing()
      .returning({ id: applications.id });

    const insertedApp = insertedApps[0];
    if (!insertedApp) {
      // Idempotency: application already existed
      logDone({
        student_id: flags.student,
        application_count: 0,
        skipped: true,
        reason: "idempotent_skip",
      });
    }

    const applicationId = insertedApp.id;

    // Tailor CV for this JD
    await tailorCvForJd({
      profileMd: profile.profile_md,
      jdText: `Job URL: ${fillResult.job_url}\nCompany: ${fillResult.company_name}\nRole: ${fillResult.role_normalized}`,
      studentId: flags.student,
      applicationId,
    });

    // --- Persist status_events -------------------------------------------------
    await db.insert(statusEvents).values({
      student_id: flags.student,
      application_id: applicationId,
      kind: "applied",
      note: `Applied via fill-forms to ${fillResult.company_name} - ${fillResult.role_normalized}`,
    });

    // --- Persist fill_form_drafts ----------------------------------------------
    await db.insert(fillFormDrafts).values({
      application_id: applicationId,
      screenshot_r2_keys_jsonb: fillResult.screenshot_r2_keys,
      missed_fields_jsonb: fillResult.missed_fields,
      needs_human_jsonb: fillResult.needs_human,
      state: "submitted",
    });

    applicationCount = 1;
  } finally {
    if (!flags.debug) {
      await cleanupRuntimeDir(flags.student);
    }
  }

  logDone({
    student_id: flags.student,
    application_count: applicationCount,
  });
}

function normalizePlatform(
  raw: string,
): "greenhouse" | "lever" | "ashby" | "workable" | "other" {
  const lower = raw.toLowerCase();
  if (lower.includes("greenhouse")) return "greenhouse";
  if (lower.includes("lever")) return "lever";
  if (lower.includes("ashby")) return "ashby";
  if (lower.includes("workable")) return "workable";
  return "other";
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
