"use server";

import { headers } from "next/headers";
import { db } from "@/db/client";
import { englishCerts, students } from "@/db/schema";
import { auth } from "@/lib/auth";
import { mapCertToCefr, meetsB2 } from "@/lib/cefr-map";
import { assertAttestationExists, presignAttestationPut } from "@/lib/r2";
import { generatePublicSlug } from "@/lib/slug";
import {
  attestationUploadRequestSchema,
  onboardingInputSchema,
  type AttestationUploadRequest,
  type OnboardingInput,
} from "@/schemas/onboarding";

export interface RequestAttestationUploadResult {
  url: string;
  key: string;
}

export type SubmitOnboardingResult = { success: true } | { success: false; error: string };

async function requireSession(): Promise<{ userId: string; email: string }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    throw new Error("UNAUTHORIZED");
  }
  return { userId: session.user.id, email: session.user.email };
}

function coerceAttestationRequest(input: FormData | AttestationUploadRequest): unknown {
  if (input instanceof FormData) {
    const sizeRaw = input.get("sizeBytes");
    const sizeStr = typeof sizeRaw === "string" ? sizeRaw : "";
    return {
      filename: input.get("filename"),
      mimeType: input.get("mimeType"),
      sizeBytes: sizeStr === "" ? Number.NaN : Number(sizeStr),
    };
  }
  return input;
}

export async function requestAttestationUpload(
  input: FormData | AttestationUploadRequest,
): Promise<RequestAttestationUploadResult> {
  const parsed = attestationUploadRequestSchema.parse(coerceAttestationRequest(input));
  const { userId } = await requireSession();
  const presigned = await presignAttestationPut({
    studentId: userId,
    filename: parsed.filename,
    mimeType: parsed.mimeType,
    sizeBytes: parsed.sizeBytes,
  });
  return { url: presigned.url, key: presigned.key };
}

export async function submitOnboarding(input: OnboardingInput): Promise<SubmitOnboardingResult> {
  const parsed = onboardingInputSchema.parse(input);
  const { userId, email } = await requireSession();

  const level = mapCertToCefr(parsed.english_cert.kind, parsed.english_cert.score);
  if (level === null || !meetsB2(level)) {
    return {
      success: false,
      error:
        "Tu nivel de inglés está por debajo de B2. Los roles remotos requieren B2+. Completa una certificación B2+ y vuelve.",
    };
  }

  try {
    await assertAttestationExists(parsed.english_cert.attestation_r2_key);
  } catch (err) {
    console.error("onboarding.attestation_missing", {
      studentId: userId,
      name: err instanceof Error ? err.name : "UnknownError",
    });
    return {
      success: false,
      error: "No pudimos confirmar la subida de tu certificado. Intenta de nuevo.",
    };
  }

  const publicSlug = generatePublicSlug(parsed.name);

  try {
    await db.transaction(async (tx) => {
      await tx
        .insert(students)
        .values({
          id: userId,
          email,
          name: parsed.name,
          whatsapp: parsed.whatsapp,
          local_salary_usd: parsed.local_salary_usd,
          consent_public_profile: parsed.consent_public_profile,
          public_slug: publicSlug,
        })
        .onConflictDoUpdate({
          target: students.id,
          set: {
            name: parsed.name,
            whatsapp: parsed.whatsapp,
            local_salary_usd: parsed.local_salary_usd,
            consent_public_profile: parsed.consent_public_profile,
            public_slug: publicSlug,
          },
        });

      await tx.insert(englishCerts).values({
        student_id: userId,
        kind: parsed.english_cert.kind,
        score: parsed.english_cert.score,
        level,
        issued_at: new Date(parsed.english_cert.issued_at),
        attestation_r2_key: parsed.english_cert.attestation_r2_key,
        verified: false,
      });
    });
  } catch (err) {
    const code = typeof err === "object" && err !== null && "code" in err ? String(err.code) : null;
    console.error("onboarding.db_error", {
      studentId: userId,
      name: err instanceof Error ? err.name : "UnknownError",
      pgCode: code,
    });
    return {
      success: false,
      error: "Algo salió mal. Intenta de nuevo en un minuto.",
    };
  }

  return { success: true };
}
