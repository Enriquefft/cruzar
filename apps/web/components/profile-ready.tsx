"use client";

import { useActionState } from "react";
import { togglePublicProfile } from "@/app/profile/actions";
import { CvDownload } from "@/components/cv-download";

interface RoleMatchDisplay {
  rank: number;
  title: string;
  compMinUsd: number;
  compMaxUsd: number;
  rationale: string;
}

interface ProfileReadyProps {
  cefrLevel: string;
  localSalaryUsd: number | null;
  roleMatches: ReadonlyArray<RoleMatchDisplay>;
  profileMdHtml: string;
  showcaseCvUrl: string | null;
  consentPublicProfile: boolean;
  publicUrl: string | null;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface ToggleState {
  consent: boolean;
  publicUrl: string | null;
  pending: boolean;
}

async function handleToggle(prev: ToggleState, _formData: FormData): Promise<ToggleState> {
  const newConsent = !prev.consent;
  const result = await togglePublicProfile(newConsent);
  if (result.success) {
    return {
      consent: newConsent,
      publicUrl: result.publicUrl ?? null,
      pending: false,
    };
  }
  return { ...prev, pending: false };
}

export function ProfileReady({
  cefrLevel,
  localSalaryUsd,
  roleMatches,
  profileMdHtml,
  showcaseCvUrl,
  consentPublicProfile,
  publicUrl: initialPublicUrl,
}: ProfileReadyProps) {
  const [shareState, formAction, isPending] = useActionState(handleToggle, {
    consent: consentPublicProfile,
    publicUrl: initialPublicUrl,
    pending: false,
  });

  const avgRoleComp =
    roleMatches.length > 0
      ? Math.round(
          roleMatches.reduce((sum, rm) => sum + (rm.compMinUsd + rm.compMaxUsd) / 2, 0) /
            roleMatches.length,
        )
      : null;

  const salaryDelta = localSalaryUsd && avgRoleComp ? avgRoleComp - localSalaryUsd : null;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-3 py-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
              Lista para postular
            </span>
          </div>
          <span className="inline-flex items-center rounded-full border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-3 py-1 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
            CEFR {cefrLevel}
          </span>
        </div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--brand-ink)] md:text-3xl">
          Tu perfil Cruzar
        </h1>
      </header>

      {salaryDelta !== null && salaryDelta > 0 && (
        <div className="rounded-md border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-5 py-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
            Delta salarial estimado
          </p>
          <p className="mt-1 font-serif text-3xl font-medium tabular-nums text-[color:var(--brand-ink)]">
            +{formatUsd(salaryDelta)}
            <span className="text-base text-[color:var(--brand-ink-soft)]">/mes</span>
          </p>
        </div>
      )}

      {roleMatches.length > 0 && (
        <section aria-label="Roles compatibles" className="space-y-4">
          <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
            Top roles compatibles
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {roleMatches.map((rm) => (
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
                  {formatUsd(rm.compMinUsd)} &ndash; {formatUsd(rm.compMaxUsd)}
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

      <div className="flex flex-wrap items-center gap-4">
        {showcaseCvUrl && <CvDownload downloadUrl={showcaseCvUrl} />}

        <form action={formAction}>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex min-h-[44px] items-center gap-3 rounded-md border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-5 py-3 text-sm font-medium text-[color:var(--brand-ink)] transition-colors hover:border-[color:var(--brand-hairline-strong)] hover:bg-[color:var(--brand-paper-deep)] disabled:opacity-50"
          >
            <span
              aria-hidden="true"
              className={`inline-block h-3 w-6 rounded-full transition-colors ${
                shareState.consent ? "bg-green-600" : "bg-[color:var(--brand-hairline-strong)]"
              }`}
            >
              <span
                className={`block h-3 w-3 rounded-full bg-white shadow transition-transform ${
                  shareState.consent ? "translate-x-3" : "translate-x-0"
                }`}
              />
            </span>
            {shareState.consent ? "Perfil publico activo" : "Activar perfil publico"}
          </button>
        </form>
      </div>

      {shareState.consent && shareState.publicUrl && (
        <p className="text-sm text-[color:var(--brand-ink-soft)]">
          Tu perfil publico:{" "}
          <a
            href={shareState.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            {shareState.publicUrl}
          </a>
        </p>
      )}
    </div>
  );
}
