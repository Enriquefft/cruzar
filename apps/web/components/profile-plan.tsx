import { renderMarkdown } from "@/lib/markdown";

interface ProfilePlanProps {
  planMarkdown: string;
  nextAssessmentAt: Date | null;
  verdictLabel: string;
}

export function ProfilePlan({ planMarkdown, nextAssessmentAt, verdictLabel }: ProfilePlanProps) {
  const planHtml = renderMarkdown(planMarkdown);

  const formattedDate = nextAssessmentAt
    ? new Intl.DateTimeFormat("es-PE", {
        dateStyle: "long",
      }).format(nextAssessmentAt)
    : null;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-3 py-1">
          <span className="inline-block h-2 w-2 rounded-full bg-[color:var(--brand-ink-label)]" />
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
            {verdictLabel}
          </span>
        </div>
        <h1 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--brand-ink)] md:text-3xl">
          Tu plan de desarrollo
        </h1>
        <p className="text-sm text-[color:var(--brand-ink-soft)]">
          Identificamos las áreas en las que puedes mejorar para acceder a roles remotos
          internacionales. Sigue tu plan y agenda tu próxima evaluación.
        </p>
      </header>

      {formattedDate && (
        <div className="rounded-md border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-5 py-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
            Próxima evaluación
          </p>
          <p className="mt-1 font-serif text-lg font-medium text-[color:var(--brand-ink)]">
            {formattedDate}
          </p>
        </div>
      )}

      <article
        className="prose-cruzar max-w-none"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: profile_md is operator-generated, never user-submitted
        dangerouslySetInnerHTML={{ __html: planHtml }}
      />
    </div>
  );
}
