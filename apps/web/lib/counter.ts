import { sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";

// Canonical aggregate per ADR-05.
const aggregateSchema = z
  .object({
    students_profiled: z.coerce.number().int().nonnegative(),
    applications_sent: z.coerce.number().int().nonnegative(),
    interviews_invited: z.coerce.number().int().nonnegative(),
  })
  .readonly();

export interface PublicCounter {
  studentsProfiled: number;
  applicationsSent: number;
  interviewsInvited: number;
}

export class PublicCounterError extends Error {
  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "PublicCounterError";
    if (cause !== undefined) this.cause = cause;
  }
}

export async function getPublicCounter(): Promise<PublicCounter> {
  let rows: Array<unknown>;
  try {
    rows = await db.execute(sql`
      SELECT
        (SELECT COUNT(*) FROM profiles) AS students_profiled,
        (SELECT COUNT(*) FROM applications WHERE status <> 'discarded') AS applications_sent,
        (SELECT COUNT(*) FROM status_events WHERE kind = 'interview_invited') AS interviews_invited
    `);
  } catch (cause) {
    throw new PublicCounterError("Failed to execute public counter aggregate.", cause);
  }

  const [first] = rows;
  const parsed = aggregateSchema.safeParse(first);
  if (!parsed.success) {
    throw new PublicCounterError("Public counter aggregate returned unexpected shape.");
  }

  return {
    studentsProfiled: parsed.data.students_profiled,
    applicationsSent: parsed.data.applications_sent,
    interviewsInvited: parsed.data.interviews_invited,
  };
}
