---
name: cruzar-assess
description: Run the assessment pipeline on a finalized intake. CC-in-the-loop. Classifies readiness (Ready | Presentation gap | Experience gap), generates the per-category plan, and on Ready also generates role matches + profile_md narrative + showcase CV markdown in a single reasoning pass. Persists everything to profiles + role_matches + R2 showcase CV. Triggers the "profile live" email suggestion.
---

# cruzar-assess

**Trigger:** Miura says `/cruzar assess <student_id>`, or automatic suggestion after `cruzar-intake --finalize`.

**Architecture:** [Flow C — Assess](../../../product/cruzar/architecture.md#flow-c--assess)
**ADRs:** [ADR-09 profile_md is per-student SSOT](../../../product/cruzar/adr/09-profile-md-ssot.md)
**Roadmap block:** M5.

## Model

CC-in-the-loop. Two scripts frame the work:

1. `assess/prepare.ts` — loads student, english cert, finalized intake, all answers, existing profile, roles catalog. Emits a single JSON context bundle on stdout including every system prompt (readiness, plan-presentation, plan-experience, role-match, profile_md, showcase-cv) and the readiness user prompt. No LLM call.
2. CC reads the bundle, runs the full reasoning in-session, and composes one discriminated-union result matching `output_schema_hint`.
3. `assess/save.ts` — reads that JSON from stdin, Zod-validates, renders the showcase CV PDF + uploads to R2 (Ready only), upserts `profiles`, replaces `role_matches`. No LLM call.

No z.ai dependency. `@/lib/llm` is not imported by either script.

## When to use

- A student has a finalized intake (`intakes.finalized_at IS NOT NULL`).
- Re-assessment after a non-ready student completes their plan milestones and a new intake cycle.

## Inputs

- `student_id` — Better Auth user id / `students.id` (required).

If Miura says `/cruzar assess` with no id, CC first runs [`/cruzar students list --state pending_assess`](../cruzar-students-list/SKILL.md) to surface candidates. `prepare.ts` itself also lists candidates to stderr and exits `2` with `error: "missing_student"` when `--student` is absent.

## Procedure

### Step 1 — prepare (load context)

```bash
bun run apps/web/scripts/operator/assess/prepare.ts --student <student_id>
```

On success, stdout is a single JSON line with these keys:

- `success: true`
- `student_id`, `student_name`, `local_salary_usd`
- `english_cert: {kind, score, level}`
- `intake_id`, `answer_count`, `answers: [...]`
- `existing_profile: {id, profile_md_version} | null`
- `next_profile_md_version`
- `roles_catalog: [...]`
- `readiness_system_prompt`, `readiness_user_prompt`
- `plan_presentation_system_prompt`, `plan_experience_system_prompt`
- `role_match_system_prompt`, `profile_md_system_prompt`, `cv_tailor_showcase_system_prompt`
- `output_schema_hint`
- `prompt_version: "assessment-v1"`

PII note: this JSON includes `answers`, `student_name`, and `local_salary_usd`. CC consumes it locally — do not tee to external sinks.

### Step 2 — reason in-session

CC applies the system + user prompts as described by the bundle:

1. **Readiness classification.** Apply `readiness_system_prompt` + `readiness_user_prompt`. Produce `{verdict, confidence, gaps[]}`.
2. **Branch on verdict.**
   - `presentation_gap` or `experience_gap`: apply the matching `plan_*_system_prompt` with a user prompt built from `verdict`, `english_cert`, identified gaps, and `answers`. Emit the non-ready shape: `{verdict, confidence, gaps, plan_markdown, milestones, next_assessment_in_days}`.
   - `ready`: run three more passes in order.
     - Apply `role_match_system_prompt` with gaps + roles_catalog + cert + answers. Pick exactly 3 distinct `role_id`s from `roles_catalog` with ranks 1/2/3.
     - Apply `profile_md_system_prompt` with gaps + role matches (looked up by title/comp from catalog) + cert + answers + local salary. Produce the full `profile_md` (must contain Identity, Background, Skills, Stories, Context, Evaluations sections) and `sections_present`.
     - Apply `cv_tailor_showcase_system_prompt` with the just-authored `profile_md`. Produce a one-page showcase CV markdown.
     - Emit the ready shape: `{verdict:"ready", confidence, gaps, matches:[3x{role_id,rank,rationale}], profile_md, sections_present, showcase_cv_markdown}`.

### Step 3 — save

Pipe the single JSON object to save.ts:

```bash
echo '<the json>' | bun run apps/web/scripts/operator/assess/save.ts --student <student_id>
```

Or, if the result is in a file `/tmp/assess-result.json`:

```bash
cat /tmp/assess-result.json | bun run apps/web/scripts/operator/assess/save.ts --student <student_id>
```

`save.ts` Zod-validates the discriminated union, then:

- **Ready:** validates all 3 `role_id`s exist in the catalog, ranks are `{1,2,3}` and distinct; renders `showcase_cv_markdown` to PDF via `apps/career-ops/bin/generate-pdf.mjs` and uploads to R2 `showcase-cvs/<student_id>.pdf` (public bucket); upserts `profiles` with the new `profile_md`, `profile_md_version`, `profile_md_generated_at`, `showcase_cv_r2_key`, gaps; deletes existing `role_matches` for the profile and inserts 3 fresh rows.
- **Non-ready:** upserts `profiles` with `plan_markdown`, `next_assessment_at` (computed from `next_assessment_in_days`), empty `profile_md`, `profile_md_version=0`; clears any stale `role_matches`.

stdout on success is a single-line JSON:
`{success:true, student_id, verdict, confidence, gaps_count, role_match_count, profile_md_length, profile_md_version, prompt_version}`.

For Ready, stderr prints: `Next step: /cruzar-email-profile-live <student_id>`.

## Scripts invoked

- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/assess/prepare.ts`
- `/home/hybridz/Projects/cruzar/apps/web/scripts/operator/assess/save.ts`

## Success criteria

- Parse the single JSON line on `save.ts` stdout and assert `success: true`.
- `verdict` is one of `ready`, `presentation_gap`, `experience_gap`.
- `prompt_version: "assessment-v1"`.
- For Ready:
  - `role_match_count: 3`.
  - `profile_md_length > 0` (typically 2000-8000 chars).
  - `profile_md_version >= 1`.
  - DB: `profiles.profile_md` is non-empty, `showcase_cv_r2_key` is set, `role_matches` has exactly 3 rows for this profile.
- For non-Ready:
  - `role_match_count: 0`.
  - `profile_md_length: 0`.
  - DB: `profiles.plan_markdown` is non-empty, `profiles.next_assessment_at` is a future date.

## Failure modes

All failures are reported as `{success: false, error: <code>, message, ...context}` JSON on stdout with exit code 1 (runtime) or 2 (args/Zod).

From `prepare.ts`:
- `args` (exit 2) — malformed `--student` flag.
- `missing_student` (exit 2) — no `--student` flag; candidates listed on stderr.
- `student_not_found`, `missing_english_cert`, `intake_not_finalized`, `no_answers`, `no_roles`.

From `save.ts`:
- `args` (exit 2) — malformed `--student` flag.
- `student_not_found`.
- `empty_stdin` — no JSON piped in.
- `invalid_json` — stdin is not valid JSON.
- `invalid_result_shape` — Zod discriminated union validation failed. Surfaces the first issue path + message. CC should fix the result shape and re-pipe.
- `invalid_role_id` — a `role_id` in `matches` is not present in the roles catalog.
- `invalid_ranks` — ranks are not exactly {1, 2, 3}.
- `duplicate_role_id` — two matches point at the same role.
- `profile_insert_failed`.
- `unhandled` — uncaught exception (e.g., PDF render failure, R2 upload). Profile state is not committed.
