# ADR-05 — Public counter rendered via ISR with 30s revalidate

**Status:** Accepted
**Date:** 2026-04-15
**Owner:** Enrique

## Context

The landing page displays a live public counter: `N students profiled · M applications sent · K interview invites`. This is the product's pitch — it must load fast, render accurate values, and not stutter under traffic.

Rendering options:

1. **SSR on every request.** Fresh data every load. Cold-cache latency spikes on first request after a deploy or a traffic lull. Each page view hits Postgres.
2. **Static with client-side fetch.** Loads instantly from CDN but the counter appears after the page renders, hurting LCP and feeling cheap.
3. **ISR with revalidate.** Static from CDN, regenerated in the background every N seconds. Fresh enough, fast as static.
4. **Edge KV cache + SSR.** Maximal freshness + speed but adds KV infra for a single counter endpoint.

The counter is the only dynamic element on the landing page. LCP budget is <1.5s. The signal it sends (growing over time) tolerates 30s of staleness without hurting credibility.

## Decision

ISR with `export const revalidate = 30` on the counter endpoint (or Next 16's equivalent `revalidate` export on the page).

The counter is a single SQL aggregate:

```sql
SELECT
  (SELECT COUNT(*) FROM profiles) AS students_profiled,
  (SELECT COUNT(*) FROM applications WHERE status <> 'discarded') AS applications_sent,
  (SELECT COUNT(*) FROM status_events WHERE kind = 'interview_invited') AS interviews_invited
```

Values use the canonical lowercase enum (`applicationStatusValues` in `apps/web/schemas/_shared.ts`).

Generated server-side at 30s intervals, served from Vercel's edge cache.

## Alternatives considered

- **SSR every request.** Rejected per LCP risk and DB load at launch traffic spikes.
- **Static + client fetch.** Rejected per LCP + premium-feel.
- **Edge KV.** Rejected per infra overhead for one counter.

## Consequences

Positive:
- LCP hits the budget easily — the counter is baked into the static HTML at revalidation time.
- Zero Postgres load per request.
- Up to 30s of staleness is invisible to users.

Negative:
- The counter can display a stale value up to 30s. Acceptable — the magnitudes it reports move in minutes and hours, not seconds.
- Revalidation happens asynchronously; if a student profiles and refreshes the landing in under 30s to see the counter tick up, they may see the prior value. Acceptable.
- ISR revalidation fires on the first request after the window; a sudden burst can trigger one extra aggregate query per instance. Negligible at 5-user scale.

## Sunset criteria

Revisit when:

- Counter freshness becomes a product concern (e.g., live demo where the audience expects to see their own profile increment the counter in real time).
- Traffic scales to levels where ISR revalidation storms matter (not at MVP 0 scale).

On sunset, default migration is Vercel KV-backed cache with explicit write-through on every profile/application mutation.
