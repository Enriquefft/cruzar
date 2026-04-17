---
name: cruzar-onboard
description: Onboard a new Cruzar student. Reads the students row + english_certs attestation, verifies the score-to-CEFR mapping, prompts Miura to confirm the verification flip, and outputs a paste-ready WhatsApp welcome message to kick off intake. Run once per new signup.
---

# cruzar-onboard

**Trigger:** `/cruzar onboard --student <id>`.

**Architecture:** [Flow A -- Onboard](../../../product/cruzar/architecture.md#flow-a--onboard)
**ADRs:** [ADR-07 English cert pre-required](../../../product/cruzar/adr/07-english-cert-pre-required.md)

## Preconditions

- Student has signed up via the web app (`students` row exists).
- `english_certs` row exists with `attestation_r2_key` pointing to a real R2 object.
- Student is not yet onboarded (`students.onboarded_at` is null).

## Inputs

- `--student <id>` -- student ID (required).

## Procedure

1. Run the script:
   ```bash
   bun run apps/web/scripts/operator/onboard.ts --student <id>
   ```
2. The script:
   a. Loads `students` and `english_certs` rows.
   b. Asserts the student is not already onboarded.
   c. Verifies the attestation exists in R2 via HEAD request.
   d. Derives CEFR level from `kind + score` using `cefr-map.ts`. Flags mismatches or ambiguous mappings.
   e. Rejects if derived level is below B2.
   f. Prompts Miura for Y/N confirmation on stdin.
   g. On Y: `UPDATE english_certs SET verified=true`, `UPDATE students SET onboarded_at=now()`.
   h. Outputs a paste-ready WhatsApp welcome message to stderr.

## Success criteria

- `english_certs.verified = true`.
- `students.onboarded_at` populated.
- Miura has a paste-ready WhatsApp welcome message in the output.

## Exit codes

- `0` -- success. JSON stdout: `{ success: true, student_id, verified_level, action: "onboarded" }`.
- `1` -- error (including attestation missing, below B2, Miura abort).
- `2` -- invalid flags.

## Failure modes

- Attestation missing in R2: exits 1, tells Miura the attestation was not found.
- Level below B2: exits 1 with the derived level and a clear rejection reason.
- Ambiguous mapping (aprendly/other): warns Miura, uses student's claimed level, proceeds to confirmation.
- Miura types N: exits 1 with "aborted" -- no DB writes.
