export { r2, publicUrl } from "../../web/lib/r2";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { readFile } from "node:fs/promises";
import { r2 } from "../../web/lib/r2";
import { env } from "../../web/lib/env";

export async function uploadFileToR2(
  key: string,
  filePath: string,
  contentType: string,
): Promise<void> {
  const e = env();
  const body = await readFile(filePath);
  await r2().send(
    new PutObjectCommand({
      Bucket: e.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
}
