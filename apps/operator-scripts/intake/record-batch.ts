import { eq } from "drizzle-orm";
import { z } from "zod";
import { parseFlags } from "../_shared/args";
import { db, intakeBatchAnswers, intakeBatches } from "../_shared/db";
import { llmJsonCompletion } from "../_shared/llm";
import { logDone, logError } from "../_shared/logger";
import {
  PROMPT_VERSION,
  renderReplyParsePrompt,
  replyParseSchema,
} from "@/lib/prompts/intake-batch";
import { intakeBatchQuestionSchema } from "@/schemas/intake-batch";

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

  const batchRows = await db
    .select({
      id: intakeBatches.id,
      intake_id: intakeBatches.intake_id,
      batch_num: intakeBatches.batch_num,
      raw_reply: intakeBatches.raw_reply,
      questions_jsonb: intakeBatches.questions_jsonb,
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

  const stdinRaw = await readStdin();
  const parsedReply = rawReplySchema.safeParse(stdinRaw.trim());
  if (!parsedReply.success) {
    logError("invalid_reply", "Reply from stdin failed validation", {
      batch_id: batchRow.id,
      issues: parsedReply.error.issues.map((i) => i.message),
    });
  }
  const rawReply = parsedReply.data;

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

  const questionsParsed = z
    .array(intakeBatchQuestionSchema)
    .length(10)
    .safeParse(batchRow.questions_jsonb);
  if (!questionsParsed.success) {
    logError("corrupt_questions_jsonb", "Stored questions failed schema validation.", {
      batch_id: batchRow.id,
    });
  }

  const parsedLlm = await llmJsonCompletion({
    tier: "strong",
    messages: renderReplyParsePrompt({
      questions: questionsParsed.data,
      rawReply,
    }),
    schema: replyParseSchema,
    schemaName: "intake-reply-parse",
  });

  let confidenceSum = 0;
  await db.transaction(async (tx) => {
    await tx
      .update(intakeBatches)
      .set({ raw_reply: rawReply, reply_at: new Date() })
      .where(eq(intakeBatches.id, batchRow.id));

    for (const ans of parsedLlm.answers) {
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

  const answerCount = parsedLlm.answers.length;
  const meanConfidence = answerCount > 0 ? Number((confidenceSum / answerCount).toFixed(3)) : 0;
  const unmatchedLength = parsedLlm.unmatched_notes?.length ?? 0;

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
