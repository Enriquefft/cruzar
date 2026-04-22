// PII envelope exception: this script is the CC-in-the-loop prepare step for
// reply parsing. The stdout JSON includes `raw_reply` (verbatim student text)
// and `questions` (verbatim question text) because CC needs them to parse the
// reply into structured answers. This is an operator-local pipe to the caller
// agent, not a log aggregator. The PII contract from _shared/logger still
// applies to every OTHER operator script — do not copy this pattern elsewhere.
// `@/lib/llm` is intentionally not imported.
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { intakeBatches } from "@/db/schema";
import { PROMPT_VERSION, renderReplyParsePrompt } from "@/lib/prompts/intake-batch";
import { intakeBatchQuestionSchema } from "@/schemas/intake-batch";
import { parseFlags } from "../_shared/args";
import { logError } from "../_shared/logger";

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

function extractSystemAndUser(messages: ReturnType<typeof renderReplyParsePrompt>): {
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
  const questions = questionsParsed.data;

  const stdinRaw = await readStdin();
  const parsedReply = rawReplySchema.safeParse(stdinRaw.trim());
  if (!parsedReply.success) {
    logError("invalid_reply", "Reply from stdin failed validation", {
      batch_id: batchRow.id,
      issues: parsedReply.error.issues.map((i) => i.message),
    });
  }
  const rawReply = parsedReply.data;

  const messages = renderReplyParsePrompt({ questions, rawReply });
  const { system, user } = extractSystemAndUser(messages);

  const payload = {
    success: true,
    batch_id: batchRow.id,
    intake_id: batchRow.intake_id,
    batch_num: batchRow.batch_num,
    questions,
    raw_reply: rawReply,
    system_prompt: system,
    user_prompt: user,
    output_schema_hint:
      "See replyParseSchema in @/lib/prompts/intake-batch — {answers: [{question_key, question_text, answer_text, confidence}], unmatched_notes?: string}",
    prompt_version: PROMPT_VERSION,
  } as const;
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
