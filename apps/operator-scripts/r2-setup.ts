import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import {
  CreateBucketCommand,
  GetBucketCorsCommand,
  HeadBucketCommand,
  type CORSRule,
  PutBucketCorsCommand,
} from "@aws-sdk/client-s3";
import { z } from "zod";

import { r2 } from "@/lib/r2";
import { env } from "@/lib/env";
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

const CORS_FILE_URL = new URL("../web/r2-cors.json", import.meta.url);

async function loadCorsConfig(): Promise<{ CORSRules: CORSRule[] }> {
  const path = fileURLToPath(CORS_FILE_URL);
  const raw = await readFile(path, "utf-8");
  const parsed = corsConfigSchema.parse(JSON.parse(raw));
  return { CORSRules: parsed.CORSRules };
}

function rulesEqual(a: CORSRule[], b: CORSRule[]): boolean {
  return JSON.stringify(normalize(a)) === JSON.stringify(normalize(b));
}

function normalize(rules: CORSRule[]): CORSRule[] {
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

async function ensureBucket(bucket: string, apply: boolean): Promise<"existed" | "created" | "missing"> {
  const client = r2();
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return "existed";
  } catch (err) {
    const name = err instanceof Error ? err.name : "UnknownError";
    if (!apply) return "missing";
    if (name !== "NotFound" && name !== "NoSuchBucket" && name !== "404") {
      throw err;
    }
    await client.send(
      new CreateBucketCommand({
        Bucket: bucket,
        CreateBucketConfiguration: { LocationConstraint: "ENAM" },
      }),
    );
    return "created";
  }
}

async function readCurrentCors(bucket: string): Promise<CORSRule[] | null> {
  try {
    const out = await r2().send(new GetBucketCorsCommand({ Bucket: bucket }));
    return out.CORSRules ?? [];
  } catch (err) {
    const name = err instanceof Error ? err.name : "UnknownError";
    if (name === "NoSuchCORSConfiguration") return null;
    throw err;
  }
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);
  const e = env();
  const bucket = e.R2_BUCKET;
  if (!bucket) {
    logError("missing_env", "R2_BUCKET is unset. Populate the R2_* keys in .env first.");
  }

  const desired = await loadCorsConfig();

  let bucketState: "existed" | "created" | "missing";
  try {
    bucketState = await ensureBucket(bucket, flags.apply);
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

  const current = bucketState === "created" ? null : await readCurrentCors(bucket);
  const corsAlreadyMatches = current !== null && rulesEqual(current, desired.CORSRules);

  if (corsAlreadyMatches) {
    logDone({
      bucket,
      bucket_state: bucketState,
      cors_state: "matches",
      apply: flags.apply,
      rule_count: desired.CORSRules.length,
    });
  }

  if (!flags.apply) {
    process.stderr.write(
      `\n--- DRY RUN ---\nbucket=${bucket} state=${bucketState}\n` +
        `cors_current=${current === null ? "(none)" : `${current.length} rules`}\n` +
        `cors_desired=${desired.CORSRules.length} rules from apps/web/r2-cors.json\n` +
        `Re-run with --apply to mutate.\n--- end ---\n`,
    );
    logDone({
      bucket,
      bucket_state: bucketState,
      cors_state: current === null ? "absent" : "drift",
      apply: false,
      rule_count: desired.CORSRules.length,
    });
  }

  try {
    await r2().send(
      new PutBucketCorsCommand({
        Bucket: bucket,
        CORSConfiguration: { CORSRules: desired.CORSRules },
      }),
    );
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("put_cors_failed", `PutBucketCors failed: ${message}`, { bucket });
  }

  logDone({
    bucket,
    bucket_state: bucketState,
    cors_state: "applied",
    apply: true,
    rule_count: desired.CORSRules.length,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
