import { and, asc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { parseFlags } from "../_shared/args";
import { db } from "@/db/client";
import {
  englishCerts,
  intakeBatchAnswers,
  intakeBatches,
  intakes,
  students,
} from "@/db/schema";
import { llmJsonCompletion } from "@/lib/llm";
import { logDone, logError } from "../_shared/logger";
import {
  batchQuestionsSchema,
  formatBatchForWhatsApp,
  PROMPT_VERSION,
  renderGenerateBatchPrompt,
  type PriorBatch,
} from "@/lib/prompts/intake-batch";

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

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  const studentRows = await db
    .select({
      id: students.id,
      name: students.name,
      onboarded_at: students.onboarded_at,
    })
    .from(students)
    .where(eq(students.id, flags.student))
    .limit(1);
  const studentRow = studentRows[0];
  if (!studentRow) {
    logError("student_not_found", "No students row for the given id", {
      student_id: flags.student,
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
    process.stdout.write(`${existingBatch.prompt_text}\n`);
    logDone({
      batch_id: existingBatch.id,
      intake_id: intakeId,
      student_id: studentRow.id,
      batch_num: nextBatchNum,
      reused: true,
      prompt_version: PROMPT_VERSION,
    });
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

  const messages = renderGenerateBatchPrompt({
    studentName: studentRow.name,
    englishCert: { kind: certRow.kind, score: certRow.score, level: certRow.level },
    batchNum: nextBatchNum,
    priorBatches,
  });

  const result = await llmJsonCompletion({
    tier: "strong",
    messages,
    schema: batchQuestionsSchema,
    schemaName: "intake-batch",
  });

  const promptText = formatBatchForWhatsApp(result.questions, studentRow.name, nextBatchNum);

  await db
    .insert(intakeBatches)
    .values({
      intake_id: intakeId,
      batch_num: nextBatchNum,
      prompt_text: promptText,
      questions_jsonb: result.questions,
    })
    .onConflictDoNothing({ target: [intakeBatches.intake_id, intakeBatches.batch_num] });

  const persistedRows = await db
    .select({ id: intakeBatches.id, prompt_text: intakeBatches.prompt_text })
    .from(intakeBatches)
    .where(and(eq(intakeBatches.intake_id, intakeId), eq(intakeBatches.batch_num, nextBatchNum)))
    .limit(1);
  const persisted = persistedRows[0];
  if (!persisted) {
    logError("batch_persist_failed", "Could not locate the intake_batches row after insert", {
      intake_id: intakeId,
      batch_num: nextBatchNum,
    });
  }

  process.stdout.write(`${persisted.prompt_text}\n`);
  logDone({
    batch_id: persisted.id,
    intake_id: intakeId,
    student_id: studentRow.id,
    batch_num: nextBatchNum,
    reused: false,
    prompt_length: promptText.length,
    prompt_version: PROMPT_VERSION,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
