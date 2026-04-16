import { and, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ProfilePlan } from "@/components/profile-plan";
import { ProfileReady } from "@/components/profile-ready";
import { db } from "@/db/client";
import { englishCerts, profiles, roleMatches, roles, students } from "@/db/schema";
import { auth } from "@/lib/auth";
import { env } from "@/lib/env";
import { renderMarkdown } from "@/lib/markdown";
import { publicUrl } from "@/lib/r2";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    redirect("/");
  }

  const studentId = session.user.id;

  const [studentRows, profileRows, certRows] = await Promise.all([
    db.select().from(students).where(eq(students.id, studentId)).limit(1),
    db.select().from(profiles).where(eq(profiles.student_id, studentId)).limit(1),
    db
      .select()
      .from(englishCerts)
      .where(and(eq(englishCerts.student_id, studentId), eq(englishCerts.verified, true)))
      .limit(1),
  ]);

  const student = studentRows[0];
  if (!student) {
    redirect("/onboarding");
  }

  const profile = profileRows[0];

  // No profile yet: intake in progress
  if (!profile) {
    return (
      <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-3 py-1">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-[color:var(--brand-ink-label)]" />
              <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
                En proceso
              </span>
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--brand-ink)] md:text-3xl">
              Tu intake esta en curso
            </h1>
            <p className="max-w-prose text-sm leading-relaxed text-[color:var(--brand-ink-soft)]">
              Miura te contactara pronto por WhatsApp para completar tu diagnostico. Cuando termine,
              tu perfil aparecera aqui.
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Ready verdict
  if (profile.readiness_verdict === "ready") {
    const matchRows = await db
      .select({
        rank: roleMatches.rank,
        rationale: roleMatches.rationale,
        title: roles.title,
        compMinUsd: roles.comp_min_usd,
        compMaxUsd: roles.comp_max_usd,
      })
      .from(roleMatches)
      .innerJoin(roles, eq(roleMatches.role_id, roles.id))
      .where(eq(roleMatches.profile_id, profile.id))
      .orderBy(roleMatches.rank)
      .limit(3);

    const cefrLevel = certRows[0]?.level ?? "B2";

    const showcaseCvUrl = profile.showcase_cv_r2_key
      ? publicUrl(profile.showcase_cv_r2_key)
      : null;

    const profileMdHtml = renderMarkdown(profile.profile_md);

    const studentPublicUrl =
      student.consent_public_profile
        ? `${env().BETTER_AUTH_URL}/p/${student.public_slug}`
        : null;

    return (
      <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
        <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
          <ProfileReady
            cefrLevel={cefrLevel}
            localSalaryUsd={student.local_salary_usd}
            roleMatches={matchRows.map((rm) => ({
              rank: rm.rank,
              title: rm.title,
              compMinUsd: rm.compMinUsd,
              compMaxUsd: rm.compMaxUsd,
              rationale: rm.rationale,
            }))}
            profileMdHtml={profileMdHtml}
            showcaseCvUrl={showcaseCvUrl}
            consentPublicProfile={student.consent_public_profile}
            publicUrl={studentPublicUrl}
          />
        </div>
      </main>
    );
  }

  // Presentation gap or experience gap
  const verdictLabel =
    profile.readiness_verdict === "presentation_gap"
      ? "Brecha de presentacion"
      : "Brecha de experiencia";

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto max-w-2xl px-6 py-16 md:px-10">
        <ProfilePlan
          planMarkdown={profile.plan_markdown}
          nextAssessmentAt={profile.next_assessment_at}
          verdictLabel={verdictLabel}
        />
      </div>
    </main>
  );
}
