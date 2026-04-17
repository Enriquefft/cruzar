# apps/operator-scripts/

Typed TypeScript entrypoints invoked by Claude Code operator skills (`.claude/skills/cruzar-*/`). Every operator action routes through a script here — no ad-hoc DB writes from skills.

See [`product/cruzar/architecture.md §Operator playbook internals`](../../product/cruzar/architecture.md#operator-playbook-internals) for conventions and [`product/cruzar/roadmap.md`](../../product/cruzar/roadmap.md) for when each script lands.

## Layout

```
apps/operator-scripts/
├── _shared/              DB client, R2 client, LLM wrappers, runtime-dir gen
├── intake/
│   ├── generate-batch.ts  (block M4)
│   ├── record-batch.ts    (block M4)
│   └── finalize.ts        (block M4)
├── assess.ts              (block M5)
├── run-cohort.ts          (block M9)
├── onboard.ts             (block M10)
├── scan-inbox.ts          (block M10)
├── send-interview-email.ts (block M10)
├── sql.ts                 (block M10)
├── counters-sanity.ts     (block M10)
└── r2-setup.ts            (one-shot: create bucket + apply CORS from apps/web/r2-cors.json)
```

## Rules

- Zod-validated I/O at every script boundary.
- Idempotent on the keys documented in Architecture §Idempotency keys.
- Exit 0 = success. Non-zero with a structured JSON error on stdout for CC to read.
- No hidden filesystem writes outside `.cruzar-runtime/` and logs.
- PII never in logs (IDs only).

## Running

```bash
bun run apps/operator-scripts/<name>.ts [flags]
```

All scripts load environment via `apps/web/lib/env.ts` from the repo root `.env` file.
