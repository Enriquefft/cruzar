# Demo — Cruzar for Miura

**Date:** 2026-04-21
**Surface:** production — `https://cruzarapp.com`. Operator skills run from this laptop against the Neon DB Vercel uses (ADR-01).
**Duration:** ~30 min.

---

## Pre-flight

1. Seed fixtures.
   ```
   bun --env-file=.env apps/web/scripts/seed-demo-fixtures.ts --reset
   ```
   Seeds Fabián (`presentation_gap`) + María (`experience_gap`). Two non-Ready profiles sit below `COUNTER_MIN_PROFILES = 3`, so the landing band stays on `CohortStatus`. The throwaway lands Ready in Part C step 3 and the band flips live.

2. Open `https://cruzarapp.com` once, close — primes ISR.

3. Open:
   - **Incognito Chrome** (Miura-facing), zoom 125%.
   - **Terminal** at repo root, fresh CC session.
   - **One Greenhouse posting** in a second Chrome profile (Aprendly-adjacent role). Do not submit.

4. Paste buffers ready:
   - 4 synthetic intake replies (batch 2 deliberately low-confidence).
   - 3 Gmail threads for `scan-inbox` (Viewed / Rejected / Interview).
   - 1 interview-invite thread.

---

## Part A — Landing (2 min)

Open `https://cruzarapp.com` in incognito.

1. Hero + salary-delta headline.
2. `CohortStatus` band: *"Cohorte 02 · admisión abierta. Los números públicos se publican cuando la cohorte alcance masa crítica."*
   Beat: *"counter is off by design. Threshold = 3 Ready profiles. Crosses live during the operator loop. Real SQL aggregates, ISR 30 s. No hardcoded dial."*
3. Two non-Ready fixtures already in the DB (Fabián `presentation_gap`, María `experience_gap`). The throwaway signs up next — when it hits Ready, band flips to live counters.

---

## Part B — Student flow (10 min)

### 1. Google OAuth signup
- Click **Continue with Google** → pick `enriquefft2001@gmail.com` (personal Gmail, throwaway) → consent → `/onboarding`.
- Beat: *"zero friction. Better Auth handles the session. User + student row created atomically on first sign-in."*

### 2. `/onboarding` form
- Fields: name, WhatsApp, optional local salary (USD), English cert (kind + score), attestation upload, consent-public-profile toggle.
- Enter IELTS 4.0 → blocked with Spanish error. Beat: *"below B2 is blocked at the gate. English is a gate, not an assessment."*
- Switch to IELTS 6.0 → CEFR derives, B2 badge renders inline.
- Upload a 1–2 MB PDF. Network tab → presigned PUT → 200. Beat: *"presigned PUT direct to R2. App never touches the blob."*
- Submit → `/onboarding/thanks`.

### 3. `/profile` empty state
- Intake-in-progress copy. Beat: *"profile lights up after intake + assess."*

### 4. `/status` empty + `/p/<slug>` 404
- `/status` → honest empty copy.
- `/p/<slug>` → 404. Beat: *"public route renders only for Ready + consent=true. Part C produces one."*

---

## Part C — Operator flow (15 min)

Fresh CC session in the repo root. Student = throwaway from Part B.

### 0. `/cruzar students list --state pending_onboard`
- Read-only. Emits human-readable table on stderr: first name, masked email, slug, created date, `id`.
- Beat: *"Miura never has to `psql` or write SQL. `students list` is the picker, state-filtered (`pending_onboard | pending_intake | pending_assess | ready | gap`). Every `/cruzar` skill that needs `--student` also auto-lists candidates when the flag is missing — zero context switches."*
- Copy the throwaway's `id` for the next step.

### 1. `/cruzar onboard <student_id>`
- Validates CEFR mapping, surfaces attestation, asks to flip `verified = true`.
- Outputs paste-ready Spanish WhatsApp welcome. Copy → send on phone.

### 2. `/cruzar intake <id> --generate` → `--record` ×4 → `--finalize`
- `--generate`: CC authors 10 adaptive Spanish Qs **in-session** from prior answers. No external LLM API call — scripts only persist. Paste into WhatsApp.
- `--record`: paste each reply. CC parses into structured Q/A rows in-session. Low-confidence answer on batch 2 triggers clarification.
- Repeat 4 batches using prepared synthetic replies.
- `--finalize`: asserts 4 batches + ≥40 answers.
- Beat: *"Wizard-of-Oz over WhatsApp. Reasoning runs inside CC — no z.ai, no Anthropic API. Scripts are dumb persistence. Phase X swaps copy-paste for a webhook behind the same orchestrator (ADR-02)."*

### 3. `/cruzar assess <id>`
- CC-in-the-loop: single reasoning pass inside the session produces readiness verdict → **Ready** (synthetic intake built for it), role matches, `profile_md`, and showcase CV markdown. Script persists + renders PDF.
- Generates `profile_md`, `role_matches`, salary delta, `showcase_cv_r2_key`.
- Incognito tab → `/profile` → Ready shape: CEFR badge, role matches, salary delta, CV download. Click → PDF streams from R2.
- `/p/<slug>` → public profile renders.
- Hard refresh `https://cruzarapp.com/` (or wait 30 s) → 3rd Ready crosses threshold → band flips from `CohortStatus` to `CounterBand` with `3 · 0 · 0`. Beat: *"production threshold flipped because real data crossed the line."*

### 4. `/cruzar run-cohort --student <id> --job-url <gh-url> --company "<Company>" --role "<Role>"`
- CC generates `.cruzar-runtime/<id>/` from DB, shells out to `apps/career-ops/bin/fill-forms.mjs` **headed**.
- Playwright opens the Greenhouse posting. CC tailors `cv.md` **in-session** (no external LLM), script renders PDF, uploads to R2, attaches to form, auto-fills standard fields, **pauses at submit**.
- Beat: *"ethical gate. fill-forms never clicks submit. You review, you click. Inviolable (ADR-08)."*
- Do not submit. Close tab.
- Re-run same URL → idempotent skip. Beat: *"same (student, company, role, job_url) → no-op."*

### 5. `/cruzar scan-inbox` + `/cruzar interview`
- Paste 3 Gmail threads into `scan-inbox` → CC classifies, proposes application match, emits `status_events`. Refresh `/status` → timeline populates.
- Paste interview invite into `/cruzar interview <application_id>` → CC extracts company/role/time/link, generates prep markdown, drafts Resend email. Approve → sends → `status_events` row with `interview_time`.
- Beat: *"nothing sends without approval."*

---

## Close (~2 min)

One framing beat: *"we didn't build an admin UI. CC is the admin UI. Command surface is the product for operators (ADR-04). And there's no external LLM API in this flow — no z.ai, no Anthropic key. CC is the brain; scripts are the hands."*

**Not in this demo:** 3+ real Aprendly students end-to-end (M12 pending). Lever/Ashby/Workable adapters, WhatsApp Cloud API, in-product English assessment — Phase X behind the same command surface.

---

## Post-demo cleanup

- Delete throwaway:
  ```
  bun --env-file=.env apps/web/scripts/operator/sql.ts --write "DELETE FROM \"user\" WHERE id = '<throwaway-id>'"
  ```
  (Cascade handles downstream.)
- Capture Miura's questions in `product/cruzar/meetings/2026-04-21-demo-debrief.md`.
- Tick M12 partial progress in `roadmap.md`.
