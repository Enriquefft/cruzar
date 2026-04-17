import { eq } from "drizzle-orm";
import { z } from "zod";

import { parseFlags } from "./_shared/args";
import { db } from "@/db/client";
import { applications, statusEvents, students } from "@/db/schema";
import { llmJsonCompletion, type LlmMessage } from "@/lib/llm";
import { logDone, logError } from "./_shared/logger";
import { uploadFileToR2 } from "@/lib/r2";
import { env } from "@/lib/env";

const PROMPT_VERSION = "interview-extract-v1" as const;

const flagsSchema = z.object({
  application: z.string().min(1),
});

const interviewExtractSchema = z.object({
  company: z.string().min(1),
  role: z.string().min(1),
  time: z.string().optional(),
  link: z.string().optional(),
  notes: z.string().optional(),
});

const interviewPrepSchema = z.object({
  prep_markdown: z.string().min(50),
});

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  // --- Load application -------------------------------------------------------
  const appRows = await db
    .select({
      id: applications.id,
      student_id: applications.student_id,
      company_name: applications.company_name,
      role_normalized: applications.role_normalized,
      job_url: applications.job_url,
    })
    .from(applications)
    .where(eq(applications.id, flags.application))
    .limit(1);

  const app = appRows[0];
  if (!app) {
    logError("application_not_found", "No applications row for the given id", {
      application_id: flags.application,
    });
  }

  // --- Load student email (needed for Resend) ---------------------------------
  const studentRows = await db
    .select({ id: students.id, email: students.email, name: students.name })
    .from(students)
    .where(eq(students.id, app.student_id))
    .limit(1);

  const student = studentRows[0];
  if (!student) {
    logError("student_not_found", "No students row for application's student_id", {
      student_id: app.student_id,
    });
  }

  // --- Read interview email from stdin ----------------------------------------
  process.stderr.write("Paste the interview email thread below (Ctrl+D when done):\n");
  const emailThread = await readStdin();
  if (emailThread.trim().length === 0) {
    logError("empty_input", "No email thread provided on stdin");
  }

  // --- Extract interview details via LLM --------------------------------------
  const extractMessages: LlmMessage[] = [
    {
      role: "system",
      content: `You extract interview details from email threads. Output strict JSON:
{
  "company": "<company name>",
  "role": "<role title>",
  "time": "<ISO 8601 datetime or null>",
  "link": "<meeting link or null>",
  "notes": "<any additional relevant notes or null>"
}

Only include time if explicitly stated. Only include link if a URL is present.
PROMPT_VERSION: ${PROMPT_VERSION}`,
    },
    {
      role: "user",
      content: `## Interview email thread\n\n${emailThread}\n\nExtract the interview details. Output strict JSON.`,
    },
  ];

  const extracted = await llmJsonCompletion({
    tier: "weak",
    messages: extractMessages,
    schema: interviewExtractSchema,
    schemaName: "interview-extract",
  });

  process.stderr.write(
    `\nExtracted:\n  Company: ${extracted.company}\n  Role: ${extracted.role}\n` +
      `  Time: ${extracted.time ?? "not specified"}\n` +
      `  Link: ${extracted.link ?? "none"}\n` +
      `  Notes: ${extracted.notes ?? "none"}\n`,
  );

  // --- Generate interview prep markdown ----------------------------------------
  const prepMessages: LlmMessage[] = [
    {
      role: "system",
      content: `You are a career coach generating interview preparation materials. Given the company, role, and any context, produce a concise prep document in markdown format.

Include:
1. Company overview (2-3 sentences)
2. Role expectations based on available info
3. Common interview questions for this type of role (5-7 questions)
4. Suggested talking points tailored to the role
5. Questions the candidate should ask the interviewer (3-5)

Keep it actionable and concise. Output strict JSON:
{ "prep_markdown": "<full markdown string>" }`,
    },
    {
      role: "user",
      content: `Company: ${extracted.company}\nRole: ${extracted.role}\nJob URL: ${app.job_url}\n\nGenerate interview prep. Output strict JSON.`,
    },
  ];

  const prepResult = await llmJsonCompletion({
    tier: "strong",
    messages: prepMessages,
    schema: interviewPrepSchema,
    schemaName: "interview-prep",
  });

  // --- Upload prep to R2 ------------------------------------------------------
  const prepR2Key = `interview-prep/${app.student_id}/${app.id}.md`;
  const tmpPath = `/tmp/cruzar-interview-prep-${app.id}.md`;
  const { writeFile, rm } = await import("node:fs/promises");
  await writeFile(tmpPath, prepResult.prep_markdown, "utf-8");
  try {
    await uploadFileToR2(prepR2Key, tmpPath, "text/markdown", "public");
  } finally {
    await rm(tmpPath, { force: true }).catch(() => {});
  }

  // --- Draft email ------------------------------------------------------------
  const interviewTime = extracted.time
    ? new Date(extracted.time).toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      })
    : "TBD";

  const emailSubject = `Interview Prep: ${extracted.company} - ${extracted.role}`;
  const emailBody = [
    `Hi ${student.name},`,
    "",
    `Great news! You have an interview with ${extracted.company} for the ${extracted.role} position.`,
    "",
    `Interview time: ${interviewTime}`,
    extracted.link ? `Meeting link: ${extracted.link}` : "",
    "",
    "We've prepared a personalized interview prep document for you. Please review it before your interview.",
    "",
    "Key tips:",
    "- Research the company's recent news and culture",
    "- Prepare your STAR stories for behavioral questions",
    "- Test your setup 15 minutes before the call",
    "",
    "You've got this!",
    "",
    "Best,",
    "Cruzar Team",
  ]
    .filter(Boolean)
    .join("\n");

  // --- Show draft and await approval ------------------------------------------
  process.stderr.write(
    `\n--- Email draft ---\nTo: [student email]\nSubject: ${emailSubject}\n\n${emailBody}\n--- end draft ---\n`,
  );
  process.stderr.write("\nSend this email via Resend? (Y/N): ");

  const confirmation = await readLine();
  if (confirmation.trim().toUpperCase() !== "Y") {
    logError("aborted", "Miura declined to send the interview email", {
      application_id: app.id,
    });
  }

  // --- Send via Resend --------------------------------------------------------
  const { Resend } = await import("resend");
  const resend = new Resend(env().RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env().RESEND_FROM_EMAIL,
    to: student.email,
    subject: emailSubject,
    text: emailBody,
  });

  if (error) {
    logError("resend_failed", `Resend send failed: ${error.message}`, {
      application_id: app.id,
    });
  }

  // --- Write status_event -----------------------------------------------------
  await db.insert(statusEvents).values({
    student_id: app.student_id,
    application_id: app.id,
    kind: "interview_invited",
    note: `Interview prep uploaded to ${prepR2Key}`,
    interview_time: extracted.time ? new Date(extracted.time) : null,
  });

  // --- Update application status to interview ---------------------------------
  await db
    .update(applications)
    .set({ status: "interview", updated_at: new Date() })
    .where(eq(applications.id, app.id));

  logDone({
    application_id: app.id,
    student_id: app.student_id,
    company: extracted.company,
    role: extracted.role,
    prep_r2_key: prepR2Key,
    prompt_version: PROMPT_VERSION,
  });
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
