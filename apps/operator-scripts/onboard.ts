import { eq } from "drizzle-orm";
import { z } from "zod";

import { parseFlags } from "./_shared/args";
import { db, students, englishCerts } from "./_shared/db";
import { logDone, logError } from "./_shared/logger";
import { assertAttestationExists } from "@/lib/r2";
import { mapCertToCefr, meetsB2, type CefrLevel } from "@/lib/cefr-map";

const flagsSchema = z.object({
  student: z.string().min(1),
});

async function main(): Promise<void> {
  const flags = parseFlags(flagsSchema);

  // --- Load student -----------------------------------------------------------
  const studentRows = await db
    .select({
      id: students.id,
      name: students.name,
      onboarded_at: students.onboarded_at,
    })
    .from(students)
    .where(eq(students.id, flags.student))
    .limit(1);

  const student = studentRows[0];
  if (!student) {
    logError("student_not_found", "No students row for the given id", {
      student_id: flags.student,
    });
  }

  if (student.onboarded_at !== null) {
    logError("already_onboarded", "Student is already onboarded", {
      student_id: student.id,
    });
  }

  // --- Load english cert ------------------------------------------------------
  const certRows = await db
    .select({
      id: englishCerts.id,
      kind: englishCerts.kind,
      score: englishCerts.score,
      level: englishCerts.level,
      attestation_r2_key: englishCerts.attestation_r2_key,
      verified: englishCerts.verified,
    })
    .from(englishCerts)
    .where(eq(englishCerts.student_id, student.id))
    .limit(1);

  const cert = certRows[0];
  if (!cert) {
    logError("missing_english_cert", "No english_certs row for student", {
      student_id: student.id,
    });
  }

  if (cert.verified) {
    logError("already_verified", "English cert is already verified", {
      student_id: student.id,
    });
  }

  // --- Verify attestation exists in R2 ----------------------------------------
  try {
    await assertAttestationExists(cert.attestation_r2_key);
  } catch {
    logError("attestation_missing", "Attestation file not found in R2. Cannot verify without attestation.", {
      student_id: student.id,
    });
  }

  // --- Verify CEFR mapping ----------------------------------------------------
  const derivedLevel = mapCertToCefr(cert.kind, cert.score);
  let verifiedLevel: CefrLevel;

  if (derivedLevel === null) {
    // Ambiguous mapping (aprendly, other, or parse failure)
    // Trust the level the student provided, but flag it
    process.stderr.write(
      `WARNING: Cannot auto-derive CEFR level from kind=${cert.kind} score=${cert.score}. Student claimed level=${cert.level}. Miura must confirm.\n`,
    );
    verifiedLevel = cert.level;
  } else if (derivedLevel !== cert.level) {
    process.stderr.write(
      `MISMATCH: Student claimed level=${cert.level} but score maps to ${derivedLevel}. Using derived level.\n`,
    );
    verifiedLevel = derivedLevel;
  } else {
    verifiedLevel = derivedLevel;
  }

  if (!meetsB2(verifiedLevel)) {
    logError("below_b2", "Student does not meet the B2 minimum requirement", {
      student_id: student.id,
      level: verifiedLevel,
    });
  }

  // --- Prompt for confirmation via stdin --------------------------------------
  process.stderr.write(
    `\nReady to onboard student ${student.id}:\n` +
      `  Cert: ${cert.kind} score=${cert.score} -> level=${verifiedLevel}\n` +
      `  Attestation: present in R2\n` +
      `\nType Y to confirm, N to abort: `,
  );

  const confirmation = await readLine();
  if (confirmation.trim().toUpperCase() !== "Y") {
    logError("aborted", "Miura declined onboarding confirmation", {
      student_id: student.id,
    });
  }

  // --- Flip verified + onboarded_at -------------------------------------------
  await db
    .update(englishCerts)
    .set({ verified: true, level: verifiedLevel })
    .where(eq(englishCerts.id, cert.id));

  await db
    .update(students)
    .set({ onboarded_at: new Date() })
    .where(eq(students.id, student.id));

  // --- Output WhatsApp welcome message ----------------------------------------
  const welcomeMessage = renderWelcomeMessage(student.name);
  process.stderr.write(`\n--- WhatsApp message (copy below) ---\n${welcomeMessage}\n--- end ---\n`);

  logDone({
    student_id: student.id,
    verified_level: verifiedLevel,
    action: "onboarded",
  });
}

function renderWelcomeMessage(studentName: string): string {
  return [
    `Hi ${studentName}! Welcome to Cruzar.`,
    "",
    "Your English certificate has been verified and your profile is now active.",
    "",
    "Next step: we'll start your intake process -- a series of 4 short question batches that help us understand your background, skills, and goals.",
    "",
    "I'll send you the first batch shortly. Take your time answering -- there are no wrong answers, and the more detail you provide, the better we can match you with the right opportunities.",
    "",
    "Questions? Just reply here.",
  ].join("\n");
}

function readLine(): Promise<string> {
  return new Promise((resolve) => {
    let data = "";
    process.stdin.setEncoding("utf-8");
    process.stdin.on("data", (chunk: string) => {
      data += chunk;
      if (data.includes("\n")) {
        process.stdin.pause();
        resolve(data.split("\n")[0] ?? "");
      }
    });
    process.stdin.resume();
  });
}

main().catch((cause: unknown) => {
  const message = cause instanceof Error ? cause.message : String(cause);
  logError("unhandled", message);
});
