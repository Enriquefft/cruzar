import { z } from "zod";

// Shared primitives consumed by entity schemas and by `db/schema.ts` via Drizzle's
// `pgEnum()`. Every enum array is exported `as const` so its values feed both
// `z.enum()` and `pgEnum()` without duplication.

export type { CefrLevel as EnglishLevel } from "@/lib/cefr-map";
export {
  cefrLevelSchema as englishLevelSchema,
  cefrLevels as englishLevelValues,
} from "@/lib/cefr-map";

export const readinessVerdictValues = ["ready", "presentation_gap", "experience_gap"] as const;
export type ReadinessVerdict = (typeof readinessVerdictValues)[number];
export const readinessVerdictSchema = z.enum(readinessVerdictValues);

export const englishCertKindValues = ["ielts", "toefl", "cambridge", "aprendly", "other"] as const;
export type EnglishCertKind = (typeof englishCertKindValues)[number];
export const englishCertKindSchema = z.enum(englishCertKindValues);

// Canonical application states. SSOT: apps/career-ops/templates/states.yml (8 ids).
// If a state is added/renamed there, update this array in the same PR.
export const applicationStatusValues = [
  "evaluated",
  "applied",
  "responded",
  "interview",
  "offer",
  "rejected",
  "discarded",
  "skip",
] as const;
export type ApplicationStatus = (typeof applicationStatusValues)[number];
export const applicationStatusSchema = z.enum(applicationStatusValues);

export const fillFormDraftStateValues = ["drafted", "submitted", "rejected"] as const;
export type FillFormDraftState = (typeof fillFormDraftStateValues)[number];
export const fillFormDraftStateSchema = z.enum(fillFormDraftStateValues);

// Events are a superset of application states plus inbox-derived signals
// ("viewed", "interview_invited"). Freeform context belongs in `note`.
export const statusEventKindValues = [
  ...applicationStatusValues,
  "viewed",
  "interview_invited",
] as const;
export type StatusEventKind = (typeof statusEventKindValues)[number];
export const statusEventKindSchema = z.enum(statusEventKindValues);

export const platformValues = ["greenhouse", "lever", "ashby", "workable", "other"] as const;
export type Platform = (typeof platformValues)[number];
export const platformSchema = z.enum(platformValues);

export const gapSeverityValues = ["low", "medium", "high"] as const;
export type GapSeverity = (typeof gapSeverityValues)[number];
export const gapSeveritySchema = z.enum(gapSeverityValues);

export const employerTypeValues = ["startup", "smb", "enterprise", "agency", "other"] as const;
export type EmployerType = (typeof employerTypeValues)[number];
export const employerTypeSchema = z.enum(employerTypeValues);
