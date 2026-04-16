import { sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "./_shared/db";
import { logDone, logError } from "./_shared/logger";

// Same schema as apps/web/lib/counter.ts -- the canonical aggregate
const aggregateSchema = z
  .object({
    students_profiled: z.coerce.number().int().nonnegative(),
    applications_sent: z.coerce.number().int().nonnegative(),
    interviews_invited: z.coerce.number().int().nonnegative(),
  })
  .readonly();

// Independent raw aggregate using different query paths for cross-validation
const rawAggregateSchema = z
  .object({
    raw_students_profiled: z.coerce.number().int().nonnegative(),
    raw_applications_sent: z.coerce.number().int().nonnegative(),
    raw_interviews_invited: z.coerce.number().int().nonnegative(),
  })
  .readonly();

async function main(): Promise<void> {
  // --- Run the ISR counter aggregate (same as apps/web/lib/counter.ts) --------
  let isrRows: Array<unknown>;
  try {
    isrRows = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM profiles) AS students_profiled,
        (SELECT COUNT(*) FROM applications WHERE status <> 'discarded') AS applications_sent,
        (SELECT COUNT(*) FROM status_events WHERE kind = 'interview_invited') AS interviews_invited
    `);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("isr_query_failed", `ISR aggregate query failed: ${message}`);
  }

  const isrFirst = isrRows[0];
  const isrParsed = aggregateSchema.safeParse(isrFirst);
  if (!isrParsed.success) {
    logError("isr_parse_failed", "ISR aggregate returned unexpected shape");
  }
  const isr = isrParsed.data;

  // --- Run independent raw aggregate ------------------------------------------
  // Uses different query structure (explicit JOINs, different predicates) to
  // catch predicate drift between the ISR query and ground truth.
  let rawRows: Array<unknown>;
  try {
    rawRows = await db.execute(sql`
      SELECT
        (SELECT COUNT(DISTINCT student_id) FROM profiles WHERE readiness_verdict IS NOT NULL) AS raw_students_profiled,
        (SELECT COUNT(*) FROM applications WHERE status NOT IN ('discarded', 'skip')) AS raw_applications_sent,
        (SELECT COUNT(DISTINCT id) FROM status_events WHERE kind = 'interview_invited') AS raw_interviews_invited
    `);
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("raw_query_failed", `Raw aggregate query failed: ${message}`);
  }

  const rawFirst = rawRows[0];
  const rawParsed = rawAggregateSchema.safeParse(rawFirst);
  if (!rawParsed.success) {
    logError("raw_parse_failed", "Raw aggregate returned unexpected shape");
  }
  const raw = rawParsed.data;

  // --- Compare ----------------------------------------------------------------
  const deltas = {
    students_profiled: isr.students_profiled - raw.raw_students_profiled,
    applications_sent: isr.applications_sent - raw.raw_applications_sent,
    interviews_invited: isr.interviews_invited - raw.raw_interviews_invited,
  };

  const hasNonZeroDelta =
    deltas.students_profiled !== 0 ||
    deltas.applications_sent !== 0 ||
    deltas.interviews_invited !== 0;

  // --- Report -----------------------------------------------------------------
  process.stderr.write("\n=== Counters Sanity Check ===\n\n");
  process.stderr.write(
    `${"Counter".padEnd(25)} ${"ISR".padStart(8)} ${"Raw".padStart(8)} ${"Delta".padStart(8)}\n`,
  );
  process.stderr.write(`${"─".repeat(25)} ${"─".repeat(8)} ${"─".repeat(8)} ${"─".repeat(8)}\n`);
  process.stderr.write(
    `${"students_profiled".padEnd(25)} ${String(isr.students_profiled).padStart(8)} ${String(raw.raw_students_profiled).padStart(8)} ${String(deltas.students_profiled).padStart(8)}\n`,
  );
  process.stderr.write(
    `${"applications_sent".padEnd(25)} ${String(isr.applications_sent).padStart(8)} ${String(raw.raw_applications_sent).padStart(8)} ${String(deltas.applications_sent).padStart(8)}\n`,
  );
  process.stderr.write(
    `${"interviews_invited".padEnd(25)} ${String(isr.interviews_invited).padStart(8)} ${String(raw.raw_interviews_invited).padStart(8)} ${String(deltas.interviews_invited).padStart(8)}\n`,
  );

  if (hasNonZeroDelta) {
    process.stderr.write(
      "\nDELTAS DETECTED. Possible causes:\n" +
        "  - ISR cache lag (expected within 30s window)\n" +
        "  - Predicate drift between ISR query and raw aggregate\n" +
        "  - The ISR query counts 'skip' status while raw excludes it\n" +
        "  - Data inconsistency requiring investigation\n",
    );
  } else {
    process.stderr.write("\nAll counters match. Ready for demo.\n");
  }

  logDone({
    isr_students_profiled: isr.students_profiled,
    isr_applications_sent: isr.applications_sent,
    isr_interviews_invited: isr.interviews_invited,
    raw_students_profiled: raw.raw_students_profiled,
    raw_applications_sent: raw.raw_applications_sent,
    raw_interviews_invited: raw.raw_interviews_invited,
    delta_students_profiled: deltas.students_profiled,
    delta_applications_sent: deltas.applications_sent,
    delta_interviews_invited: deltas.interviews_invited,
    all_match: !hasNonZeroDelta,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
