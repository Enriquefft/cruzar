import { z } from "zod";

export const attestationMimeTypeValues = ["image/png", "image/jpeg", "application/pdf"] as const;
export type AttestationMimeType = (typeof attestationMimeTypeValues)[number];
export const attestationMimeTypeSchema = z.enum(attestationMimeTypeValues);
