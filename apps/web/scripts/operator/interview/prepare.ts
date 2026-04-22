// PII envelope exception: this script is the CC-in-the-loop prepare step for
// the interview invite flow. The stdout JSON echoes the raw pasted `thread`
// string plus the student's name/email so CC — running locally in the operator
// session — can extract the invite details and draft the student-facing email.
// This is an operator-local pipe to the caller agent, not a log aggregator.
// The PII contract from _shared/logger still applies to every OTHER operator
// script — do not copy this pattern elsewhere. `@/lib/llm` is intentionally
// not imported; reasoning happens in CC itself against the inlined prompts.
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { applications, students } from "@/db/schema";
import { parseFlags } from "../_shared/args";
import { logError } from "../_shared/logger";

const PROMPT_VERSION = "interview-extract-v1" as const;

const flagsSchema = z.object({
  application: z.string().min(1),
});

const extractSystem = `You extract interview details from email threads. Output strict JSON:
{
  "company": "<company name>",
  "role": "<role title>",
  "time": "<ISO 8601 datetime or null>",
  "link": "<meeting link or null>",
  "notes": "<any additional relevant notes or null>"
}

Only include time if explicitly stated. Only include link if a URL is present.
PROMPT_VERSION: ${PROMPT_VERSION}`;

const prepSystemTemplate = `You are a career coach generating interview preparation materials. Given the company, role, and any context, produce a concise prep document in markdown format.

Include:
1. Company overview (2-3 sentences)
2. Role expectations based on available info
3. Common interview questions for this type of role (5-7 questions)
4. Suggested talking points tailored to the role
5. Questions the candidate should ask the interviewer (3-5)

Keep it actionable and concise. Output as a single markdown string (no JSON wrapper; just the markdown).`;

async function readStdin(): Promise<string> {
  process.stdin.setEncoding("utf8");
  let data = "";
  for await (const chunk of process.stdin) {
    data += typeof chunk === "string" ? chunk : chunk.toString("utf8");
  }
  return data;
}

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

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

  const thread = await readStdin();
  if (thread.trim().length === 0) {
    logError("empty_input", "No email thread provided on stdin");
  }

  const extractUser = `## Interview email thread

${thread}

Extract the interview details. Output strict JSON matching the schema in the system prompt.`;

  const payload = {
    success: true,
    application_id: app.id,
    student_id: app.student_id,
    student_name: student.name,
    student_email: student.email,
    company_name: app.company_name,
    role: app.role_normalized,
    job_url: app.job_url,
    thread,
    extract_system_prompt: extractSystem,
    extract_user_prompt: extractUser,
    prep_system_prompt_template: prepSystemTemplate,
    output_schema_hint:
      "extract → {company: string, role: string, time?: string (ISO 8601), link?: string, notes?: string}. prep → single markdown string. email → {email_subject: string, email_body: string}.",
    prompt_version: PROMPT_VERSION,
  } as const;
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
