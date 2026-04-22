---
name: cruzar-students-list
description: List students keyed by pipeline state (pending_onboard | pending_intake | pending_assess | ready | gap) so Miura can resolve student ids from name, email, or slug without running SQL. Read-only. Used as the picker step before any other /cruzar skill that needs --student <id>.
---

# cruzar-students-list

**Trigger:** `/cruzar students list [--state <state>] [--q <substring>]`.

**Architecture:** derives state from [students + english_certs + intakes + profiles](../../../product/cruzar/architecture.md#data-model). Read-only — never mutates.

## When to use

- Miura says `/cruzar onboard|intake|assess|run-cohort` without a `--student` id. CC runs this skill first, surfaces the candidates to Miura, then re-invokes the downstream skill with the chosen id.
- Miura asks "who still needs onboarding / intake / assess", or "what's the id for <name>".
- Pre-demo sanity check: confirm the cohort lines up with what's committed in `product/cruzar/`.

## Inputs

- `--state <state>` -- optional filter. One of `pending_onboard`, `pending_intake`, `pending_assess`, `ready`, `gap`. When omitted, all five states are returned.
- `--q <substring>` -- optional case-insensitive substring match against name, email, public_slug, or id.

## State derivation

| State | Condition |
|---|---|
| `pending_onboard` | `students` + `english_certs` exist, `students.onboarded_at IS NULL`. |
| `pending_intake` | `students.onboarded_at IS NOT NULL`, no `intakes.finalized_at`. |
| `pending_assess` | `intakes.finalized_at IS NOT NULL`, no `profiles` row. |
| `ready` | `profiles.readiness_verdict = 'ready'`. |
| `gap` | `profiles.readiness_verdict IN ('presentation_gap', 'experience_gap')`. |

A `students` row without an `english_certs` row is excluded (pre-onboarding signup, not yet in the pipeline).

## Procedure

1. Invoke the script:
   ```bash
   bun run apps/web/scripts/operator/students/list.ts [--state <state>] [--q <substring>]
   ```
2. Read the stderr table to pick an id. stdout has the machine-readable JSON envelope (ids only, no PII).
3. Re-invoke the skill that prompted this list with `--student <id>`.

## Output contract

- **stderr** -- human-readable table with columns `state`, `first` (first name only), `email` (masked as `e***@domain`), `slug`, `created` (YYYY-MM-DD), `id`. Safe for demo screenshare.
- **stdout** -- single JSON line: `{ success: true, count, student_ids: [<id>, ...], state_filter, query }`. IDs only — no names, emails, slugs, whatsapps per the PII contract in [apps/web/scripts/CLAUDE.md](../../../apps/web/scripts/CLAUDE.md).

## Success criteria

- Parse the single JSON line on stdout and assert `success: true`.
- `count === student_ids.length`.
- Re-running with the same flags returns identical output (read-only, no state mutation).

## Failure modes

- `args` (exit 2) -- invalid `--state` value or empty `--q`; `issues` mirrors the Zod issue list.
- `unhandled` (exit 1) -- DB connection or query failure. Retry after checking `.env`.
