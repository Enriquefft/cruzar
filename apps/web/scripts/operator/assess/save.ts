// CC-in-the-loop assess step 2/2. Reads a single JSON object from stdin —
// the assessment result authored by Claude Code from prepare.ts context —
// validates it with Zod, renders the showcase CV PDF (ready path), and
// upserts profiles + role_matches. Idempotent: profiles upsert, role_matches
// delete-then-insert, showcase CV overwrites the same R2 key per student.
//
// stdout envelope is IDs + counts only per the operator PII rule.

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import {
  planMilestoneSchema,
  PROMPT_VERSION,
  readinessGapSchema,
  roleMatchEntrySchema,
} from "@/lib/prompts/assessment";
import { profileGapSchema } from "@/schemas/profile";
import { parseFlags } from "../_shared/args";
import { renderShowcaseCvFromMarkdown } from "../_shared/cv-tailor";
import { logDone, logError } from "../_shared/logger";

const flagsSchema = z.object({
  student: z.string().min(1),
});

const nonReadyResultSchema = z.object({
  verdict: z.enum(["presentation_gap", "experience_gap"]),
  confidence: z.number().min(0).max(1),
  gaps: z.array(readinessGapSchema),
  plan_markdown: z.string().min(1),
  milestones: z.array(planMilestoneSchema),
  next_assessment_in_days: z.number().int().positive(),
});

const readyResultSchema = z.object({
  verdict: z.literal("ready"),
  confidence: z.number().min(0).max(1),
  gaps: z.array(readinessGapSchema),
  matches: z.array(roleMatchEntrySchema).length(3),
  profile_md: z.string().min(100),
  sections_present: z.array(z.string()),
  showcase_cv_markdown: z.string().min(50),
});

const assessResultSchema = z.discriminatedUnion("verdict", [
  nonReadyResultSchema,
  readyResultSchema,
]);

async function readStdin(): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of process.stdin) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);
  const studentId: string = flags.student;

  const studentRows = await db
    .select({ id: schema.students.id })
    .from(schema.students)
    .where(eq(schema.students.id, studentId))
    .limit(1);
  const student = studentRows[0];
  if (!student) {
    logError("student_not_found", "No students row for the given id", {
      student_id: studentId,
    });
  }

  const raw = (await readStdin()).trim();
  if (raw.length === 0) {
    logError("empty_stdin", "No JSON payload received on stdin", { student_id: student.id });
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(raw);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("invalid_json", `stdin JSON parse failed: ${message}`, { student_id: student.id });
  }

  const parsed = assessResultSchema.safeParse(parsedJson);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    logError("invalid_result_shape", "Assessment result failed Zod validation", {
      student_id: student.id,
      first_issue_path: issue ? issue.path.map((p) => String(p)).join(".") : "",
      first_issue_message: issue ? issue.message : "",
      issue_count: parsed.error.issues.length,
    });
  }
  const result = parsed.data;

  const existingProfileRows = await db
    .select({
      id: schema.profiles.id,
      profile_md_version: schema.profiles.profile_md_version,
    })
    .from(schema.profiles)
    .where(eq(schema.profiles.student_id, student.id))
    .limit(1);
  const existingProfile = existingProfileRows[0];
  const nextProfileMdVersion = existingProfile ? existingProfile.profile_md_version + 1 : 1;

  const gaps = z.array(profileGapSchema).parse(result.gaps);

  if (result.verdict === "ready") {
    const rolesCatalogRows = await db
      .select({ id: schema.roles.id })
      .from(schema.roles);
    const roleIdSet = new Set(rolesCatalogRows.map((r) => r.id));
    for (const match of result.matches) {
      if (!roleIdSet.has(match.role_id)) {
        logError("invalid_role_id", "Result contains a role_id not present in the catalog", {
          student_id: student.id,
          role_id: match.role_id,
        });
      }
    }
    const ranks = result.matches.map((m) => m.rank).sort((a, b) => a - b);
    if (ranks[0] !== 1 || ranks[1] !== 2 || ranks[2] !== 3) {
      logError("invalid_ranks", "Result matches must cover ranks 1, 2, 3 exactly once", {
        student_id: student.id,
      });
    }
    const distinctRoles = new Set(result.matches.map((m) => m.role_id));
    if (distinctRoles.size !== 3) {
      logError("duplicate_role_id", "Result matches contain duplicate role_ids", {
        student_id: student.id,
      });
    }

    const showcaseCvR2Key = await renderShowcaseCvFromMarkdown({
      cvMarkdown: result.showcase_cv_markdown,
      studentId: student.id,
    });

    const now = new Date();
    const profileValues = {
      student_id: student.id,
      readiness_verdict: result.verdict,
      gaps_jsonb: gaps,
      plan_markdown: "",
      next_assessment_at: null,
      profile_md: result.profile_md,
      profile_md_version: nextProfileMdVersion,
      profile_md_generated_at: now,
      showcase_cv_r2_key: showcaseCvR2Key,
      prompt_version: PROMPT_VERSION,
    } as const;

    let profileId: string;
    if (existingProfile) {
      await db
        .update(schema.profiles)
        .set(profileValues)
        .where(eq(schema.profiles.id, existingProfile.id));
      profileId = existingProfile.id;
    } else {
      const inserted = await db
        .insert(schema.profiles)
        .values(profileValues)
        .returning({ id: schema.profiles.id });
      const row = inserted[0];
      if (!row) {
        logError("profile_insert_failed", "Failed to insert profiles row", {
          student_id: student.id,
        });
      }
      profileId = row.id;
    }

    await db.delete(schema.roleMatches).where(eq(schema.roleMatches.profile_id, profileId));
    await db.insert(schema.roleMatches).values(
      result.matches.map((match) => ({
        profile_id: profileId,
        role_id: match.role_id,
        rank: match.rank,
        rationale: match.rationale,
      })),
    );

    process.stderr.write(`Next step: /cruzar-email-profile-live ${student.id}\n`);

    logDone({
      student_id: student.id,
      verdict: result.verdict,
      confidence: result.confidence,
      gaps_count: gaps.length,
      role_match_count: result.matches.length,
      profile_md_length: result.profile_md.length,
      profile_md_version: nextProfileMdVersion,
      prompt_version: PROMPT_VERSION,
    });
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + result.next_assessment_in_days);

  const profileValues = {
    student_id: student.id,
    readiness_verdict: result.verdict,
    gaps_jsonb: gaps,
    plan_markdown: result.plan_markdown,
    next_assessment_at: nextDate,
    profile_md: "",
    profile_md_version: 0,
    profile_md_generated_at: null,
    showcase_cv_r2_key: null,
    prompt_version: PROMPT_VERSION,
  } as const;

  if (existingProfile) {
    await db
      .update(schema.profiles)
      .set(profileValues)
      .where(eq(schema.profiles.id, existingProfile.id));
    await db
      .delete(schema.roleMatches)
      .where(eq(schema.roleMatches.profile_id, existingProfile.id));
  } else {
    await db.insert(schema.profiles).values(profileValues);
  }

  logDone({
    student_id: student.id,
    verdict: result.verdict,
    confidence: result.confidence,
    gaps_count: gaps.length,
    role_match_count: 0,
    profile_md_length: 0,
    profile_md_version: 0,
    prompt_version: PROMPT_VERSION,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
