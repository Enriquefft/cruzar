---
name: cruzar-assess
description: Run the assessment pipeline on a finalized intake. Classifies readiness (Ready | Presentation gap | Experience gap), generates the per-category plan, and on Ready also generates role matches + profile_md narrative. Persists everything to profiles + role_matches. Triggers the "profile live" email suggestion.
---

# cruzar-assess

**Trigger:** Miura says `/cruzar assess <student_id>`, or automatic suggestion after `cruzar-intake --finalize`.

**Architecture:** [Flow C — Assess](../../../product/cruzar/architecture.md#flow-c--assess)
**ADRs:** [ADR-09 profile_md is per-student SSOT](../../../product/cruzar/adr/09-profile-md-ssot.md)
**Roadmap block:** M5.

## When to use

- A student has a finalized intake (`intakes.finalized_at IS NOT NULL`) — assessment is the next step after intake.
- Re-assessment after a non-ready student completes their plan milestones and a new intake cycle.

## Inputs

- `student_id` — Better Auth user id / `students.id` (required).

## Procedure

1. Invoke `bun run apps/operator-scripts/assess.ts --student <student_id>`.
2. The script loads `students`, `english_certs`, `intakes` (asserts `finalized_at IS NOT NULL`), and all `intake_batch_answers`. Fails fast on missing data.
3. LLM call 1: **Readiness classification** (strong tier) — produces `{ verdict, confidence, gaps[] }`.
4. If verdict is `presentation_gap` or `experience_gap`:
   a. LLM call 2: **Plan generation** (strong tier, verdict-specific prompt) — produces `{ plan_markdown, milestones[], next_assessment_in_days }`.
   b. Upserts `profiles` row with `readiness_verdict`, `gaps_jsonb`, `plan_markdown`, `next_assessment_at`, `profile_md=""`, `profile_md_version=0`, `prompt_version`.
   c. Clears any stale `role_matches` from a prior Ready assessment.
   d. Done (2 LLM calls total).
5. If verdict is `ready`:
   a. LLM call 2: **Role matching** (strong tier) — selects top 3 from the 10-role catalog. Produces `{ matches[3]: { role_id, rank, rationale } }`.
   b. LLM call 3: **Profile markdown synthesis** (strong tier) — produces the full narrative document with sections: identity, background, skills, stories, context, evaluations. Includes salary delta computation if `students.local_salary_usd` is available.
   c. Upserts `profiles` row with `readiness_verdict`, `gaps_jsonb`, `plan_markdown=""`, `profile_md`, `profile_md_version` (incremented), `profile_md_generated_at`, `prompt_version`.
   d. Inserts/replaces 3 `role_matches` rows.
   e. Done (3 LLM calls total).
6. Prints the next-step suggestion to stderr: `/cruzar-email-profile-live <student_id>`.

## Scripts invoked

- `/home/hybridz/Projects/cruzar/apps/operator-scripts/assess.ts`

## Success criteria

- Parse the single JSON line on stdout and assert `success: true`.
- `verdict` is one of `ready`, `presentation_gap`, `experience_gap`.
- `prompt_version: "assessment-v1"`.
- For Ready:
  - `role_match_count: 3`.
  - `profile_md_length > 0` (typically 2000-8000 chars).
  - `profile_md_version >= 1`.
  - DB: `profiles.profile_md` is non-empty, `role_matches` has exactly 3 rows for this profile.
- For non-Ready:
  - `role_match_count: 0`.
  - `profile_md_length: 0`.
  - DB: `profiles.plan_markdown` is non-empty, `profiles.next_assessment_at` is a future date.

## Failure modes

All failures are reported as `{success: false, error: <code>, message, ...context}` JSON on stdout with exit code 1 (runtime) or 2 (args/Zod).

- `args` (exit 2) — malformed `--student` flag.
- `student_not_found` — no `students` row for the given id.
- `missing_english_cert` — no `english_certs` row for the student.
- `intake_not_finalized` — no intake with `finalized_at IS NOT NULL`.
- `no_answers` — finalized intake has zero `intake_batch_answers`.
- `no_roles` — roles catalog is empty; run `bun run db:seed`.
- `invalid_role_id` — LLM returned a `role_id` not present in the catalog. Auto-retried once; surface if both attempts fail.
- `profile_insert_failed` — DB insert failure on `profiles`.
- `unhandled` — uncaught exception (e.g., LLM Zod fail after one retry). Surface the message to Miura and retry; profile state is not committed on unhandled errors.
