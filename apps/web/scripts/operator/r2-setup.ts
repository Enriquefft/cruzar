import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import { env } from "@/lib/env";
import {
  type R2CorsRule,
  applyBucketCors,
  ensureBucket,
  readBucketCors,
} from "@/lib/r2";
import { parseFlags } from "./_shared/args";
import { logDone, logError } from "./_shared/logger";

const flagsSchema = z.object({
  apply: z.preprocess((v) => v === true || v === "true", z.boolean().default(false)),
});

const corsRuleSchema = z.object({
  ID: z.string().min(1),
  AllowedOrigins: z.array(z.string().url()).min(1),
  AllowedMethods: z.array(z.enum(["GET", "PUT", "POST", "DELETE", "HEAD"])).min(1),
  AllowedHeaders: z.array(z.string()).default([]),
  ExposeHeaders: z.array(z.string()).default([]),
  MaxAgeSeconds: z.number().int().nonnegative(),
});
const corsConfigSchema = z.object({
  CORSRules: z.array(corsRuleSchema).min(1),
});

const CORS_FILE_URL = new URL("../../r2-cors.json", import.meta.url);

async function loadDesiredCors(): Promise<R2CorsRule[]> {
  const path = fileURLToPath(CORS_FILE_URL);
  const raw = await readFile(path, "utf-8");
  return corsConfigSchema.parse(JSON.parse(raw)).CORSRules;
}

function rulesEqual(a: R2CorsRule[], b: R2CorsRule[]): boolean {
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

function normalize(rules: R2CorsRule[]): R2CorsRule[] {
  return [...rules]
    .map((r) => ({
      ID: r.ID,
      AllowedOrigins: [...(r.AllowedOrigins ?? [])].sort(),
      AllowedMethods: [...(r.AllowedMethods ?? [])].sort(),
      AllowedHeaders: [...(r.AllowedHeaders ?? [])].sort(),
      ExposeHeaders: [...(r.ExposeHeaders ?? [])].sort(),
      MaxAgeSeconds: r.MaxAgeSeconds,
    }))
    .sort((x, y) => (x.ID ?? "").localeCompare(y.ID ?? ""));
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);
  const e = env();
  const bucket = e.R2_BUCKET;
  if (!bucket) {
    logError("missing_env", "R2_BUCKET is unset. Populate the R2_* keys in .env first.");
  }

  const desired = await loadDesiredCors();

  let bucketState: Awaited<ReturnType<typeof ensureBucket>>;
  try {
    bucketState = await ensureBucket(flags.apply);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("bucket_check_failed", `HeadBucket/CreateBucket failed: ${message}`, { bucket });
  }

  if (bucketState === "missing") {
    logError(
      "bucket_missing",
      `Bucket "${bucket}" does not exist. Re-run with --apply to create it.`,
      { bucket },
    );
  }

  const current = bucketState === "created" ? null : await readBucketCors();
  const corsAlreadyMatches = current !== null && rulesEqual(current, desired);

  if (corsAlreadyMatches) {
    logDone({
      bucket,
      bucket_state: bucketState,
      cors_state: "matches",
      apply: flags.apply,
      rule_count: desired.length,
    });
  }

  if (!flags.apply) {
    process.stderr.write(
      `\n--- DRY RUN ---\nbucket=${bucket} state=${bucketState}\n` +
        `cors_current=${current === null ? "(none)" : `${current.length} rules`}\n` +
        `cors_desired=${desired.length} rules from apps/web/r2-cors.json\n` +
        `Re-run with --apply to mutate.\n--- end ---\n`,
    );
    logDone({
      bucket,
      bucket_state: bucketState,
      cors_state: current === null ? "absent" : "drift",
      apply: false,
      rule_count: desired.length,
    });
  }

  try {
    await applyBucketCors(desired);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("put_cors_failed", `PutBucketCors failed: ${message}`, { bucket });
  }

  logDone({
    bucket,
    bucket_state: bucketState,
    cors_state: "applied",
    apply: true,
    rule_count: desired.length,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
