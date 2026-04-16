# ADR-08 — fill-forms retains synchronous headed loop; per-JD CV customization + Greenhouse adapter ship in MVP 0

**Status:** Accepted
**Date:** 2026-04-15
**Owner:** Enrique (decision), Miura (operator + builder)

## Context

`fill-forms.mjs` in the absorbed career-ops is single-tenant (hardcoded candidate at lines 36–46) with a generic label-matching heuristic and a synchronous headed loop (Miura watches, presses Enter between apps). Scope candidates for MVP 0 upgrade:

1. Multi-tenant candidate (parameterize, no hardcoded profile).
2. LLM-generated long-form answers per JD (field-extraction Playwright pre-pass → Claude per-field answer generation → Zod validation + confidence flagging).
3. Platform adapter (Greenhouse) with per-platform selector maps.
4. Async review mode with video recording and replay-to-submit.
5. Structured miss-log + idempotency.
6. Captcha/login detection.
7. Chrome extension for off-portal postings.
8. Per-JD CV customization (Claude derives tailored `cv.md` per JD → `generate-pdf.mjs` → attach tailored PDF).
9. Video-scrubber review UI.

Miura explicitly invested in fill-forms as a strategic differentiator — per-JD customization is the interview-invite multiplier.

Honest costs for 24h:

- Item 1: ~1h
- Item 2: 2–3 days (Lever/Ashby/Workable field DOMs each render labels differently; calibration loop on confidence)
- Item 3 (Greenhouse only): 2–3h
- Item 4: multi-day (Playwright traces aren't mutably replayable; needs form-state snapshot + replay flow)
- Item 5: 2–4h
- Item 6: 1 day
- Item 7: post-24h
- Item 8: ~3h
- Item 9: post-24h

## Decision

In MVP 0:

- **Item 1** — multi-tenant candidate. `runApplication({ candidate, application, cvPath, answersPath, workspaceDir })` with Zod-typed `candidate`.
- **Item 3** — Greenhouse platform adapter. Stable selector map. Generic heuristic from the absorbed file stays as fallback.
- **Item 5** — structured miss-log + idempotency on `(student_id, company_normalized, role_normalized, job_url)`. Persisted on `fill_form_drafts`.
- **Item 8** — per-JD CV customization. The strategic investment. Per-application, Claude takes `profiles.profile_md` (the per-student SSOT, see ADR-09) + JD text → tailored `cv.md` → `generate-pdf.mjs` → PDF uploaded to R2 → attached to the form. Persisted on `generated_cvs`.
- **Synchronous headed loop retained.** Miura watches; presses Enter between apps. Same as the absorbed file's current behavior.

Deferred (Phase 1 continuation):

- Item 2 — LLM-generated long-form answers. For MVP 0, long-form answers come from per-app answers markdown files Miura dictates once per candidate (or Claude drafts and Miura reviews). Full field-extraction + per-JD long-form LLM answering ships after U0 cohort validates the model.
- Item 4 — async review + video replay. Phase 1 continuation.
- Item 6 — captcha/login detection. Phase 1 continuation; Miura handles manually for now.
- Item 7, Item 9 — post-24h.

## Alternatives considered

- **Ship items 1–5 + 8 all in 24h.** Rejected per honest costs. Items 2 and 4 each blow the window.
- **Drop per-JD CV customization.** Rejected. Per-JD CV is the interview-invite multiplier. Miura invested deliberately; without it the cohort's application volume produces lower-quality signal.
- **Drop Greenhouse adapter; rely on generic heuristic.** Rejected. Reliability on Greenhouse alone is the difference between 70% clean fills and 30% clean fills. 2–3h is worth the fidelity.

## Consequences

Positive:
- fill-forms v2 ships functional for U0's application volume: Greenhouse posts work cleanly, per-JD CVs differentiate submissions, multi-tenant unlocks students beyond Enrique.
- Idempotency prevents duplicate applications on re-runs.
- Miss-log surfaces needs-human fields inline in CC, not buried in stdout.
- Miura sees every submission before clicking send — ethical gate preserved.

Negative:
- Long-form answer quality depends on Miura + Claude drafting per app, not on a field-extraction pipeline. Slower per app; fine at 5 students with ~50–75 apps each over the first 2 weeks.
- Non-Greenhouse postings fall through to the generic heuristic. Some will need manual intervention.
- Captcha on any platform stops the run and requires Miura to solve manually.

## Sunset criteria

Revisit when:

- Application volume exceeds Miura's per-app answer-review bandwidth (triggers item 2).
- Review fatigue from the synchronous loop becomes real (triggers item 4).
- Captchas become frequent enough to justify detection + queue (triggers item 6).
- Cohort expands beyond Greenhouse-heavy portals (triggers Lever/Ashby/Workable adapters).
