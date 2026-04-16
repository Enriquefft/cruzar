# ADR-04 — Operator surface is Claude Code skills + typed scripts; no admin web UI

**Status:** Accepted
**Date:** 2026-04-15
**Owner:** Enrique (decision), Miura (operator)

## Context

Every prior MVP 0 draft specified a web admin UI: list view, detail view, status-flip controls, review queue for fill-forms drafts, keyboard shortcuts, counters sanity panel, sync-from-career-ops button, run-career-ops-for-student button. Rough cost: 6–10h of frontend work, 3–4h of authorization + state management, 2h of deploy + test. Ignores that the same code has to be maintained long-term and kept in sync with schema changes.

Miura is learning Claude Code during the 24h sprint. Every action the admin UI would do — list students, generate intake prompts, run fill-forms, flip statuses, scan inbox, draft interview emails — is expressible as a CC skill invocation against a typed script.

CC already has: conversational context, multi-step orchestration, Bash execution, DB access via scripts, MCP support for Gmail/Postgres if needed, file read/write, inline output of screenshots and video artifacts. It is a more powerful operator surface than any admin UI Cruzar would build in 24h.

## Decision

The operator surface is:

- **Skills.** `.claude/skills/cruzar-*/SKILL.md` — one per operator action. Each brief CC on goal, inputs, steps, scripts to invoke, success criteria.
- **Scripts.** `apps/operator-scripts/*.ts` — typed entrypoints invoked by skills. Read + write the DB through Drizzle, call LLMs, shell out to `apps/career-ops/`, upload to R2. Every mutation routes through a script; no raw SQL from skills except via the explicit `/cruzar sql` escape hatch, which requires `--write` + confirmation for mutations.
- **MCP (optional, per session).** Postgres MCP for ad-hoc reads; Gmail access is paste-in only in MVP 0 (no OAuth).

Skills ship in MVP 0:
- `cruzar-onboard` — welcome + English cert validation
- `cruzar-intake` — `--generate` / `--record` / `--finalize`
- `cruzar-assess` — readiness classifier + plan generator + Ready-path CV/roles generation
- `cruzar-run-cohort` — runtime-dir gen + fill-forms with per-JD CV + ingest
- `cruzar-scan-inbox` — paste threads → classify → propose status flips
- `cruzar-interview` — extract interview details + draft prep + send email
- `cruzar-sql` — escape hatch
- `cruzar-counters-sanity` — weekly reconcile

No admin route exists in `apps/web`.

## Alternatives considered

- **Thin admin web UI.** Rejected per cost vs. value at 5 users. CC is faster to operate and more flexible for ad-hoc needs.
- **CLI-only (no skills, just scripts).** Rejected. Skills give CC context + guidance; raw scripts leave Miura to remember invocations.
- **Mixed (CC for most, minimal admin UI for status flips).** Rejected as a structural split that creates two places to read/write state. SSOT violation.

## Consequences

Positive:
- Saves 10–15h of frontend work.
- Skills are versioned in the repo; operator playbook is reproducible across machines.
- Every mutation is typed + Zod-validated + idempotent by construction.
- Ad-hoc needs (custom query, one-off migration, emergency fix) handled by the sql escape hatch without adding UI.
- Miura learns CC operation at the speed of the sprint — skill after skill — rather than building a UI that duplicates the same actions.

Negative:
- Non-Miura operators (future cofounder, ops hire) need to learn CC before they can operate the cohort. Acceptable until hiring.
- No mobile operator access. Miura acknowledges this; laptop only.
- Counters-sanity and status inspection cost a CC session instead of a glance. Acceptable; public counter on landing serves the quick-glance need.

## Sunset criteria

Revisit when:

- A second operator joins who would benefit from a persistent UI.
- Operator actions need to be auditable by non-technical stakeholders in real time.
- Mobile / on-the-go operator actions become needed.

On sunset, the scripts already exist as the business-logic layer; a thin Next admin UI wraps them. No rewrite — the admin UI would only be a new view over the same code.
