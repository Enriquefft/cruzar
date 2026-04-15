import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),

  BETTER_AUTH_SECRET: z.string().min(32),
  BETTER_AUTH_URL: z.string().url(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string().url().optional(),

  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM_EMAIL: z.string().min(1),

  AI_API_KEY: z.string().min(1),
  AI_BASE_URL: z.string().url(),
  AI_STRONG_MODEL: z.string().min(1),
  AI_WEAK_MODEL: z.string().min(1),

  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_PUBLIC_URL: z.string().url(),

  SENTRY_DSN: z.string().url().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional(),

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
