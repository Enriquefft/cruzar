import type { StatusEventKind } from "@/schemas/_shared";

interface TimelineApplication {
  company_name: string;
  role_normalized: string;
}

interface TimelineEvent {
  id: string;
  kind: StatusEventKind;
  note: string | null;
  interview_time: Date | null;
  created_at: Date;
  application?: TimelineApplication | undefined;
}

interface StatusTimelineProps {
  events: ReadonlyArray<TimelineEvent>;
}

const KIND_LABELS: Record<StatusEventKind, string> = {
  evaluated: "Evaluada",
  applied: "Aplicada",
  responded: "Respondida",
  interview: "Entrevista",
  offer: "Oferta",
  rejected: "Rechazada",
  discarded: "Descartada",
  skip: "Omitida",
  viewed: "Vista",
  interview_invited: "Entrevista agendada",
};

const KIND_COLORS: Record<StatusEventKind, string> = {
  applied: "bg-blue-100 text-blue-800",
  viewed: "bg-gray-100 text-gray-700",
  rejected: "bg-red-100 text-red-800",
  interview_invited: "bg-green-100 text-green-800",
  interview: "bg-green-100 text-green-800",
  offer: "bg-emerald-100 text-emerald-800",
  evaluated: "bg-amber-100 text-amber-800",
  responded: "bg-sky-100 text-sky-800",
  discarded: "bg-gray-100 text-gray-600",
  skip: "bg-gray-100 text-gray-600",
};

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

  if (diffDays > 7) {
    return new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  }
  if (diffDays >= 1) {
    return rtf.format(-diffDays, "day");
  }
  if (diffHours >= 1) {
    return rtf.format(-diffHours, "hour");
  }
  if (diffMinutes >= 1) {
    return rtf.format(-diffMinutes, "minute");
  }
  return "ahora mismo";
}

function formatInterviewTime(date: Date): string {
  return new Intl.DateTimeFormat("es", {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

export function StatusTimeline({ events }: StatusTimelineProps) {
  if (events.length === 0) {
    return null;
  }

  return (
    <section aria-label="Línea de tiempo de aplicaciones">
      <h2 className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
        Actividad reciente
      </h2>
      <ol className="mt-6 flex flex-col gap-0">
        {events.map((event, idx) => (
          <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            {idx < events.length - 1 && (
              <div
                aria-hidden="true"
                className="absolute top-5 left-[7px] h-[calc(100%-12px)] w-px bg-[color:var(--brand-hairline)]"
              />
            )}
            <div
              aria-hidden="true"
              className="relative mt-1.5 h-[15px] w-[15px] shrink-0 rounded-full border-2 border-[color:var(--brand-hairline-strong)] bg-[color:var(--brand-card)]"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-block rounded-full px-2.5 py-0.5 text-[0.65rem] font-medium leading-snug ${KIND_COLORS[event.kind]}`}
                >
                  {KIND_LABELS[event.kind]}
                </span>
                <time
                  dateTime={event.created_at.toISOString()}
                  className="text-[0.7rem] text-[color:var(--brand-ink-label)]"
                >
                  {formatRelativeTime(event.created_at)}
                </time>
              </div>
              {event.application && (
                <p className="text-sm leading-snug text-[color:var(--brand-ink)]">
                  {event.application.company_name}
                  <span className="text-[color:var(--brand-ink-label)]"> · </span>
                  <span className="text-[color:var(--brand-ink-soft)]">
                    {event.application.role_normalized}
                  </span>
                </p>
              )}
              {event.note && (
                <p className="text-sm leading-relaxed text-[color:var(--brand-ink-soft)]">
                  {event.note}
                </p>
              )}
              {event.interview_time && (
                <p className="text-sm text-[color:var(--brand-ink-soft)]">
                  <span className="font-medium text-[color:var(--brand-ink)]">Entrevista: </span>
                  {formatInterviewTime(event.interview_time)}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
