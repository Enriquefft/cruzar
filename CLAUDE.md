# CLAUDE.md

Monorepo for two founders running the company end-to-end for the next 6 months. Holds both the **software we ship** (products under `product/`, all code workspaces under `apps/`) and the **business intelligence source of truth** (everything non-code).

If a durable business fact lives outside this repo (Notion, Google Docs, Slack, memory), it is stale or at risk. The repo wins.

## Areas

Each top-level area has its own `CLAUDE.md` with rules specific to that discipline. When working in an area, that file loads on top of this one.

- `business/` — research, market, competitive, positioning, personas, problems
- `product/` — per-product spec, MSP, UX decisions (one subdir per product, e.g. `product/cruzar/`)
- `company/` — legal, finance, captable, partnerships, team, grants, internal meetings
- `apps/` — all code workspaces (web app with operator scripts under `apps/web/scripts/operator/`, career-ops binaries)

## Hard rules

- **SSOT.** Every durable fact has exactly one file. Other files link, never copy. If two places disagree, one is wrong — reconcile in the same PR, don't leave contradictions in tree.
- **No PII in tree.** Customer names, emails, phone numbers, payroll. Store in secured systems; reference by ID.
- **No secrets.** No credentials, tokens, keys. Use env management.
- **No aspirational docs.** Empty placeholder files, "we will eventually..." sections, TODO-only files — delete or don't create.

## Editing existing facts

- When a fact changes, update the canonical file in place. Git keeps the history — don't mirror it in markdown.
- **Exception:** facts that genuinely evolve and where the progression matters at a glance (equity splits over time, partnership terms) get a `Historial` table appended to. Everything else just gets edited.
- Dated artifacts (past meetings, pitch prep for a specific date) stay as-is under `meetings/YYYY-MM-DD-<slug>.md`. The filename already marks them dated; don't also add "historical" banners.
- Every reference to an entity defined elsewhere is a markdown link to the canonical file. Do not paraphrase.
- Dates are absolute (YYYY-MM-DD). Numbers have units and scope.

## Language

Docs may be Spanish or English. One language per file, no code-switching. Filenames and structural headings (`Status`, `Historial`, `Open questions`) stay English so grep works uniformly.


## Commits

Explain **why** the change was made, not just what. `update equity` is bad. `equity: meeting outcome 2026-04-14, 50/50 draft with bimonthly revision` is good. Git log is the history of the business — the markdown tree only needs to carry the current state.
