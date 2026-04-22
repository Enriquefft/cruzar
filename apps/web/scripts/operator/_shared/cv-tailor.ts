import { execFile } from "node:child_process";
import { copyFile, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import * as schema from "@/db/schema";
import { PROMPT_VERSION, renderCvTailorPrompt } from "@/lib/prompts/cv-tailor";
import { uploadFileToR2 } from "@/lib/r2";

const execFileAsync = promisify(execFile);

interface PrepareTailorContextInput {
  profileMd: string;
  jdText: string;
  applicationId: string;
}

interface PrepareTailorContextOutput {
  nextVersion: number;
  system_prompt: string;
  user_prompt: string;
  prompt_version: typeof PROMPT_VERSION;
}

/**
 * CC-in-the-loop: load the next version number for this application and emit
 * the system/user prompts so Claude Code (in the orchestrator session) can
 * author the tailored cv_markdown. No LLM call here.
 */
export async function prepareTailorContext({
  profileMd,
  jdText,
  applicationId,
}: PrepareTailorContextInput): Promise<PrepareTailorContextOutput> {
  const existingVersions = await db
    .select({ version: schema.generatedCvs.version })
    .from(schema.generatedCvs)
    .where(eq(schema.generatedCvs.application_id, applicationId))
    .orderBy(desc(schema.generatedCvs.version))
    .limit(1);

  const lastVersion = existingVersions[0]?.version ?? 0;
  const nextVersion = lastVersion + 1;

  const messages = renderCvTailorPrompt({ profileMd, jdText });
  let system = "";
  let user = "";
  for (const m of messages) {
    if (m.role === "system") system = m.content;
    else if (m.role === "user") user = m.content;
  }

  return {
    nextVersion,
    system_prompt: system,
    user_prompt: user,
    prompt_version: PROMPT_VERSION,
  };
}

interface SaveTailoredCvInput {
  cvMarkdown: string;
  changesSummary: string;
  studentId: string;
  applicationId: string;
  nextVersion: number;
  destPdfPath?: string;
}

interface TailorCvOutput {
  cvMarkdown: string;
  cvR2Key: string;
  version: number;
}

/**
 * Render the CC-authored cv_markdown to PDF, upload to R2, and persist a
 * generated_cvs row. Append-only audit trail on (application_id, version).
 */
export async function saveTailoredCv({
  cvMarkdown,
  changesSummary,
  studentId,
  applicationId,
  nextVersion,
  destPdfPath,
}: SaveTailoredCvInput): Promise<TailorCvOutput> {
  const tmpDir = await mkdtemp(join(tmpdir(), "cruzar-cv-"));
  try {
    const mdPath = join(tmpDir, "cv.md");
    const pdfPath = join(tmpDir, "cv.pdf");

    await writeFile(mdPath, cvMarkdown, "utf-8");

    const thisDir = dirname(fileURLToPath(import.meta.url));
    const generatePdfPath = resolve(thisDir, "../../../../career-ops/bin/generate-pdf.mjs");
    await execFileAsync("node", [generatePdfPath, mdPath, pdfPath]);

    const r2Key = `generated-cvs/${studentId}/${applicationId}/v${nextVersion}.pdf`;
    await uploadFileToR2(r2Key, pdfPath, "application/pdf", "private");

    if (destPdfPath) {
      await copyFile(pdfPath, destPdfPath);
    }

    await db.insert(schema.generatedCvs).values({
      student_id: studentId,
      application_id: applicationId,
      cv_markdown: cvMarkdown,
      cv_r2_key: r2Key,
      version: nextVersion,
      changes_summary: changesSummary,
    });

    return {
      cvMarkdown,
      cvR2Key: r2Key,
      version: nextVersion,
    };
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}

interface RenderShowcaseCvInput {
  cvMarkdown: string;
  studentId: string;
}

/**
 * Render a pre-authored showcase CV markdown to PDF and upload to the R2
 * public bucket. Returns the R2 key. Idempotent per student: re-runs
 * overwrite the same key so /profile + /p/<slug> always read the latest
 * render.
 *
 * CC-in-the-loop: the markdown is authored upstream by Claude Code from
 * the prepare.ts context bundle. This function does no LLM work.
 */
export async function renderShowcaseCvFromMarkdown({
  cvMarkdown,
  studentId,
}: RenderShowcaseCvInput): Promise<string> {
  const tmpDir = await mkdtemp(join(tmpdir(), "cruzar-showcase-"));
  try {
    const mdPath = join(tmpDir, "cv.md");
    const pdfPath = join(tmpDir, "cv.pdf");
    await writeFile(mdPath, cvMarkdown, "utf-8");

    const thisDir = dirname(fileURLToPath(import.meta.url));
    const generatePdfPath = resolve(thisDir, "../../../../career-ops/bin/generate-pdf.mjs");
    await execFileAsync("node", [generatePdfPath, mdPath, pdfPath]);

    const r2Key = `showcase-cvs/${studentId}.pdf`;
    await uploadFileToR2(r2Key, pdfPath, "application/pdf", "public");
    return r2Key;
  } finally {
    await rm(tmpDir, { recursive: true, force: true }).catch(() => {});
  }
}
