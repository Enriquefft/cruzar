import { z } from "zod";

// Per-application tailored CV derived from `profiles.profile_md` + JD text
// (ADR-09). `version` is per-application and append-only for audit.
export const generatedCvSchema = z.object({
  id: z.uuid(),
  student_id: z.string().min(1),
  application_id: z.uuid(),
  cv_markdown: z.string().min(1),
  cv_r2_key: z.string().min(1),
  version: z.number().int().positive(),
  changes_summary: z.string(),
  created_at: z.iso.datetime(),
});
export type GeneratedCv = z.infer<typeof generatedCvSchema>;
