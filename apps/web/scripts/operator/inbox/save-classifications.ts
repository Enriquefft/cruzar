// PII contract: this script validates + persists inbox classifications
// authored by CC. stdout emits the final JSON envelope with IDs and counts
// only. `@/lib/llm` is intentionally not imported — reasoning happens in CC,
// this script only validates + persists.
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { applications, statusEvents } from "@/db/schema";
import {
  type InboxClassification,
  inboxClassifyResultSchema,
  PROMPT_VERSION,
} from "@/lib/prompts/inbox-classify";
import { logError } from "../_shared/logger";

const STATUS_MAP: Record<string, "viewed" | "rejected" | "interview_invited"> = {
  viewed: "viewed",
  rejected: "rejected",
  interview: "interview_invited",
} as const;

interface MatchedApp {
  id: string;
  student_id: string;
}

async function findApplication(classification: InboxClassification): Promise<MatchedApp | null> {
  if (!classification.application_match) return null;

  const { company, role, job_url } = classification.application_match;
  const companyNormalized = company.toLowerCase().trim();
  const roleNormalized = role.toLowerCase().trim();

  const rows = await db
    .select({
      id: applications.id,
      student_id: applications.student_id,
    })
    .from(applications)
    .where(
      and(
        eq(sql`lower(${applications.company_normalized})`, companyNormalized),
        eq(sql`lower(${applications.role_normalized})`, roleNormalized),
        ...(job_url ? [eq(applications.job_url, job_url)] : []),
      ),
    )
    .limit(1);

  if (rows[0]) return rows[0];

  const fuzzyRows = await db
    .select({
      id: applications.id,
      student_id: applications.student_id,
    })
    .from(applications)
    .where(eq(sql`lower(${applications.company_normalized})`, companyNormalized))
    .limit(3);

  if (fuzzyRows.length === 1 && fuzzyRows[0]) return fuzzyRows[0];

  return null;
}

async function readStdin(): Promise<string> {
  process.stdin.setEncoding("utf8");
  let data = "";
  for await (const chunk of process.stdin) {
    data += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }
  return data;
}

async function main(): Promise<void> {
  const stdinRaw = await readStdin();
  const trimmed = stdinRaw.trim();
  if (trimmed.length === 0) {
    logError("empty_stdin", "No JSON on stdin; pipe the classifications payload");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(trimmed);
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("invalid_json", `stdin is not valid JSON: ${message}`);
  }

  const parsed = inboxClassifyResultSchema.safeParse(parsedJson);
  if (!parsed.success) {
    logError("invalid_classifications", "stdin JSON failed schema validation", {
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }
  const { classifications } = parsed.data;

  let flippedCount = 0;
  let skippedCount = 0;
  const suggestions: string[] = [];
  const unmatched: string[] = [];

  for (const classification of classifications) {
    const eventKind = STATUS_MAP[classification.classification];
    if (!eventKind) {
      skippedCount++;
      continue;
    }

    const matchedApp = classification.application_match
      ? await findApplication(classification)
      : null;

    const studentId = matchedApp?.student_id;
    if (!studentId) {
      skippedCount++;
      unmatched.push(classification.thread_id);
      continue;
    }

    await db.insert(statusEvents).values({
      student_id: studentId,
      application_id: matchedApp?.id ?? null,
      kind: eventKind,
      note: `Inbox scan: ${classification.classification} from ${classification.application_match?.company ?? "unknown"}`,
      interview_time: classification.interview_time
        ? new Date(classification.interview_time)
        : null,
    });

    if (matchedApp && classification.classification === "interview") {
      await db
        .update(applications)
        .set({ status: "interview", updated_at: new Date() })
        .where(eq(applications.id, matchedApp.id));
    } else if (matchedApp && classification.classification === "rejected") {
      await db
        .update(applications)
        .set({ status: "rejected", updated_at: new Date() })
        .where(eq(applications.id, matchedApp.id));
    }

    flippedCount++;

    if (eventKind === "interview_invited" && matchedApp) {
      suggestions.push(matchedApp.id);
    }
  }

  const payload = {
    success: true,
    threads_classified: classifications.length,
    flipped: flippedCount,
    skipped: skippedCount,
    unmatched_thread_ids: unmatched,
    interview_application_ids: suggestions,
    prompt_version: PROMPT_VERSION,
  } as const;
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
