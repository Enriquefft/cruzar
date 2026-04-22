---
name: cruzar-scan-inbox
description: Classify pasted email threads from the cohort inbox into viewed/rejected/interview/other, match each to an application, and propose status flips for Miura's confirmation. No Gmail OAuth in MVP 0 — Miura pastes threads.
---

# cruzar-scan-inbox

**Trigger:** `/cruzar scan-inbox` while Miura has recent threads to classify.

**Architecture:** [Flow E -- Scan inbox](../../../product/cruzar/architecture.md#flow-e--scan-inbox)

CC-in-the-loop: the scripts emit a classification context bundle; **CC itself** (in this session) produces the `classifications[]` JSON using the bundled system + user prompt, then pipes it back into the save script. `@/lib/llm` is no longer called.

## Preconditions

- At least one student has applications in the DB.
- Miura has unread email threads to paste.

## Inputs

- No flags. Interactive: reads threads from stdin on step 1.

## Procedure

1. Run the prepare script and paste the threads (Ctrl+D when done):
   ```bash
   bun run apps/web/scripts/operator/inbox/prepare-classify.ts
   ```
   The stdout JSON is:
   ```
   { success, threads, system_prompt, user_prompt, output_schema_hint, prompt_version }
   ```

2. **CC authors the classifications.** Read `system_prompt` + `user_prompt` from the bundle and produce a JSON object matching `inboxClassifyResultSchema` exactly:
   ```json
   {
     "classifications": [
       {
         "thread_id": "thread-1",
         "classification": "viewed" | "rejected" | "interview" | "other",
         "application_match": { "company": "...", "role": "...", "job_url": "..." },
         "interview_time": "<ISO 8601>",
         "confidence": 0.0
       }
     ]
   }
   ```
   Be conservative; when ambiguous, `"other"` with low confidence. Never invent interview times.

3. Show the proposed classifications to Miura on stderr/chat. If she wants to edit one, edit in-session before step 4.

4. Pipe the final JSON into the save script:
   ```bash
   echo '<classifications JSON>' | bun run apps/web/scripts/operator/inbox/save-classifications.ts
   ```
   It:
   - Validates against `inboxClassifyResultSchema`.
   - Matches each classification to an `applications` row via `(company_normalized, role_normalized[, job_url])`, with fuzzy fallback on company alone.
   - Inserts `status_events` rows (`viewed` / `rejected` / `interview_invited`) and flips `applications.status` for rejections/interviews.
   - Skips classifications with no matching application and surfaces their `thread_id` in `unmatched_thread_ids` on stdout.

5. If the envelope returns `interview_application_ids: ["<uuid>", ...]`, suggest `/cruzar interview --application <uuid>` for each.

## Success criteria

- Every classified thread either flips a status or is surfaced as unmatched.
- `@/lib/llm` is not invoked; reasoning is CC-in-the-loop.
- Low-confidence classifications (<0.7) are flagged by CC before step 4.

## Exit codes

- `0` — success. Final stdout: `{ success: true, threads_classified, flipped, skipped, unmatched_thread_ids, interview_application_ids, prompt_version }`.
- `1` — error (empty stdin, invalid JSON, schema fail, DB error).
- `2` — args / invalid input.

## Failure modes

- `invalid_classifications` — CC-authored JSON did not match the schema. Re-author and pipe again.
- Ambiguous application match: the save script falls back to fuzzy-on-company; no match → `unmatched_thread_ids`.
- No matching application in DB: skipped, cannot write `status_events` without `student_id`.
