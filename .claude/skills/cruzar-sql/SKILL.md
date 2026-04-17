---
name: cruzar-sql
description: Escape hatch for ad-hoc Postgres queries. Read-only by default. Mutations require the --write flag plus an explicit typed confirmation from Miura. Use only when no existing skill covers the need.
---

# cruzar-sql

**Trigger:** `/cruzar sql --query "<sql>"` when no other skill covers the task.

**Architecture:** [Flow G -- SQL escape](../../../product/cruzar/architecture.md#flow-g--sql-escape)

## Inputs

- `--query "<sql>"` -- the SQL query to execute (required).
- `--write` -- enable mutation mode (optional, default false).
- `--destructive` -- required alongside `--write` for DROP/TRUNCATE/ALTER (optional).

## Procedure

1. Run the script:
   ```bash
   bun run apps/web/scripts/operator/sql.ts --query "SELECT ..." [--write] [--destructive]
   ```
2. The script:
   a. Validates flags via Zod.
   b. **Read-only default:** rejects the query if it contains INSERT/UPDATE/DELETE/DROP/TRUNCATE/ALTER/CREATE without `--write`.
   c. **Destructive gate:** rejects DROP/TRUNCATE/ALTER without `--destructive` flag.
   d. **Write confirmation:** on `--write`, prints the query + EXPLAIN output, then requires operator to type `CONFIRM` on stdin.
   e. Executes the query against Postgres.
   f. Prints results: column names, rows (max 20 sample), total row count.

## Guardrails

- Read-only by default. No mutation without `--write`.
- DROP/TRUNCATE/ALTER require both `--write` and `--destructive`.
- Every `--write` query requires explicit `CONFIRM` typed on stdin.
- Mutations are rare -- prefer creating a new skill + script for repeated actions.
- EXPLAIN output shown before confirmation so Miura sees the query plan.

## Exit codes

- `0` -- success. JSON stdout: `{ success: true, rows_returned, write_mode, query_preview }`.
- `1` -- error (rejected query, failed execution, Miura abort).
- `2` -- invalid flags.

## Failure modes

- Write keyword without `--write`: exits 1 with clear message naming the keyword.
- Destructive keyword without `--destructive`: exits 1 with clear message.
- Miura does not type `CONFIRM`: exits 1 with "aborted".
- SQL syntax error: exits 1 with Postgres error message.
