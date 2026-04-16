import type { PublicCounter } from "@/lib/counter";

interface CounterCellProps {
  label: string;
  value: number;
}

function CounterCell({ label, value }: CounterCellProps) {
  const display = new Intl.NumberFormat("es-PE").format(value);

  return (
    <div className="flex flex-col gap-3 border-t border-[color:var(--brand-hairline)] pt-6 first:border-t-0 first:pt-0 md:border-t-0 md:border-l md:pt-0 md:pl-8 md:first:border-l-0 md:first:pl-0">
      <dt className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
        {label}
      </dt>
      <dd className="font-serif text-5xl font-medium leading-none tracking-tight tabular-nums text-[color:var(--brand-ink)] md:text-6xl">
        {display}
      </dd>
    </div>
  );
}

interface CounterBandProps {
  counter: PublicCounter;
}

export function CounterBand({ counter }: CounterBandProps) {
  const cells: ReadonlyArray<CounterCellProps> = [
    {
      label: "Estudiantes con perfil",
      value: counter.studentsProfiled,
    },
    {
      label: "Aplicaciones enviadas",
      value: counter.applicationsSent,
    },
    {
      label: "Entrevistas conseguidas",
      value: counter.interviewsInvited,
    },
  ];

  return (
    <section
      aria-label="Indicadores en vivo de la cohorte"
      className="mx-auto max-w-3xl border-t border-[color:var(--brand-hairline)] py-10 md:py-14"
    >
      <dl className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-0">
        {cells.map((cell) => (
          <CounterCell key={cell.label} label={cell.label} value={cell.value} />
        ))}
      </dl>
    </section>
  );
}
