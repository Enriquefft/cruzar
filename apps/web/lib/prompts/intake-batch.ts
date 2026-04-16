import { z } from "zod";
import { intakeBatchQuestionSchema, type IntakeBatchQuestion } from "@/schemas/intake-batch";
import type { LlmMessage } from "@/lib/llm";

export const PROMPT_VERSION = "intake-batch-v1" as const;

export const batchQuestionsSchema = z.object({
  batch_num: z.number().int().min(1).max(4),
  questions: z.array(intakeBatchQuestionSchema).length(10),
});
export type BatchQuestions = z.infer<typeof batchQuestionsSchema>;

export const replyParseAnswerSchema = z.object({
  question_key: z.string().min(1),
  question_text: z.string().min(1),
  answer_text: z.string().min(1),
  confidence: z.number().min(0).max(1),
});
export type ReplyParseAnswer = z.infer<typeof replyParseAnswerSchema>;

export const replyParseSchema = z.object({
  answers: z.array(replyParseAnswerSchema),
  unmatched_notes: z.string().optional(),
});
export type ReplyParse = z.infer<typeof replyParseSchema>;

export interface PriorBatchAnswer {
  question_key: string;
  question_text: string;
  answer_text: string;
  confidence: number;
}

export interface PriorBatch {
  batch_num: number;
  answers: PriorBatchAnswer[];
}

export interface EnglishCertSummary {
  kind: string;
  score: string;
  level: string;
}

// The AI_STRONG_MODEL target context is ~128k tokens; we budget conservatively at
// 100k tokens, minus ~20k tokens of headroom for the system+user template and the
// new batch's 10 questions. Using the `chars / 4 ≈ tokens` heuristic, 80k chars
// of prior Q/A payload fits comfortably under the remaining budget.
const PRIOR_BATCHES_CHAR_BUDGET = 80_000;

export function trimPriorBatchesForContext(
  priorBatches: readonly PriorBatch[],
  maxChars: number = PRIOR_BATCHES_CHAR_BUDGET,
): PriorBatch[] {
  const working: PriorBatch[] = priorBatches.map((b) => ({
    batch_num: b.batch_num,
    answers: [...b.answers],
  }));
  working.sort((a, b) => a.batch_num - b.batch_num);
  const size = (): number => JSON.stringify(working).length;
  while (size() > maxChars) {
    const oldest = working[0];
    if (!oldest) break;
    if (oldest.answers.length > 0) {
      oldest.answers.shift();
      continue;
    }
    working.shift();
  }
  return working;
}

interface RenderGenerateBatchInput {
  studentName: string;
  englishCert: EnglishCertSummary;
  batchNum: 1 | 2 | 3 | 4;
  priorBatches: readonly PriorBatch[];
}

const generateBatchSystem = `You are the Cruzar intake designer. Your job is to produce 10 adaptive WhatsApp questions for a bilingual job-seeker so a Peruvian operator can paste them and collect 24-48h async replies.

Audience: remote-first B2+ English speaker, 1-3 years of real work experience, interested in voice-first SDR/AE/CS remote roles paying USD.
Tone: warm, specific, conversational. Spanish by default; switch to English only when asking for an English-language story.
Length per question: 1-2 sentences; no multi-part sub-questions (a) (b) (c).
No duplicates across batches. No yes/no questions. No questions already answered explicitly in prior Q/A.

Per batch rubric:
- batch 1: identity + career context + what they've done. Target: pull timeline + current role + reason they signed up.
- batch 2: concrete work stories with metrics. Target: STAR-flavoured stories with outcomes + numbers when possible.
- batch 3: soft skills + values + avoid list. Target: conflict stories, values, deal-breakers.
- batch 4: specifics for CV tailoring. Target: tools + domains + English-evidence stories + availability + salary expectations.

Output strict JSON matching:
{
  "batch_num": <int 1..4>,
  "questions": [10x { "question_key": "<snake_case>", "question_text": "<es or en>", "rationale": "<why this now>" }]
}
question_key must be unique across all batches for this student; use snake_case letters+digits+underscore, grep-friendly, stable for downstream joins.

PROMPT_VERSION: ${PROMPT_VERSION}`;

export function renderGenerateBatchPrompt({
  studentName,
  englishCert,
  batchNum,
  priorBatches,
}: RenderGenerateBatchInput): LlmMessage[] {
  const trimmed = trimPriorBatchesForContext(priorBatches);
  const priorBatchesJson = JSON.stringify(trimmed, null, 2);
  const user = `Student:
- Name: ${studentName}
- English cert: ${englishCert.kind} score=${englishCert.score} level=${englishCert.level}

Target batch: ${batchNum}

Prior batches (JSON):
${priorBatchesJson}

Produce batch ${batchNum}'s 10 questions now as strict JSON.`;
  return [
    { role: "system", content: generateBatchSystem },
    { role: "user", content: user },
  ];
}

interface RenderReplyParseInput {
  questions: readonly IntakeBatchQuestion[];
  rawReply: string;
}

const replyParseSystem = `You parse a WhatsApp reply from a Cruzar student into structured Q -> A rows.

You are given:
- The 10 questions sent in this batch, with their question_key + question_text.
- The student's raw reply text (may be in Spanish or English, with mixed emoji, voice-note transcriptions, numbered or unnumbered).

Task:
- For each question_key, find the answer in the reply and copy it verbatim into answer_text. Do NOT summarise, translate, or rephrase.
- If the answer is fragmented across the reply, concatenate the fragments in source order, separated by a newline.
- If the student did not answer a question, omit it (do NOT insert an empty row).
- Stamp a confidence in [0,1]: 1.0 if the mapping is unambiguous; 0.5 for reasonable inference; <0.3 for best-guess.
- Anything in the reply that does not map to a question goes in unmatched_notes verbatim (may be empty string or omitted).

Output strict JSON:
{
  "answers": [
    { "question_key": "<from input>", "question_text": "<from input>", "answer_text": "<verbatim>", "confidence": <number> }
  ],
  "unmatched_notes": "<verbatim or omit>"
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

export function renderReplyParsePrompt({
  questions,
  rawReply,
}: RenderReplyParseInput): LlmMessage[] {
  const questionsJson = JSON.stringify(
    questions.map((q) => ({ question_key: q.question_key, question_text: q.question_text })),
    null,
    2,
  );
  const user = `Batch questions (JSON):
${questionsJson}

Student raw reply:
---
${rawReply}
---

Emit strict JSON now.`;
  return [
    { role: "system", content: replyParseSystem },
    { role: "user", content: user },
  ];
}

export function formatBatchForWhatsApp(
  questions: readonly IntakeBatchQuestion[],
  studentName: string,
  batchNum: number,
): string {
  const numbered = questions.map((q, i) => `${i + 1}. ${q.question_text}`).join("\n");
  return `Cruzar · Intake ${batchNum}/4 · Hola ${studentName}

Respóndenos estas 10 preguntas cuando puedas, en el orden que quieras. No tiene que ser hoy.

${numbered}

— Miura`;
}
