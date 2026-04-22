// PII contract: this script persists CC's parse of a student reply. stdout
// emits IDs + counts only; no verbatim text appears in the final JSON envelope.
// `@/lib/llm` is intentionally not imported — reasoning happens in CC, this
// script only validates + persists.
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { intakeBatchAnswers, intakeBatches } from "@/db/schema";
import { PROMPT_VERSION, replyParseSchema } from "@/lib/prompts/intake-batch";
import { parseFlags } from "../_shared/args";
import { logDone, logError } from "../_shared/logger";

const flagsSchema = z.object({
  batch: z.uuid(),
  overwrite: z
    .preprocess((v) => {
      if (v === undefined) return false;
      if (typeof v === "boolean") return v;
      if (typeof v === "string") return v === "true" || v === "1";
      return v;
    }, z.boolean())
    .default(false),
});

const rawReplySchema = z.string().min(1).max(20_000);

const stdinSchema = replyParseSchema.extend({
  raw_reply: rawReplySchema,
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

  const stdinRaw = await readStdin();
  const trimmed = stdinRaw.trim();
  if (trimmed.length === 0) {
    logError("empty_stdin", "No JSON on stdin; pipe the {raw_reply, answers, unmatched_notes?} payload");
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
    logError("invalid_payload", "stdin JSON failed schema validation", {
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }
  const { raw_reply, answers, unmatched_notes } = parsed.data;

  const batchRows = await db
    .select({
      id: intakeBatches.id,
      intake_id: intakeBatches.intake_id,
      batch_num: intakeBatches.batch_num,
      raw_reply: intakeBatches.raw_reply,
    })
    .from(intakeBatches)
    .where(eq(intakeBatches.id, flags.batch))
    .limit(1);
  const batchRow = batchRows[0];
  if (!batchRow) {
    logError("batch_not_found", "No intake_batches row with the given id", {
      batch_id: flags.batch,
    });
  }

  if (batchRow.raw_reply !== null && !flags.overwrite) {
    logError(
      "already_recorded",
      "Batch already has raw_reply recorded; pass --overwrite to replace",
      {
        batch_id: batchRow.id,
        batch_num: batchRow.batch_num,
      },
    );
  }

  let confidenceSum = 0;
  await db.transaction(async (tx) => {
    await tx
      .update(intakeBatches)
      .set({ raw_reply, reply_at: new Date() })
      .where(eq(intakeBatches.id, batchRow.id));

    for (const ans of answers) {
      confidenceSum += ans.confidence;
      await tx
        .insert(intakeBatchAnswers)
        .values({
          batch_id: batchRow.id,
          question_key: ans.question_key,
          question_text: ans.question_text,
          answer_text: ans.answer_text,
          confidence: ans.confidence,
        })
        .onConflictDoUpdate({
          target: [intakeBatchAnswers.batch_id, intakeBatchAnswers.question_key],
          set: {
            question_text: ans.question_text,
            answer_text: ans.answer_text,
            confidence: ans.confidence,
          },
        });
    }
  });

  const answerCount = answers.length;
  const meanConfidence = answerCount > 0 ? Number((confidenceSum / answerCount).toFixed(3)) : 0;
  const unmatchedLength = unmatched_notes?.length ?? 0;

  logDone({
    batch_id: batchRow.id,
    intake_id: batchRow.intake_id,
    batch_num: batchRow.batch_num,
    answer_count: answerCount,
    mean_confidence: meanConfidence,
    unmatched_notes_length: unmatchedLength,
    prompt_version: PROMPT_VERSION,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("db_transaction_failed", message);
});
