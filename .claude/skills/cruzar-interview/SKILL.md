---
name: cruzar-interview
description: Handle an interview invite. Extracts company/role/time/link from the pasted thread, surfaces the career-ops interview-prep markdown, drafts the student-facing email with prep attached, and sends via Resend once Miura approves. Writes status_events.
---

# cruzar-interview

**Trigger:** `/cruzar interview --application <id>` after `cruzar-scan-inbox` flagged an interview thread.

**Architecture:** [Flow F -- Interview invite](../../../product/cruzar/architecture.md#flow-f--interview-invite)

## Preconditions

- `applications` row exists for the given ID.
- `students` row exists for the application's student_id with a valid email.
- `.env` populated with `RESEND_API_KEY` and `RESEND_FROM_EMAIL`.

## Inputs

- `--application <id>` -- application UUID (required).
- Interview email thread pasted on stdin.

## Procedure

1. Run the script:
   ```bash
   bun run apps/operator-scripts/send-interview-email.ts --application <id>
   ```
2. When prompted, paste the interview email thread, then press Ctrl+D.
3. The script:
   a. Loads the `applications` row and associated `students` row.
   b. Extracts `{ company, role, time, link, notes }` from the thread via LLM (Zod-validated).
   c. Generates interview-prep markdown via a strong-tier LLM call.
   d. Uploads prep markdown to R2 at `interview-prep/<student_id>/<application_id>.md`.
   e. Drafts a student-facing email with the interview details and prep.
   f. Displays the draft to Miura. **Only sends on explicit Y confirmation.**
   g. On Y: sends via Resend, inserts `status_events` (kind=interview_invited, interview_time), updates `applications.status` to "interview".

## Success criteria

- `status_events` row committed with `kind=interview_invited` and `interview_time` populated (when available).
- Student receives the email with prep content.
- `applications.status` updated to "interview".
- Prep markdown visible in R2.

## Exit codes

- `0` -- success. JSON stdout: `{ success: true, application_id, student_id, company, role, prep_r2_key, prompt_version }`.
- `1` -- error (including Miura abort, Resend failure).
- `2` -- invalid flags.

## Failure modes

- Time extraction ambiguous: LLM returns `time: null`, shown to Miura -- Miura can proceed or abort.
- Resend send fails: exits 1, no status_event written. Miura retries.
- Miura types N: exits 1 with "aborted", no email sent, no DB writes.
