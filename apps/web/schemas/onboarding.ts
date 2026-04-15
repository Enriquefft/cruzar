import { z } from "zod";
import { attestationMimeTypeSchema } from "@/lib/r2";
import { englishCertSchema } from "./english-cert";
import { studentSchema } from "./student";

const englishCertOnboardingInputSchema = englishCertSchema
  .pick({
    kind: true,
    score: true,
    issued_at: true,
    attestation_r2_key: true,
  })
  .extend({
    score: z.string().min(1).max(32),
    attestation_r2_key: z.string().min(1).max(512),
  });
export type EnglishCertOnboardingInput = z.infer<typeof englishCertOnboardingInputSchema>;

const studentOnboardingInputSchema = studentSchema
  .pick({
    name: true,
    whatsapp: true,
    local_salary_usd: true,
    consent_public_profile: true,
  })
  .extend({
    name: z.string().min(1).max(200),
    whatsapp: z.string().min(5).max(32),
  });

export const onboardingInputSchema = studentOnboardingInputSchema.extend({
  english_cert: englishCertOnboardingInputSchema,
});
export type OnboardingInput = z.infer<typeof onboardingInputSchema>;

export const attestationUploadRequestSchema = z.object({
  filename: z.string().min(1).max(255),
  mimeType: attestationMimeTypeSchema,
  sizeBytes: z.number().int().positive().max(10_000_000),
});
export type AttestationUploadRequest = z.infer<typeof attestationUploadRequestSchema>;
