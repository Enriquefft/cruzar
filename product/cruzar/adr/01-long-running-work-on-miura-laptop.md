# ADR-01 — Long-running work runs on Miura's laptop via Claude Code

**Status:** Accepted
**Date:** 2026-04-15
**Owner:** Enrique (decision), Miura (operator)

## Context

MVP 0 runs Playwright (career-ops fill-forms, CV PDF render), Claude Sonnet chains (intake adaptive-question generation, readiness classifier, per-JD CV customization, plan generator), and career-ops subprocesses. Each has non-trivial runtime, memory, and binary requirements.

Three viable hosts were considered:

1. Vercel serverless functions (where the student web app lives).
2. Trigger.dev for long-running tasks.
3. A dedicated Fly machine.
4. Miura's laptop during Claude Code sessions.

Vercel is unusable for this work: Hobby has 10s timeouts, Pro is 60s, Chromium binary exceeds Lambda layer limits, `/tmp` is per-invocation (512 MB, no cross-invocation persistence) — career-ops runtime workspaces would evaporate. Trigger.dev and Fly add real infra, real cost, real provisioning time, and a new surface for the builder to learn during the 24h window.

## Decision

Long-running work — Playwright, PDF render, LLM chains invoked from operator skills, all career-ops subprocesses — runs on Miura's laptop inside a Claude Code session. Every operator action is Miura-initiated; nothing runs autonomously. The student web app on Vercel handles only short-lived HTTP work (signup, magic link, reading profiles, reading status, serving landing + counter).

## Alternatives considered

- **Trigger.dev.** Fine for long-running Playwright and LLM chains. Adds dashboard, API keys, deploy-per-change, and a mental model Miura has to learn during the sprint. Correct for Phase 1 continuation; wrong for 24h.
- **Fly machine.** Runs anything, but requires provisioning, persistence, ops. Same verdict.
- **Vercel scheduled functions.** Incompatible with runtime constraints.

## Consequences

Positive:
- Zero infra to provision for MVP 0. Miura has Bun, Node, Playwright already on his laptop.
- CC sees every error inline; no remote log aggregation needed.
- Operator work is explicit and synchronous — Miura knows what's running because Miura started it.

Negative:
- If Miura's laptop is asleep, nothing runs. Acceptable at 5-user cap.
- Not horizontally scalable. Acceptable at 5-user cap; by Phase 1 continuation this ADR is revisited.
- Requires Miura's machine + browser state (OAuth logins to portals, Gmail) rather than a clean server state. Manageable; fill-forms is headed anyway.

## Sunset criteria

Revisit when any of the following holds:

- Cohort exceeds 10 simultaneous students.
- Miura's operator time exceeds 4 hours/day (scaling limit).
- Any operator action needs to run without Miura present (true automation).

On sunset, default migration is Trigger.dev for LLM chains + scheduled jobs and a Fly machine for Playwright.
