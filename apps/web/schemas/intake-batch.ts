import { z } from "zod";

export const intakeBatchSchema = z.object({
  id: z.uuid(),
  intake_id: z.uuid(),
  batch_num: z.number().int().min(1).max(4),
  prompt_text: z.string().min(1),
  sent_at: z.iso.datetime().optional(),
  raw_reply: z.string().optional(),
  reply_at: z.iso.datetime().optional(),
  created_at: z.iso.datetime(),
});
export type IntakeBatch = z.infer<typeof intakeBatchSchema>;
