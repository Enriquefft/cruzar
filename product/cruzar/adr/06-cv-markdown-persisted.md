# ADR-06 — `cv_markdown` persisted on profiles; regeneration is versioned

**Status:** Superseded by [ADR-09](./09-profile-md-ssot.md) on 2026-04-15. The rationale below remains valid for *why* CV markdown needs to persist somewhere; ADR-09 replaces the *where* (profile_md as SSOT; per-JD CVs on generated_cvs; no master cv_markdown on profiles).
**Date:** 2026-04-15
**Owner:** Enrique

## Context

The CV pipeline runs as: diagnostic/intake answers → Claude generates `cv.md` → `generate-pdf.mjs` renders HTML → PDF uploaded to R2 → PDF linked on `/profile` and attached to fill-forms runs.

Claude is non-deterministic. If only the PDF is persisted (not the markdown), regenerating the CV (font fix, template change, student updates their intake answers) produces a different `cv.md` than what backed the original PDF. Silent drift — the PDF students download on Monday and the regenerated PDF on Tuesday differ in ways no one tracked, because only the output is stored.

The per-JD customization pipeline compounds this: each application produces a tailored `cv.md` derived from the master `cv.md` + JD text. Without the master persisted, the derivation is unreproducible.

## Decision

`profiles.cv_markdown` (text column) persists the generated master markdown alongside `profiles.cv_r2_key` (the PDF). `profiles.cv_version` increments on every regeneration. `profiles.prompt_version` captures which prompt template produced this version.

Per-JD CV customizations persist on `generated_cvs`: `{id, student_id, application_id, cv_markdown, cv_r2_key, version, created_at}`. The master markdown at the time of generation is captured in the derivation — never re-fetched from `profiles` on read — so that application-time CVs stay reproducible even after the master changes.

Regeneration policy:

- Regenerating the master `cv_markdown` creates a new version row in an append-only audit pattern (new version bumps `cv_version` and `generated_at` on the `profiles` row; prior versions kept in a `profile_versions` table if audit is needed in Phase 1).
- Regeneration is never implicit — triggered only by an explicit operator skill or a student-initiated re-intake.

## Alternatives considered

- **Store only the PDF.** Rejected per silent-drift risk. Makes per-JD derivations unreproducible.
- **Regenerate on demand from intake answers.** Rejected per determinism — same input ≠ same output from Claude.
- **Persist markdown but never version.** Rejected per inability to debug "why did this student's CV change between Monday and Tuesday."

## Consequences

Positive:
- Deterministic derivation path: master `cv_markdown` + JD text → per-JD `cv_markdown` → PDF. Reproducible on demand.
- Debuggable. When fill-forms produces a bad tailored CV, the exact markdown inputs and the derivation step are in the DB.
- Prompt-version stamping lets us A/B prompt templates without data loss.

Negative:
- `profiles.cv_markdown` adds ~2–5 KB per row. Negligible.
- `generated_cvs` grows linearly with applications. Negligible at MVP 0 scale (5 students × 50–75 apps = ~300 rows).
- Regeneration requires explicit operator intent. Students can't self-regenerate their CV via a button. Fine for MVP 0.

## Sunset criteria

Revisit when:

- Students need self-service CV regeneration (likely when product matures past MVP 0).
- Prompt template churn exceeds what simple version stamps can track (likely requires a proper prompt registry).
