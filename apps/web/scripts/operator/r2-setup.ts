import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";

import {
  applyBucketCors,
  type BucketState,
  bucketNames,
  ensureBucket,
  type R2CorsRule,
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

type BucketRole = "public" | "private";

interface BucketReport {
  role: BucketRole;
  name: string;
  bucket_state: BucketState;
  cors_state: "matches" | "drift" | "absent" | "applied";
}

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

async function provisionBucket(
  role: BucketRole,
  name: string,
  desired: R2CorsRule[],
  apply: boolean,
): Promise<BucketReport> {
  let bucketState: BucketState;
  try {
    bucketState = await ensureBucket(name, apply);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("bucket_check_failed", `HeadBucket/CreateBucket failed: ${message}`, {
      bucket: name,
      role,
    });
    throw cause;
  }

  if (bucketState === "missing") {
    logError(
      "bucket_missing",
      `Bucket "${name}" does not exist. Re-run with --apply to create it.`,
      { bucket: name, role },
    );
    throw new Error("bucket_missing");
  }

  const current = bucketState === "created" ? null : await readBucketCors(name);
  const corsAlreadyMatches = current !== null && rulesEqual(current, desired);

  if (corsAlreadyMatches) {
    return { role, name, bucket_state: bucketState, cors_state: "matches" };
  }

  if (!apply) {
    return {
      role,
      name,
      bucket_state: bucketState,
      cors_state: current === null ? "absent" : "drift",
    };
  }

  try {
    await applyBucketCors(name, desired);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("put_cors_failed", `PutBucketCors failed: ${message}`, { bucket: name, role });
    throw cause;
  }

  return { role, name, bucket_state: bucketState, cors_state: "applied" };
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  let buckets: { publicBucket: string; privateBucket: string };
  try {
    buckets = bucketNames();
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("missing_env", message);
    return;
  }

  const desired = await loadDesiredCors();

  const reports: BucketReport[] = [];
  for (const [role, name] of [
    ["public", buckets.publicBucket],
    ["private", buckets.privateBucket],
  ] as const) {
    const report = await provisionBucket(role, name, desired, flags.apply);
    reports.push(report);
  }

  if (!flags.apply) {
    const summary = reports
      .map((r) => `  ${r.role}: bucket="${r.name}" state=${r.bucket_state} cors=${r.cors_state}`)
      .join("\n");
    process.stderr.write(
      `\n--- DRY RUN ---\n${summary}\ncors_desired=${desired.length} rules from apps/web/r2-cors.json\n` +
        `Re-run with --apply to mutate.\n--- end ---\n`,
    );
  }

  const payload: Record<string, string | number | boolean> = {
    apply: flags.apply,
    rule_count: desired.length,
  };
  for (const r of reports) {
    payload[`${r.role}_bucket`] = r.name;
    payload[`${r.role}_bucket_state`] = r.bucket_state;
    payload[`${r.role}_cors_state`] = r.cors_state;
  }
  logDone(payload);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
