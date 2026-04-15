import { z } from "zod";
import { employerTypeSchema, englishLevelSchema } from "./_shared";

export const roleSchema = z.object({
  id: z.uuid(),
  title: z.string().min(1),
  comp_min_usd: z.number().int().nonnegative(),
  comp_max_usd: z.number().int().nonnegative(),
  english_level: englishLevelSchema,
  skills_jsonb: z.array(z.string()),
  employer_type: employerTypeSchema,
  entry_level: z.boolean(),
});
export type Role = z.infer<typeof roleSchema>;
