import { z } from "zod";
import { gapSeveritySchema, readinessVerdictSchema } from "./_shared";

export const profileGapSchema = z.object({
  category: z.string(),
  severity: gapSeveritySchema,
  evidence: z.string(),
});
export type ProfileGap = z.infer<typeof profileGapSchema>;

export const profileSchema = z.object({
  id: z.uuid(),
  student_id: z.string().min(1),
  readiness_verdict: readinessVerdictSchema,
  gaps_jsonb: z.array(profileGapSchema),
  plan_markdown: z.string(),
  next_assessment_at: z.iso.datetime().optional(),
  cv_markdown: z.string().optional(),
  cv_r2_key: z.string().optional(),
  cv_version: z.number().int().nonnegative(),
  generated_at: z.iso.datetime().optional(),
  prompt_version: z.string().min(1),
});
export type Profile = z.infer<typeof profileSchema>;
