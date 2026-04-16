# company/

Legal, finance, captable, partnerships, team, grants, internal meetings, compliance, vendor management. The state of the company as an entity.

## Canonical files

- Equity / captable → `equity.md` (single file, append to Historial on every change).
- Partnerships → `partnerships/<counterparty>.md` (one file per counterparty).
- Team composition → `team.md`.
- Internal meeting (founder alignment, board, advisor) → `meetings/YYYY-MM-DD-<slug>.md`.

## Rules

- **No PII in tree.** Cofounder and teammate names are fine (public). Customer data, payroll details, personal IDs stay out — reference by system and ID.
- **Numbers appear once.** Equity percentages, grant amounts, payroll, runway figures — canonical file holds the value. Every other doc links.
- **Captable and partnership terms evolve — show the progression.** `equity.md` and `partnerships/*.md` keep a `Historial` table (dated rows, append-only) because seeing the evolution at a glance matters for investors, cofounders, and future you. For other docs, git is the history.
- **Draft vs. signed.** Convenios and term sheets mark status explicitly (`Status: Draft`, `Status: Signed YYYY-MM-DD`). Do not present drafts as agreements.
