import { z } from "zod";
import { statusEventKindSchema } from "./_shared";

// Idempotency key: (application_id, kind, created_at::date) — at most one
// status flip per application per kind per calendar day. Enforced by
// `status_events_per_day` in `db/schema.ts`.
export const statusEventSchema = z.object({
  id: z.uuid(),
  student_id: z.string().min(1),
  application_id: z.uuid().optional(),
  kind: statusEventKindSchema,
  note: z.string().optional(),
  interview_time: z.iso.datetime().optional(),
  created_at: z.iso.datetime(),
});
export type StatusEvent = z.infer<typeof statusEventSchema>;
