import { z } from "zod";
import { applicationStatusSchema, platformSchema } from "./_shared";

// Idempotency key: (student_id, company_normalized, role_normalized, job_url).
// Enforced by `applications_idem_idx` in `db/schema.ts`.
export const applicationSchema = z.object({
  id: z.uuid(),
  student_id: z.string().min(1),
  role_id: z.uuid().optional(),
  company_name: z.string().min(1),
  company_normalized: z.string().min(1),
  role_normalized: z.string().min(1),
  job_url: z.url(),
  platform: platformSchema,
  status: applicationStatusSchema,
  applied_at: z.iso.datetime().optional(),
  updated_at: z.iso.datetime(),
  career_ops_report_r2_key: z.string().optional(),
});
export type Application = z.infer<typeof applicationSchema>;
