# apps/web/scripts — conventions

Typed TypeScript entrypoints that ship inside the `apps/web` workspace and reuse its `node_modules` directly. Two distinct kinds of script live here:

- `operator/` — entrypoints invoked by `.claude/skills/cruzar-*/SKILL.md`. Drive the cohort pipeline (intake, assess, run-cohort, scan-inbox, interview, sql, counters-sanity, onboard, r2-setup). Every operator action routes through one of these scripts; skills never mutate the DB directly.
- `*.ts` directly under `apps/web/scripts/` (sibling of `operator/`) — app-internal dev tooling: eval harnesses, migration helpers, anything tied to apps/web's own internals. None exist yet. Do not put operator scripts here, and do not put dev tooling under `operator/`.

Stacks on top of [`../CLAUDE.md`](../CLAUDE.md) (apps/web rules: Zod SSOT, no `any`, no `as` except `as const`, env via `lib/env.ts`, PII never logs) and the area + repo CLAUDE.md files above it. Do not repeat those rules.

SSOT for what the operator scripts must do is [`../../../product/cruzar/architecture.md §Operator playbook internals`](../../../product/cruzar/architecture.md#operator-playbook-internals).

## Rules for `operator/`

1. **Zod at the boundary.** Every script validates flags, stdin, and env with Zod before doing anything else. Use `parseFlags(schema)` from `_shared/args.ts`.
2. **Idempotent.** Use the documented keys from Architecture §Idempotency keys. Re-running with the same inputs must not produce duplicate rows.
3. **Exit codes.** Exit 0 on success via `logDone(payload)`. Non-zero via `logError(name, message, ctx?)` writes a structured JSON error to stdout. CC parses it.
4. **No hidden writes.** Filesystem writes only under `.cruzar-runtime/<student_id>/` plus stdout/stderr. R2 writes routed through `@/lib/r2`.
5. **PII never logs.** IDs, counts, booleans, prompt-version strings only. Never log `email`, `name`, `whatsapp`, `local_salary_usd`, `attestation_r2_key`, `raw_reply`, `answer_text`, `prompt_text`. Same rule applies to Sentry breadcrumbs.
6. **Subprocess contract with `apps/career-ops/`.** `run-cohort.ts` is the only script that shells out to `apps/career-ops/bin/fill-forms.mjs` + `generate-pdf.mjs`. The ethical submit gate is enforced inside `apps/career-ops/`, but `run-cohort.ts` also asserts the gate in the subprocess config — defence in depth.

## Imports

Files anywhere under `apps/web/` resolve `@/*` via the workspace tsconfig. Always import from canonical paths:

- DB: `import { db } from "@/db/client"`, `import { <table> } from "@/db/schema"`, `import * as schema from "@/db/schema"` only when many tables needed dynamically.
- R2: `import { ... } from "@/lib/r2"`.
- LLM: `import { llmJsonCompletion, type LlmMessage } from "@/lib/llm"`.
- Env: `import { env } from "@/lib/env"`.
- Prompts: `import { ... } from "@/lib/prompts/<name>"`.

Operator scripts may import from `./_shared/{args,logger,runtime-dir,cv-tailor}` for script-specific helpers that have no second caller in the app.

## Running

Scripts run from the repo root using bun, which picks up `apps/web/node_modules` because the file lives inside that workspace:

```bash
bun run apps/web/scripts/operator/<name>.ts [flags]
```

See [`README.md`](./README.md) for per-script invocations.
