---
name: cruzar-intake
description: Drive the Wizard-of-Oz intake loop over WhatsApp. Generates adaptive batches of 10 questions from prior answers, records student replies, and finalizes the intake after 4 batches. Miura copy-pastes the prompts + replies; CC persists everything.
---

# cruzar-intake

**Trigger:** Miura says `/cruzar intake <student_id> --generate|--record|--finalize`.

**Architecture:** [Flow B — Intake](../../../product/cruzar/architecture.md#flow-b--intake)
**ADRs:** [ADR-02 Intake WOZ WhatsApp](../../../product/cruzar/adr/02-intake-woz-whatsapp.md)
**Roadmap block:** M4 (primary), M10 for polish.

## When to use

- A student has `students.onboarded_at IS NOT NULL` and an `english_certs` row — intake is the next step before assessment.
- Miura needs to generate a new WhatsApp question batch, record a pasted reply, or finalize the 4-batch loop.

## Inputs

- `student_id` (Better Auth user id / `students.id`, required for `--generate` and `--finalize`).
- `batch_id` (uuid, required for `--record`).
- Optional `batch_num` (1..4) override for `--generate`.
- Optional `--overwrite` for `--record` when replacing a prior reply.
- Optional `--force` for `--finalize` when relaxing the per-batch answer floor from 8 to 5.

## Procedure

### `--generate` — author and persist the next batch

1. Invoke `bun run apps/web/scripts/operator/intake/generate-batch.ts --student <student_id>` (optionally add `--batch <1..4>`).
2. The script reads `students`, `english_certs`, prior `intake_batches` + `intake_batch_answers`. It fails fast if the student is missing, not onboarded, or lacks an english_certs row.
3. On the happy path it calls Claude with the `intake-batch-v1` prompt, Zod-validates the 10 questions, persists the `intake_batches` row (idempotent on `(intake_id, batch_num)`), and prints the paste-ready WhatsApp payload to stdout followed by a JSON success envelope.
4. Copy the payload (everything before the final JSON line) to WhatsApp and send it to the student.

### `--record` — ingest a pasted reply

1. Pipe the student's verbatim WhatsApp reply into `bun run apps/web/scripts/operator/intake/record-batch.ts --batch <batch_id>` (stdin). Add `--overwrite` when replacing a prior reply for the same batch.
2. The script validates the stdin reply (1..20_000 chars), updates `intake_batches.raw_reply` + `reply_at`, calls Claude with the `intake-batch-v1` reply-parse prompt, and upserts `intake_batch_answers` rows keyed by `(batch_id, question_key)`.
3. The JSON envelope reports `answer_count`, `mean_confidence`, and `unmatched_notes_length` so Miura can eyeball parse quality before moving on.

### `--finalize` — close the 4-batch loop

1. Invoke `bun run apps/web/scripts/operator/intake/finalize.ts --student <student_id>` (add `--force` only when a batch has <8 answers but you accept shipping at ≥5).
2. The script asserts exactly 4 batches, each with a non-null `raw_reply`, and an answer count ≥8 per batch (≥5 under `--force`). Batches below 10 answers emit a single-line JSON `level:"warn"` on stderr but are not fatal.
3. On success it sets `intakes.finalized_at = now()` and echoes the suggested next step in the JSON envelope.

## Scripts invoked

- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/generate-batch.ts`
- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/record-batch.ts`
- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/finalize.ts`

## Success criteria

- Parse the single JSON line on stdout and assert `success: true`.
- `--generate`: `batch_id` + `batch_num` returned, `prompt_version: "intake-batch-v1"`, and when `reused: true` the script produced no new LLM call.
- `--record`: `answer_count > 0` and `mean_confidence >= 0.5` expected; flag a lower value for Miura review.
- `--finalize`: `batch_count: 4`, `total_answers` sane; `intakes.finalized_at` flipped from null.
- Idempotency: rerunning `--generate` on the same `(intake_id, batch_num)` returns the existing row (no new LLM call, `reused: true`).

## Failure modes

All failures are reported as `{success: false, error: <code>, message, ...context}` JSON on stdout with exit code 1 (runtime) or 2 (args/Zod).

- `args` (exit 2) — malformed flags; `issues` array mirrors the Zod issue list.
- `student_not_found`, `not_onboarded`, `missing_english_cert` — preconditions on the target student; resolve before retrying `--generate`.
- `batch_not_found` — invalid `--batch <uuid>` for `--record`.
- `already_recorded` — `--record` without `--overwrite` on a batch that already has `raw_reply`. Confirm intent and rerun with `--overwrite`.
- `invalid_reply` — stdin was empty or over 20_000 chars; re-paste.
- `incomplete_batches`, `unreplied_batch`, `low_answer_count`, `critically_low_answer_count` — `--finalize` gating. Fix the underlying batch or add `--force` (only above the 5-answer floor).
- `already_finalized` — target intake already has `finalized_at`; next step is `/cruzar assess`.
- `unhandled` — uncaught exception (e.g., LLM Zod fail after one retry). Surface the message to Miura and retry; do not mutate state.
