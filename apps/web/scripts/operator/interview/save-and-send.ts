// PII contract: this script validates + persists the CC-authored interview
// payload, uploads the prep markdown to R2, writes status_events, and
// optionally sends the student-facing email via Resend when --send is passed.
// stdout emits the final JSON envelope with IDs only — no email bodies, no
// student names. `@/lib/llm` is intentionally not imported; all reasoning
// happens in CC upstream.
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db/client";
import { applications, statusEvents, students } from "@/db/schema";
import { env } from "@/lib/env";
import { uploadFileToR2 } from "@/lib/r2";
import { parseFlags } from "../_shared/args";
import { logError } from "../_shared/logger";

const PROMPT_VERSION = "interview-extract-v1" as const;

const flagsSchema = z.object({
  application: z.string().min(1),
  send: z
    .preprocess((v) => {
      if (v === undefined) return false;
      if (typeof v === "boolean") return v;
      if (typeof v === "string") return v === "true" || v === "1";
      return v;
    }, z.boolean())
    .default(false),
});

const stdinSchema = z.object({
  extracted: z.object({
    company: z.string().min(1),
    role: z.string().min(1),
    time: z.string().optional(),
    link: z.string().optional(),
    notes: z.string().optional(),
  }),
  prep_markdown: z.string().min(50),
  email_subject: z.string().min(1),
  email_body: z.string().min(1),
});

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

  const stdinRaw = await readStdin();
  const trimmed = stdinRaw.trim();
  if (trimmed.length === 0) {
    logError("empty_stdin", "No JSON on stdin; pipe the interview payload");
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(trimmed);
  } catch (cause: unknown) {
    const message = cause instanceof Error ? cause.message : String(cause);
    logError("invalid_json", `stdin is not valid JSON: ${message}`);
  }

  const parsed = stdinSchema.safeParse(parsedJson);
  if (!parsed.success) {
    logError("invalid_payload", "stdin JSON failed schema validation", {
      issues: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`),
    });
  }
  const { extracted, prep_markdown, email_subject, email_body } = parsed.data;

  const appRows = await db
    .select({
      id: applications.id,
      student_id: applications.student_id,
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
    .select({ id: students.id, email: students.email })
    .from(students)
    .where(eq(students.id, app.student_id))
    .limit(1);
  const student = studentRows[0];
  if (!student) {
    logError("student_not_found", "No students row for application's student_id", {
      student_id: app.student_id,
    });
  }

  const prepR2Key = `interview-prep/${app.student_id}/${app.id}.md`;
  const tmpPath = `/tmp/cruzar-interview-prep-${app.id}.md`;
  const { writeFile, rm } = await import("node:fs/promises");
  await writeFile(tmpPath, prep_markdown, "utf-8");
  try {
    await uploadFileToR2(prepR2Key, tmpPath, "text/markdown", "public");
  } finally {
    await rm(tmpPath, { force: true }).catch(() => {});
  }

  let emailSent = false;
  if (flags.send) {
    const { Resend } = await import("resend");
    const resend = new Resend(env().RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: env().RESEND_FROM_EMAIL,
      to: student.email,
      subject: email_subject,
      text: email_body,
    });

    if (error) {
      logError("resend_failed", `Resend send failed: ${error.message}`, {
        application_id: app.id,
      });
    }
    emailSent = true;
  }

  await db.insert(statusEvents).values({
    student_id: app.student_id,
    application_id: app.id,
    kind: "interview_invited",
    note: `Interview prep uploaded to ${prepR2Key}`,
    interview_time: extracted.time ? new Date(extracted.time) : null,
  });

  await db
    .update(applications)
    .set({ status: "interview", updated_at: new Date() })
    .where(eq(applications.id, app.id));

  const payload = {
    success: true,
    application_id: app.id,
    student_id: app.student_id,
    prep_r2_key: prepR2Key,
    email_sent: emailSent,
    dry_run: !flags.send,
    prompt_version: PROMPT_VERSION,
  } as const;
  process.stdout.write(`${JSON.stringify(payload)}\n`);
  process.exit(0);
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
