// PII contract: this script persists the 10-question batch authored by CC.
// stdout emits IDs + counts only in the final JSON envelope. It ALSO prints the
// paste-ready WhatsApp prompt_text to stdout before the JSON envelope line so
// Miura can copy it directly, matching the historical generate-batch.ts
// behaviour. `@/lib/llm` is intentionally not imported — reasoning happens in
// CC, this script only validates + persists.
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { intakeBatches, students } from "@/db/schema";
import { formatBatchForWhatsApp, PROMPT_VERSION } from "@/lib/prompts/intake-batch";
import { intakeBatchQuestionSchema } from "@/schemas/intake-batch";
import { parseFlags } from "../_shared/args";
import { logError } from "../_shared/logger";

const flagsSchema = z.object({
  intake: z.uuid(),
  batch: z.preprocess((v) => (v === undefined ? undefined : Number(v)), z.number().int().min(1).max(4)),
  student: z.string().min(1),
  overwrite: z
    .preprocess((v) => {
      if (v === undefined) return false;
      if (typeof v === "boolean") return v;
      if (typeof v === "string") return v === "true" || v === "1";
      return v;
    }, z.boolean())
    .default(false),
});

type BatchNum = 1 | 2 | 3 | 4;

function toBatchNum(n: number): BatchNum {
  if (n === 1 || n === 2 || n === 3 || n === 4) return n;
  logError("invalid_batch_num", `batch_num must be 1..4, got ${n}`);
}

const stdinSchema = z
  .array(intakeBatchQuestionSchema)
  .length(10)
  .superRefine((questions, ctx) => {
    const seen = new Set<string>();
    for (const q of questions) {
      if (seen.has(q.question_key)) {
        ctx.addIssue({
          code: "custom",
          message: `duplicate question_key: ${q.question_key}`,
          path: ["question_key"],
        });
      }
      seen.add(q.question_key);
    }
  });

async function readStdin(): Promise<string> {
  process.stdin.setEncoding("utf8");
  let data = "";
  for await (const chunk of process.stdin) {
    data += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }
  return data;
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);
  const batchNum = toBatchNum(flags.batch);

  const stdinRaw = await readStdin();
  const trimmed = stdinRaw.trim();
  if (trimmed.length === 0) {
    logError("empty_stdin", "No JSON on stdin; pipe the 10-question array");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(trimmed);
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("invalid_json", `stdin is not valid JSON: ${message}`);
  }

  const parsed = stdinSchema.safeParse(parsedJson);
  if (!parsed.success) {
    logError("invalid_questions", "stdin JSON failed schema validation", {
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }
  const questions = parsed.data;

  const existingRows = await db
    .select({
      id: intakeBatches.id,
      prompt_text: intakeBatches.prompt_text,
    })
    .from(intakeBatches)
    .where(and(eq(intakeBatches.intake_id, flags.intake), eq(intakeBatches.batch_num, batchNum)))
    .limit(1);
  const existing = existingRows[0];
  if (existing && !flags.overwrite) {
    logError("already_saved", "Batch already saved; pass --overwrite to replace", {
      intake_id: flags.intake,
      batch_num: batchNum,
      batch_id: existing.id,
    });
  }

  const studentRows = await db
    .select({ id: students.id, name: students.name })
    .from(students)
    .where(eq(students.id, flags.student))
    .limit(1);
  const studentRow = studentRows[0];
  if (!studentRow) {
    logError("student_not_found", "No students row for the given id", {
      student_id: flags.student,
    });
  }

  const promptText = formatBatchForWhatsApp(questions, studentRow.name, batchNum);

  let batchId: string;
  if (existing && flags.overwrite) {
    const updated = await db
      .update(intakeBatches)
      .set({ prompt_text: promptText, questions_jsonb: questions })
      .where(eq(intakeBatches.id, existing.id))
      .returning({ id: intakeBatches.id });
    const row = updated[0];
    if (!row) {
      logError("batch_update_failed", "Failed to update intake_batches row", {
        batch_id: existing.id,
      });
    }
    batchId = row.id;
  } else {
    const inserted = await db
      .insert(intakeBatches)
      .values({
        intake_id: flags.intake,
        batch_num: batchNum,
        prompt_text: promptText,
        questions_jsonb: questions,
      })
      .returning({ id: intakeBatches.id });
    const row = inserted[0];
    if (!row) {
      logError("batch_insert_failed", "Failed to insert intake_batches row", {
        intake_id: flags.intake,
        batch_num: batchNum,
      });
    }
    batchId = row.id;
  }

  process.stdout.write(`${promptText}\n`);
  const payload = {
    success: true,
    batch_id: batchId,
    batch_num: batchNum,
    prompt_text: promptText,
    prompt_version: PROMPT_VERSION,
  } as const;
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
