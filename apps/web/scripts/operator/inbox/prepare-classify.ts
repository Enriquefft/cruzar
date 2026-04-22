// PII envelope exception: this script is the CC-in-the-loop prepare step for
// inbox thread classification. The stdout JSON echoes the raw pasted `threads`
// string (which is email content, inherently PII) because CC — running locally
// in the operator session — needs them to reason about classification. This is
// an operator-local pipe to the caller agent, not a log aggregator. The PII
// contract from _shared/logger still applies to every OTHER operator script —
// do not copy this pattern elsewhere. `@/lib/llm` is intentionally not
// imported; reasoning happens in CC itself against the inlined prompt.
import { PROMPT_VERSION, renderInboxClassifyPrompt } from "@/lib/prompts/inbox-classify";
import { logError } from "../_shared/logger";

function extractSystemAndUser(messages: ReturnType<typeof renderInboxClassifyPrompt>): {
  system: string;
  user: string;
} {
  let system = "";
  let user = "";
  for (const m of messages) {
    if (m.role === "system") system = m.content;
    else if (m.role === "user") user = m.content;
  }
  if (system.length === 0 || user.length === 0) {
    logError("prompt_render_failed", "system or user prompt was empty after render");
  }
  return { system, user };
}

async function readStdin(): Promise<string> {
  process.stdin.setEncoding("utf8");
  let data = "";
  for await (const chunk of process.stdin) {
    data += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }
  return data;
}

async function main(): Promise<void> {
  const threads = await readStdin();
  if (threads.trim().length === 0) {
    logError("empty_input", "No email threads provided on stdin");
  }

  const messages = renderInboxClassifyPrompt({ threads });
  const { system, user } = extractSystemAndUser(messages);

  const payload = {
    success: true,
    threads,
    system_prompt: system,
    user_prompt: user,
    output_schema_hint:
      "See inboxClassifyResultSchema in @/lib/prompts/inbox-classify — { classifications: [{thread_id, classification: 'viewed'|'rejected'|'interview'|'other', application_match?: {company, role, job_url?}, interview_time?, confidence}] }",
    prompt_version: PROMPT_VERSION,
  } as const;
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
