import { z } from "zod";

// Treat the empty string as "unset" across optional keys — dotenv parsers hand
// us `""` for unfilled lines, which a bare `.optional()` would still reject
// when paired with `.url()` or `.min(1)`.
const optionalString = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().min(1).optional(),
);
const optionalUrl = z.preprocess((v) => (v === "" ? undefined : v), z.string().url().optional());

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  NEXT_PUBLIC_BETTER_AUTH_URL: optionalUrl,

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),

  AI_API_KEY: z.string().min(1),
  AI_BASE_URL: z.string().url(),
  AI_STRONG_MODEL: z.string().min(1),
  AI_WEAK_MODEL: z.string().min(1),

  // R2 is optional at the env layer (blocks M2+ depend on it; M1 runtime does
  // not). The R2 client throws if any of these are missing at call time.
  R2_ACCOUNT_ID: optionalString,
  R2_ACCESS_KEY_ID: optionalString,
  R2_SECRET_ACCESS_KEY: optionalString,
  R2_PUBLIC_BUCKET: optionalString,
  R2_PRIVATE_BUCKET: optionalString,
  R2_PUBLIC_URL: optionalUrl,

  NEXT_PUBLIC_POSTHOG_KEY: optionalString,
  NEXT_PUBLIC_POSTHOG_HOST: optionalUrl,

  OPERATOR_EMAILS: z.string().transform((raw) =>
    raw
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean),
  ),

  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
});

export type Env = z.infer<typeof envSchema>;

let cached: Env | undefined;

export function env(): Env {
  if (cached) return cached;
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error("Invalid environment:", parsed.error.flatten().fieldErrors);
    throw new Error("Environment validation failed. See apps/web/.env.example.");
  }
  cached = parsed.data;
  return cached;
}
