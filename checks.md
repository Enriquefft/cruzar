# Pre-demo manual checks

**Last updated:** 2026-04-17
**Surface:** **production — `https://cruzarapp.com`**. Operator scripts run locally against the same Neon DB Vercel uses.
**Use with:** [demo.md](./demo.md). Run these start-to-finish before Miura joins. Anything failing = demo risk; decide skip-vs-fix per item.

## Current state snapshot (what's already verified)

- `bun run typecheck` green; `bun run build` green locally. Vercel production READY on latest commit.
- `.env` has DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL, RESEND_*, AI_*, R2_* (public + private bucket split), OPERATOR_EMAILS. PostHog keys absent (no analytics/replay in demo). Sentry dead keys removed.
- R2: buckets exist, CORS matches (`r2-setup.ts` confirms).
- Drizzle migrations applied to Neon; seed catalog = 10 roles.
- **Demo fixtures seedable via `apps/web/scripts/seed-demo-fixtures.ts`:** Fabián (`presentation_gap`), María (`experience_gap`). Each gets `user` + `students` + `english_certs` + 4 `intake_batches` (10 Qs each) + 40 `intake_batch_answers` + `profiles`. Emails are `enrique+demo-*@cruzarapp.com` so magic links land in the operator Gmail. `--reset` flag supported.
- **NOT seeded (by design):** Ready fixture, `role_matches`, `applications`, `status_events`, `generated_cvs`, `fill_form_drafts`. Ready is produced live in Part B step 5.

---

## P0 — blockers (do first, 25 min)

### 1. Seed + reset fixtures
- `bun --env-file=.env apps/web/scripts/seed-demo-fixtures.ts --reset`.
- Expect `Seeded 2 demo fixtures…  demo-presentation: created  demo-experience: created  Done in <N>s.` Re-runs without `--reset` should say `exists` for both.

### 2. Landing renders correct band
- `https://cruzarapp.com` → refresh once. With seed = 2 fixtures (< `COUNTER_MIN_PROFILES = 3`), landing renders the **`CohortStatus` fallback**: *"Cohorte 02 · admisión abierta. Los números públicos se publican cuando la cohorte alcance masa crítica."* This is correct production behaviour — counter only lights at masa crítica.
- Counter flips to `CounterBand` mid-demo after Part B step 5 produces the 3rd Ready profile (30 s ISR revalidate).
- `bun --env-file=.env apps/web/scripts/operator/counters-sanity.ts` → prints raw aggregates (`students_profiled = 2`, `applications_sent = 0`, `interviews_invited = 0`), zero drift vs. SQL.
- If `CounterBand` renders at pre-flight with only the 2 seeded fixtures, something is wrong — threshold bypassed or stale fixture rows leaked. Fix before demo.

### 3. Capture fixture sessions (pre-flight)
- Persistent browser window 1: go to `https://cruzarapp.com`, submit `enrique+demo-presentation@cruzarapp.com`, click the Resend link from Gmail, land on `/onboarding` or `/profile`. Keep this window open all demo long.
- Persistent browser window 2 (separate browser profile): same flow with `enrique+demo-experience@cruzarapp.com`. Sessions must not collide with window 1.
- Incognito window 3: stays logged out. This is the Miura-facing tab for Part A signup narration.

### 4. Fixture profiles render
- Window 1 (Fabián) → `/profile`: CEFR C1 badge, plan markdown with 3 actions, `next_assessment_at` ~7 days from today.
- Window 2 (María) → `/profile`: CEFR B2, milestones list, no date (by design).
- Window 1 → `/status`: auth-gated, renders empty state (Fabián has 0 applications).

### 5. `/p/<slug>` 404 behaviour
- `https://cruzarapp.com/p/fabian-alvarez` → **404** (consent=false).
- `https://cruzarapp.com/p/maria-garcia` → **404**.
- If either 200s, a seeded consent flipped by accident — fix before demo.

### 6. Magic-link delivery on a throwaway email
- Incognito window 3: submit a non-aliased real Gmail you don't mind using once.
- Resend email lands in **Primary** in < 30 s. Click → `/onboarding`. This also serves as the throwaway student you'll use in Part B.

### 7. R2 upload end-to-end
- On `/onboarding`: fill all fields, upload a 1–2 MB PDF.
- Network tab: presigned PUT returns **200**. Drizzle Studio shows new `english_certs` row with `attestation_r2_key`.
- Try a 15 MB file → blocked at 10 MB cap with clear Spanish error.

### 8. Run-cohort dry-run (Playwright on real Greenhouse posting)
- `bun --env-file=.env apps/web/scripts/operator/run-cohort.ts --student <throwaway-id> --job-url <gh-url>` **after** the throwaway has been advanced to Ready via live assess (step 6 in demo.md).
- Playwright opens **headed**. CV tailoring runs. PDF uploads to R2. Form fills. **Pauses at submit.**
- **Critical:** if it auto-clicks submit without pausing, stop demo — ethical-gate violation, blocks everything.
- Close the Playwright window without clicking submit. Confirm `fill_form_drafts` row created in Studio.

---

## P1 — high-impact (20 min)

### 9. Operator skill smoke (no DB mutations)
- Fresh CC session in repo root. Run each skill with no args or `--help`:
  - `/cruzar onboard`, `/cruzar intake --generate`, `/cruzar intake --record`, `/cruzar intake --finalize`, `/cruzar assess`, `/cruzar run-cohort`, `/cruzar scan-inbox`, `/cruzar interview`, `/cruzar sql`, `/cruzar counters-sanity`.
- Each returns a Zod validation error with a **structured JSON payload** listing missing flags. No crashes.

### 10. `cruzar-sql` write-gate
- `/cruzar sql "SELECT 1"` → runs.
- `/cruzar sql --write "UPDATE students SET name='X' WHERE id='nonexistent'"` → asks for typed confirmation. Do not confirm.

### 11. `/status` and counter logic
- Window 1 (Fabián) → `/status` → empty state renders.
- `https://cruzarapp.com/` with 2 seeded fixtures → `CohortStatus` fallback (threshold `COUNTER_MIN_PROFILES = 3` not met). Raw aggregate via `counters-sanity` = `profiled 2 / applications 0 / interviews 0`, zero drift.
- After Part B step 5 lands the throwaway as Ready (3rd profile), landing flips to `CounterBand` on next ISR revalidate (30 s). Post-demo cleanup deletes the throwaway → back to fallback. Both transitions are production-correct, not demo scaffolding.

### 12. Browser console hygiene
- Walk `/`, `/onboarding`, `/onboarding/thanks`, `/profile`, `/status`, `/p/<slug>` across the three windows — zero console errors, zero 500s, zero failed presigned PUT/GETs.

---

## P2 — polish (10 min)

### 13. Mobile 375 px
- Devtools → iPhone SE on all six routes. Hero on `/` doesn't overflow; form inputs reachable; status table readable.

### 14. Magic-link rate limit
- Submit the same throwaway email 6 times in < 1 h. 6th request rejected with rate-limit copy.

### 15. Demo rehearsal
- Walk Part A + Part B once solo with a stopwatch. Tighten any beat > 5 s pause.
- Confirm font sizes are projector-readable on the display you'll use.

---

## Skipped on purpose (out of MVP 0 scope)

- PostHog `$pageview` / session replay — env keys absent.
- OG image runtime for `/p/<slug>` — static OG tags only (Phase X).
- i18n, a11y sweep beyond keyboard nav, broader integration tests.
- In-product voice/English assessment (Phase X).

---

## Post-check cleanup

- Delete the throwaway student's rows so the landing counter reflects only intended state:
  ```
  bun --env-file=.env apps/web/scripts/operator/sql.ts --write "DELETE FROM \"user\" WHERE id = '<throwaway-id>'"
  ```
- Drizzle Studio tab stays open during demo — doubles as the "look behind the curtain" surface if Miura asks where a specific row lives.
- Keep the two fixture-session browser windows logged in for the duration of the demo. Don't close them between pre-flight and the meeting.
