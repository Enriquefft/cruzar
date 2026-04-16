# Cruzar — Architecture (MVP 0)

**Date:** 2026-04-15
**Status:** Active — SSOT during development.
**Companion:** [roadmap.md](./roadmap.md) — ordered execution + current position.
**Spec it replaces in the build window:** [mvp-0.md](./mvp-0.md) (business-side, archived at handoff).

This document says *what exists* and *how it is wired*. It does not say *when* — that is the Roadmap. It does not justify decisions — those are in [adr/](./adr/).

---

## System overview

Three surfaces sharing one data layer.

```
                                 ┌────────────────────────────────────────┐
 student ──> HTTPS ──> apps/web ─┤                                        │
                                 │   Neon Postgres + R2                   │
 miura  ──> Claude Code ─────────┤   (Zod SSOT contracts)                 │
            ├─ .claude/skills/   │                                        │
            ├─ apps/operator-scripts/*.ts      └────────────────────────────────────────┘
            └─ apps/career-ops/        ▲
                                           │
                                           ▼
                                    Resend (email)
                                    Anthropic (Claude)
                                    Playwright (on Miura's laptop)
```

- **apps/web** — Next 16 App Router on Vercel. Public student-facing routes only.
- **Claude Code operator playbook** — skills + scripts + absorbed career-ops, all running on Miura's laptop. Reads + writes the same DB + R2 as apps/web.
- **Data layer** — Neon Postgres, R2 blobs, Zod as SSOT with Drizzle tables derived. No other source of truth exists.

---

## Monorepo layout

```
cruzar/
├── package.json                  # Bun workspaces: apps/*
├── bunfig.toml
├── tsconfig.base.json
├── .gitignore                    # excludes .cruzar-runtime/, node_modules/, .next/, drizzle/
│
├── apps/                         # all code workspaces live here
│   ├── web/                      # @cruzar/web — student-facing Next 16 app
│   │   ├── app/                  # Next 16 App Router routes
│   │   │   ├── (public)/         # landing, /p/<slug>
│   │   │   ├── onboarding/
│   │   │   ├── profile/
│   │   │   ├── status/
│   │   │   └── api/              # auth, counter, webhook (future)
│   │   ├── db/                   # Drizzle schema files, migrations, client
│   │   ├── schemas/              # Zod schemas (SSOT)
│   │   ├── lib/                  # domain helpers: cefr-map, normalizers, prompts
│   │   ├── components/           # shadcn + ours
│   │   ├── AGENTS.md             # Next 16 pointer (ships with Next)
│   │   ├── CLAUDE.md             # conventions CC inherits per session
│   │   ├── next.config.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── career-ops/               # @cruzar/career-ops — absorbed critical path (ADR-03)
│   │   ├── bin/
│   │   │   ├── fill-forms.mjs    # staged-never-committed + v2 multi-tenant upgrade
│   │   │   └── generate-pdf.mjs
│   │   ├── templates/
│   │   │   ├── cv-template.html
│   │   │   └── states.yml
│   │   ├── fonts/
│   │   ├── CLAUDE.md             # multi-tenant rules, ethical submit gate
│   │   ├── package.json
│   │   └── README.md
│   │
│   └── operator-scripts/         # @cruzar/operator-scripts — typed operator entrypoints (CC invokes)
│       ├── intake/
│       │   ├── generate-batch.ts
│       │   ├── record-batch.ts
│       │   └── finalize.ts
│       ├── assess.ts
│       ├── run-cohort.ts
│       ├── flip-status.ts
│       ├── send-interview-email.ts
│       ├── counters-sanity.ts
│       └── _shared/              # DB client, R2 client, LLM wrappers, runtime-dir gen
│
├── .claude/
│   └── skills/
│       ├── cruzar-onboard/SKILL.md
│       ├── cruzar-intake/SKILL.md
│       ├── cruzar-assess/SKILL.md
│       ├── cruzar-run-cohort/SKILL.md
│       ├── cruzar-scan-inbox/SKILL.md
│       ├── cruzar-interview/SKILL.md
│       ├── cruzar-sql/SKILL.md
│       └── cruzar-counters-sanity/SKILL.md
│
├── product/cruzar/
│   ├── mvp-0.md                  # spec (archived after handoff)
│   ├── architecture.md           # this file
│   ├── roadmap.md
│   └── adr/01..08-*.md
│
└── business/, company/           # non-build docs
```

`.cruzar-runtime/<student_id>/` — gitignored, created at runtime by `apps/operator-scripts/_shared/runtime-dir.ts`, consumed by `apps/career-ops/bin/*`, deleted or retained for debugging after each run.

---

## Data contracts

Zod is the single source of truth. Drizzle schemas live alongside each Zod schema and are derived (`z.infer` for TS types, Drizzle table constructors type-checked against the Zod shape).

### Entities (mirrored in `apps/web/schemas/*.ts`)

- `student` — `{ id, email, name, whatsapp, local_salary_usd?, consent_public_profile, public_slug, onboarded_at?, created_at }`
- `english_cert` — `{ id, student_id, kind, score, level, issued_at, attestation_r2_key, verified }`. `kind ∈ {"ielts","toefl","cambridge","aprendly","other"}`. `level ∈ {"A2","B1","B2","C1","C2"}`.
- `intake` — `{ id, student_id, started_at, finalized_at? }`
- `intake_batch` — `{ id, intake_id, batch_num, prompt_text, sent_at?, raw_reply?, reply_at?, created_at }`. `batch_num ∈ {1,2,3,4}`.
- `intake_batch_answer` — `{ id, batch_id, question_key, question_text, answer_text, confidence }`
- `profile` — `{ id, student_id, readiness_verdict, gaps_jsonb, plan_markdown, next_assessment_at?, profile_md, profile_md_version, profile_md_generated_at?, showcase_cv_r2_key?, prompt_version }`. `readiness_verdict ∈ {"ready","presentation_gap","experience_gap"}`. `profile_md` is the per-student SSOT (narrative document) per [ADR-09](./adr/09-profile-md-ssot.md); `showcase_cv_r2_key` is a canonical CV PDF rendered once when public-profile consent is toggled on.
- `role` — `{ id, title, comp_min_usd, comp_max_usd, english_level, skills_jsonb, employer_type, entry_level }` (seeded from msp.md §B5).
- `role_match` — `{ id, profile_id, role_id, rank, rationale }`
- `application` — `{ id, student_id, role_id?, company_name, company_normalized, role_normalized, job_url, platform, status, applied_at?, updated_at, career_ops_report_r2_key? }`. `UNIQUE (student_id, company_normalized, role_normalized, job_url)`. `status ∈ (Evaluated, Applied, Responded, Interview, Offer, Rejected, Discarded, SKIP)` (from `apps/career-ops/templates/states.yml`).
- `generated_cv` — `{ id, student_id, application_id, cv_markdown, cv_r2_key, version, created_at }`
- `fill_form_draft` — `{ id, application_id, screenshot_r2_keys_jsonb, missed_fields_jsonb, needs_human_jsonb, state, created_at }`. `state ∈ {"drafted","submitted","rejected"}`.
- `status_event` — `{ id, student_id, application_id?, kind, note?, interview_time?, created_at }`.

Better Auth owns `user` + `session`. `student.id` carries the FK relationship to Better Auth's `user.id`.

### LLM structured-output contracts

Every Claude call that produces structured data returns a Zod-validated shape. One retry on validation fail, then an honest error and Sentry alert.

- **Adaptive intake batch** — `{ batch_num, questions: Array<{ question_key, question_text, rationale }> }`, 10 entries per batch.
- **Readiness classification** — `{ verdict: "ready"|"presentation_gap"|"experience_gap", confidence, gaps: Array<{ category, severity, evidence }> }`.
- **Per-category plan** — `{ plan_markdown, milestones: Array<{ title, description, due_in_days? }>, next_assessment_in_days }`.
- **Role match** — `{ matches: Array<{ role_id, rank, rationale }> }`, length 3.
- **Profile markdown (master, per-student)** — `{ profile_md, prompt_version, sections_present: string[] }` (markdown passes a second-stage lint: required sections present — identity, background, skills, stories, context, evaluations; no placeholder text; no PII beyond what `profile.consent_public_profile` allows).
- **CV markdown (per-JD tailored)** — `{ cv_markdown, changes_summary }` — derived from `profile_md` + JD text at render time.
- **Inbox classification** — `{ thread_id, classification: "viewed"|"rejected"|"interview"|"other", application_match?: {company, role, job_url?}, interview_time?, confidence }`.
- **Form-field answer generation (deferred, Phase 1)** — reserved.

Prompt version stamped on every row that persists LLM output.

### Idempotency keys

- `applications`: `(student_id, company_normalized, role_normalized, job_url)`.
- `intake_batches`: `(intake_id, batch_num)`.
- `status_events` for application state changes: `(application_id, kind, created_at_date)` — one flip per application per kind per calendar day maximum.
- `generated_cvs`: `(application_id, version)`.

---

## External dependencies

| Dep | Where | Purpose |
|---|---|---|
| Neon Postgres | DB | Durable state |
| Cloudflare R2 | Blob | Attestations, CV PDFs, fill-forms screenshots, interview-prep files |
| Anthropic API (Claude Sonnet) | apps/web + scripts | LLM for all structured outputs |
| Resend | apps/web | Transactional email |
| Better Auth | apps/web | Email + magic link |
| Sentry | apps/web + scripts | Error tracking |
| Better Stack | Vercel | Uptime |
| Playwright | apps/career-ops | fill-forms + PDF render (on Miura's laptop) |

All API keys loaded via `.env` (local) + Vercel project env vars. `.env.example` at repo root enumerates every key with a pointer to where it's obtained.

---

## Student-side data flows

### Flow 1 — Onboarding

```
landing
 → email input → POST /api/auth/magic-link
 → Resend sends magic link
 → student clicks → GET /api/auth/callback → session created → redirect /onboarding
 → onboarding form: name, whatsapp, salary?, english_cert (kind, score, level, issued_at, attestation upload to R2), consent
 → POST /api/onboarding (server action)
   → validate via Zod
   → upsert students row, insert english_certs row (verified=false)
   → redirect /onboarding/thanks
```

### Flow 2 — Profile (Ready path)

```
student visits /profile
 → auth check
 → SELECT profiles, english_certs, role_matches, roles, recent status_events
 → if no profiles row → render "Intake in progress" placeholder with next_contact_at hint
 → if profiles.readiness_verdict = "ready" → render Ready UI: CEFR badge (from english_cert), salary delta, top 3 roles with rationale, profile_md rendered as the student's narrative, showcase CV download (if consent_public_profile is on), share toggle
 → if "presentation_gap" → render plan + next_assessment_at
 → if "experience_gap" → render plan + milestones + next_assessment_at
```

### Flow 3 — Public profile

```
visitor hits /p/<slug>
 → lookup students.public_slug → if consent_public_profile=false or readiness_verdict≠"ready" → 404
 → render read-only profile_md (the student's narrative) + top 3 role matches + showcase CV download (profiles.showcase_cv_r2_key). No CTAs, no share toggle.
```

### Flow 4 — Status

```
student visits /status
 → auth check
 → SELECT applications WHERE student_id = me, status_events WHERE student_id = me ORDER BY created_at DESC
 → aggregate counters (applied / viewed / rejected / interview_invited)
 → render counters + timeline
```

### Flow 5 — Public counter

```
GET / (ISR, revalidate: 30s)
 → run the SSOT aggregate query (see ADR-05)
 → render the landing page with baked values
```

---

## Operator-side data flows

Every action runs through a CC skill → typed script → DB write. All flows are invoked synchronously by Miura during a CC session.

### Flow A — Onboard

```
/cruzar onboard <student_id>
 → script: read students + english_certs
 → check attestation_r2_key exists, download, open for review
 → verify score-to-level mapping via cefr_map.ts
 → prompt Miura to confirm ("Y/N")
 → on Y: UPDATE english_certs SET verified=true, UPDATE students SET onboarded_at=now()
 → output: welcome WhatsApp message (formatted, ready to paste)
```

### Flow B — Intake

Three subcommands sharing `intakes` + `intake_batches` state.

```
/cruzar intake <id> --generate
 → read prior batches + answers from DB
 → Claude: adaptive-intake-batch prompt (input: student, cert, prior Q/A) → 10 new questions (Zod validated)
 → INSERT intake_batches (batch_num=N, prompt_text=formatted)
 → output: paste-ready WhatsApp payload (batch N/4 header + 10 numbered questions)

/cruzar intake <id> --record
 → Miura pastes student reply
 → UPDATE intake_batches SET raw_reply=paste, reply_at=now()
 → Claude: parse reply into Q→A array keyed by question_key (Zod validated)
 → INSERT intake_batch_answers for each
 → output: "Batch N recorded. Generate batch N+1?"

/cruzar intake <id> --finalize
 → assert 4 batches recorded with >= 10 answers each
 → UPDATE intakes SET finalized_at=now()
 → trigger /cruzar assess <id> (or prompt Miura)
```

### Flow C — Assess

```
/cruzar assess <student_id>
 → read intakes, intake_batch_answers, english_certs
 → Claude: readiness-classifier → { verdict, confidence, gaps }
 → Claude: plan generator (verdict-specific prompt) → { plan_markdown, milestones, next_assessment_in_days }
 → compute next_assessment_at (null for Ready)
 → INSERT profiles (readiness_verdict, gaps_jsonb, plan_markdown, next_assessment_at)
 → if Ready:
    → Claude: role-match → top 3 from roles catalog (Zod validated)
    → INSERT role_matches
    → Claude: profile-md synthesizer (intake answers + english_cert + findings) → profile_md (Zod + lint)
    → UPDATE profiles SET profile_md, profile_md_version += 1, profile_md_generated_at, prompt_version
    → if students.consent_public_profile = true:
       → Claude: tailored CV (profile_md + "showcase" target) → cv_markdown
       → shell: apps/career-ops/bin/generate-pdf.mjs --in <temp>/cv.md --out <temp>/showcase.pdf
       → upload to R2 → UPDATE profiles SET showcase_cv_r2_key
    → compute salary delta, update profile UI fields
 → trigger Resend email: "Your Cruzar profile is live"
```

### Flow D — Run cohort (single student)

```
/cruzar run-cohort --student <id>
 → assert profiles.readiness_verdict = "ready"
 → apps/operator-scripts/_shared/runtime-dir.ts:
    → mkdir .cruzar-runtime/<id>
    → render profile.md from profiles.profile_md (the narrative SSOT)
    → render profile.yml from profiles + role_matches
    → render portals.yml from global template ∩ role_matches
    → render data/applications.md from full applications history for this student
 → for each target JD (fill-forms drives the loop):
    → fetch JD text (fill-forms scrapes the posting page)
    → Claude: per-JD CV customization (profile_md + JD text) → tailored cv_markdown + changes_summary
    → shell: generate-pdf.mjs → tailored PDF
    → upload to R2 → INSERT generated_cvs
    → fill-forms fills form using candidate + answers file + tailored PDF
    → pause at submit (headed)
    → Miura reviews + clicks submit
    → on submit: INSERT applications (idempotent on unique key) + INSERT status_events (kind=applied) + INSERT fill_form_drafts (state=submitted)
 → cleanup runtime dir (or retain per debugging flag)
```

### Flow E — Scan inbox

```
/cruzar scan-inbox
 → Miura pastes recent email threads (unread, filtered manually)
 → Claude: inbox-classification (Zod validated) → per-thread classification
 → for each classified thread:
    → match to applications by (student_id, company_normalized, role_normalized, job_url)
    → propose flip to Miura (confirm Y/N)
    → on Y: INSERT status_events (kind=classification, note, interview_time?)
    → if kind=interview: trigger suggestion to run /cruzar interview <application_id>
```

### Flow F — Interview invite

```
/cruzar interview <application_id>
 → Miura pastes interview email thread
 → Claude: extract { company, role, time, link, notes }
 → draft interview-prep markdown via career-ops prompt (or reuse previously generated)
 → upload prep to R2 → INSERT status_events (kind=interview_invited, note=prep_url, interview_time)
 → draft Resend email (template + prep_url)
 → Miura approves draft → send via Resend
```

### Flow G — SQL escape

```
/cruzar sql "<query>" [--write]
 → read-only by default (query rejected if it contains non-SELECT keywords without --write)
 → on --write: print the query + planned row count, ask explicit "CONFIRM: <query>"
 → execute + print results
```

### Flow H — Counters sanity

```
/cruzar counters-sanity
 → run the ISR public-counter aggregate query
 → compare to a raw from-scratch aggregate
 → report deltas; if non-zero, surface the cause (typically ISR lag; rarely a real mismatch)
```

---

## Student web app internals

### Routing

- `/` — landing, ISR 30s counter, email CTA
- `/onboarding` — onboarding form (auth required)
- `/onboarding/thanks` — post-submit confirmation
- `/profile` — three shapes based on `readiness_verdict` (auth required)
- `/p/<slug>` — public profile (consent-gated)
- `/status` — per-student counters + timeline (auth required)
- `/api/auth/*` — Better Auth handlers
- `/api/onboarding` — server action for onboarding form submit
- `/api/counter` — internal endpoint read by the landing page (if not inlined into the page SSR)

### Server actions vs. API routes

Prefer server actions for form submissions that mutate user state (`/onboarding` submit). Use API routes only for third-party webhooks (none in MVP 0) and cross-origin needs (R2 presigned URL handoffs if required).

### Rate limits + caps

- Magic link: 5 requests/hour/email (Better Auth config + Upstash rate limiter backing it).
- Attestation upload: 10 MB max, MIME allowlist `{ image/png, image/jpeg, application/pdf }`.
- Public counter ISR: `revalidate: 30`.

### R2 CORS

Allowed origin: `https://cruzarapp.com`. Methods: `GET, PUT` (PUT for presigned upload of attestations). Configured during deploy.

---

## Operator playbook internals

### Skill structure (`.claude/skills/cruzar-*/SKILL.md`)

Every skill file contains:

- **Name** — e.g. `cruzar-intake`
- **When to use** — trigger phrases Miura types to invoke it
- **Inputs** — student id, subcommand, paste payloads
- **Procedure** — step-by-step for CC to execute (read scripts to invoke, DB tables to query, outputs to print)
- **Scripts invoked** — absolute paths (`apps/operator-scripts/intake/generate-batch.ts`, etc.)
- **Success criteria** — what the skill must verify before reporting done
- **Failure modes** — how to surface errors to Miura

Skills never mutate the DB directly. Every mutation happens through a script.

### Script conventions (`apps/operator-scripts/*.ts`)

- Written in TypeScript, run via `bun run apps/operator-scripts/<...>.ts`.
- Import shared DB client, R2 client, LLM wrapper from `apps/operator-scripts/_shared/`.
- Validate every input with Zod at the script boundary.
- Idempotent on the keys documented in §Idempotency keys.
- Exit code 0 = success. Non-zero = failure with a structured JSON error on stdout for CC to read.
- No hidden filesystem writes outside `.cruzar-runtime/` + logs.

### apps/career-ops contract

Binaries invoked via subprocess from `apps/operator-scripts/run-cohort.ts`:

- `bin/fill-forms.mjs --workspace <path>` — reads candidate from `<workspace>/profile.yml`, applications from `<workspace>/data/applications.md`, answers from `<workspace>/answers/`, CV from `<workspace>/cv.md`. Writes drafts + screenshots to `<workspace>/output/`.
- `bin/generate-pdf.mjs --in <md> --out <pdf>` — stateless CV renderer. Fonts loaded from `apps/career-ops/fonts/` (pinned) for determinism.

The package exports nothing as importable TypeScript — only binaries. `apps/operator-scripts/run-cohort.ts` shells out, reads stdout/stderr, writes to DB.

---

## WOZ + ethical boundaries

- Every application submission requires Miura's manual click. `fill-forms.mjs` never clicks any element whose text matches `/submit|send|apply now/i` beyond the initial listing-page "Apply" trigger. Enforced in code and in `apps/career-ops/CLAUDE.md`.
- Claim-vs-reality honesty: the public counter is a SQL aggregate over real rows. Every application counted is a real submission to a real company. Students are not told automation happened when a human pressed submit.
- Audit trail: every intake batch stores `raw_reply` verbatim; every application has a `career_ops_report_r2_key` pointing at the evaluation artifact; every status change creates a `status_events` row.

---

## Observability

- Sentry on `apps/web` and on every script (Node SDK). Structured errors with student_id + action context.
- Better Stack uptime pinging `/` and `/status` endpoints.
- Every script logs its invocation, inputs (IDs only, never PII), duration, outcome.
- No custom analytics in MVP 0.

---

## Environment

```
# .env.example (repo root)

# Database
DATABASE_URL=postgres://...@neon...

# Auth (Better Auth)
BETTER_AUTH_SECRET=                # 32+ bytes
BETTER_AUTH_URL=https://cruzarapp.com

# Email
RESEND_API_KEY=
RESEND_FROM=enrique@cruzarapp.com

# LLM
ANTHROPIC_API_KEY=

# Object storage
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=cruzar
R2_PUBLIC_URL=https://cdn.cruzarapp.com  # CNAME pointing at R2

# Observability
SENTRY_DSN=
SENTRY_ORG=
SENTRY_PROJECT=

# Operator allowlist (emails permitted to run operator skills — used by sql escape + internal health routes if any)
OPERATOR_EMAILS=miura@cruzarapp.com,enrique@cruzarapp.com

# Misc
NODE_ENV=development
```

---

## Deployment

- **apps/web** — Vercel project, connected to this repo. Builds `apps/web` on push to `main`. Preview deploys on PRs. Custom domain `cruzarapp.com` with Resend DKIM/SPF/DMARC configured on the DNS before first magic link sends.
- **Neon** — branch-per-deploy optional; MVP 0 uses a single `main` branch.
- **R2** — single bucket, CORS configured for `https://cruzarapp.com`, public CDN subdomain `cdn.cruzarapp.com`.
- **Operator laptop** — Miura clones the repo, `bun install`, runs `bun run apps/operator-scripts/<...>.ts` inside CC sessions. Playwright binary cached in `~/.cache/playwright`. No special setup beyond Node + Bun + the cloned repo.

---

## Testing

MVP 0 testing is thin by design. Production-grade floor is enforced via:

- `bun typecheck` in pre-commit (zero errors, zero `any`, zero non-`as const` casts).
- Biome lint pre-commit.
- Zod validation at every boundary (no test duplicates what validation enforces).
- Manual smoke test with 3+ real U0 students before launch.
- Idempotency tested manually: re-run `/cruzar run-cohort` for the same student and assert no duplicate applications.

Formal integration test suite is Phase 1 continuation.

---

## Security

- PII fields: `email`, `name`, `whatsapp`, `local_salary_usd`, `attestation_r2_key`. Never logged. Never in Sentry breadcrumbs.
- Operator emails allowlisted in `OPERATOR_EMAILS`; the sql escape hatch is available only when running scripts from the local machine with those emails in env.
- Magic link rate limited (5/hour/email).
- R2 objects are private by default; attestations are accessed only via time-limited presigned URLs server-side.
- Playwright runs headed on Miura's laptop, not in any server context.
- career-ops runtime dirs are gitignored. If retained for debugging, they live under `.cruzar-runtime/` on Miura's laptop only.

---

## Out-of-scope cross-references

Anything not listed above is not part of MVP 0. See [mvp-0.md §Out of scope](./mvp-0.md#out-of-scope-not-in-24h) and [msp.md](./msp.md) Phase 1 continuation for the deferred roadmap.
