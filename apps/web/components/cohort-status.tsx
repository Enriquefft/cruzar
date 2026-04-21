export function CohortStatus() {
  return (
    <section
      aria-label="Estado de la cohorte"
      className="mx-auto max-w-3xl border-t border-[color:var(--brand-hairline)] py-10 md:py-14"
    >
      <p className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
        Estado de la cohorte
      </p>
      <p className="mt-4 max-w-2xl text-pretty font-serif text-xl leading-snug text-[color:var(--brand-ink)] md:text-2xl">
        Cohorte 02 <span className="text-[color:var(--brand-ink-label)]">·</span> admisión abierta.
        Publicamos los números cuando la cohorte tenga suficientes perfiles activos.
      </p>
    </section>
  );
}
