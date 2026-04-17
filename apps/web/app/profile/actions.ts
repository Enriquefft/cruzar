"use server";

import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { db } from "@/db/client";
import { students } from "@/db/schema";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";

export interface TogglePublicProfileResult {
  success: boolean;
  publicUrl?: string;
}

export async function togglePublicProfile(consent: boolean): Promise<TogglePublicProfileResult> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { success: false };
  }

  const studentId = session.user.id;

  await db
    .update(students)
    .set({ consent_public_profile: consent })
    .where(eq(students.id, studentId));

  if (consent) {
    const rows = await db
      .select({ public_slug: students.public_slug })
      .from(students)
      .where(eq(students.id, studentId))
      .limit(1);

    const slug = rows[0]?.public_slug;
    if (slug) {
      const publicUrl = `${env().BETTER_AUTH_URL}/p/${slug}`;
      return { success: true, publicUrl };
    }
  }

  return { success: true };
}
