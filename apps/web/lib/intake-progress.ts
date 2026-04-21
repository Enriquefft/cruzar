import { and, eq, isNotNull, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { intakeBatches, intakes } from "@/db/schema";

export type IntakeProgress =
  | { kind: "not_started" }
  | { kind: "in_progress"; batchesWithReply: number; total: 4; lastReplyAt: Date | null }
  | { kind: "awaiting_assessment"; lastReplyAt: Date | null }
  | { kind: "no_intake" };

export async function getIntakeProgress(studentId: string): Promise<IntakeProgress> {
  const intakeRows = await db
    .select({ id: intakes.id, finalized_at: intakes.finalized_at })
    .from(intakes)
    .where(eq(intakes.student_id, studentId))
    .limit(1);

  const intake = intakeRows[0];
  if (!intake) {
    return { kind: "no_intake" };
  }

  const repliedRows = await db
    .select({
      count: sql<number>`count(*)::int`,
      lastReplyAt: sql<Date | null>`max(${intakeBatches.reply_at})`,
    })
    .from(intakeBatches)
    .where(and(eq(intakeBatches.intake_id, intake.id), isNotNull(intakeBatches.reply_at)));

  const repliedCount = repliedRows[0]?.count ?? 0;
  const lastReplyAt = repliedRows[0]?.lastReplyAt ?? null;

  if (intake.finalized_at) {
    return { kind: "awaiting_assessment", lastReplyAt };
  }

  if (repliedCount === 0) {
    return { kind: "not_started" };
  }

  return {
    kind: "in_progress",
    batchesWithReply: repliedCount,
    total: 4,
    lastReplyAt,
  };
}
