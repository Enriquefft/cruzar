// CC-in-the-loop assess step 1/2. Emits the full assessment context on stdout
// as a single JSON object. Claude Code consumes it, runs the readiness +
// plan/role-match/profile_md/showcase reasoning, and pipes the result into
// assess/save.ts.
//
// PII: the stdout payload carries `answers`, `student_name`, and
// `local_salary_usd` because CC is the immediate local consumer. This is NOT
// a log and does not go through the logger. It must never be teed to Sentry,
// persisted to disk outside `.cruzar-runtime/`, or forwarded to any third
// party. Error envelopes (logError) remain IDs-only per the operator PII rule.

import { and, asc, eq, isNotNull } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { englishCerts, intakeBatchAnswers, intakeBatches, intakes, students } from "@/db/schema";
import {
  type AnswerEntry,
  type CertSummary,
  PROMPT_VERSION,
  planSystemExperience,
  planSystemPresentation,
  profileMdSystem,
  readinessSystem,
  renderReadinessUser,
  type RoleCatalogEntry,
  roleMatchSystem,
} from "@/lib/prompts/assessment";
import { showcaseCvTailorSystem } from "@/lib/prompts/cv-tailor";
import { parseFlags } from "../_shared/args";
import { logError } from "../_shared/logger";
import { renderCandidatesForStderr } from "../students/list";

const flagsSchema = z.object({
  student: z.string().min(1),
});

const OUTPUT_SCHEMA_HINT =
  'Return strict JSON. Discriminated union on "verdict". Non-ready: {verdict:"presentation_gap"|"experience_gap", confidence:0..1, gaps:[{category,severity:"low"|"medium"|"high",evidence}], plan_markdown:string, milestones:[{title,description,due_in_days?:int}], next_assessment_in_days:int}. Ready: {verdict:"ready", confidence:0..1, gaps:[...], matches:[3x{role_id:uuid,rank:1|2|3,rationale}] (distinct role_ids from roles_catalog, ranks 1/2/3), profile_md:string (>=100 chars, sections: Identity, Background, Skills, Stories, Context, Evaluations), sections_present:["identity","background","skills","stories","context","evaluations"], showcase_cv_markdown:string (>=50 chars, one-page CV rendered from profile_md)}';

async function main(): Promise<void> {
  if (!process.argv.slice(2).includes("--student")) {
    const block = await renderCandidatesForStderr("pending_assess");
    process.stderr.write(block);
    process.stdout.write(
      `${JSON.stringify({ success: false, error: "missing_student", message: "Pass --student <id>. Candidates listed above on stderr; also run `/cruzar students list --state pending_assess`." })}\n`,
    );
    process.exit(2);
  }

  const flags = parseFlags(flagsSchema);
  const studentId: string = flags.student;

  const studentRows = await db
    .select({
      id: students.id,
      name: students.name,
      local_salary_usd: students.local_salary_usd,
    })
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);
  const student = studentRows[0];
  if (!student) {
    logError("student_not_found", "No students row for the given id", {
      student_id: studentId,
    });
  }

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

  const readinessUserPrompt = renderReadinessUser({ answers, cert });

  const payload = {
    success: true as const,
    student_id: student.id,
    student_name: student.name,
    local_salary_usd: student.local_salary_usd,
    english_cert: cert,
    intake_id: intake.id,
    answer_count: answers.length,
    answers,
    existing_profile: existingProfile
      ? { id: existingProfile.id, profile_md_version: existingProfile.profile_md_version }
      : null,
    next_profile_md_version: nextProfileMdVersion,
    roles_catalog: rolesCatalog,
    readiness_system_prompt: readinessSystem,
    readiness_user_prompt: readinessUserPrompt,
    plan_presentation_system_prompt: planSystemPresentation,
    plan_experience_system_prompt: planSystemExperience,
    role_match_system_prompt: roleMatchSystem,
    profile_md_system_prompt: profileMdSystem,
    cv_tailor_showcase_system_prompt: showcaseCvTailorSystem,
    output_schema_hint: OUTPUT_SCHEMA_HINT,
    prompt_version: PROMPT_VERSION,
  };

  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
