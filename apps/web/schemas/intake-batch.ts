import { z } from "zod";

export const intakeBatchQuestionSchema = z.object({
  question_key: z
    .string()
    .regex(/^[a-z0-9_]+$/, "question_key must be snake_case alphanumerics"),
  question_text: z.string().min(10),
  rationale: z.string().min(10),
});
export type IntakeBatchQuestion = z.infer<typeof intakeBatchQuestionSchema>;

export const intakeBatchSchema = z.object({
  id: z.uuid(),
  intake_id: z.uuid(),
  batch_num: z.number().int().min(1).max(4),
  prompt_text: z.string().min(1),
  questions_jsonb: z.array(intakeBatchQuestionSchema).length(10),
  sent_at: z.iso.datetime().optional(),
  raw_reply: z.string().optional(),
  reply_at: z.iso.datetime().optional(),
  created_at: z.iso.datetime(),
});
export type IntakeBatch = z.infer<typeof intakeBatchSchema>;
