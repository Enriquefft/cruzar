import { z } from "zod";

export const intakeBatchAnswerSchema = z.object({
  id: z.uuid(),
  batch_id: z.uuid(),
  question_key: z.string().min(1),
  question_text: z.string().min(1),
  answer_text: z.string(),
  confidence: z.number().min(0).max(1),
});
export type IntakeBatchAnswer = z.infer<typeof intakeBatchAnswerSchema>;
