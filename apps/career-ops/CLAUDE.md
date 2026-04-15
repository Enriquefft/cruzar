# apps/career-ops — operator rules

This package is absorbed critical-path tooling from an external personal pipeline per [ADR-03](../../product/cruzar/adr/03-career-ops-absorb-scope.md). It is **not** one-person tooling; it is multi-tenant infrastructure driven by `apps/operator-scripts/run-cohort.ts` in `apps/web`-adjacent code, on behalf of any student in the cohort.

If you are about to change a file in this package, read this file first.

## Scope

In-tree:

- `bin/fill-forms.mjs` — Playwright headed form filler. NEVER clicks Submit (see ethical submit gate below).
- `bin/generate-pdf.mjs` — Playwright HTML→PDF renderer for tailored CVs.
- `templates/cv-template.html` — placeholder-driven HTML template.
- `templates/states.yml` — canonical application-state SSOT.
- `fonts/*.woff2` — pinned font files for deterministic CV rendering.

Out of scope (deferred to Phase 1 wave 2 per ADR-03): `analyze-patterns`, `doctor`, `dedup-tracker`, `merge-tracker`, `normalize-statuses`, `verify-pipeline`, `cv-sync-check`, `check-liveness`, `modes/*`, `batch/*`, dashboards, example data, JD corpora. Do not absorb these on your own initiative — write a new ADR first.

## Multi-tenant rule (inviolable)

No hardcoded candidate data anywhere in this package. The public contract is:

```
runApplication({ candidate, application, cvPath, answersPath, workspaceDir })
```

Any code that hardcodes a name, email, phone, LinkedIn, GitHub, portfolio, or location is a bug. Reject the change.

**Current debt:** `bin/fill-forms.mjs` still contains a hardcoded `candidate` block at lines ~36-46 carried over from the absorbed source. This is flagged in a header comment and will be parameterized in block M8 (fill-forms v2). Until M8 lands, this binary must not be run against real student applications. Do not add features on top of the hardcoded shape — fix the shape first.

## Ethical submit gate (inviolable)

`fill-forms.mjs` may click an element whose text matches `/submit|send|apply now/i` **only** when it is the job-listing-page "Apply" trigger that opens the actual application form. Every subsequent submit is Miura's manual click in the headed browser.

Implementation invariant: the "Apply" click path must explicitly reject elements whose text includes "submit" (case-insensitive). See the existing guard in `fillForm()`:

```js
if (!text.toLowerCase().includes('submit')) {
  // safe to click — this is the listing-page "Apply" trigger
}
```

If a proposed change drifts toward auto-submitting, end-of-form clicking, "confirm" buttons at any step, or any heuristic that would click a submit-shaped control inside the form itself — reject the change. This is non-negotiable regardless of how "safe" the branch looks.

See `product/cruzar/architecture.md` §WOZ + §Ethical boundaries.

## Network + filesystem hygiene

- No analytics, telemetry, or tracking. This binary runs on Miura's laptop; it must not phone home.
- Outbound network access is limited to the job-board domains the form is being filled on (plus font/image CDNs the board itself loads). No calls to third-party trackers, even if a dependency wants them.
- Filesystem writes are limited to `workspaceDir` (the per-run disposable workspace) + R2 via the calling script. No hidden caches in `$HOME`, `/tmp/<anything-persistent>`, or relative paths from `__dirname`.

## Dependencies

Runtime only. Pin exact versions. Do not add devDependencies unless strictly required by a binary that ships in this package. No test frameworks — tests for this package's logic live in `apps/web`-adjacent scripts that drive the binaries.

## Sanitization contract

Before any commit that touches this package, run the absorb-sanitization grep from the repo root. The canonical pattern is defined in [ADR-03](../../product/cruzar/adr/03-career-ops-absorb-scope.md) §Decision — source the pattern from there so this file never carries matching strings itself.

After the M8 upgrade lands, the pattern must return zero hits. P3 (the absorb block) deliberately leaves the hardcoded candidate in place and flagged — the grep returns exactly the lines in the candidate block at the top of `bin/fill-forms.mjs` until M8 rewrites that block. Any hit outside that block is a bug and must be scrubbed before the PR merges.

In addition to grep, eyeball any file you edit for subtle profile leakage in prose and comments — phrasings like "N years of experience", "Software Engineer from Country", "<university> student", and similar details that silently bake one person's profile into multi-tenant code.

## Context pointers

- Root [CLAUDE.md](../../CLAUDE.md) — monorepo rules.
- [product/cruzar/architecture.md](../../product/cruzar/architecture.md) §WOZ + §Ethical boundaries — why the submit gate exists.
- [product/cruzar/adr/03-career-ops-absorb-scope.md](../../product/cruzar/adr/03-career-ops-absorb-scope.md) — what's in, what's out, why.
- [product/cruzar/adr/08-fill-forms-sync-per-jd-cv-greenhouse.md](../../product/cruzar/adr/08-fill-forms-sync-per-jd-cv-greenhouse.md) — the M8 upgrade contract.
