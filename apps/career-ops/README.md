# @cruzar/career-ops

Multi-tenant critical-path subset of the job-application pipeline absorbed from `~/Projects/jobs/` per [ADR-03](../../product/cruzar/adr/03-career-ops-absorb-scope.md). Driven by `apps/operator-scripts/run-cohort.ts` — not invoked standalone.

Full operator rules and invariants live in [CLAUDE.md](./CLAUDE.md). Read that before editing any file here.

## Absorb scope

**In:**

- `bin/fill-forms.mjs` — Playwright headed form filler.
- `bin/generate-pdf.mjs` — Playwright HTML→PDF renderer.
- `templates/cv-template.html` — CV template (placeholder-driven).
- `templates/states.yml` — canonical application states.
- `fonts/*.woff2` — pinned CV fonts.

**Out** (deferred to Phase 1 wave 2): `analyze-patterns`, `doctor`, `dedup-tracker`, `merge-tracker`, `normalize-statuses`, `verify-pipeline`, `cv-sync-check`, `check-liveness`, `modes/*`, `batch/*`, dashboards, example data, JD corpora.

## Ethical submit gate

`fill-forms.mjs` may only click submit-shaped elements on the listing-page "Apply" trigger (the thing that opens the form). Every subsequent submit is Miura's manual click in the headed browser. See [CLAUDE.md](./CLAUDE.md) for the full invariant and enforcement contract.

## Status

Absorb landed (Roadmap P3). The hardcoded candidate block in `bin/fill-forms.mjs` lines ~36-46 is flagged in the file header and will be parameterized in block M8 (fill-forms v2 multi-tenant upgrade). Until M8, do not run this binary against real student applications.
