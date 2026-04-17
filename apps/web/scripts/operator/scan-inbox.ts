import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/client";
import { applications, statusEvents } from "@/db/schema";
import { llmJsonCompletion } from "@/lib/llm";
import { logDone, logError } from "./_shared/logger";
import {
  PROMPT_VERSION,
  inboxClassifyResultSchema,
  renderInboxClassifyPrompt,
  type InboxClassification,
} from "@/lib/prompts/inbox-classify";

const STATUS_MAP: Record<string, "viewed" | "rejected" | "interview_invited"> = {
  viewed: "viewed",
  rejected: "rejected",
  interview: "interview_invited",
} as const;

async function main(): Promise<void> {
  // --- Read threads from stdin ------------------------------------------------
  process.stderr.write("Paste email threads below (Ctrl+D when done):\n");
  const threads = await readStdin();
  if (threads.trim().length === 0) {
    logError("empty_input", "No email threads provided on stdin");
  }

  // --- Classify via LLM ------------------------------------------------------
  const messages = renderInboxClassifyPrompt({ threads });
  const result = await llmJsonCompletion({
    tier: "weak",
    messages,
    schema: inboxClassifyResultSchema,
    schemaName: "inbox-classify",
  });

  const { classifications } = result;
  process.stderr.write(`\nClassified ${classifications.length} thread(s).\n\n`);

  let flippedCount = 0;
  let skippedCount = 0;

  for (const classification of classifications) {
    const eventKind = STATUS_MAP[classification.classification];
    if (!eventKind) {
      process.stderr.write(
        `[${classification.thread_id}] classification="${classification.classification}" -> skipped (no status flip needed)\n`,
      );
      skippedCount++;
      continue;
    }

    // --- Try to match application --------------------------------------------
    const matchedApp = classification.application_match
      ? await findApplication(classification)
      : null;

    // Display proposal
    process.stderr.write(
      `\n[${classification.thread_id}] ${classification.classification} (confidence=${classification.confidence.toFixed(2)})\n`,
    );
    if (classification.application_match) {
      process.stderr.write(
        `  Company: ${classification.application_match.company}\n` +
          `  Role: ${classification.application_match.role}\n`,
      );
    }
    if (matchedApp) {
      process.stderr.write(`  Matched application: ${matchedApp.id}\n`);
    } else if (classification.application_match) {
      process.stderr.write(
        "  WARNING: No matching application found in DB. Status event will have no application_id.\n",
      );
    }
    if (classification.interview_time) {
      process.stderr.write(`  Interview time: ${classification.interview_time}\n`);
    }

    process.stderr.write(`  Proposed flip: ${eventKind}\n`);

    if (classification.confidence < 0.7) {
      process.stderr.write("  LOW CONFIDENCE (<0.7) -- review carefully.\n");
    }

    process.stderr.write("  Confirm? (Y/N): ");
    const answer = await readLine();

    if (answer.trim().toUpperCase() !== "Y") {
      process.stderr.write("  -> Skipped.\n");
      skippedCount++;
      continue;
    }

    // --- Write status_event ----------------------------------------------------
    const studentId = matchedApp?.student_id;
    if (!studentId) {
      process.stderr.write("  Cannot write status_event without a student_id. Skipping.\n");
      skippedCount++;
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

    // Update application status if we have a match
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

    process.stderr.write("  -> Status event written.\n");
    flippedCount++;

    // Suggest interview skill for interview classifications
    if (eventKind === "interview_invited" && matchedApp) {
      process.stderr.write(`  Suggestion: run /cruzar interview --application ${matchedApp.id}\n`);
    }
  }

  logDone({
    threads_classified: classifications.length,
    flipped: flippedCount,
    skipped: skippedCount,
    prompt_version: PROMPT_VERSION,
  });
}

interface MatchedApp {
  id: string;
  student_id: string;
}

async function findApplication(classification: InboxClassification): Promise<MatchedApp | null> {
  if (!classification.application_match) return null;

  const { company, role, job_url } = classification.application_match;
  const companyNormalized = company.toLowerCase().trim();
  const roleNormalized = role.toLowerCase().trim();

  // Try exact match on company + role (normalized via SQL lower)
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

  // Fallback: fuzzy match on company only
  const fuzzyRows = await db
    .select({
      id: applications.id,
      student_id: applications.student_id,
    })
    .from(applications)
    .where(eq(sql`lower(${applications.company_normalized})`, companyNormalized))
    .limit(3);

  if (fuzzyRows.length === 1 && fuzzyRows[0]) return fuzzyRows[0];

  if (fuzzyRows.length > 1) {
    process.stderr.write(`  Multiple matches for company "${company}". Listing top candidates:\n`);
    for (const row of fuzzyRows) {
      process.stderr.write(`    - application_id: ${row.id}\n`);
    }
  }

  return null;
}

function readStdin(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
    });
    process.stdin.on("end", () => {
      resolve(data);
    });
    process.stdin.resume();
  });
}

function readLine(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    const onData = (chunk: string) => {
      data += chunk;
      if (data.includes("\n")) {
        process.stdin.removeListener("data", onData);
        process.stdin.pause();
        resolve(data.split("\n")[0] ?? "");
      }
    };
    process.stdin.on("data", onData);
    process.stdin.resume();
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
