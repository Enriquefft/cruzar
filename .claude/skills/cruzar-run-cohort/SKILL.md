---
name: cruzar-run-cohort
description: Run the per-student application pipeline. Generates a disposable runtime workspace from DB, tailors CVs per JD, invokes fill-forms.mjs in headed mode, pauses at every submit for Miura's click, then ingests tracker rows + drafts back into the DB. Idempotent on (student, company, role, job_url).
---

# cruzar-run-cohort

**Trigger:** `/cruzar run-cohort --student <id> --job-url <url>`.

**Architecture:** [Flow D -- Run cohort](../../../product/cruzar/architecture.md#flow-d--run-cohort-single-student)
**ADRs:** [ADR-01 work-on-laptop](../../../product/cruzar/adr/01-long-running-work-on-miura-laptop.md), [ADR-03 absorb-scope](../../../product/cruzar/adr/03-career-ops-absorb-scope.md), [ADR-08 fill-forms](../../../product/cruzar/adr/08-fill-forms-sync-per-jd-cv-greenhouse.md)

## Preconditions

- `profiles.readiness_verdict = "ready"` for the target student.
- `.env` populated with all variables from `.env.example`.
- Playwright binary installed on Miura's laptop.

## Inputs

- `--student <id>` -- student ID (required).
- `--job-url <url>` -- target JD URL for this invocation (required in MVP 0).
- `--debug` -- retain the runtime dir after run (optional, default false).

## Procedure

1. Run the script:
   ```bash
   bun run apps/operator-scripts/run-cohort.ts --student <id> --job-url <url>
   ```
2. The script:
   a. Asserts `profiles.readiness_verdict = "ready"`.
   b. Generates `.cruzar-runtime/<student_id>/` with `profile.md`, `profile.yml`, `data/applications.md`.
   c. Invokes `apps/career-ops/bin/fill-forms.mjs` as a subprocess with the job URL and workspace context.
   d. Parses fill-forms output (company, role, platform, screenshots, missed fields).
   e. Inserts `applications` row (idempotent on unique key).
   f. Calls `tailorCvForJd()` to generate per-JD CV markdown, render PDF, upload to R2, persist `generated_cvs`.
   g. Inserts `status_events` row (kind=applied).
   h. Inserts `fill_form_drafts` row (state=submitted).
   i. Cleans up runtime dir (unless `--debug`).

## Success criteria

- `applications` row with status `applied` committed for the run.
- Per-JD tailored PDF visible in R2 and linked on `generated_cvs`.
- Re-running with the same `--job-url` produces zero new applications (idempotency via unique key on applications table).
- Ethical gate held: fill-forms never clicked a submit-family button.

## Exit codes

- `0` -- success. JSON stdout: `{ success: true, student_id, application_count }`.
- `1` -- error. JSON stdout: `{ success: false, error, message }`.
- `2` -- invalid flags. JSON stdout: `{ success: false, error: "args", issues }`.

## Failure modes

- CV tailoring Zod-fail: one retry (built into `llmJsonCompletion`), then error exit.
- fill-forms subprocess crash: error exit with stderr details. Miura can retry.
- Idempotent skip: exits 0 with `application_count: 0, skipped: true`.
