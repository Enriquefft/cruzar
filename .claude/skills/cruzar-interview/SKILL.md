---
name: cruzar-interview
description: Handle an interview invite. Extracts company/role/time/link from the pasted thread, surfaces the career-ops interview-prep markdown, drafts the student-facing email with prep attached, and sends via Resend once Miura approves. Writes status_events.
---

# cruzar-interview

**Trigger:** `/cruzar interview --application <id>` after `cruzar-scan-inbox` flagged an interview thread.

**Architecture:** [Flow F -- Interview invite](../../../product/cruzar/architecture.md#flow-f--interview-invite)

CC-in-the-loop: the prepare script emits context + inlined prompts; **CC itself** (in this session) extracts the interview details, writes the prep markdown, and drafts the email; the save-and-send script validates + persists + optionally sends. `@/lib/llm` is no longer called.

## Preconditions

- `applications` row exists for the given ID.
- `students` row exists for the application's student_id with a valid email.
- `.env` populated with `RESEND_API_KEY` and `RESEND_FROM_EMAIL` (only needed when `--send` is passed).

## Inputs

- `--application <id>` — application UUID (required on both scripts).
- `--send` — on `save-and-send.ts`, actually deliver the email via Resend. Omit for dry run.
- Interview email thread pasted on stdin of the prepare script.

## Procedure

1. Run the prepare script and paste the interview thread (Ctrl+D when done):
   ```bash
   bun run apps/web/scripts/operator/interview/prepare.ts --application <id>
   ```
   The stdout JSON is:
   ```
   { success, application_id, student_id, student_name, student_email,
     company_name, role, job_url, thread,
     extract_system_prompt, extract_user_prompt, prep_system_prompt_template,
     output_schema_hint, prompt_version }
   ```

2. **CC authors everything.**
   - **Extract** from `thread` using `extract_system_prompt` + `extract_user_prompt`:
     ```json
     { "company": "...", "role": "...", "time": "<ISO 8601 optional>", "link": "...optional", "notes": "...optional" }
     ```
   - **Prep markdown** using `prep_system_prompt_template` + `{company, role, job_url}`. Output a single markdown string (5 sections: company overview, role expectations, likely interview questions, talking points, questions to ask interviewer).
   - **Draft email** to `student_name`/`student_email` announcing the interview, including the time (or "TBD"), the meeting link if present, and a short summary of the prep doc. Keep it warm + actionable. Produce `email_subject` + `email_body` (plain text).

3. Show Miura the extracted fields + email draft. If she edits anything, update in-session before step 4.

4. Pipe the final payload into the save-and-send script.

   Dry run (no email sent; writes prep + status_events):
   ```bash
   echo '{"extracted": {...}, "prep_markdown": "...", "email_subject": "...", "email_body": "..."}' \
     | bun run apps/web/scripts/operator/interview/save-and-send.ts --application <id>
   ```

   Send for real:
   ```bash
   echo '<payload>' \
     | bun run apps/web/scripts/operator/interview/save-and-send.ts --application <id> --send
   ```

   The script:
   - Validates the payload against the inlined Zod schema.
   - Uploads `prep_markdown` to `interview-prep/<student_id>/<application_id>.md` in R2 (public).
   - On `--send`: sends the email via Resend from `RESEND_FROM_EMAIL`.
   - Inserts `status_events` (`kind=interview_invited`, `interview_time`).
   - Updates `applications.status = "interview"`.

## Success criteria

- `status_events` row committed with `kind=interview_invited` and `interview_time` populated (when available).
- On `--send`: student receives the email with prep content.
- `applications.status` updated to `interview`.
- Prep markdown visible in R2.
- `@/lib/llm` is not invoked; reasoning is CC-in-the-loop.

## Exit codes

- `0` — success. Final stdout: `{ success: true, application_id, student_id, prep_r2_key, email_sent, dry_run, prompt_version }`.
- `1` — error (empty stdin, invalid JSON, schema fail, Resend failure, DB error).
- `2` — args / invalid input.

## Failure modes

- `invalid_payload` — CC-authored JSON did not match the schema. Re-author and pipe again.
- Time ambiguous: CC sets `extracted.time = undefined`; Miura can decide.
- Resend send fails: exit 1, no status_event written. Miura retries with the same payload.
- Dry run first: always run without `--send` once to verify R2 upload + DB writes before sending.
