# Cruzar — MVP 0 Spec

**Date:** 2026-04-15
**Status:** Archived — see [architecture.md](./architecture.md) + [roadmap.md](./roadmap.md). This file remains as the business-side record of what was agreed. Architecture + Roadmap are the only SSOT during development.
**Owner:** Miura (operator + builder, Claude Code everywhere). Enrique (scaffold + conventions + ADRs + handoff).
**Timebox:** 24h of Miura's focused build time, CC-assisted. Scope below fits that window because the operator surface is Claude Code, not a web admin UI.
**Supersedes for the 24h window:** first slice of Phase 1 in [msp.md](./msp.md). msp.md remains canonical post-24h.
**User:** [U0 "Underleveraged Operator"](../../business/personas.md#u0-phase-1-woz-user--underleveraged-operator-active-cohort-profile) — Aprendly cohort, B2+ verifiable, 1–3 years experience, voice-first remote roles. Cap: 5 simultaneous users.

---

## Core design decisions (locked)

1. **Claude Code is the operator surface.** Miura runs the cohort through CC sessions: skills + typed scripts + DB + R2. No admin web UI is built.
2. **Intake is Wizard-of-Oz via WhatsApp + Miura copy-paste.** CC generates 10 adaptive questions from the student's prior answers; Miura pastes them into WhatsApp; student replies async over 24–48h; Miura pastes the reply back into CC. Bounce 4 times → 40+ questions captured. Miura's cost: ~20 min per student spread over days. No Meta Cloud API, no webhook, no templates.
3. **English is pre-required, not assessed in product.** Students must present a verifiable B2+ cert (IELTS/TOEFL/Cambridge/Aprendly). MVP 0 captures the cert, does not score oral/written English. Voice assessment in product is Phase 1 continuation.
4. **Stage 2 readiness is categorical, actionable, and gated.** Three verdicts: `Ready` | `Presentation gap` | `Experience gap`. Only `Ready` enters the applications pipeline. Non-ready students get a concrete, personalized coaching plan on their profile page.
5. **Applications use per-JD customized CVs.** The absorbed fill-forms loop tailors `cv.md` per job posting via Claude before generating the PDF. This is the interview-invite multiplier and Miura's deliberate investment.
6. **career-ops is absorbed, critical path only.** `fill-forms.mjs` (with multi-tenant upgrade), `generate-pdf.mjs`, `templates/cv-template.html`, `templates/states.yml`, `fonts/`. Nothing else in MVP 0. Wider absorb = Phase 1 wave 2.
7. **Long-running work runs on Miura's laptop.** Playwright, PDF render, LLM chains, career-ops scripts — all executed inside CC sessions. No Trigger.dev, no Fly, no Vercel function timeout concerns in MVP 0.

Rationale for each is promoted to its own ADR under `product/cruzar/adr/`.

---

## The three surfaces

### Surface 1 — Student web app (`apps/web`)

Public UI. The only UI. Ships to Vercel at `cruzarapp.com`.

### Surface 2 — Shared data + contracts

Neon Postgres. Drizzle tables derived from Zod schemas (SSOT). R2 for every blob. Read and written by Surface 1 (student actions) and Surface 3 (operator actions) through a single code path per write — no ad-hoc mutations anywhere.

### Surface 3 — Claude Code operator playbook

- `.claude/skills/cruzar-*/SKILL.md` — one per operator action.
- `apps/operator-scripts/*.ts` — typed entrypoints invoked by skills. Zod-validated I/O. Idempotent on documented keys.
- `apps/career-ops/` — absorbed critical-path scripts.
- Optional per-session MCP: Postgres MCP for ad-hoc reads; any Gmail access is handled by Miura in his own inbox and pasted into CC when a skill needs it (no OAuth in MVP 0).

---

## Student flow (UX)

Single unbranched path. Four student decisions total: sign up, present English cert, consent to public profile, come back.

1. **Land** (`/`) — hero, salary-delta headline, live counter `N profiled · M applications · K interviews`, single CTA: email input → magic link. No nav.
2. **Magic link** → `/onboarding`. `students` row created on email submit.
3. **Onboarding** (`/onboarding`) — single short form:
   - Full name, WhatsApp number (required — Miura will contact here).
   - Local monthly salary in USD (optional, powers salary delta).
   - English certification: kind (IELTS/TOEFL/Cambridge/Aprendly/Other) + score + level + issue date + attestation upload (PDF/image to R2).
   - Public-profile consent toggle.
   - Submit → thank-you screen: *"Miura will reach out on WhatsApp within 24h to start your intake. Check your number."*
4. **Intake** happens off-app (WhatsApp). No student-facing web screen during intake.
5. **Profile** (`/profile`) — becomes populated after Miura completes the assessment. Three possible shapes:
   - **Ready** → CEFR-badged, top 3 role matches, salary delta, CV download, share toggle, "You're in the application queue" status message.
   - **Presentation gap** → CV/positioning plan: specific items to add or rephrase, examples, suggested next iteration window. *"We'll re-assess on [date]."*
   - **Experience gap** → growth plan: specific projects/roles/certifications to pursue, estimated timeline, milestones. *"We'll re-assess when you complete N of the milestones."*
6. **Public profile** (`/p/<slug>`) — only exists for `Ready` students who consent. Plain HTML, no dynamic OG (deferred). Visible to LinkedIn/WhatsApp previews via static site OG tags.
7. **Status** (`/status`) — per-student counters (Applied / Viewed / Rejected / Interview) + timeline. Empty state with honest copy until the first application is logged.
8. **Emails** (Resend, domain-verified day 1) —
   - Magic link.
   - Post-onboarding: *"Miura will reach out soon on WhatsApp."*
   - Intake complete + plan ready: *"Your Cruzar profile is live. See it →"*
   - First application out: *"Your first applications are in motion. See status →"*
   - Interview invite (Miura-authored, triggered by `/cruzar interview` skill).

### Completion + trust safeguards
- Profile page is protected — shows "Intake in progress" until Miura persists an assessment.
- Plan pages show a concrete next-assessment date so the student knows when the next update lands.
- Magic links rate-limited (5/hour/email). Resend DKIM/SPF/DMARC verified before first send.

---

## Operator flow (Miura + Claude Code)

Every action below is a named CC skill backed by a typed script.

### Onboarding a new student — `/cruzar onboard <student_id>`
- CC reads the `students` row, validates the English cert attestation, flags anomalies.
- Outputs a short "welcome + intake kickoff" WhatsApp message for Miura to send.
- Marks `students.onboarded_at`.

### Intake — `/cruzar intake <student_id>`
Three subcommands per student:

- `/cruzar intake <id> --generate` — CC reads prior batches + answers, generates the next batch of 10 adaptive questions, formats for WhatsApp paste. Persists the prompt text on `intake_batches`.
- `/cruzar intake <id> --record` — Miura pastes the student's reply; CC parses it into structured Q→A rows on `intake_batch_answers`, asks clarifying questions only if an answer is unparseable, persists `raw_reply` verbatim.
- `/cruzar intake <id> --finalize` — CC declares intake complete once 4 batches + 40 answered Qs are in. Triggers the assessment pipeline.

### Assessment — `/cruzar assess <student_id>`
- CC runs: readiness classifier (3-way) → per-category plan generator (Presentation or Experience, or goes straight to Ready).
- Persists on `profiles`: `readiness_verdict`, `gaps (jsonb)`, `plan_markdown`, `next_assessment_at` for non-ready students.
- If `Ready`: also triggers role-match generator (top 3 from catalog), salary-delta calc, CV markdown generator, PDF render, R2 upload, sets `/profile` to live.
- If not ready: profile page populates with the plan, next-assessment date communicated via email.

### Run applications for a Ready student — `/cruzar run-cohort --student <id>`
- CC validates `readiness_verdict = Ready`.
- Generates `.cruzar-runtime/<id>/` from DB (cv.md, profile.yml, portals.yml filtered to target roles).
- Shells out to `apps/career-ops/bin/fill-forms.mjs` in headed mode. fill-forms v2 multi-tenant + Greenhouse adapter + per-JD CV customization:
  - For each JD, Claude generates a tailored `cv.md` from master + JD → `generate-pdf.mjs` → PDF uploaded to R2.
  - fill-forms opens the posting, fills standard fields, attaches the tailored PDF, scrolls to submit, pauses.
- Miura reviews the filled form on screen, clicks submit, presses Enter for the next.
- On each submit, CC upserts the `applications` row + emits `status_events` row. Idempotent on `(student_id, company_normalized, role_normalized, job_url)`.
- Per-JD CV markdown + PDF keys persisted on `generated_cvs` — regeneration is versioned, never silently drifts.

### Inbox scan — `/cruzar scan-inbox`
- Miura exports or pastes recent threads from the shared cohort Gmail into CC.
- CC classifies each thread (Viewed / Rejected / Interview / Other), proposes status flips, awaits Miura confirmation.
- Confirmed flips call `apps/operator-scripts/flip-status.ts` → `status_events` row emitted.

### Interview invite — `/cruzar interview <application_id>`
- CC extracts company, role, time, link from the pasted email thread.
- Generates or surfaces `interview-prep/{company}-{role}.md` via career-ops flow + stores in R2.
- Drafts the Resend email with prep attached; Miura approves; CC sends + emits `status_events`.

### Escape hatches
- `/cruzar sql "<query>"` — CC runs read-only SQL by default; explicit `--write` flag + confirmation required for mutations. Every mutation goes through a script, not raw SQL, except in emergencies.
- `/cruzar counters-sanity` — weekly reconcile; CC queries raw aggregates vs. the public counter endpoint.

### What Miura does NOT do in MVP 0
- No admin UI clicks (no admin UI exists).
- No Gmail OAuth (inbox scan is paste-in).
- No manual DB edits (every mutation goes through a typed script).
- No writing application answers from scratch for every field — Claude generates per-JD answers where the form has long-form fields, Miura reviews.

---

## English certification (pre-required)

`english_certs` table on signup:

| Field | Type |
|---|---|
| id | uuid |
| student_id | FK students |
| kind | enum `ielts`/`toefl`/`cambridge`/`aprendly`/`other` |
| score | text (raw, as issued) |
| level | enum `A2`/`B1`/`B2`/`C1`/`C2` (derived via mapping) |
| issued_at | date |
| attestation_r2_key | text (screenshot/PDF the student uploads) |
| verified | boolean (Miura flips to true during `/cruzar onboard`) |

Mapping table (`cefr_map.ts`, typed):
- IELTS: 5.5–6.0 → B2, 6.5–7.5 → C1, 8.0+ → C2
- TOEFL iBT: 72–94 → B2, 95–109 → C1, 110+ → C2
- Cambridge: FCE → B2, CAE → C1, CPE → C2
- Aprendly: whatever Aprendly's internal scale maps to (final mapping documented in `cefr_map.ts`)

Below-B2 certs blocked at onboarding — student sees "English level below B2 — remote roles require B2+. Please complete a B2+ cert and return."

---

## Applications backend: minimum-scope absorb

From `~/Projects/jobs/` (staged-but-uncommitted) into `apps/career-ops/`:

**In:**
- `bin/fill-forms.mjs` (staged-never-committed original; multi-tenant upgrade on top)
- `bin/generate-pdf.mjs` (unchanged)
- `templates/cv-template.html`
- `templates/states.yml`
- `fonts/`

**Out (deferred to Phase 1 wave 2):**
- `analyze-patterns.mjs`, `doctor.mjs`, `dedup-tracker.mjs`, `normalize-statuses.mjs`, `verify-pipeline.mjs`, `cv-sync-check.mjs`, `check-liveness.mjs`, `merge-tracker.mjs`.
- All `modes/*.md`, `batch/batch-prompt.md`.
- Every Enrique-personal file.

### Sanitization (ship-blocking)
1. `grep -rinE 'enrique|flores|utec\.edu\.pe|\+51926|enriquefft|lima|linkedin\.com/in/enriqueflores'` returns zero hits before commit.
2. Manual prose diff on any copied file with >20 lines of prose — scrub subtle Enrique-profile leakage (three years of experience, Software Engineer background, etc.).
3. `fill-forms.mjs` lines 36–46 (hardcoded candidate) deleted in the multi-tenant upgrade diff, same commit.
4. `apps/career-ops/CLAUDE.md` authored fresh (not copied) — multi-tenant rules, ethical submit gate inviolable.

### fill-forms v2 multi-tenant upgrade (stays, Miura's invested time)

Applied as a diff on top of the copied file:

1. **Multi-tenant candidate.** `runApplication({ candidate, application, cvPath, answersPath, workspaceDir })`. `candidate` is a Zod schema (firstName, lastName, email, phone, LinkedIn, GitHub, portfolio, location, timezone, work-authorization).
2. **Per-JD CV customization.** Before filling, Claude generates a tailored `cv.md` from `profile_md` (the per-student SSOT, see ADR-09) + JD description → `generate-pdf.mjs` → PDF attached. Persisted on `generated_cvs` (student_id, application_id, cv_markdown, cv_r2_key, version, created_at).
3. **Greenhouse platform adapter.** Detects `boards.greenhouse.io` or `jobs.<co>.com/greenhouse-embedded`; uses a per-platform selector map. Generic heuristic (current file's behavior) stays as fallback.
4. **LLM-generated long-form answers.** Field-extraction Playwright pre-pass → Claude fills long-form answers keyed on field label → Zod-validated `{fieldKey: {value, confidence}}`. Confidence <0.6 flagged as `needsHuman` (not filled, surfaced in CC). Short-form (name, email, LinkedIn, etc.) continue to come from `candidate`.
5. **Idempotency on `(student_id, company_normalized, role_normalized, job_url)`.** Re-runs skip already-drafted or already-submitted apps.
6. **Structured miss-log.** Per-run output `{filled: [...], missed: [...], needsHuman: [...], screenshots: [r2keys], finalStateScreenshot: r2key}` persisted on `fill_form_drafts`.
7. **Synchronous headed loop retained.** Miura watches, presses Enter between apps. Async/video review is Phase 1 continuation.

### Runtime workspaces
Per-student at `.cruzar-runtime/<student_id>/`, gitignored, disposable, regenerated from DB each pipeline run.

Contents (all rendered from DB):
- `profile.md` (per-student SSOT) ← `profiles.profile_md`
- `profile.yml` ← `profiles` + `role_matches`
- `portals.yml` ← global portals template ∩ student's target roles
- `data/applications.md` ← full `applications` history for this student (never starts empty)
- `answers/<application_id>.md` ← per-app long-form answers (generated + human-edited)

Per-run outputs stream to R2 + DB rows as produced. Dir is safe to delete after the run.

---

## Data model (v0)

Zod = SSOT. Drizzle tables derive via `z.infer` / `$inferSelect`. Better Auth owns its `user`/`session` tables; `students.id` FKs them.

| Table | Columns (abbreviated; schema files are the truth) |
|---|---|
| `students` | id, email, name, whatsapp, local_salary_usd, consent_public_profile, public_slug, onboarded_at, created_at |
| `english_certs` | id, student_id, kind, score, level, issued_at, attestation_r2_key, verified |
| `intakes` | id, student_id, started_at, finalized_at |
| `intake_batches` | id, intake_id, batch_num (1–4), prompt_text, sent_at, raw_reply, reply_at, created_at |
| `intake_batch_answers` | id, batch_id, question_key, question_text, answer_text, confidence |
| `profiles` | id, student_id, readiness_verdict (`ready`/`presentation_gap`/`experience_gap`), gaps_jsonb, plan_markdown, next_assessment_at, profile_md, profile_md_version, profile_md_generated_at, showcase_cv_r2_key, prompt_version (see ADR-09 — profile_md is SSOT; master CV removed) |
| `role_matches` | id, profile_id, role_id, rank, rationale |
| `roles` | id, title, comp_min_usd, comp_max_usd, english_level, skills_jsonb, employer_type, entry_level |
| `applications` | id, student_id, role_id (nullable), company_name, company_normalized, role_normalized, job_url, platform, status (canonical from `states.yml`), applied_at, updated_at, career_ops_report_r2_key. UNIQUE `(student_id, company_normalized, role_normalized, job_url)`. |
| `generated_cvs` | id, student_id, application_id, cv_markdown, cv_r2_key, version, created_at |
| `fill_form_drafts` | id, application_id, screenshot_r2_keys_jsonb, missed_fields_jsonb, needs_human_jsonb, state (`drafted`/`submitted`/`rejected`), created_at |
| `status_events` | id, student_id, application_id (nullable), kind, note, interview_time (nullable), created_at |

Public counter = SQL aggregate over real rows, ISR at 30s. No denormalized counters.

---

## Quality floor (non-negotiable)

- Zod SSOT for every entity and every LLM structured output. One retry on Zod-fail, then honest error + Sentry alert.
- Zero `any`. Zero `as` except `as const`. Zero duplicated types. Enforced by `bun typecheck` in pre-commit.
- Idempotency key `(student_id, company_normalized, role_normalized, job_url)` on every applications write.
- `profile_md` persisted on `profiles` as the per-student SSOT (ADR-09). Regeneration bumps `profile_md_version`, never silent.
- `generated_cvs` captures per-JD CV history with version stamps.
- Resend DKIM + SPF + DMARC verified before first magic link sends. First email smoke-tested to an external non-technical inbox.
- R2 CORS configured for `cruzarapp.com` (attestation uploads + CV PDF download).
- Magic-link rate limit 5/hr/email. Attestation upload size cap 10 MB.
- Public counter: ISR `revalidate: 30`, never SSR-on-every-request.
- Sentry + Better Stack uptime on `apps/web`. Operator-side errors from scripts always print to CC stdout with structured exit codes.

Out of MVP 0 quality scope: a11y sweep beyond keyboard nav, mobile polish beyond Tailwind defaults, i18n, broader integration test suite, analytics.

---

## Out of scope (NOT in 24h; all deferred to msp.md Phase 1 continuation)

- Admin web UI.
- WhatsApp Cloud API integration (intake stays WOZ).
- In-product English assessment (written or voice).
- Gmail cron parser (inbox scan is on-demand paste-in).
- OG image runtime generation.
- Referral loop.
- Async fill-forms review + video recording + replay-to-submit.
- Voice Interview Mode 1 / Scenario Simulation Mode 2.
- Student cohort / funnel views, institution / employer surfaces, payments, diagnostic retakes, i18n, full CEFR eval harness, platform adapters beyond Greenhouse.
- `~/Projects/jobs/` system layer beyond the critical-path files named above.

---

## Decisions landed as ADRs (separate files under `product/cruzar/adr/`)

- ADR-01 — Long-running work runs on Miura's laptop via CC (not Vercel / Trigger.dev / Fly in MVP 0).
- ADR-02 — Intake is WOZ copy-paste over WhatsApp; no Cloud API in MVP 0.
- ADR-03 — career-ops absorb is critical-path only.
- ADR-04 — Operator surface is Claude Code skills + typed scripts; no admin web UI.
- ADR-05 — Public counter rendered via ISR with 30s revalidate.
- ADR-06 — `cv_markdown` persisted on `profiles`; regeneration is versioned.
- ADR-07 — English verified via external cert pre-required; no in-product assessment in MVP 0.
- ADR-08 — fill-forms retains synchronous headed loop; per-JD CV customization + Greenhouse adapter ship in MVP 0; async/video review + LLM-long-form-answer extraction + cross-platform adapters are Phase 1 continuation.

Each ADR captures: context, decision, alternatives considered, consequences, sunset criteria (when the decision should be revisited).

---

## Success criteria (24h exit)

Hard — all ship-blocking:

- [ ] `cruzarapp.com` deployed on Vercel, TLS, Resend DKIM/SPF/DMARC verified, magic link lands in a real inbox (not spam) from a non-technical test account.
- [ ] Public counter on `/` renders ISR'd SQL aggregates with real non-zero values at launch.
- [ ] Student can sign up, complete onboarding (name + WhatsApp + English cert upload + consent), see post-onboarding confirmation.
- [ ] `/profile` renders correctly for each of the three verdicts (Ready / Presentation gap / Experience gap) with real data from at least one student in each (or two states minimum).
- [ ] Per-JD CV customization pipeline produces a tailored PDF per application. Master `cv_markdown` and per-JD `generated_cvs` both persisted.
- [ ] `.claude/skills/cruzar-*/SKILL.md` × 7 authored: `onboard`, `intake`, `assess`, `run-cohort`, `scan-inbox`, `interview`, `sql`, `counters-sanity`. Each invocable from a fresh CC session.
- [ ] `apps/operator-scripts/*.ts` backing each skill, Zod-validated I/O, idempotent on documented keys.
- [ ] `apps/career-ops/` absorbed (critical-path only), sanitized (grep + prose-diff), committed. Fresh `apps/career-ops/CLAUDE.md` authored.
- [ ] fill-forms v2 multi-tenant + Greenhouse adapter + per-JD CV customization operational end-to-end on a real Greenhouse posting against a real student.
- [ ] Sentry + Better Stack uptime wired.
- [ ] Typecheck clean. `bun typecheck` in pre-commit.
- [ ] **3+ Aprendly students through the full flow end-to-end.** Non-zero public counter at launch. At least one student with a real submitted application and a `status_events` row for it.

Soft:
- [ ] 5 students processed (fills the Fase 1 cap).
- [ ] At least one interview invite received and flipped via `/cruzar interview`.

---

## Tech stack (subset wired)

- Bun workspaces + Next 16 App Router + TypeScript. ⚠ Next 16 ≠ Next 15 — read `apps/web/AGENTS.md` + `node_modules/next/dist/docs/` before writing route code.
- Neon Postgres + Drizzle ORM + Zod (SSOT).
- Better Auth (email + magic link).
- shadcn/ui + Tailwind v4.
- Anthropic SDK (Claude Sonnet) with prompt caching on static blocks.
- Cloudflare R2 (attestations, CV PDFs, fill-forms screenshots, interview-prep files).
- Resend (transactional email).
- `apps/career-ops/` (Node/Playwright, absorbed critical path).
- Sentry + Better Stack.
- Biome for lint/format.

Not wired in MVP 0: Deepgram, OpenAI Realtime, LiveKit, Trigger.dev/Fly, OG image runtime, Meta WhatsApp Cloud API.

---

## Build blocks (24h ordered — spec-level intent; executable version lives in `roadmap.md`)

### Pre-handoff (Enrique, not on Miura's 24h budget)
- P1. Monorepo scaffold — done (apps/web Next 16 + apps/career-ops placeholder + tsconfig + Bun workspaces + deps + typecheck green).
- P2. `apps/web/CLAUDE.md` authored.
- P3. `apps/career-ops/` absorbed + sanitized + committed (per ADR-03).
- P4. ADRs 01–08 authored.
- P5. `product/cruzar/architecture.md` + `product/cruzar/roadmap.md` authored. Spec moved to `Status: Archived — see architecture.md + roadmap.md`.

### Miura's 24h (ordered; details in `roadmap.md`)

1. Schema + Better Auth + magic link wired end-to-end.
2. Onboarding form (signup → English cert upload → consent → thank-you).
3. Landing + ISR counter + email CTA.
4. Intake skill suite (`/cruzar onboard`, `/cruzar intake --generate/--record/--finalize`).
5. Assessment pipeline (readiness classifier + per-category plan + Ready path to CV/role-match).
6. Profile page (three verdict shapes) + `/p/<slug>` + CV download.
7. Status page (per-student counters + timeline).
8. fill-forms v2 upgrade applied to absorbed file + per-JD CV customization + Greenhouse adapter.
9. Run-cohort skill + script + runtime-dir generation + ingest round-trip.
10. Scan-inbox + interview-invite + counters-sanity + sql skills.
11. Quality floor + deploy (Sentry, uptime, rate limits, CORS, Resend DKIM, Vercel, domain).
12. Onboard 3+ Aprendly students end-to-end; verify non-zero counter at launch.

---

## Handoff rules

- P1–P5 land before Miura's 24h starts.
- `apps/web/CLAUDE.md`: Zod SSOT, no `any`, no `as` except `as const`, `bun typecheck` in pre-commit, one Zod schema per entity, server actions over API routes unless there's a reason.
- `apps/career-ops/CLAUDE.md`: multi-tenant rules, never reintroduce personal data, ethical submit gate is inviolable.
- Every mutation goes through a typed script. No ad-hoc DB writes from skills.
- `roadmap.md` is the single source of truth for where Miura is during the 24h.
- If CC can't complete a block in one session, Miura escalates to Enrique before patching.

---

## What MVP 0 is not

- Not a demo. Live product with real U0 students and real submits.
- Not a pitch artifact. The pitch is the numbers it produces.
- Not the full Phase 1. The 24h first slice; msp.md owns the rest.
- Not disposable at any line. Production-grade floor per [root CLAUDE.md](../../CLAUDE.md).

---

## Next

1. Author ADRs 01–08 at `product/cruzar/adr/`.
2. Author `product/cruzar/architecture.md` (contracts, wiring, external deps, boundaries).
3. Author `product/cruzar/roadmap.md` (ordered blocks, acceptance, current position, ADR links).
4. Flip this file to `Status: Archived — see architecture.md + roadmap.md`. Architecture + Roadmap become the only SSOT during Miura's 24h.
