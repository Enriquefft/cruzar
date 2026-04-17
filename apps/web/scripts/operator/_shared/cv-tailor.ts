import { writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { desc, eq } from "drizzle-orm";

import { llmJsonCompletion } from "@/lib/llm";
import { uploadFileToR2 } from "@/lib/r2";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { cvTailorSchema, renderCvTailorPrompt } from "@/lib/prompts/cv-tailor";

const execFileAsync = promisify(execFile);

interface TailorCvInput {
  profileMd: string;
  jdText: string;
  studentId: string;
  applicationId: string;
}

interface TailorCvOutput {
  cvMarkdown: string;
  cvR2Key: string;
  version: number;
}

/**
 * Derive a tailored cv_markdown from profile_md + JD text, render to PDF,
 * upload to R2, and persist a generated_cvs row. Returns the cv_markdown,
 * R2 key, and version number.
 *
 * Idempotent on (application_id, version): re-running with the same
 * application_id increments version (append-only audit trail).
 */
export async function tailorCvForJd({
  profileMd,
  jdText,
  studentId,
  applicationId,
}: TailorCvInput): Promise<TailorCvOutput> {
  // Determine next version for this application
  const existingVersions = await db
    .select({ version: schema.generatedCvs.version })
    .from(schema.generatedCvs)
    .where(eq(schema.generatedCvs.application_id, applicationId))
    .orderBy(desc(schema.generatedCvs.version))
    .limit(1);

  const lastVersion = existingVersions[0]?.version ?? 0;
  const nextVersion = lastVersion + 1;

  // Call LLM: profile_md + JD -> tailored cv_markdown
  const messages = renderCvTailorPrompt({ profileMd, jdText });
  const result = await llmJsonCompletion({
    tier: "strong",
    messages,
    schema: cvTailorSchema,
    schemaName: "cv-tailor",
  });

  const { cv_markdown, changes_summary } = result;

  // Render PDF via generate-pdf.mjs subprocess
  const tmpDir = await mkdtemp(join(tmpdir(), "cruzar-cv-"));
  try {
    const mdPath = join(tmpDir, "cv.md");
    const pdfPath = join(tmpDir, "cv.pdf");

    await writeFile(mdPath, cv_markdown, "utf-8");

    // generate-pdf.mjs accepts <input> <output> positional args
    const thisDir = dirname(fileURLToPath(import.meta.url));
    const generatePdfPath = resolve(thisDir, "../../../../career-ops/bin/generate-pdf.mjs");
    await execFileAsync("node", [generatePdfPath, mdPath, pdfPath]);

    // Upload PDF to R2
    const r2Key = `generated-cvs/${studentId}/${applicationId}/v${nextVersion}.pdf`;
    await uploadFileToR2(r2Key, pdfPath, "application/pdf", "private");

    // Persist generated_cvs row
    await db.insert(schema.generatedCvs).values({
      student_id: studentId,
      application_id: applicationId,
      cv_markdown,
      cv_r2_key: r2Key,
      version: nextVersion,
      changes_summary,
    });

    return {
      cvMarkdown: cv_markdown,
      cvR2Key: r2Key,
      version: nextVersion,
    };
  } finally {
    // Cleanup temp dir
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
