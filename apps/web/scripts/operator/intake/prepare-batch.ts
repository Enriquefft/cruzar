// PII envelope exception: this script is the CC-in-the-loop prepare step for
// intake batch generation. The stdout JSON includes `student_name` and
// `prior_batches` (which contain verbatim question/answer text) because CC,
// running locally in the operator session, needs them to author the next 10
// questions. This is an operator-local pipe to the caller agent, not a log
// aggregator. The PII contract from _shared/logger still applies to every
// OTHER operator script — do not copy this pattern elsewhere. `@/lib/llm` is
// intentionally not imported: z.ai has been unreliable and reasoning is now
// done by CC itself against the inlined prompt.
import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { englishCerts, intakeBatchAnswers, intakeBatches, intakes, students } from "@/db/schema";
import {
  type PriorBatch,
  PROMPT_VERSION,
  renderGenerateBatchPrompt,
  trimPriorBatchesForContext,
} from "@/lib/prompts/intake-batch";
import { parseFlags } from "../_shared/args";
import { logError } from "../_shared/logger";
import { renderCandidatesForStderr } from "../students/list";

const flagsSchema = z.object({
  student: z.string().min(1),
  batch: z.preprocess(
    (v) => (v === undefined ? undefined : Number(v)),
    z.number().int().min(1).max(4).optional(),
  ),
});

type BatchNum = 1 | 2 | 3 | 4;

function toBatchNum(n: number): BatchNum {
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  logError("invalid_batch_num", `batch_num must be 1..4, got ${n}`);
}

function extractSystemAndUser(messages: ReturnType<typeof renderGenerateBatchPrompt>): {
  system: string;
  user: string;
} {
  let system = "";
  let user = "";
  for (const m of messages) {
    if (m.role === "system") system = m.content;
    else if (m.role === "user") user = m.content;
  }
  if (system.length === 0 || user.length === 0) {
    logError("prompt_render_failed", "system or user prompt was empty after render");
  }
  return { system, user };
}

async function main(): Promise<void> {
  if (!process.argv.slice(2).includes("--student")) {
    const block = await renderCandidatesForStderr("pending_intake");
    process.stderr.write(block);
    process.stdout.write(
      `${JSON.stringify({ success: false, error: "missing_student", message: "Pass --student <id>. Candidates listed above on stderr; also run `/cruzar students list --state pending_intake`." })}\n`,
    );
    process.exit(2);
  }

  const flags = parseFlags(flagsSchema);
  const studentId: string = flags.student;

  const studentRows = await db
    .select({
      id: students.id,
      name: students.name,
      onboarded_at: students.onboarded_at,
    })
    .from(students)
    .where(eq(students.id, studentId))
    .limit(1);
  const studentRow = studentRows[0];
  if (!studentRow) {
    logError("student_not_found", "No students row for the given id", {
      student_id: studentId,
    });
  }
  if (studentRow.onboarded_at === null) {
    logError("not_onboarded", "Student is not yet onboarded", { student_id: studentRow.id });
  }

  const certRows = await db
    .select({
      kind: englishCerts.kind,
      score: englishCerts.score,
      level: englishCerts.level,
    })
    .from(englishCerts)
    .where(eq(englishCerts.student_id, studentRow.id))
    .limit(1);
  const certRow = certRows[0];
  if (!certRow) {
    logError("missing_english_cert", "No english_certs row for student", {
      student_id: studentRow.id,
    });
  }

  const existingIntakes = await db
    .select({ id: intakes.id })
    .from(intakes)
    .where(eq(intakes.student_id, studentRow.id))
    .limit(1);
  let intakeId: string;
  const existingIntake = existingIntakes[0];
  if (existingIntake) {
    intakeId = existingIntake.id;
  } else {
    const inserted = await db
      .insert(intakes)
      .values({ student_id: studentRow.id })
      .returning({ id: intakes.id });
    const row = inserted[0];
    if (!row) {
      logError("intake_insert_failed", "Failed to create intakes row", {
        student_id: studentRow.id,
      });
    }
    intakeId = row.id;
  }

  const maxRows = await db
    .select({
      max_batch_num: sql<number>`coalesce(max(${intakeBatches.batch_num}), 0)::int`,
    })
    .from(intakeBatches)
    .where(eq(intakeBatches.intake_id, intakeId));
  const maxBatchNum = maxRows[0]?.max_batch_num ?? 0;

  let nextBatchNum: BatchNum;
  if (flags.batch) {
    nextBatchNum = toBatchNum(flags.batch);
  } else {
    if (maxBatchNum >= 4) {
      logError(
        "intake_complete",
        "All 4 batches already generated. Pass --batch <1..4> to regenerate or run /cruzar intake --finalize.",
        { max_batch_num: maxBatchNum },
      );
    }
    nextBatchNum = toBatchNum(Math.max(maxBatchNum + 1, 1));
  }

  const existingBatchRows = await db
    .select({ id: intakeBatches.id, prompt_text: intakeBatches.prompt_text })
    .from(intakeBatches)
    .where(and(eq(intakeBatches.intake_id, intakeId), eq(intakeBatches.batch_num, nextBatchNum)))
    .limit(1);
  const existingBatch = existingBatchRows[0];
  if (existingBatch && existingBatch.prompt_text.length > 0) {
    const payload = {
      success: true,
      reused: true,
      intake_id: intakeId,
      student_id: studentRow.id,
      batch_id: existingBatch.id,
      batch_num: nextBatchNum,
      prompt_text: existingBatch.prompt_text,
      prompt_version: PROMPT_VERSION,
    } as const;
    process.stdout.write(`${JSON.stringify(payload)}\n`);
    process.exit(0);
  }

  const priorBatchRows = await db
    .select({
      batch_num: intakeBatches.batch_num,
      question_key: intakeBatchAnswers.question_key,
      question_text: intakeBatchAnswers.question_text,
      answer_text: intakeBatchAnswers.answer_text,
      confidence: intakeBatchAnswers.confidence,
    })
    .from(intakeBatches)
    .innerJoin(intakeBatchAnswers, eq(intakeBatchAnswers.batch_id, intakeBatches.id))
    .where(eq(intakeBatches.intake_id, intakeId))
    .orderBy(asc(intakeBatches.batch_num));

  const priorBatchMap = new Map<number, PriorBatch>();
  for (const row of priorBatchRows) {
    let bucket = priorBatchMap.get(row.batch_num);
    if (!bucket) {
      bucket = { batch_num: row.batch_num, answers: [] };
      priorBatchMap.set(row.batch_num, bucket);
    }
    bucket.answers.push({
      question_key: row.question_key,
      question_text: row.question_text,
      answer_text: row.answer_text,
      confidence: row.confidence,
    });
  }
  const priorBatches: PriorBatch[] = Array.from(priorBatchMap.values());
  const trimmedPriorBatches = trimPriorBatchesForContext(priorBatches);

  const messages = renderGenerateBatchPrompt({
    studentName: studentRow.name,
    englishCert: { kind: certRow.kind, score: certRow.score, level: certRow.level },
    batchNum: nextBatchNum,
    priorBatches,
  });
  const { system, user } = extractSystemAndUser(messages);

  const payload = {
    success: true,
    reused: false,
    intake_id: intakeId,
    student_id: studentRow.id,
    student_name: studentRow.name,
    batch_num: nextBatchNum,
    english_cert: {
      kind: certRow.kind,
      score: certRow.score,
      level: certRow.level,
    },
    prior_batches: trimmedPriorBatches,
    system_prompt: system,
    user_prompt: user,
    output_schema_hint:
      "See batchQuestionsSchema in @/lib/prompts/intake-batch — array of 10 {question_key, question_text, rationale}",
    prompt_version: PROMPT_VERSION,
  } as const;
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
