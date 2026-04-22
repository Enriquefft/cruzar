import { execFile } from "node:child_process";
import { readFile } from "node:fs/promises";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { applications, fillFormDrafts, profiles, statusEvents, students, user } from "@/db/schema";
import { uploadFileToR2 } from "@/lib/r2";
import type { platformValues } from "@/schemas/_shared";
import { parseFlags } from "./_shared/args";
import { prepareTailorContext, saveTailoredCv } from "./_shared/cv-tailor";
import { logDone, logError } from "./_shared/logger";
import { cleanupRuntimeDir, generateRuntimeDir } from "./_shared/runtime-dir";
import { renderCandidatesForStderr } from "./students/list";

const execFileAsync = promisify(execFile);
const thisDir = dirname(fileURLToPath(import.meta.url));

const flagsSchema = z.object({
  student: z.string().min(1),
  "job-url": z.string().url(),
  company: z.string().min(1),
  role: z.string().min(1),
  debug: z.preprocess((v) => v === true || v === "true", z.boolean().default(false)),
  "cv-markdown-path": z.string().min(1).optional(),
  "changes-summary": z.string().min(1).optional(),
});

const fillFormsResultSchema = z.object({
  filled: z.array(z.string()).default([]),
  missed: z.array(z.object({ key: z.string(), label: z.string() })).default([]),
  needsHuman: z
    .array(z.object({ key: z.string(), label: z.string(), reason: z.string() }))
    .default([]),
  screenshots: z.array(z.string()).default([]),
  finalStateScreenshot: z.string().default(""),
});

type Platform = (typeof platformValues)[number];

function detectPlatform(url: string): Platform {
  const lower = url.toLowerCase();
  if (lower.includes("greenhouse.io")) return "greenhouse";
  if (lower.includes("lever.co")) return "lever";
  if (lower.includes("ashbyhq.com")) return "ashby";
  if (lower.includes("workable.com")) return "workable";
  return "other";
}

function normalizeSlug(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function splitName(full: string): { firstName: string; lastName: string } {
  const parts = full.trim().replace(/\s+/g, " ").split(" ");
  const first = parts[0] ?? "";
  if (parts.length <= 1) return { firstName: first, lastName: "" };
  return { firstName: first, lastName: parts.slice(1).join(" ") };
}

async function main(): Promise<void> {
  // Pre-parse check: if `--student` is missing entirely, list `ready`
  // candidates on stderr so Miura (via CC) can pick an id before re-invoking
  // with the rest of the flags. Any other Zod issue still flows through
  // parseFlags below.
  if (!process.argv.slice(2).includes("--student")) {
    const block = await renderCandidatesForStderr("ready");
    process.stderr.write(block);
    process.stdout.write(
      `${JSON.stringify({ success: false, error: "missing_student", message: "Pass --student <id> along with --job-url --company --role. Candidates listed above on stderr; also run `/cruzar students list --state ready`." })}\n`,
    );
    process.exit(2);
  }

  const flags = parseFlags(flagsSchema);

  if (process.platform === "linux" && !process.env.DISPLAY) {
    logError(
      "no_display",
      "DISPLAY env var not set — headed Playwright cannot launch. Run from a graphical session.",
      { student_id: flags.student },
    );
  }

  const rows = await db
    .select({
      student_id: students.id,
      name: students.name,
      whatsapp: students.whatsapp,
      email: user.email,
      profile_md: profiles.profile_md,
      verdict: profiles.readiness_verdict,
    })
    .from(students)
    .innerJoin(user, eq(user.id, students.id))
    .leftJoin(profiles, eq(profiles.student_id, students.id))
    .where(eq(students.id, flags.student))
    .limit(1);

  const row = rows[0];
  if (!row) {
    logError("student_not_found", "No student row for the given id", {
      student_id: flags.student,
    });
  }
  if (!row.profile_md || !row.verdict) {
    logError("no_profile", "Student has no profile — run /cruzar assess first", {
      student_id: flags.student,
    });
  }
  if (row.verdict !== "ready") {
    logError("not_ready", "Student readiness_verdict is not 'ready'", {
      student_id: flags.student,
      verdict: row.verdict,
    });
  }

  const jobUrl = flags["job-url"];
  const companyNormalized = normalizeSlug(flags.company);
  const roleNormalized = normalizeSlug(flags.role);
  if (companyNormalized.length === 0 || roleNormalized.length === 0) {
    logError("bad_slug", "--company and --role must contain alphanumeric characters", {
      student_id: flags.student,
    });
  }
  const platform = detectPlatform(jobUrl);

  const inserted = await db
    .insert(applications)
    .values({
      student_id: flags.student,
      company_name: flags.company,
      company_normalized: companyNormalized,
      role_normalized: roleNormalized,
      job_url: jobUrl,
      platform,
      status: "applied",
      applied_at: new Date(),
    })
    .onConflictDoNothing({
      target: [
        applications.student_id,
        applications.company_normalized,
        applications.role_normalized,
        applications.job_url,
      ],
    })
    .returning({ id: applications.id });

  if (inserted.length === 0) {
    logDone({
      student_id: flags.student,
      application_count: 0,
      skipped: true,
      reason: "idempotent_skip",
      platform,
      company_normalized: companyNormalized,
      role_normalized: roleNormalized,
    });
  }
  const firstInserted = inserted[0];
  if (!firstInserted) {
    logError("insert_failed", "applications insert returned no row", {
      student_id: flags.student,
    });
  }
  const applicationId = firstInserted.id;

  const jdText = `Job URL: ${jobUrl}\nCompany: ${flags.company}\nRole: ${flags.role}\nPlatform: ${platform}`;

  const cvMarkdownPath = flags["cv-markdown-path"];
  if (!cvMarkdownPath) {
    const ctx = await prepareTailorContext({
      profileMd: row.profile_md,
      jdText,
      applicationId,
    });
    const payload = {
      success: false,
      error: "need_cv_markdown",
      message:
        "Author cv_markdown using system_prompt+user_prompt, write it to a temp file, then re-invoke run-cohort with --cv-markdown-path <path> and --changes-summary <string>.",
      student_id: flags.student,
      application_id: applicationId,
      next_version: ctx.nextVersion,
      system_prompt: ctx.system_prompt,
      user_prompt: ctx.user_prompt,
      output_schema_hint:
        "See cvTailorSchema in @/lib/prompts/cv-tailor — {cv_markdown: string (≥50 chars), changes_summary: string}. Write ONLY cv_markdown to the temp file; pass changes_summary via --changes-summary.",
      prompt_version: ctx.prompt_version,
    } as const;
    process.stdout.write(`${JSON.stringify(payload)}\n`);
    process.exit(2);
  }

  const changesSummary = flags["changes-summary"];
  if (!changesSummary) {
    logError(
      "missing_changes_summary",
      "--cv-markdown-path requires --changes-summary <string> describing what was tailored",
      { student_id: flags.student, application_id: applicationId },
    );
  }

  const workspaceDir = await generateRuntimeDir(flags.student);

  try {
    const cvPdfPath = join(workspaceDir, "cv.pdf");
    const cvMarkdown = await readFile(cvMarkdownPath, "utf-8");
    if (cvMarkdown.trim().length < 50) {
      logError("cv_markdown_too_short", "cv_markdown from --cv-markdown-path is shorter than 50 chars", {
        student_id: flags.student,
        application_id: applicationId,
      });
    }
    const tailorCtx = await prepareTailorContext({
      profileMd: row.profile_md,
      jdText,
      applicationId,
    });
    await saveTailoredCv({
      cvMarkdown,
      changesSummary,
      studentId: flags.student,
      applicationId,
      nextVersion: tailorCtx.nextVersion,
      destPdfPath: cvPdfPath,
    });

    const { firstName, lastName } = splitName(row.name);
    const stdinPayload = JSON.stringify({
      candidate: {
        firstName,
        lastName,
        email: row.email,
        phone: row.whatsapp,
      },
      application: {
        company_name: flags.company,
        role_normalized: roleNormalized,
        job_url: jobUrl,
        platform,
      },
      cvPath: "cv.pdf",
      workspaceDir,
    });

    const fillFormsPath = resolve(thisDir, "../../../career-ops/bin/fill-forms.mjs");

    let fillFormsStdout: string;
    try {
      const pending = execFileAsync("node", [fillFormsPath], {
        env: { ...process.env, CRUZAR_ETHICAL_GATE: "1" },
        maxBuffer: 16 * 1024 * 1024,
        timeout: 30 * 60 * 1000,
        cwd: workspaceDir,
      });
      pending.child.stdin?.end(stdinPayload);
      const result = await pending;
      fillFormsStdout = result.stdout;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      logError("fill_forms_failed", `fill-forms subprocess failed: ${message}`, {
        student_id: flags.student,
        application_id: applicationId,
      });
    }

    let fillResult: z.infer<typeof fillFormsResultSchema>;
    try {
      const lines = fillFormsStdout
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      const lastLine = lines.at(-1) ?? "";
      const parsed: unknown = JSON.parse(lastLine);
      fillResult = fillFormsResultSchema.parse(parsed);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      logError("fill_forms_parse_failed", `Could not parse fill-forms output: ${message}`, {
        student_id: flags.student,
        application_id: applicationId,
      });
    }

    const screenshotR2Keys: string[] = [];
    const shotPaths = [
      ...fillResult.screenshots,
      ...(fillResult.finalStateScreenshot ? [fillResult.finalStateScreenshot] : []),
    ];
    for (const absPath of shotPaths) {
      const key = `fill-form-drafts/${flags.student}/${applicationId}/${basename(absPath)}`;
      try {
        await uploadFileToR2(key, absPath, "image/png", "private");
        screenshotR2Keys.push(key);
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : String(cause);
        process.stderr.write(`screenshot upload failed (${key}): ${message}\n`);
      }
    }

    await db.insert(fillFormDrafts).values({
      application_id: applicationId,
      screenshot_r2_keys_jsonb: screenshotR2Keys,
      missed_fields_jsonb: fillResult.missed,
      needs_human_jsonb: fillResult.needsHuman,
      state: "drafted",
    });

    await db.insert(statusEvents).values({
      student_id: flags.student,
      application_id: applicationId,
      kind: "applied",
      note: null,
    });

    logDone({
      student_id: flags.student,
      application_id: applicationId,
      application_count: 1,
      platform,
      company_normalized: companyNormalized,
      role_normalized: roleNormalized,
      filled_count: fillResult.filled.length,
      missed_count: fillResult.missed.length,
      needs_human_count: fillResult.needsHuman.length,
      screenshot_count: screenshotR2Keys.length,
    });
  } finally {
    if (!flags.debug) {
      await cleanupRuntimeDir(flags.student);
    }
  }
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
