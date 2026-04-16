# ADR-03 — career-ops absorb is critical-path only

**Status:** Accepted
**Date:** 2026-04-15
**Owner:** Enrique

## Context

`~/Projects/jobs/` is Enrique's personal career-ops pipeline. It has ~100 uncommitted staged changes, including `fill-forms.mjs` itself (never committed anywhere — no remote version exists), improved `batch/batch-prompt.md`, rewritten `modes/scan.md`, expanded `interview-prep/story-bank.md`, a new `reusable-responses.md`, updated `CLAUDE.md`, and tracker TSVs for Enrique's own applications. System layer and user layer are intertwined.

Options for MVP 0:

1. **Consume.** Point Cruzar at `~/Projects/jobs/` at runtime. Fastest to code, but depends on an unowned, unversioned, Enrique-personalized folder that violates own-the-critical-path and SSOT.
2. **Absorb everything.** Copy the whole system layer into `apps/career-ops/`. Preserves every capability but drags in files MVP 0's loop never touches (analyze-patterns, doctor, dedup-tracker, verify-pipeline, modes/*, etc.). Sanitization surface is large; rot likely because no Cruzar surface uses them.
3. **Absorb the critical path.** Copy only the files MVP 0's loop actually executes.

## Decision

Absorb the critical path. Into `apps/career-ops/`, copy:

- `bin/fill-forms.mjs` (the staged-never-committed improved version). Multi-tenant upgrade applied on top, same commit.
- `bin/generate-pdf.mjs` (Playwright HTML→PDF renderer used by the CV pipeline).
- `templates/cv-template.html`.
- `templates/states.yml`.
- `fonts/` (required by `cv-template.html` for deterministic rendering).

Everything else stays in `~/Projects/jobs/` and is not referenced at runtime. `apps/career-ops/CLAUDE.md` is authored fresh for multi-tenant use — never copied.

Sanitization before the absorb commit merges:

1. `grep -rinE 'enrique|flores|utec\.edu\.pe|\+51926|enriquefft|lima|linkedin\.com/in/enriqueflores'` over `apps/career-ops/` returns zero hits.
2. Manual prose-diff of any copied file with >20 lines of prose; removes subtle Enrique-profile leakage that grep misses ("three years of experience", "Software Engineer background", etc.).
3. `fill-forms.mjs` lines 36–46 (hardcoded candidate) deleted as part of the multi-tenant upgrade in the same commit.
4. `git log -p apps/career-ops/ | grep -i enrique` is empty.

## Alternatives considered

- **Consume.** Rejected per own-the-critical-path.
- **Absorb everything.** Rejected per broad rot risk and sanitization surface. The additional files (analyze-patterns, doctor, dedup-tracker, merge-tracker, normalize-statuses, verify-pipeline, cv-sync-check, check-liveness, modes/*, batch/batch-prompt.md) are Phase 1 wave 2 — absorbed on demand when a Cruzar surface actually calls them.

## Consequences

Positive:
- Cruzar owns every line that runs in MVP 0's application loop.
- Sanitization surface is small; prose-diff pass is tractable.
- `apps/career-ops/` stays narrowly scoped; less rot risk.
- Absorption is a one-time operation with a clean commit, not a long-lived fork-maintenance problem.

Negative:
- Phase 1 wave 2 will need another absorb pass for `merge-tracker.mjs` + the modes if/when Cruzar uses them. Manageable; same process.
- The unstaged improvements to `batch/batch-prompt.md` and `modes/scan.md` in `~/Projects/jobs/` are left behind — they belong to Enrique's personal pipeline. MVP 0's scan + evaluation behavior is handled by Claude skills inside Cruzar, not by porting those modes.

## Sunset criteria

Revisit when:

- Cruzar needs tracker-merge, liveness checks, or pattern analysis on ingested applications (typically during the first university-facing dashboard iteration).
- The multi-tenant upgrade on `fill-forms.mjs` diverges enough from Enrique's personal version that the two codebases benefit from explicit re-sync.
