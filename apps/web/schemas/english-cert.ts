import { z } from "zod";
import { englishCertKindSchema, englishLevelSchema } from "./_shared";

export const englishCertSchema = z.object({
  id: z.uuid(),
  student_id: z.string().min(1),
  kind: englishCertKindSchema,
  score: z.string().min(1),
  level: englishLevelSchema,
  issued_at: z.iso.date(),
  attestation_r2_key: z.string().min(1),
  verified: z.boolean(),
});
export type EnglishCert = z.infer<typeof englishCertSchema>;
