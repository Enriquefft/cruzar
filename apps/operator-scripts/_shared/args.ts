import type { ZodType } from "zod";
import { logError } from "./logger";

type FlagValue = string | boolean;

function tokenize(argv: readonly string[]): Record<string, FlagValue> {
  const out: Record<string, FlagValue> = {};
  let i = 0;
  while (i < argv.length) {
    const tok = argv[i];
    if (tok === undefined) break;
    if (!tok.startsWith("--")) {
      logError("args", `Unexpected positional argument: ${tok}`);
    }
    const key = tok.slice(2);
    if (key.length === 0) {
      logError("args", `Invalid flag: ${tok}`);
    }
    const next = argv[i + 1];
    if (next === undefined || next.startsWith("--")) {
      out[key] = true;
      i += 1;
      continue;
    }
    out[key] = next;
    i += 2;
  }
  return out;
}

export function parseFlags<T>(schema: ZodType<T>): T {
  const raw = tokenize(process.argv.slice(2));
  const parsed = schema.safeParse(raw);
  if (parsed.success) return parsed.data;
  const issues = parsed.error.issues.map((issue) => ({
    path: issue.path,
    message: issue.message,
    code: issue.code,
  }));
  process.stdout.write(`${JSON.stringify({ success: false, error: "args", issues })}\n`);
  process.exit(2);
}
