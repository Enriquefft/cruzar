import { readFile } from "node:fs/promises";
import {
  type CORSRule,
  CreateBucketCommand,
  GetBucketCorsCommand,
  HeadBucketCommand,
  HeadObjectCommand,
  PutBucketCorsCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
import { attestationMimeTypeSchema } from "./attestation-mime";
import { env } from "./env";

let cached: S3Client | undefined;

function requireR2Env() {
  const e = env();
  const accountId = e.R2_ACCOUNT_ID;
  const accessKeyId = e.R2_ACCESS_KEY_ID;
  const secretAccessKey = e.R2_SECRET_ACCESS_KEY;
  const bucket = e.R2_BUCKET;
  const publicBase = e.R2_PUBLIC_URL;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    throw new Error(
      "R2 env missing. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL in .env.",
    );
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBase };
}

export function r2(): S3Client {
  if (cached) return cached;
  const { accountId, accessKeyId, secretAccessKey } = requireR2Env();
  cached = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return cached;
}

export function publicUrl(key: string): string {
  const { publicBase } = requireR2Env();
  return `${publicBase.replace(/\/$/, "")}/${encodeURI(key).replace(/^\//, "")}`;
}

const ATTESTATION_MAX_BYTES = 10_000_000;
const ATTESTATION_EXPIRES_IN_SECONDS = 300;

const presignAttestationInputSchema = z.object({
  studentId: z.string().min(1),
  filename: z.string().min(1).max(255),
  mimeType: attestationMimeTypeSchema,
  sizeBytes: z.number().int().positive().max(ATTESTATION_MAX_BYTES),
});
export type PresignAttestationInput = z.infer<typeof presignAttestationInputSchema>;

export interface PresignedAttestationPut {
  url: string;
  key: string;
  expiresIn: number;
}

function sanitizeFilename(raw: string): string {
  const stripped = raw.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const safe = stripped.replace(/[^A-Za-z0-9._-]+/g, "-").replace(/-+/g, "-");
  const trimmed = safe.replace(/^[-.]+|[-.]+$/g, "");
  if (trimmed.length === 0) return "file";
  return trimmed.slice(0, 120);
}

export async function presignAttestationPut(
  input: PresignAttestationInput,
): Promise<PresignedAttestationPut> {
  const parsed = presignAttestationInputSchema.parse(input);
  const { bucket } = requireR2Env();
  const key = `attestations/${parsed.studentId}/${crypto.randomUUID()}-${sanitizeFilename(parsed.filename)}`;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: parsed.mimeType,
    ContentLength: parsed.sizeBytes,
  });
  const url = await getSignedUrl(r2(), command, {
    expiresIn: ATTESTATION_EXPIRES_IN_SECONDS,
  });
  return { url, key, expiresIn: ATTESTATION_EXPIRES_IN_SECONDS };
}

export async function assertAttestationExists(key: string): Promise<void> {
  const { bucket } = requireR2Env();
  try {
    await r2().send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
  } catch (err) {
    const name = err instanceof Error ? err.name : "UnknownError";
    throw new Error(`R2 attestation not found (${name})`);
  }
}

// ----------------------------------------------------------------------------
// Admin operations — invoked once by `apps/web/scripts/operator/r2-setup.ts`
// to provision the bucket + apply the canonical CORS config from
// `apps/web/r2-cors.json`. Not used by the runtime app.
// ----------------------------------------------------------------------------

export type R2CorsRule = CORSRule;
export type BucketState = "existed" | "created" | "missing";

export async function ensureBucket(apply: boolean): Promise<BucketState> {
  const { bucket } = requireR2Env();
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
    await client.send(new CreateBucketCommand({ Bucket: bucket }));
    return "created";
  }
}

export async function readBucketCors(): Promise<CORSRule[] | null> {
  const { bucket } = requireR2Env();
  try {
    const out = await r2().send(new GetBucketCorsCommand({ Bucket: bucket }));
    return out.CORSRules ?? [];
  } catch (err) {
    const name = err instanceof Error ? err.name : "UnknownError";
    if (name === "NoSuchCORSConfiguration") return null;
    throw err;
  }
}

export async function applyBucketCors(rules: CORSRule[]): Promise<void> {
  const { bucket } = requireR2Env();
  await r2().send(
    new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: { CORSRules: rules },
    }),
  );
}

export async function uploadFileToR2(
  key: string,
  filePath: string,
  contentType: string,
): Promise<void> {
  const { bucket } = requireR2Env();
  const body = await readFile(filePath);
  await r2().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}
