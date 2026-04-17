# apps/web/scripts/

Typed TypeScript entrypoints that live inside the `apps/web` workspace and reuse its `node_modules`.

See [`product/cruzar/architecture.md §Operator playbook internals`](../../../product/cruzar/architecture.md#operator-playbook-internals) for what each script does and [`product/cruzar/roadmap.md`](../../../product/cruzar/roadmap.md) for when each landed.

## Layout

```
apps/web/scripts/
├── operator/                     skill-invoked operator surface
│   ├── _shared/                  args parser, logger, runtime-dir gen, cv-tailor
│   ├── intake/
│   │   ├── generate-batch.ts     (block M4)
│   │   ├── record-batch.ts       (block M4)
│   │   └── finalize.ts           (block M4)
│   ├── assess.ts                 (block M5)
│   ├── run-cohort.ts             (block M9)
│   ├── onboard.ts                (block M10)
│   ├── scan-inbox.ts             (block M10)
│   ├── send-interview-email.ts   (block M10)
│   ├── sql.ts                    (block M10)
│   ├── counters-sanity.ts        (block M10)
│   └── r2-setup.ts               (one-shot: bucket + CORS from apps/web/r2-cors.json)
└── (future *.ts)                 app-internal dev tooling — none yet
```

## Rules

- Zod-validated I/O at every script boundary.
- Idempotent on the keys documented in Architecture §Idempotency keys.
- Exit 0 = success. Non-zero with a structured JSON error on stdout for CC to read.
- No hidden filesystem writes outside `.cruzar-runtime/` and logs.
- PII never in logs (IDs only).

See [`CLAUDE.md`](./CLAUDE.md) for the full conventions.

## Running

All scripts run from the repo root. Bun resolves dependencies through `apps/web/node_modules`:

```bash
bun run apps/web/scripts/operator/<name>.ts [flags]
```

Examples:

```bash
bun run apps/web/scripts/operator/onboard.ts --student <id>
bun run apps/web/scripts/operator/intake/generate-batch.ts --student <id>
bun run apps/web/scripts/operator/intake/record-batch.ts --batch <id> < reply.txt
bun run apps/web/scripts/operator/intake/finalize.ts --student <id>
bun run apps/web/scripts/operator/assess.ts --student <id>
bun run apps/web/scripts/operator/run-cohort.ts --student <id> --job-url <url>
bun run apps/web/scripts/operator/scan-inbox.ts
bun run apps/web/scripts/operator/send-interview-email.ts --application <id>
bun run apps/web/scripts/operator/sql.ts --query "SELECT ..." [--write] [--destructive]
bun run apps/web/scripts/operator/counters-sanity.ts
bun run apps/web/scripts/operator/r2-setup.ts          # report drift
bun run apps/web/scripts/operator/r2-setup.ts --apply  # create bucket + apply CORS
```

All scripts load environment via `apps/web/lib/env.ts` from the repo-root `.env` file.
