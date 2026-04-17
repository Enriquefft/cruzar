// PII contract: this logger is the only channel for operator-script stdout.
// Payloads must contain only IDs (uuid, text), counts, booleans, prompt-version
// strings, and short machine-readable labels. Never log email, name, whatsapp,
// local_salary_usd, attestation_r2_key, raw_reply, answer_text, prompt_text, or
// any other field that could carry student PII or verbatim natural language.

export type LogPayloadValue = string | number | boolean | null | string[];
export type LogPayload = Record<string, LogPayloadValue>;

export function logDone(payload: LogPayload): never {
  const line = JSON.stringify({ success: true, ...payload });
  process.stdout.write(`${line}\n`);
  process.exit(0);
}

export function logError(name: string, message: string, context?: LogPayload): never {
  const line = JSON.stringify({
    success: false,
    error: name,
    message,
    ...(context ?? {}),
  });
  process.stdout.write(`${line}\n`);
  process.exit(1);
}
