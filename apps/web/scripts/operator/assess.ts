import { and, asc, eq, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { englishCerts, intakeBatchAnswers, intakeBatches, intakes, students } from "@/db/schema";
import { llmJsonCompletion } from "@/lib/llm";
import {
  type AnswerEntry,
  type CertSummary,
  PROMPT_VERSION,
  planSchema,
  profileMdSchema,
  type ReadinessGap,
  type RoleCatalogEntry,
  type RoleMatchSummary,
  readinessSchema,
  renderPlanPrompt,
  renderProfileMdPrompt,
  renderReadinessPrompt,
  renderRoleMatchPrompt,
  roleMatchSchema,
} from "@/lib/prompts/assessment";
import { parseFlags } from "./_shared/args";
import { logDone, logError } from "./_shared/logger";

const flagsSchema = z.object({
  student: z.string().min(1),
});

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  // --- Load student ---------------------------------------------------------
  const studentRows = await db
    .select({
      id: students.id,
      name: students.name,
      local_salary_usd: students.local_salary_usd,
    })
    .from(students)
    .where(eq(students.id, flags.student))
    .limit(1);
  const student = studentRows[0];
  if (!student) {
    logError("student_not_found", "No students row for the given id", {
      student_id: flags.student,
    });
  }

  // --- Load English cert ----------------------------------------------------
  const certRows = await db
    .select({
      kind: englishCerts.kind,
      score: englishCerts.score,
      level: englishCerts.level,
    })
    .from(englishCerts)
    .where(eq(englishCerts.student_id, student.id))
    .limit(1);
  const certRow = certRows[0];
  if (!certRow) {
    logError("missing_english_cert", "No english_certs row for student", {
      student_id: student.id,
    });
  }
  const cert: CertSummary = { kind: certRow.kind, score: certRow.score, level: certRow.level };

  // --- Load finalized intake ------------------------------------------------
  const intakeRows = await db
    .select({ id: intakes.id, finalized_at: intakes.finalized_at })
    .from(intakes)
    .where(and(eq(intakes.student_id, student.id), isNotNull(intakes.finalized_at)))
    .limit(1);
  const intake = intakeRows[0];
  if (!intake) {
    logError("intake_not_finalized", "No finalized intake for student", {
      student_id: student.id,
    });
  }

  // --- Load all answers -----------------------------------------------------
  const answerRows = await db
    .select({
      question_key: intakeBatchAnswers.question_key,
      question_text: intakeBatchAnswers.question_text,
      answer_text: intakeBatchAnswers.answer_text,
      confidence: intakeBatchAnswers.confidence,
    })
    .from(intakeBatchAnswers)
    .innerJoin(intakeBatches, eq(intakeBatchAnswers.batch_id, intakeBatches.id))
    .where(eq(intakeBatches.intake_id, intake.id))
    .orderBy(asc(intakeBatches.batch_num));

  if (answerRows.length === 0) {
    logError("no_answers", "Intake has zero answers", { intake_id: intake.id });
  }

  const answers: AnswerEntry[] = answerRows.map((r) => ({
    question_key: r.question_key,
    question_text: r.question_text,
    answer_text: r.answer_text,
    confidence: r.confidence,
  }));

  // --- Check for existing profile (re-assessment) ---------------------------
  // MVP 0: simple overwrite. A future version should diff and merge.
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

  // --- Step 1: Readiness classification -------------------------------------
  const readinessMessages = renderReadinessPrompt({ answers, cert });
  const readiness = await llmJsonCompletion({
    tier: "strong",
    messages: readinessMessages,
    schema: readinessSchema,
    schemaName: "readiness-classification",
  });

  const { verdict, confidence, gaps } = readiness;

  // --- Step 2: Plan generation (non-ready only) -----------------------------
  let planMarkdown = "";
  let nextAssessmentAt: Date | null = null;

  if (verdict !== "ready") {
    const planMessages = renderPlanPrompt({ verdict, gaps, answers, cert });
    const plan = await llmJsonCompletion({
      tier: "strong",
      messages: planMessages,
      schema: planSchema,
      schemaName: "plan-generation",
    });
    planMarkdown = plan.plan_markdown;
    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + plan.next_assessment_in_days);
    nextAssessmentAt = nextDate;
  }

  // --- Ready path: role match + profile_md ----------------------------------
  let roleMatchCount = 0;
  let profileMdLength = 0;

  if (verdict === "ready") {
    // Load roles catalog
    const rolesCatalogRows = await db
      .select({
        id: schema.roles.id,
        title: schema.roles.title,
        comp_min_usd: schema.roles.comp_min_usd,
        comp_max_usd: schema.roles.comp_max_usd,
        english_level: schema.roles.english_level,
        skills_jsonb: schema.roles.skills_jsonb,
        employer_type: schema.roles.employer_type,
        entry_level: schema.roles.entry_level,
      })
      .from(schema.roles);

    if (rolesCatalogRows.length === 0) {
      logError("no_roles", "Roles catalog is empty. Run db:seed first.");
    }

    const rolesCatalog: RoleCatalogEntry[] = rolesCatalogRows.map((r) => ({
      id: r.id,
      title: r.title,
      comp_min_usd: r.comp_min_usd,
      comp_max_usd: r.comp_max_usd,
      english_level: r.english_level,
      skills_jsonb: r.skills_jsonb,
      employer_type: r.employer_type,
      entry_level: r.entry_level,
    }));

    // Step 3: Role matching
    const roleMatchMessages = renderRoleMatchPrompt({
      answers,
      cert,
      gaps,
      rolesCatalog,
    });
    const roleMatchResult = await llmJsonCompletion({
      tier: "strong",
      messages: roleMatchMessages,
      schema: roleMatchSchema,
      schemaName: "role-match",
    });

    // Validate role_ids exist in catalog
    const roleIdSet = new Set(rolesCatalog.map((r) => r.id));
    for (const match of roleMatchResult.matches) {
      if (!roleIdSet.has(match.role_id)) {
        logError("invalid_role_id", "LLM returned a role_id not in the catalog", {
          role_id: match.role_id,
        });
      }
    }

    // Build role match summaries for profile_md prompt
    const roleMatchSummaries: RoleMatchSummary[] = roleMatchResult.matches.map((match) => {
      const role = rolesCatalog.find((r) => r.id === match.role_id);
      if (!role) {
        logError("role_lookup_failed", "Role not found after validation", {
          role_id: match.role_id,
        });
      }
      return {
        role_title: role.title,
        rank: match.rank,
        rationale: match.rationale,
        comp_min_usd: role.comp_min_usd,
        comp_max_usd: role.comp_max_usd,
      };
    });

    // Step 4: Profile markdown synthesis
    const profileMdMessages = renderProfileMdPrompt({
      answers,
      cert,
      gaps,
      roleMatches: roleMatchSummaries,
      localSalaryUsd: student.local_salary_usd,
    });
    const profileMdResult = await llmJsonCompletion({
      tier: "strong",
      messages: profileMdMessages,
      schema: profileMdSchema,
      schemaName: "profile-md-synthesis",
    });

    profileMdLength = profileMdResult.profile_md.length;

    // --- Persist: upsert profile (ready) ------------------------------------
    const now = new Date();
    const profileValues = {
      student_id: student.id,
      readiness_verdict: verdict,
      gaps_jsonb: gaps as ReadinessGap[],
      plan_markdown: "",
      next_assessment_at: null,
      profile_md: profileMdResult.profile_md,
      profile_md_version: nextProfileMdVersion,
      profile_md_generated_at: now,
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

    // --- Persist: role_matches ------------------------------------------------
    // Delete prior matches for this profile before inserting fresh ones
    if (existingProfile) {
      await db.delete(schema.roleMatches).where(eq(schema.roleMatches.profile_id, profileId));
    }

    const roleMatchValues = roleMatchResult.matches.map((match) => ({
      profile_id: profileId,
      role_id: match.role_id,
      rank: match.rank,
      rationale: match.rationale,
    }));

    await db.insert(schema.roleMatches).values(roleMatchValues);
    roleMatchCount = roleMatchValues.length;
  } else {
    // --- Non-ready path: upsert profile with plan ----------------------------
    const profileValues = {
      student_id: student.id,
      readiness_verdict: verdict,
      gaps_jsonb: gaps as ReadinessGap[],
      plan_markdown: planMarkdown,
      next_assessment_at: nextAssessmentAt,
      profile_md: "",
      profile_md_version: 0,
      profile_md_generated_at: null,
      prompt_version: PROMPT_VERSION,
    } as const;

    if (existingProfile) {
      await db
        .update(schema.profiles)
        .set(profileValues)
        .where(eq(schema.profiles.id, existingProfile.id));
      // Clear stale role_matches from a prior ready assessment
      await db
        .delete(schema.roleMatches)
        .where(eq(schema.roleMatches.profile_id, existingProfile.id));
    } else {
      await db.insert(schema.profiles).values(profileValues);
    }
  }

  // --- Next step suggestion -------------------------------------------------
  process.stderr.write(`Next step: /cruzar-email-profile-live ${student.id}\n`);

  // --- Done -----------------------------------------------------------------
  logDone({
    student_id: student.id,
    verdict,
    confidence,
    gaps_count: gaps.length,
    role_match_count: roleMatchCount,
    profile_md_length: profileMdLength,
    profile_md_version: nextProfileMdVersion,
    prompt_version: PROMPT_VERSION,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
