interface StatusCounterCellProps {
  label: string;
  value: number;
}

function StatusCounterCell({ label, value }: StatusCounterCellProps) {
  const display = new Intl.NumberFormat("es-PE").format(value);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-[color:var(--brand-hairline)] bg-[color:var(--brand-card)] px-5 py-5">
      <dt className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
        {label}
      </dt>
      <dd className="font-serif text-3xl font-medium leading-none tracking-tight tabular-nums text-[color:var(--brand-ink)]">
        {display}
      </dd>
    </div>
  );
}

interface StatusCountersProps {
  applied: number;
  viewed: number;
  rejected: number;
  interviewInvited: number;
}

export function StatusCounters({ applied, viewed, rejected, interviewInvited }: StatusCountersProps) {
  const cells: ReadonlyArray<StatusCounterCellProps> = [
    { label: "Aplicaciones enviadas", value: applied },
    { label: "Vistas por empresas", value: viewed },
    { label: "Rechazadas", value: rejected },
    { label: "Invitaciones a entrevista", value: interviewInvited },
  ];

  return (
    <section aria-label="Resumen de estado de aplicaciones">
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {cells.map((cell) => (
          <StatusCounterCell key={cell.label} label={cell.label} value={cell.value} />
        ))}
      </dl>
    </section>
  );
}
