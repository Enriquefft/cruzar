// No explicit prompt caching — z.ai OpenAI-compat surface handles any server-side caching transparently.
import { type ZodType, z } from "zod";
import { env } from "./env";

export type LlmTier = "strong" | "weak";

export function strongModel(): string {
  return env().AI_STRONG_MODEL;
}

export function weakModel(): string {
  return env().AI_WEAK_MODEL;
}

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

const chatCompletionResponseSchema = z.object({
  choices: z
    .array(
      z.object({
        message: z.object({
          content: z.string(),
        }),
      }),
    )
    .min(1),
});

interface LlmJsonCompletionInput<T> {
  tier: LlmTier;
  messages: LlmMessage[];
  schema: ZodType<T>;
  schemaName: string;
}

export async function llmJsonCompletion<T>({
  tier,
  messages,
  schema,
  schemaName,
}: LlmJsonCompletionInput<T>): Promise<T> {
  const model = tier === "strong" ? strongModel() : weakModel();
  const firstAttempt = await requestJson({ model, messages, schemaName, tier });
  const firstParse = schema.safeParse(firstAttempt.parsed);
  if (firstParse.success) return firstParse.data;

  const retryAttempt = await requestJson({ model, messages, schemaName, tier });
  const retryParse = schema.safeParse(retryAttempt.parsed);
  if (retryParse.success) return retryParse.data;

  throw new Error(
    `LLM output failed schema '${schemaName}' after one retry. Raw content: ${retryAttempt.raw}`,
  );
}

interface RequestJsonOutput {
  parsed: unknown;
  raw: string;
}

async function requestJson({
  model,
  messages,
  schemaName,
  tier,
}: {
  model: string;
  messages: LlmMessage[];
  schemaName: string;
  tier: LlmTier;
}): Promise<RequestJsonOutput> {
  const e = env();
  const response = await fetch(`${e.AI_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${e.AI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: { type: "json_object" },
      temperature: 0,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    const truncated = body.length > 500 ? `${body.slice(0, 500)}…` : body;
    throw new Error(`LLM HTTP ${response.status} ${response.statusText}: ${truncated}`);
  }

  const outer = chatCompletionResponseSchema.parse(await response.json());
  const firstChoice = outer.choices[0];
  if (!firstChoice) throw new Error("LLM response had no choices");
  const raw = firstChoice.message.content;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (cause) {
    throw new Error(`LLM returned invalid JSON for schema '${schemaName}' on tier '${tier}'`, {
      cause,
    });
  }
  return { parsed, raw };
}
