import { z } from "zod";
import type { LlmMessage } from "@/lib/llm";

export const PROMPT_VERSION = "inbox-classify-v1" as const;

export const inboxClassificationSchema = z.object({
  thread_id: z.string().min(1),
  classification: z.enum(["viewed", "rejected", "interview", "other"]),
  application_match: z
    .object({
      company: z.string().min(1),
      role: z.string().min(1),
      job_url: z.string().optional(),
    })
    .optional(),
  interview_time: z.string().optional(),
  confidence: z.number().min(0).max(1),
});
export type InboxClassification = z.infer<typeof inboxClassificationSchema>;

export const inboxClassifyResultSchema = z.object({
  classifications: z.array(inboxClassificationSchema).min(1),
});
export type InboxClassifyResult = z.infer<typeof inboxClassifyResultSchema>;

interface RenderInboxClassifyInput {
  threads: string;
}

const inboxClassifySystem = `You are the Cruzar inbox classification engine. Given one or more pasted email threads from a job application inbox, classify each thread.

For each thread, determine:
1. **thread_id**: A short identifier you assign (e.g. "thread-1", "thread-2") in the order they appear.
2. **classification**: One of:
   - "viewed" — the company acknowledged or viewed the application (e.g. "your application has been received", "we're reviewing your application")
   - "rejected" — explicit rejection (e.g. "we decided to move forward with other candidates", "unfortunately...")
   - "interview" — an invitation to interview (scheduling link, proposed times, interview details)
   - "other" — newsletters, unrelated, spam, or ambiguous threads
3. **application_match**: If the thread references a specific company and role, extract them. Include job_url if visible.
4. **interview_time**: If classification is "interview" and a specific time is mentioned, extract it as an ISO 8601 datetime string.
5. **confidence**: 0.0 to 1.0 indicating how certain you are about the classification.

Rules:
- Be conservative: if ambiguous, classify as "other" with low confidence.
- Extract company and role names exactly as they appear in the email.
- Do not hallucinate interview times. Only extract a time if explicitly stated.

Output strict JSON:
{
  "classifications": [
    {
      "thread_id": "<string>",
      "classification": "viewed"|"rejected"|"interview"|"other",
      "application_match": { "company": "<string>", "role": "<string>", "job_url": "<string>" } | null,
      "interview_time": "<ISO 8601>" | null,
      "confidence": <number>
    }
  ]
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

export function renderInboxClassifyPrompt({ threads }: RenderInboxClassifyInput): LlmMessage[] {
  const user = `## Email threads to classify

${threads}

---

Classify each thread. Output strict JSON.`;

  return [
    { role: "system", content: inboxClassifySystem },
    { role: "user", content: user },
  ];
}
