import { z } from "zod";

export const intakeSchema = z.object({
  id: z.uuid(),
  student_id: z.string().min(1),
  started_at: z.iso.datetime(),
  finalized_at: z.iso.datetime().optional(),
});
export type Intake = z.infer<typeof intakeSchema>;
