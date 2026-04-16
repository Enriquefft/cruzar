# apps/operator-scripts — conventions

Typed TypeScript entrypoints invoked by `.claude/skills/cruzar-*` skills. Every operator action routes through a script here — skills never mutate the DB directly.

Stacks on top of [`../../CLAUDE.md`](../../CLAUDE.md) (repo root engineering principles) and [`../CLAUDE.md`](../CLAUDE.md) (apps-level TypeScript rules). SSOT for what these scripts must do is [`../../product/cruzar/architecture.md §Operator playbook internals`](../../product/cruzar/architecture.md#operator-playbook-internals).

## Scope

**This workspace = business/operator orchestration.** Scripts invoked by CC skills to drive the cohort pipeline. Examples: `intake/generate-batch.ts`, `assess.ts`, `run-cohort.ts`, `scan-inbox.ts`.

**Not this workspace = app-dev tooling.** Migrations, build helpers, eval harnesses, or anything tied to a single workspace's internals live inside that workspace (e.g. `apps/web/scripts/eval-cefr.ts`, `apps/web/package.json` scripts). Do not mix them here.

## Rules

1. **Zod at the boundary.** Every script validates its inputs (flags, stdin, env) with Zod before doing anything else.
2. **Idempotent.** Use the documented keys from Architecture §Idempotency keys. Re-running a script with the same inputs must not produce duplicate rows.
3. **Exit codes.** Exit 0 on success. Non-zero with a structured JSON error on stdout. CC parses it.
4. **No hidden writes.** Filesystem writes allowed only under `.cruzar-runtime/<student_id>/` + logs. R2 writes routed through `_shared/r2.ts`.
5. **PII never in logs.** IDs only. Sentry breadcrumbs same rule.
6. **Env access through `apps/web/lib/env.ts`** — the canonical Zod-validated env accessor. Do not read `process.env` directly.
7. **No `any`. No `as` except `as const`.** Same rules as every other workspace.

## Subprocess contract with `apps/career-ops/`

`run-cohort.ts` is the single script that shells out to `apps/career-ops/bin/fill-forms.mjs` + `generate-pdf.mjs`. No other script may invoke those binaries. The ethical submit gate (Architecture §WOZ) is enforced by `apps/career-ops/`, but `run-cohort.ts` also asserts the gate in the subprocess config — defence in depth.
