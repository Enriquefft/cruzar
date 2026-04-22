---
name: cruzar-run-cohort
description: Run the per-student application pipeline. Generates a disposable runtime workspace from DB, tailors CVs per JD, invokes fill-forms.mjs in headed mode, pauses at every submit for Miura's click, then ingests tracker rows + drafts back into the DB. Idempotent on (student, company, role, job_url).
---

# cruzar-run-cohort

**Trigger:** `/cruzar run-cohort --student <id> --job-url <url> --company "<Company Name>" --role "<Role Title>"`.

**Architecture:** [Flow D -- Run cohort](../../../product/cruzar/architecture.md#flow-d--run-cohort-single-student)
**ADRs:** [ADR-01 work-on-laptop](../../../product/cruzar/adr/01-long-running-work-on-miura-laptop.md), [ADR-03 absorb-scope](../../../product/cruzar/adr/03-career-ops-absorb-scope.md), [ADR-08 fill-forms](../../../product/cruzar/adr/08-fill-forms-sync-per-jd-cv-greenhouse.md)

CC-in-the-loop: CV tailoring no longer calls `@/lib/llm`. `run-cohort.ts` emits a tailoring-context bundle on the first invocation and exits `2`; CC authors the `cv_markdown` against the bundled prompts, writes it to a temp file, then re-invokes run-cohort with `--cv-markdown-path` + `--changes-summary`.

## Preconditions

- `profiles.readiness_verdict = "ready"` for the target student.
- `.env` populated with all variables from `.env.example`.
- Playwright binary installed on Miura's laptop.

## Inputs

- `--student <id>` — student ID (required).
- `--job-url <url>` — target JD URL (required). Platform is auto-detected from the URL host.
- `--company "<Company Name>"` — company display name (required). Normalized for idempotency.
- `--role "<Role Title>"` — role title (required). Normalized for idempotency.
- `--debug` — retain the runtime dir after run (optional, default false).
- `--cv-markdown-path <path>` — path to a file containing CC-authored `cv_markdown`. Required on the re-invocation after the context bundle is returned.
- `--changes-summary "<string>"` — 1-3 sentence summary of what was emphasized/reordered/omitted. Required alongside `--cv-markdown-path`.

If Miura says `/cruzar run-cohort` without `--student`, CC first runs [`/cruzar students list --state ready`](../cruzar-students-list/SKILL.md) to surface the candidates, then re-invokes this skill with the chosen id plus the remaining flags. `run-cohort.ts` itself pre-checks argv for `--student` before Zod parsing, lists candidates to stderr, and exits `2` with `error: "missing_student"` when absent.

## Procedure

1. **First invocation** (no `--cv-markdown-path`):
   ```bash
   bun run apps/web/scripts/operator/run-cohort.ts \
     --student <id> --job-url <url> --company "<Company>" --role "<Role>"
   ```
   The script:
   - Asserts Linux `DISPLAY`, `readiness_verdict=ready`.
   - Inserts the `applications` row (idempotent; `idempotent_skip` if already present).
   - Loads `profile_md`, computes next CV version, renders the tailor prompts.
   - Emits stdout JSON and exits `2`:
     ```
     { success: false, error: "need_cv_markdown",
       student_id, application_id, next_version,
       system_prompt, user_prompt, output_schema_hint, prompt_version }
     ```

2. **CC authors the CV.** Using `system_prompt` + `user_prompt` from the bundle, author a tailored `cv_markdown` matching `cvTailorSchema` from `@/lib/prompts/cv-tailor` (≥50 chars). Also author a short `changes_summary` (2-3 sentences).

3. **Write to temp file.** Write ONLY the `cv_markdown` body to a temp file, e.g.:
   ```bash
   tmp=$(mktemp --suffix=.md)
   # write cv_markdown to $tmp
   ```

4. **Re-invoke** with the temp file and the summary flag. Pass the SAME flags as step 1 (idempotency depends on them):
   ```bash
   bun run apps/web/scripts/operator/run-cohort.ts \
     --student <id> --job-url <url> --company "<Company>" --role "<Role>" \
     --cv-markdown-path "$tmp" --changes-summary "Reordered X, emphasized Y, dropped Z."
   ```
   The script now:
   - Re-reads the `applications` row (idempotent skip still applies — no new row inserted).
   - Reads `cv_markdown` from the file, validates length ≥50, calls `saveTailoredCv` → renders PDF via `generate-pdf.mjs` → uploads to R2 private (`generated-cvs/<student>/<application>/v<n>.pdf`) → inserts `generated_cvs` row.
   - Generates the runtime workspace under `.cruzar-runtime/<student_id>/` with `profile.md`, `profile.yml`, `data/applications.md` + `cv.pdf`.
   - Invokes `apps/career-ops/bin/fill-forms.mjs` as a subprocess with `CRUZAR_ETHICAL_GATE=1`. Headed Playwright opens on the JD URL; Miura clicks any submit.
   - Parses fill-forms last-line JSON: `{ filled, missed, needsHuman, screenshots, finalStateScreenshot }`.
   - Uploads each screenshot to R2 private (`fill-form-drafts/<student>/<application>/*.png`).
   - Inserts `fill_form_drafts` (state=`drafted`) + `status_events` (kind=`applied`).
   - Cleans up the runtime dir (unless `--debug`).

## Success criteria

- `applications` row with status `applied` committed for the run.
- Per-JD tailored PDF visible in R2 and linked on `generated_cvs`.
- Re-running step 4 with the same flags + a new temp file appends a new `generated_cvs` version but does NOT create a new `applications` row.
- Ethical gate held: fill-forms never clicked a submit-family button.
- `@/lib/llm` is not invoked by this skill.

## Exit codes

- `0` — success. JSON stdout: `{ success: true, student_id, application_id, application_count, ... }`.
- `1` — error. JSON stdout: `{ success: false, error, message }`.
- `2` — either `args` / invalid flags, or `need_cv_markdown` / `missing_student` signalling CC to do the next step.

## Failure modes

- `need_cv_markdown`: normal first-invocation flow; CC authors the CV and re-invokes.
- `missing_changes_summary`: `--cv-markdown-path` passed without `--changes-summary`. Re-invoke with both.
- `cv_markdown_too_short`: CC-authored markdown has <50 chars. Re-author.
- fill-forms subprocess crash: error exit with stderr details. Miura can retry the same command.
- Missing `CRUZAR_ETHICAL_GATE=1`: fill-forms refuses to launch — direct invocation outside run-cohort is blocked.
- Missing Linux `DISPLAY`: run-cohort exits with `no_display` before the subprocess starts.
- Idempotent skip: first invocation exits 0 with `application_count: 0, skipped: true` and no context bundle is emitted (because the `applications` insert short-circuited).
