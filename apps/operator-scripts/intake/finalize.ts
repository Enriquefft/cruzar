import { and, asc, eq, isNull, sql } from "drizzle-orm";
import { z } from "zod";
import { parseFlags } from "../_shared/args";
import { db, intakeBatchAnswers, intakeBatches, intakes } from "../_shared/db";
import { logDone, logError } from "../_shared/logger";

const flagsSchema = z.object({
  student: z.string().min(1),
  force: z
    .preprocess((v) => {
      if (v === undefined) return false;
      if (typeof v === "boolean") return v;
      if (typeof v === "string") return v === "true" || v === "1";
      return v;
    }, z.boolean())
    .default(false),
});

const HARD_FLOOR = 8;
const FORCE_FLOOR = 5;
const WARN_BELOW = 10;

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  const intakeRows = await db
    .select({ id: intakes.id, finalized_at: intakes.finalized_at })
    .from(intakes)
    .where(eq(intakes.student_id, flags.student))
    .limit(1);
  const intakeRow = intakeRows[0];
  if (!intakeRow) {
    logError("intake_not_found", "No intakes row for student", { student_id: flags.student });
  }
  if (intakeRow.finalized_at !== null) {
    logError("already_finalized", "Intake is already finalized", {
      intake_id: intakeRow.id,
      student_id: flags.student,
    });
  }

  const batchRows = await db
    .select({
      id: intakeBatches.id,
      batch_num: intakeBatches.batch_num,
      raw_reply: intakeBatches.raw_reply,
    })
    .from(intakeBatches)
    .where(eq(intakeBatches.intake_id, intakeRow.id))
    .orderBy(asc(intakeBatches.batch_num));

  if (batchRows.length !== 4) {
    logError("incomplete_batches", "Expected exactly 4 intake_batches rows", {
      intake_id: intakeRow.id,
      count: batchRows.length,
    });
  }

  for (const b of batchRows) {
    if (b.raw_reply === null) {
      logError("unreplied_batch", "A batch has no raw_reply recorded", {
        intake_id: intakeRow.id,
        batch_id: b.id,
        batch_num: b.batch_num,
      });
    }
  }

  const counts = await db
    .select({
      batch_id: intakeBatchAnswers.batch_id,
      count: sql<number>`count(*)::int`,
    })
    .from(intakeBatchAnswers)
    .where(
      sql`${intakeBatchAnswers.batch_id} in (${sql.join(
        batchRows.map((b) => sql`${b.id}::uuid`),
        sql`, `,
      )})`,
    )
    .groupBy(intakeBatchAnswers.batch_id);

  const countByBatch = new Map<string, number>();
  for (const c of counts) countByBatch.set(c.batch_id, c.count);

  for (const b of batchRows) {
    const count = countByBatch.get(b.id) ?? 0;
    if (flags.force) {
      if (count < FORCE_FLOOR) {
        logError("critically_low_answer_count", "Batch has fewer answers than the force floor", {
          intake_id: intakeRow.id,
          batch_id: b.id,
          batch_num: b.batch_num,
          count,
          force_floor: FORCE_FLOOR,
        });
      }
    } else if (count < HARD_FLOOR) {
      logError("low_answer_count", "Batch has fewer answers than the hard floor", {
        intake_id: intakeRow.id,
        batch_id: b.id,
        batch_num: b.batch_num,
        count,
        hard_floor: HARD_FLOOR,
      });
    }
    if (count < WARN_BELOW) {
      const warnLine = JSON.stringify({
        level: "warn",
        event: "below_target_answer_count",
        intake_id: intakeRow.id,
        batch_id: b.id,
        batch_num: b.batch_num,
        count,
        warn_below: WARN_BELOW,
      });
      process.stderr.write(`${warnLine}\n`);
    }
  }

  const updated = await db
    .update(intakes)
    .set({ finalized_at: sql`now()` })
    .where(
      and(
        eq(intakes.id, intakeRow.id),
        eq(intakes.student_id, flags.student),
        isNull(intakes.finalized_at),
      ),
    )
    .returning({ id: intakes.id });

  if (updated.length === 0) {
    logError("concurrent_finalize", "Intake was finalized by another process.", {
      intake_id: intakeRow.id,
    });
  }

  const totalAnswers = Array.from(countByBatch.values()).reduce((a, b) => a + b, 0);

  logDone({
    intake_id: intakeRow.id,
    student_id: flags.student,
    batch_count: batchRows.length,
    total_answers: totalAnswers,
    forced: flags.force,
    next_step: `/cruzar assess ${flags.student}`,
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
