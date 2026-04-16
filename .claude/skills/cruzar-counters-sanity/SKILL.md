---
name: cruzar-counters-sanity
description: Reconcile the public landing counter against the raw SQL aggregates. Weekly check. Surfaces ISR lag or real data mismatches before universities or pitch audiences notice.
---

# cruzar-counters-sanity

**Trigger:** `/cruzar counters-sanity` weekly or before any pitch/demo.

**Architecture:** [Flow H -- Counters sanity](../../../product/cruzar/architecture.md#flow-h--counters-sanity)

## Preconditions

- `.env` populated with `DATABASE_URL`.
- At least one student profiled (otherwise both counters are zero and trivially match).

## Inputs

- No flags. Fully automated comparison.

## Procedure

1. Run the script:
   ```bash
   bun run apps/operator-scripts/counters-sanity.ts
   ```
2. The script:
   a. Runs the ISR counter aggregate query (identical SQL as `apps/web/lib/counter.ts`).
   b. Runs an independent raw aggregate using different query structure for cross-validation.
   c. Compares the three counters (students_profiled, applications_sent, interviews_invited).
   d. Outputs a formatted comparison table to stderr.
   e. Reports deltas and potential causes.

## What the ISR query counts vs raw

- **ISR** `students_profiled`: `COUNT(*) FROM profiles`
- **Raw** `students_profiled`: `COUNT(DISTINCT student_id) FROM profiles WHERE readiness_verdict IS NOT NULL`
- **ISR** `applications_sent`: `COUNT(*) FROM applications WHERE status <> 'discarded'`
- **Raw** `applications_sent`: `COUNT(*) FROM applications WHERE status NOT IN ('discarded', 'skip')`
- **ISR** `interviews_invited`: `COUNT(*) FROM status_events WHERE kind = 'interview_invited'`
- **Raw** `interviews_invited`: `COUNT(DISTINCT id) FROM status_events WHERE kind = 'interview_invited'`

Known delta source: ISR counts `skip` status applications, raw excludes them. This is intentional to surface predicate drift.

## Success criteria

- Counter values agree or deltas explained by ISR cache lag (30s window).
- Miura sees a clean readout before demoing to anyone.

## Exit codes

- `0` -- success. JSON stdout includes all ISR values, raw values, deltas, and `all_match` boolean.
- `1` -- error (query failure, parse failure).

## Failure modes

- Structural mismatch (predicate drifted): investigate the delta cause. File an incident if the ISR query definition needs updating.
- Query failure: exits 1 with Postgres error.
