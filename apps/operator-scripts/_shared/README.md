# apps/operator-scripts/_shared/

Shared helpers used across operator scripts. Populated incrementally during Roadmap blocks M4–M10.

Expected contents:

- `db.ts` — Drizzle client for scripts (distinct from `apps/web/db/client.ts` only if connection pooling differs).
- `llm.ts` — Anthropic wrapper with structured-output helpers + retry policy.
- `r2.ts` — R2 client for scripts.
- `runtime-dir.ts` — per-student `.cruzar-runtime/<id>/` generator + cleaner (block M9).
- `prompts/` — typed prompt constants + Zod output schemas.
- `logger.ts` — structured stdout for CC parsing.

All exports strict on types. No `any`, no `as` except `as const`.
