---
name: cruzar-intake
description: Drive the Wizard-of-Oz intake loop over WhatsApp. CC authors adaptive batches of 10 questions from prior answers and parses replies; scripts persist. Miura copy-pastes prompts + replies; CC does the reasoning in-session and pipes results into the save scripts.
---

# cruzar-intake

**Trigger:** Miura says `/cruzar intake <student_id> --generate|--record|--finalize`.

**Architecture:** [Flow B — Intake](../../../product/cruzar/architecture.md#flow-b--intake)
**ADRs:** [ADR-02 Intake WOZ WhatsApp](../../../product/cruzar/adr/02-intake-woz-whatsapp.md)
**Roadmap block:** M4 (primary), M10 for polish.

## Shape of the flow (CC-in-the-loop)

z.ai has been unreliable. All LLM reasoning for intake now happens inside **this CC session**. The operator scripts split into two halves:

- `prepare-*.ts` — load DB context and emit the exact system+user prompts on stdout. No LLM call.
- `save-*.ts` — accept CC's JSON output on stdin, Zod-validate, persist idempotently.

CC is the reasoner between them. Treat the `system_prompt` + `user_prompt` fields from `prepare-*` output as a literal instruction; do not paraphrase.

## When to use

- A student has `students.onboarded_at IS NOT NULL` and an `english_certs` row — intake is the next step before assessment.
- Miura needs to generate a new WhatsApp question batch, record a pasted reply, or finalize the 4-batch loop.

## Inputs

- `student_id` (Better Auth user id / `students.id`, required for `--generate` and `--finalize`).
- `batch_id` (uuid, required for `--record`).
- Optional `batch_num` (1..4) override for `--generate`.
- Optional `--overwrite` for `--record` (prepare-record + save-record) when replacing a prior reply.
- Optional `--overwrite` for `--generate` save-step when replacing a prior same-batch row.
- Optional `--force` for `--finalize` when relaxing the per-batch answer floor from 8 to 5.

If Miura says `/cruzar intake` with no id, CC first runs [`/cruzar students list --state pending_intake`](../cruzar-students-list/SKILL.md) to surface the candidates, then re-invokes this skill with the chosen id. `prepare-batch.ts` itself also lists candidates to stderr and exits `2` with `error: "missing_student"` when `--student` is absent.

## Procedure

### `--generate` — author and persist the next batch

**Step 1.** Run `prepare-batch.ts` to load DB context:

```bash
bun run apps/web/scripts/operator/intake/prepare-batch.ts --student <student_id>
# optional: add --batch <1..4> to target a specific batch
```

It emits a single JSON line on stdout.

- If `reused: true`, the batch was already generated and persisted. Paste the `prompt_text` field directly to WhatsApp and **skip steps 2–3**. Record the `batch_id` for the later `--record` run.
- If `reused: false`, proceed to step 2. The payload contains:
  - `intake_id`, `student_id`, `student_name`, `batch_num`, `english_cert`, `prior_batches` — inputs for reasoning.
  - `system_prompt`, `user_prompt` — the literal prompt template to follow.
  - `output_schema_hint` — schema reference.

**Step 2.** As CC, follow `system_prompt` + `user_prompt` verbatim and author exactly 10 questions. Output must be a JSON array matching `intakeBatchQuestionSchema`:

```json
[
  { "question_key": "snake_case_key", "question_text": "...", "rationale": "..." },
  ...9 more
]
```

`question_key` must be unique across ALL batches for this student (check `prior_batches`), snake_case alphanumerics only.

**Step 3.** Pipe the questions JSON into `save-batch.ts`:

```bash
cat <<'JSON' | bun run apps/web/scripts/operator/intake/save-batch.ts \
    --intake <intake_id> --batch <batch_num> --student <student_id>
[ ...the 10 questions array... ]
JSON
```

Add `--overwrite` when regenerating an existing `(intake_id, batch_num)`.

`save-batch.ts` prints the paste-ready WhatsApp `prompt_text` on stdout (human-readable), then a final JSON envelope line with `{success, batch_id, batch_num, prompt_text, prompt_version}`.

**Step 4.** Paste `prompt_text` to WhatsApp and send it to the student.

### `--record` — ingest a pasted reply

**Step 1.** Pipe Miura's verbatim WhatsApp reply into `prepare-record.ts`:

```bash
cat <<'REPLY' | bun run apps/web/scripts/operator/intake/prepare-record.ts --batch <batch_id>
... student reply verbatim ...
REPLY
```

Add `--overwrite` when replacing a prior reply. The JSON envelope contains:

- `batch_id`, `intake_id`, `batch_num`.
- `questions` — the 10 original questions.
- `raw_reply` — echoed back so CC can include it in the save-record stdin.
- `system_prompt`, `user_prompt` — literal reply-parse prompt.
- `output_schema_hint` — schema reference.

**Step 2.** As CC, follow `system_prompt` + `user_prompt` verbatim to parse the reply. Emit:

```json
{
  "raw_reply": "<verbatim — echo from prepare-record output>",
  "answers": [
    { "question_key": "...", "question_text": "...", "answer_text": "...", "confidence": 0.0-1.0 }
  ],
  "unmatched_notes": "<optional verbatim leftover text>"
}
```

Copy `answer_text` verbatim; do not summarise, translate, or rephrase. Omit questions the student skipped. Unknown mappings go in `unmatched_notes` verbatim.

**Step 3.** Pipe the full payload into `save-record.ts`:

```bash
cat <<'JSON' | bun run apps/web/scripts/operator/intake/save-record.ts --batch <batch_id>
{ "raw_reply": "...", "answers": [...], "unmatched_notes": "..." }
JSON
```

Add `--overwrite` when replacing a prior reply. The JSON envelope reports `answer_count`, `mean_confidence`, `unmatched_notes_length` for parse-quality eyeballing.

### `--finalize` — close the 4-batch loop

```bash
bun run apps/web/scripts/operator/intake/finalize.ts --student <student_id>
# add --force only when a batch has <8 answers but you accept shipping at >=5
```

The script asserts exactly 4 batches, each with a non-null `raw_reply`, and an answer count >=8 per batch (>=5 under `--force`). Batches below 10 answers emit a single-line JSON `level:"warn"` on stderr but are not fatal. On success it sets `intakes.finalized_at = now()` and echoes the suggested next step in the JSON envelope.

## Scripts invoked

- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/prepare-batch.ts`
- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/save-batch.ts`
- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/prepare-record.ts`
- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/save-record.ts`
- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/intake/finalize.ts`

## Success criteria

- Every script prints a single JSON line last on stdout. Parse it and assert `success: true`.
- `--generate`: `save-batch.ts` returns `batch_id` + `batch_num` + `prompt_version: "intake-batch-v1"`. `prepare-batch.ts` with `reused: true` means no CC reasoning needed — just paste the prompt_text.
- `--record`: `save-record.ts` returns `answer_count > 0`, `mean_confidence >= 0.5` expected; flag a lower value for Miura review.
- `--finalize`: `batch_count: 4`, `total_answers` sane; `intakes.finalized_at` flipped from null.
- Idempotency: rerunning `prepare-batch.ts` on the same `(intake_id, batch_num)` returns `reused: true` with the existing prompt_text (no CC call needed). `save-batch.ts` without `--overwrite` errors `already_saved`. `save-record.ts` without `--overwrite` errors `already_recorded`.

## Failure modes

All failures are reported as `{success: false, error: <code>, message, ...context}` JSON on stdout with exit code 1 (runtime) or 2 (args/Zod).

- `args` (exit 2) — malformed flags; `issues` array mirrors the Zod issue list.
- `missing_student` (exit 2) — `prepare-batch.ts` invoked without `--student`; pick an id from the stderr candidate table.
- `student_not_found`, `not_onboarded`, `missing_english_cert` — preconditions on the target student; resolve before retrying `--generate`.
- `intake_complete` — all 4 batches already exist; pass `--batch <1..4>` to regenerate or move to `--finalize`.
- `batch_not_found` — invalid `--batch <uuid>` for `prepare-record.ts` / `save-record.ts`.
- `already_saved` — `save-batch.ts` without `--overwrite` on an existing `(intake_id, batch_num)`. Confirm intent and rerun with `--overwrite`.
- `already_recorded` — `prepare-record.ts` / `save-record.ts` without `--overwrite` on a batch that already has `raw_reply`.
- `invalid_reply` — stdin was empty or over 20_000 chars; re-paste.
- `invalid_json`, `invalid_questions`, `invalid_payload` — CC's stdin output failed Zod validation; inspect `issues`, re-author, re-pipe.
- `corrupt_questions_jsonb` — stored questions failed schema validation; investigate the row manually.
- `incomplete_batches`, `unreplied_batch`, `low_answer_count`, `critically_low_answer_count` — `--finalize` gating. Fix the underlying batch or add `--force` (only above the 5-answer floor).
- `already_finalized` — target intake already has `finalized_at`; next step is `/cruzar assess`.
- `unhandled` — uncaught exception. Surface the message to Miura and retry; do not mutate state.
