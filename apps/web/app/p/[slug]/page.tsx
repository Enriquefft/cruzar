import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { CvDownload } from "@/components/cv-download";
import { db } from "@/db/client";
import { englishCerts, profiles, roleMatches, roles, students } from "@/db/schema";
import { renderMarkdown } from "@/lib/markdown";
import { publicUrl } from "@/lib/r2";

interface PublicProfilePageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicProfilePage({ params }: PublicProfilePageProps) {
  const { slug } = await params;

  const studentRows = await db
    .select()
    .from(students)
    .where(eq(students.public_slug, slug))
    .limit(1);

  const student = studentRows[0];
  if (!student || !student.consent_public_profile) {
    notFound();
  }

  const profileRows = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.student_id, student.id), eq(profiles.readiness_verdict, "ready")))
    .limit(1);

  const profile = profileRows[0];
  if (!profile) {
    notFound();
  }

  const [matchRows, certRows] = await Promise.all([
    db
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
      .limit(3),
    db
      .select({ level: englishCerts.level })
      .from(englishCerts)
      .where(and(eq(englishCerts.student_id, student.id), eq(englishCerts.verified, true)))
      .limit(1),
  ]);

  const cefrLevel = certRows[0]?.level ?? "B2";
  const profileMdHtml = renderMarkdown(profile.profile_md);
  const showcaseCvUrl = profile.showcase_cv_r2_key ? publicUrl(profile.showcase_cv_r2_key) : null;

  return (
    <main className="min-h-screen bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="mx-auto max-w-3xl px-6 py-16 md:px-10">
        <div className="space-y-10">
          <header className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
                CEFR {cefrLevel}
              </span>
            </div>
            <h1 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--brand-ink)] md:text-3xl">
              Perfil Cruzar
            </h1>
          </header>

          {matchRows.length > 0 && (
            <section aria-label="Roles compatibles" className="space-y-4">
              <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
                Top roles compatibles
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {matchRows.map((rm) => (
                  <div
                    key={rm.rank}
                    className="rounded-md border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-[color:var(--brand-ink)]">
                        {rm.title}
                      </h3>
                      <span className="shrink-0 font-mono text-[0.65rem] text-[color:var(--brand-ink-label)]">
                        #{rm.rank}
                      </span>
                    </div>
                    <p className="mt-1 font-mono text-xs tabular-nums text-[color:var(--brand-ink-soft)]">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(rm.compMinUsd)}{" "}
                      &ndash;{" "}
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      }).format(rm.compMaxUsd)}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--brand-ink-soft)]">
                      {rm.rationale}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          <article
            className="prose-cruzar max-w-none"
            // biome-ignore lint/security/noDangerouslySetInnerHtml: profile_md is operator-generated, never user-submitted
            dangerouslySetInnerHTML={{ __html: profileMdHtml }}
          />

          {showcaseCvUrl && (
            <div>
              <CvDownload downloadUrl={showcaseCvUrl} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
