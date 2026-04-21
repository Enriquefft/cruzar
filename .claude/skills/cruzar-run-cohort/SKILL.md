---
name: cruzar-run-cohort
description: Run the per-student application pipeline. Generates a disposable runtime workspace from DB, tailors CVs per JD, invokes fill-forms.mjs in headed mode, pauses at every submit for Miura's click, then ingests tracker rows + drafts back into the DB. Idempotent on (student, company, role, job_url).
---

# cruzar-run-cohort

**Trigger:** `/cruzar run-cohort --student <id> --job-url <url> --company "<Company Name>" --role "<Role Title>"`.

**Architecture:** [Flow D -- Run cohort](../../../product/cruzar/architecture.md#flow-d--run-cohort-single-student)
**ADRs:** [ADR-01 work-on-laptop](../../../product/cruzar/adr/01-long-running-work-on-miura-laptop.md), [ADR-03 absorb-scope](../../../product/cruzar/adr/03-career-ops-absorb-scope.md), [ADR-08 fill-forms](../../../product/cruzar/adr/08-fill-forms-sync-per-jd-cv-greenhouse.md)

## Preconditions

- `profiles.readiness_verdict = "ready"` for the target student.
- `.env` populated with all variables from `.env.example`.
- Playwright binary installed on Miura's laptop.

## Inputs

- `--student <id>` -- student ID (required).
- `--job-url <url>` -- target JD URL (required). Platform is auto-detected from the URL host.
- `--company "<Company Name>"` -- company display name (required). Normalized (lowercase + dashes) for idempotency.
- `--role "<Role Title>"` -- role title (required). Normalized (lowercase + dashes) for idempotency.
- `--debug` -- retain the runtime dir after run (optional, default false).

## Procedure

1. Run the script:
   ```bash
   bun run apps/web/scripts/operator/run-cohort.ts --student <id> --job-url <url> --company "<Company>" --role "<Role>"
   ```
2. The script:
   a. Asserts Linux `DISPLAY` env is set (headed Playwright needs a graphical session).
   b. Asserts `profiles.readiness_verdict = "ready"`.
   c. Inserts `applications` row (idempotent on `(student_id, company_normalized, role_normalized, job_url)`); short-circuits with `idempotent_skip` if the row already exists.
   d. Generates `.cruzar-runtime/<student_id>/` with `profile.md`, `profile.yml`, `data/applications.md`.
   e. Calls `tailorCvForJd()` → per-JD CV markdown → PDF rendered by `generate-pdf.mjs` → uploaded to R2 private bucket, `generated_cvs` row persisted, PDF also copied to `<workspaceDir>/cv.pdf` for the subprocess.
   f. Invokes `apps/career-ops/bin/fill-forms.mjs` as a subprocess with `CRUZAR_ETHICAL_GATE=1` env (defence in depth on the submit gate). Headed Playwright opens on the JD URL.
   g. Parses fill-forms last-line JSON: `{ filled, missed, needsHuman, screenshots, finalStateScreenshot }`.
   h. Uploads each screenshot path to R2 private (`fill-form-drafts/<student>/<application>/*.png`).
   i. Inserts `fill_form_drafts` row (state=`drafted`) with screenshot keys + missed + needsHuman.
   j. Inserts `status_events` row (kind=`applied`).
   k. Cleans up runtime dir (unless `--debug`).

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
- Missing `CRUZAR_ETHICAL_GATE=1`: fill-forms refuses to launch — direct invocation outside of run-cohort is blocked.
- Missing Linux `DISPLAY`: run-cohort exits with `no_display` before the subprocess starts.
- Idempotent skip: exits 0 with `application_count: 0, skipped: true`.
