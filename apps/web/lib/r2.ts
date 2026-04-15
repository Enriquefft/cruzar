import { S3Client } from "@aws-sdk/client-s3";
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
