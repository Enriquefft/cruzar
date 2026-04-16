import { z } from "zod";
import type { LlmMessage } from "@/lib/llm";

export const PROMPT_VERSION = "cv-tailor-v1" as const;

export const cvTailorSchema = z.object({
  cv_markdown: z.string().min(50),
  changes_summary: z.string().min(1),
});
export type CvTailorResult = z.infer<typeof cvTailorSchema>;

interface RenderCvTailorInput {
  profileMd: string;
  jdText: string;
}

const cvTailorSystem = `You are the Cruzar CV tailoring engine. Given a student's profile_md (their single source of truth narrative document) and a specific job description, produce a tailored cv_markdown optimized for this role.

The cv_markdown is a markdown document structured as a professional CV/resume. It must:

1. **Lead with relevance.** Reorder sections and bullets to front-load what matters most for this specific JD.
2. **Mirror the JD's language.** Where the student has a matching skill/experience, use the JD's exact terminology (not synonyms). ATS systems match on keywords.
3. **Quantify everything.** Pull metrics, team sizes, durations, and outcomes from profile_md. Never invent numbers.
4. **Omit irrelevant content.** If a story or skill from profile_md is unrelated to this JD, drop it. A focused 1-page CV beats a comprehensive 2-page one.
5. **Preserve truth.** Every claim in the CV must trace back to profile_md. Do not fabricate experience, inflate titles, or add skills not evidenced in the profile.
6. **Professional formatting.** Use markdown headers, bullet points, and consistent date formats. No tables, no images, no links (the PDF renderer handles layout).
7. **One page target.** Aim for content that fits a single A4 page when rendered. Prioritize ruthlessly.

The changes_summary is a brief (2-3 sentences) explanation of what was emphasized, reordered, or omitted relative to a generic CV for this student.

Output strict JSON:
{
  "cv_markdown": "<full markdown string>",
  "changes_summary": "<string>"
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

export function renderCvTailorPrompt({ profileMd, jdText }: RenderCvTailorInput): LlmMessage[] {
  const user = `## Student profile (SSOT)

${profileMd}

---

## Job description

${jdText}

---

Produce a tailored CV markdown optimized for this specific role. Output strict JSON.`;

  return [
    { role: "system", content: cvTailorSystem },
    { role: "user", content: user },
  ];
}
