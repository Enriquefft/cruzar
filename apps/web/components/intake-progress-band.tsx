import type { IntakeProgress } from "@/lib/intake-progress";

interface IntakeProgressBandProps {
  progress: IntakeProgress;
}

interface BandCopy {
  pill: string;
  pillTone: "pulse" | "steady";
  headline: string;
  body: string;
}

function copyFor(progress: IntakeProgress): BandCopy {
  if (progress.kind === "in_progress" && progress.batchesWithReply > 0) {
    const next = Math.min(progress.batchesWithReply + 1, progress.total);
    return {
      pill: `Ronda ${next} de ${progress.total}`,
      pillTone: "pulse",
      headline: `Llevamos ${progress.batchesWithReply} de ${progress.total} rondas.`,
      body: "La siguiente tanda de preguntas llega por WhatsApp cuando Miura la envíe. Responde en tu tiempo; no hay prisa.",
    };
  }

  if (progress.kind === "awaiting_assessment") {
    return {
      pill: "En análisis",
      pillTone: "pulse",
      headline: "Intake completo.",
      body: "Estamos generando tu diagnóstico. Aparece aquí en menos de 24 horas.",
    };
  }

  return {
    pill: "En proceso",
    pillTone: "pulse",
    headline: "Tu intake empieza pronto.",
    body: "Miura te escribirá por WhatsApp dentro de las próximas 24 horas. Mantén el número activo.",
  };
}

export function IntakeProgressBand({ progress }: IntakeProgressBandProps) {
  const copy = copyFor(progress);
  const dotClass =
    copy.pillTone === "pulse"
      ? "inline-block h-2 w-2 animate-pulse rounded-full bg-[color:var(--brand-ink-label)]"
      : "inline-block h-2 w-2 rounded-full bg-[color:var(--brand-ink-label)]";

  return (
    <div className="space-y-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-3 py-1">
        <span className={dotClass} />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
          {copy.pill}
        </span>
      </div>
      <h1 className="font-serif text-2xl font-semibold tracking-tight text-[color:var(--brand-ink)] md:text-3xl">
        {copy.headline}
      </h1>
      <p className="max-w-prose text-sm leading-relaxed text-[color:var(--brand-ink-soft)]">
        {copy.body}
      </p>
    </div>
  );
}
