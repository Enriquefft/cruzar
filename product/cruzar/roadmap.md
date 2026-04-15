# Cruzar — Roadmap (MVP 0)

**Date:** 2026-04-15
**Status:** Active — SSOT during development alongside [architecture.md](./architecture.md).
**Purpose:** ordered execution + current position. Tick statuses as work lands.

This document answers: *what comes next, in what order, with what acceptance, and where are we right now.*

---

## Current position

**Phase:** P — Pre-handoff **Complete**. Phase M — **M1 in progress** (schema authored, migration + seed + auth round-trip pending env).
**Done:** P1 (monorepo scaffold), P2 (`apps/web/CLAUDE.md`), **P3** (career-ops absorb — commits `976d09d` + `a26a0fd`), P4 (ADRs 01–08), P5 (Architecture + Roadmap authored, spec archived), P6 (operator playbook dirs + lib shells + skill stubs).
**Post-P3 refactor:** code roots collapsed under `apps/` — `packages/career-ops/` → `apps/career-ops/`, root `scripts/` → `apps/operator-scripts/`. Path references updated repo-wide.
**M1 partial:** 11 Zod entity schemas under `apps/web/schemas/` (enums + student + english-cert + intake + profile + role + application + status-event), 8 Cruzar Drizzle tables derived + 4 Better Auth tables (`user`/`session`/`account`/`verification`) in `apps/web/db/schema.ts`, role catalog seed at `apps/web/db/seed.ts` wired to `bun run db:seed`. Typecheck green. **Pending M1 runtime steps:** `bun run db:push` against Neon, load seed, verify magic-link round trip end-to-end.
**Blocked on:** `DATABASE_URL`, `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `RESEND_FROM` before the M1 runtime steps above.

Update this section at the start of every session.

---

## Phase structure

- **Phase P — Pre-handoff.** Enrique-owned. Not counted against Miura's 24h.
- **Phase M — Miura's 24h.** Ordered blocks, each one a focused CC session.
- **Phase X — Post-24h continuation** (lives in [msp.md](./msp.md), summarized at the end of this file for context).

Each block lists: **Goal**, **Files**, **Dependencies**, **Acceptance**, **Status**, **CC prompt template**. The prompt template is what Miura pastes into Claude Code to kick off the session.

---

## Phase P — Pre-handoff

### P1 — Monorepo scaffold — **Done**

**Goal:** Bun workspaces, `apps/web/` (Next 16 + Drizzle + Zod + Better Auth + shadcn scaffold), `apps/career-ops/` placeholder, `tsconfig.base.json`, `.gitignore`, `.env.example`. Typecheck green on empty shell.

**Files:** repo root `package.json`, `bunfig.toml`, `tsconfig.base.json`, `.gitignore`; `apps/web/*` (Next scaffold); `apps/career-ops/` (empty).

**Acceptance:**
- [x] `bun install` clean at repo root.
- [x] `cd apps/web && bun run typecheck` passes with zero errors.
- [x] `apps/web/package.json` named `@cruzar/web` with all MVP 0 deps listed.
- [x] `apps/career-ops/` directory exists.

### P2 — `apps/web/CLAUDE.md` conventions — **Done**

**Goal:** Conventions CC inherits per session inside `apps/web/`. Enforces Zod SSOT, no `any`, no non-`as const` casts, one Zod schema per entity, server actions over API routes, pre-commit typecheck.

**Files:** `apps/web/CLAUDE.md` (replaces the Next-scaffold default that just points at `AGENTS.md`).

**Acceptance:**
- [x] File written, scoped to `apps/web/` conventions, references [architecture.md](./architecture.md) and [roadmap.md](./roadmap.md) as SSOT.
- [x] A section on Next 16 caveats (`AGENTS.md` pointer to `node_modules/next/dist/docs/`).

### P3 — career-ops absorb (critical path) — **Done**

**Goal:** Copy `fill-forms.mjs` (staged), `generate-pdf.mjs`, `cv-template.html`, `states.yml`, `fonts/` from `~/Projects/jobs/` into `apps/career-ops/`. Sanitize per ADR-03.

**Files:** `apps/career-ops/bin/fill-forms.mjs`, `apps/career-ops/bin/generate-pdf.mjs`, `apps/career-ops/templates/cv-template.html`, `apps/career-ops/templates/states.yml`, `apps/career-ops/fonts/*`, `apps/career-ops/CLAUDE.md` (fresh), `apps/career-ops/package.json`, `apps/career-ops/README.md`.

**Dependencies:** P1.

**Acceptance:**
- [ ] `grep -rinE 'enrique|flores|utec\.edu\.pe|\+51926|enriquefft|lima|linkedin\.com/in/enriqueflores' apps/career-ops/` returns hits **only** inside the hardcoded candidate block in `fill-forms.mjs` (deliberately retained until M8 per ADR-03). Zero hits elsewhere is ship-blocking. The candidate block is deleted in M8 and the grep then returns zero — that exit criterion belongs to M8.
- [ ] Manual prose-diff of `fill-forms.mjs` confirms no Enrique-profile leakage outside the flagged candidate block, and that block is annotated with a header comment scheduling its removal in the multi-tenant upgrade diff (block M8).
- [ ] `apps/career-ops/CLAUDE.md` written fresh with multi-tenant rules + ethical submit gate. Never copied.
- [ ] `bun install` at repo root picks up the new workspace without error.
- [ ] Single absorption commit on `main`.

### P4 — ADRs 01–08 — **Done**

**Goal:** ADR files under `product/cruzar/adr/`, one per locked decision.

**Acceptance:**
- [x] `product/cruzar/adr/01-long-running-work-on-miura-laptop.md`
- [x] `product/cruzar/adr/02-intake-woz-whatsapp.md`
- [x] `product/cruzar/adr/03-career-ops-absorb-scope.md`
- [x] `product/cruzar/adr/04-operator-surface-claude-code.md`
- [x] `product/cruzar/adr/05-public-counter-isr.md`
- [x] `product/cruzar/adr/06-cv-markdown-persisted.md`
- [x] `product/cruzar/adr/07-english-cert-pre-required.md`
- [x] `product/cruzar/adr/08-fill-forms-sync-per-jd-cv-greenhouse.md`

### P5 — Architecture + Roadmap + spec archive — **Done**

**Goal:** `architecture.md` + `roadmap.md` authored. `mvp-0.md` flipped to `Status: Archived — see architecture.md + roadmap.md`.

**Files:** `product/cruzar/architecture.md`, `product/cruzar/roadmap.md`, `product/cruzar/mvp-0.md` (status line updated).

**Acceptance:**
- [x] `architecture.md` written.
- [x] `roadmap.md` written (this file).
- [x] `mvp-0.md` header flipped to Archived + reference line to Architecture + Roadmap.

### P6 — Operator + app scaffold extension — **Done**

**Goal:** Everything Miura needs in-place before the 24h clock starts, beyond the original P1 scope. Operator playbook dirs, `apps/web/lib/` shells, skill stubs, `.env.example`, Biome + Lefthook. Typecheck green.

**Files:**
- `.env.example` (every key from Architecture §Environment)
- `biome.json`, `lefthook.yml`
- `apps/web/lib/env.ts` (Zod-validated env access), `apps/web/lib/auth.ts` (Better Auth + magic link), `apps/web/lib/email.ts` (Resend), `apps/web/lib/r2.ts` (`@aws-sdk/client-s3`), `apps/web/lib/llm.ts` (Anthropic), `apps/web/lib/cefr-map.ts` (typed mappings + `meetsB2`)
- `apps/web/db/client.ts` (Drizzle postgres client), `apps/web/db/schema.ts` (placeholder), `apps/web/schemas/index.ts` (placeholder)
- `apps/web/drizzle.config.ts`
- `apps/web/app/api/auth/[...all]/route.ts` (Better Auth Next handler)
- Empty route dirs: `app/onboarding/`, `app/profile/`, `app/status/`, `app/p/[slug]/`
- `apps/operator-scripts/README.md`, `apps/operator-scripts/_shared/README.md`
- `.claude/skills/cruzar-{onboard,intake,assess,run-cohort,scan-inbox,interview,sql,counters-sanity}/SKILL.md`
- `apps/career-ops/package.json` + `README.md` (absorb target shell)

**Acceptance:**
- [x] `bun install` clean; all deps resolved.
- [x] `cd apps/web && bun run typecheck` green.
- [x] All 8 operator skills registered (visible in CC's skill list).
- [x] Env schema rejects missing/malformed values at runtime (no silent misconfigs).

---

## Phase M — Miura's 24h (ordered)

Clock starts when P1–P5 are all `Done`. Each block sized for one focused CC session. Hour budgets are targets, not deadlines; the aggregate closes on ~27h with slack tolerable via late-block compression.

> Miura's rule: at the start of every block, paste the block's **CC prompt template** into a fresh Claude Code session. At the end, update this file's `Status` for that block and the **Current position** section at top.

### M1 — Schema + Better Auth wired — 2h

**Goal:** Zod schemas for every entity in [architecture.md §Data contracts](./architecture.md#data-contracts). Drizzle tables derived. One initial migration. Role catalog seed. Better Auth magic-link flow working end-to-end (signup → email → click → authenticated session).

**Files:** `apps/web/schemas/*.ts`, `apps/web/db/schema.ts`, `apps/web/db/seed.ts`, `apps/web/db/client.ts`, `apps/web/app/api/auth/[...all]/route.ts`, `drizzle.config.ts`.

**Dependencies:** P1, P2.

**Acceptance:**
- [x] Every entity in Architecture has a Zod schema + Drizzle table.
- [ ] `bun run db:push` applies the migration to Neon.
- [ ] 10 role seed rows loaded via `bun run db:seed`.
- [ ] Magic-link round trip: submit email → receive email → click → session authenticated → redirect to `/onboarding`.
- [x] Typecheck clean. No `any`, no `as` except `as const`.

**CC prompt template:**

> We are in block M1 of the Cruzar MVP 0 Roadmap. Read `product/cruzar/architecture.md` §Data contracts and `product/cruzar/adr/07-english-cert-pre-required.md`. Write `apps/web/schemas/*.ts` (one file per entity) + derive Drizzle tables in `apps/web/db/schema.ts`. Use `z.infer` for TS types. Follow `apps/web/CLAUDE.md` rules. Then wire Better Auth with magic-link email via Resend. Acceptance is in Roadmap M1.

### M2 — Onboarding — 2h

**Goal:** `/onboarding` form. Name + WhatsApp + optional local salary + English cert (kind, score, level, issued_at, attestation PDF/image upload to R2) + consent toggle. `/onboarding/thanks` screen.

**Files:** `apps/web/app/onboarding/page.tsx`, `apps/web/app/onboarding/thanks/page.tsx`, `apps/web/app/onboarding/actions.ts` (server action), `apps/web/lib/r2.ts` (presigned upload helper), `apps/web/lib/cefr-map.ts`.

**Dependencies:** M1.

**Acceptance:**
- [ ] Form validates via Zod on submit.
- [ ] Attestation uploaded to R2 (presigned PUT); `attestation_r2_key` persisted.
- [ ] Below-B2 cert blocked with clear message.
- [ ] `students.onboarded_at` still null (Miura flips later via `/cruzar onboard`); `english_certs.verified = false`.
- [ ] Thanks screen renders.

**CC prompt template:**

> Block M2. Build `/onboarding` with the shape defined in `product/cruzar/architecture.md` §Flow 1. Use shadcn form primitives. Upload attestations to R2 via presigned PUT (helper in `apps/web/lib/r2.ts`). Use `apps/web/lib/cefr-map.ts` to derive `level` from `kind + score`. Server action for submit.

### M3 — Landing + ISR counter — 2h

**Goal:** Landing `/` with hero + salary-delta headline + live public counter + email-CTA magic-link start.

**Files:** `apps/web/app/page.tsx`, `apps/web/lib/counter.ts` (SQL aggregate), `apps/web/components/counter.tsx`, `apps/web/components/hero.tsx`.

**Dependencies:** M1.

**Acceptance:**
- [ ] Counter query in `apps/web/lib/counter.ts` matches ADR-05 exactly.
- [ ] Page exports `revalidate = 30`.
- [ ] Hero copy and type scale confirmed polished (premium-feel pass).
- [ ] LCP < 1.5s in local Lighthouse run.

**CC prompt template:**

> Block M3. Build `/` per Architecture §Flow 5 + ADR-05. ISR revalidate 30s. One CTA (email → magic link). Counter aggregates from DB using the SQL in ADR-05. Tailwind v4 + shadcn. Read `apps/web/AGENTS.md` first — Next 16 has breaking changes.

### M4 — Intake skill suite — 3h

**Goal:** Three scripts + one skill file covering the full intake loop.

**Files:** `apps/operator-scripts/intake/generate-batch.ts`, `apps/operator-scripts/intake/record-batch.ts`, `apps/operator-scripts/intake/finalize.ts`, `apps/operator-scripts/_shared/db.ts`, `apps/operator-scripts/_shared/llm.ts`, `.claude/skills/cruzar-intake/SKILL.md`, `apps/web/lib/prompts/intake-batch.ts` (or `apps/operator-scripts/_shared/prompts/`).

**Dependencies:** M1.

**Acceptance:**
- [ ] `bun run apps/operator-scripts/intake/generate-batch.ts --student <id>` generates a Zod-validated batch and persists `intake_batches` row.
- [ ] `bun run apps/operator-scripts/intake/record-batch.ts --batch <id> --reply <path>` persists `raw_reply` + parsed `intake_batch_answers`.
- [ ] `bun run apps/operator-scripts/intake/finalize.ts --student <id>` asserts 4 batches exist, sets `intakes.finalized_at`.
- [ ] `.claude/skills/cruzar-intake/SKILL.md` tested in a fresh CC session; each subcommand invocable.
- [ ] Idempotent: re-running `generate-batch` for the same batch_num returns the existing row (no duplicate batches).

**CC prompt template:**

> Block M4. Build the intake skill + three scripts per Architecture §Flow B + ADR-02. Prompts live in `apps/web/lib/prompts/intake-batch.ts` (or `apps/operator-scripts/_shared/prompts/`, pick one and document). Zod-validated LLM output. Idempotent on `(intake_id, batch_num)`. Test the skill end-to-end in a fresh CC session with one test student.

### M5 — Assessment pipeline — 3h

**Goal:** `apps/operator-scripts/assess.ts` + `.claude/skills/cruzar-assess/SKILL.md`. Readiness classifier + per-category plan + Ready-path triggers (role match, master CV markdown, PDF render, R2 upload).

**Files:** `apps/operator-scripts/assess.ts`, `apps/operator-scripts/_shared/cv-pipeline.ts`, `apps/web/lib/prompts/readiness.ts`, `apps/web/lib/prompts/plan.ts`, `apps/web/lib/prompts/role-match.ts`, `apps/web/lib/prompts/cv-master.ts`, `.claude/skills/cruzar-assess/SKILL.md`.

**Dependencies:** M4 (intake data) + P3 (`generate-pdf.mjs`).

**Acceptance:**
- [ ] Three readiness paths tested with synthetic data.
- [ ] Ready path produces `profile_md` on `profiles` (per-student SSOT, ADR-09), `role_matches` rows, salary delta fields, and — if `consent_public_profile` is true — a `showcase_cv_r2_key` rendered PDF.
- [ ] Non-ready path produces `plan_markdown` + `next_assessment_at`.
- [ ] Prompt version stamped on `profiles.prompt_version`.

**CC prompt template:**

> Block M5. Implement `apps/operator-scripts/assess.ts` per Architecture §Flow C + ADR-09 (synthesize `profile_md` + version stamp; no master CV on profiles). Zod-validated outputs. Shell out to `apps/career-ops/bin/generate-pdf.mjs` only when rendering the optional `showcase_cv_r2_key`. Test each of the three verdict branches.

### M6 — Profile + share — 3h

**Goal:** `/profile` for the three verdicts + `/p/<slug>` public read-only + CV download.

**Files:** `apps/web/app/profile/page.tsx`, `apps/web/app/profile/actions.ts` (share toggle), `apps/web/app/p/[slug]/page.tsx`, `apps/web/components/profile-ready.tsx`, `apps/web/components/profile-plan.tsx`, `apps/web/components/cv-download.tsx`.

**Dependencies:** M5.

**Acceptance:**
- [ ] All three verdict renders tested with real data.
- [ ] `/p/<slug>` 404s when consent is off or verdict is not Ready.
- [ ] CV download streams from R2 via presigned GET.
- [ ] Mobile responsive (Tailwind defaults are enough — no breakpoint fights).

**CC prompt template:**

> Block M6. Build `/profile` and `/p/<slug>` per Architecture §Flow 2 + §Flow 3. Read verdict + render the matching shape. Share toggle is a server action. CV download is a presigned R2 GET.

### M7 — Status page — 1h

**Goal:** `/status` counters + timeline.

**Files:** `apps/web/app/status/page.tsx`, `apps/web/components/status-counters.tsx`, `apps/web/components/status-timeline.tsx`.

**Dependencies:** M1.

**Acceptance:**
- [ ] Empty state copy rendered when no applications exist.
- [ ] Counters aggregate correctly from `applications` + `status_events`.

**CC prompt template:**

> Block M7. Build `/status` per Architecture §Flow 4. Auth-gate the route. Timeline is `status_events DESC`.

### M8 — fill-forms v2 + per-JD CV — 4h

**Goal:** Apply the multi-tenant upgrade diff to `apps/career-ops/bin/fill-forms.mjs` (delete hardcoded candidate, parameterize by workspace). Build the Greenhouse adapter. Wire per-JD CV customization as part of the fill-forms run. Persist `generated_cvs` + `fill_form_drafts`.

**Files:** `apps/career-ops/bin/fill-forms.mjs` (upgraded in place), `apps/career-ops/bin/adapters/greenhouse.mjs` (new), `apps/career-ops/bin/adapters/generic.mjs` (extracted fallback), `apps/operator-scripts/_shared/cv-tailor.ts` (LLM chain for per-JD CV).

**Dependencies:** P3, M5.

**Acceptance:**
- [ ] `fill-forms.mjs` accepts `{ candidate, application, cvPath, answersPath, workspaceDir }` via JSON on stdin or flags — no hardcoded candidate.
- [ ] Hardcoded candidate block from P3 is deleted; sanitization grep (per P3) now returns **zero** hits across `apps/career-ops/`.
- [ ] All filesystem reads/writes scoped to `workspaceDir`; no `__dirname` paths for runtime data (per `apps/career-ops/CLAUDE.md` invariant).
- [ ] Greenhouse adapter handles the standard `boards.greenhouse.io` + Greenhouse-embedded layouts.
- [ ] Per-JD CV: tailored `cv_markdown` generated, PDF rendered, R2-uploaded, attached to the form, `generated_cvs` row persisted with version.
- [ ] Miss-log persisted on `fill_form_drafts` (screenshots, missed fields, needs-human).
- [ ] Idempotent on `(student_id, company_normalized, role_normalized, job_url)` — re-run skips already-submitted.
- [ ] Never clicks any element whose text matches `/submit|send|apply now/i` beyond the listing-page "Apply" trigger.

**CC prompt template:**

> Block M8. Upgrade `apps/career-ops/bin/fill-forms.mjs` per ADR-08. Add Greenhouse adapter. Wire per-JD CV tailor (`apps/operator-scripts/_shared/cv-tailor.ts`) into the form-fill loop. Persist `generated_cvs` + `fill_form_drafts`. Idempotency + ethical submit gate per Architecture §WOZ.

### M9 — run-cohort skill + ingest — 2h

**Goal:** `apps/operator-scripts/run-cohort.ts` + `.claude/skills/cruzar-run-cohort/SKILL.md`. Runtime-dir generation, shells out to fill-forms, collects outputs, upserts `applications` + `status_events`.

**Files:** `apps/operator-scripts/run-cohort.ts`, `apps/operator-scripts/_shared/runtime-dir.ts`, `.claude/skills/cruzar-run-cohort/SKILL.md`.

**Dependencies:** M8.

**Acceptance:**
- [ ] Runtime dir generation is pure (DB → filesystem) and re-runnable.
- [ ] End-to-end run for one Ready student against a real Greenhouse posting produces: tailored CV in R2, fill_form_draft row, application row after Miura's submit click.
- [ ] Re-running without new target JDs produces zero new applications (idempotency proven).

**CC prompt template:**

> Block M9. Build `run-cohort` per Architecture §Flow D. Runtime-dir generation in `apps/operator-scripts/_shared/runtime-dir.ts`. Subprocess-invokes `fill-forms.mjs`. Ingests outputs into DB. Test end-to-end on one real student + one real Greenhouse posting.

### M10 — Remaining operator skills — 2h

**Goal:** `cruzar-onboard`, `cruzar-scan-inbox`, `cruzar-interview`, `cruzar-sql`, `cruzar-counters-sanity` — skills + scripts.

**Files:** `.claude/skills/cruzar-onboard/SKILL.md` + `apps/operator-scripts/onboard.ts`; `.claude/skills/cruzar-scan-inbox/SKILL.md` + `apps/operator-scripts/scan-inbox.ts`; `.claude/skills/cruzar-interview/SKILL.md` + `apps/operator-scripts/send-interview-email.ts`; `.claude/skills/cruzar-sql/SKILL.md` + `apps/operator-scripts/sql.ts`; `.claude/skills/cruzar-counters-sanity/SKILL.md` + `apps/operator-scripts/counters-sanity.ts`.

**Dependencies:** M9.

**Acceptance:**
- [ ] Each skill invocable from a fresh CC session.
- [ ] `cruzar-sql` defaults to read-only; `--write` requires confirmation.
- [ ] `cruzar-scan-inbox` classifies a batch of test threads into the 4 categories.
- [ ] `cruzar-interview` drafts a Resend email and only sends on Miura's explicit approval.

**CC prompt template:**

> Block M10. Build the remaining operator skills per Architecture §Flow A, E, F, G, H. One SKILL.md + one script per action. Zod-validated. Every mutation through a script.

### M11 — Quality floor + deploy — 2h

**Goal:** Sentry, Better Stack uptime, Resend DKIM/SPF/DMARC, R2 CORS, rate limits, Vercel deploy, custom domain, magic-link smoke test from an external inbox.

**Files:** `apps/web/sentry.*.config.ts`, `apps/web/middleware.ts` (rate limit), DNS records, Vercel project settings.

**Dependencies:** all prior M blocks.

**Acceptance:**
- [ ] `cruzar.io` resolves with valid TLS.
- [ ] Magic-link email from `hello@cruzar.io` reaches a non-technical Gmail test inbox in Primary (not Spam/Promotions).
- [ ] Sentry receives a test error from a canary route.
- [ ] Uptime pings report healthy.
- [ ] `bun typecheck` green across the repo from pre-commit.
- [ ] `.gitignore` honored; `.cruzar-runtime/` and `drizzle/` not tracked.

**CC prompt template:**

> Block M11. Finalize quality floor per Architecture §Observability + §Deployment + §Security. Configure Resend DKIM/SPF/DMARC on `cruzar.io` before testing magic link. R2 CORS for `https://cruzar.io`. Rate limits. Deploy. Verify end-to-end with a real Gmail test account.

### M12 — Onboard 3+ real students + launch — 1h

**Goal:** Three Aprendly students run through the full flow end-to-end; public counter non-zero at launch.

**Acceptance:**
- [ ] ≥ 3 students have `english_certs.verified = true` + `intakes.finalized_at` + `profiles.readiness_verdict`.
- [ ] ≥ 1 student is Ready with `profiles.profile_md` populated + at least one `applications` row + one `status_events` row (and, if that student consented to public profile, `profiles.showcase_cv_r2_key` set).
- [ ] Public counter renders non-zero values (students profiled ≥ 3, applications ≥ 1).
- [ ] Announce internally (Miura + Enrique).

**CC prompt template:**

> Block M12. Run 3 Aprendly students through onboard + intake + assess + (for at least one) run-cohort. Verify the counter is non-zero. Note any rough edges for Phase X.

---

## Rolling status table

Tick this at the end of every block.

| Block | Goal (one-line) | Hours | Status |
|---|---|---|---|
| P1 | Monorepo scaffold | — | Done |
| P2 | `apps/web/CLAUDE.md` | — | Done |
| P3 | career-ops absorb | — | Done |
| P4 | ADRs 01–08 | — | Done |
| P5 | Architecture + Roadmap + archive spec | — | Done |
| P6 | Operator + app scaffold extension | — | Done |
| M1 | Schema + Better Auth | 2 | Not started |
| M2 | Onboarding form | 2 | Not started |
| M3 | Landing + counter | 2 | Not started |
| M4 | Intake skill suite | 3 | Not started |
| M5 | Assessment pipeline | 3 | Not started |
| M6 | Profile + share | 3 | Not started |
| M7 | Status page | 1 | Not started |
| M8 | fill-forms v2 + per-JD CV | 4 | Not started |
| M9 | run-cohort skill + ingest | 2 | Not started |
| M10 | Remaining operator skills | 2 | Not started |
| M11 | Quality + deploy | 2 | Not started |
| M12 | Onboard 3+ + launch | 1 | Not started |
| **Total Phase M** | | **27** | |

---

## Escalation rules

- A block that can't complete in its budgeted hour + 50% slack → escalate to Enrique before patching around it.
- Any Zod-validation failure from Claude that doesn't resolve on a single retry → escalate + capture the failing prompt + input on a GitHub issue (or a `product/cruzar/incidents/` markdown if no GH yet).
- Any deviation from ADR decisions → write a new ADR (09+) before merging the code. Do not silently override.

---

## Phase X — Post-24h continuation (summary; full spec in [msp.md](./msp.md))

Roughly ranked by traction ROI:

1. fill-forms long-form answer generator (LLM per-JD field fills).
2. Async fill-forms review + video recording + replay-to-submit.
3. Lever / Ashby / Workable platform adapters.
4. Meta WhatsApp Cloud API transition (replaces Miura copy-paste with the same orchestrator behind a webhook).
5. Voice Interview Mode 1 (practice) + Mode 2 (SDR scenario).
6. In-product English assessment (Deepgram + CEFR rubric + full eval harness with CI gate).
7. career-ops absorb wave 2 (`analyze-patterns`, `doctor`, `dedup-tracker`, `merge-tracker`, modes/*, `batch/batch-prompt.md`).
8. Institution-facing dashboard (first UTEC conversation artifact).
9. OG image runtime + referral loop.
10. Multi-admin operator surface (when a second operator joins).

Phase X is not planned in this file — [msp.md](./msp.md) owns that.
