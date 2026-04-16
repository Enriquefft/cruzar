---
name: cruzar-scan-inbox
description: Classify pasted email threads from the cohort inbox into viewed/rejected/interview/other, match each to an application, and propose status flips for Miura's confirmation. No Gmail OAuth in MVP 0 — Miura pastes threads.
---

# cruzar-scan-inbox

**Trigger:** `/cruzar scan-inbox` while Miura has recent threads to classify.

**Architecture:** [Flow E -- Scan inbox](../../../product/cruzar/architecture.md#flow-e--scan-inbox)

## Preconditions

- At least one student has applications in the DB.
- Miura has unread email threads to paste.

## Inputs

- No flags. Interactive: reads threads from stdin.

## Procedure

1. Run the script:
   ```bash
   bun run apps/operator-scripts/scan-inbox.ts
   ```
2. When prompted, paste one or more email threads (sender, subject, body), then press Ctrl+D.
3. The script:
   a. Sends threads to Claude for classification (Zod-validated, `inbox-classify-v1` prompt).
   b. For each classified thread: matches to an `applications` row by `(company_normalized, role_normalized)`.
   c. Displays each classification with confidence, matched application, and proposed status flip.
   d. Prompts Miura for Y/N per thread.
   e. On Y: inserts `status_events` row and updates `applications.status` where applicable.
   f. For `interview` classifications: suggests running `/cruzar interview --application <id>`.

## Success criteria

- Every classified thread either flips a status or is explicitly declined by Miura.
- Zero silent writes -- every mutation confirmed interactively.
- Low-confidence classifications (<0.7) flagged for extra scrutiny.

## Exit codes

- `0` -- success. JSON stdout: `{ success: true, threads_classified, flipped, skipped, prompt_version }`.
- `1` -- error.
- `2` -- invalid input (empty stdin).

## Failure modes

- Ambiguous application match: lists top candidates, lets Miura see the IDs.
- Low-confidence classification: flagged with warning, Miura decides.
- No matching application in DB: warns, cannot write status_event without student_id.
