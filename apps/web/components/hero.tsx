export function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="mx-auto flex max-w-3xl flex-col gap-8 pt-20 pb-12 md:pt-32 md:pb-16"
    >
      <p className="text-xs font-mono uppercase tracking-[0.22em] text-[color:var(--brand-ink-label)]">
        <span className="text-[color:var(--brand-ink)]">
          Cruzar<span className="text-[color:var(--accent)]">.</span>
        </span>{" "}
        <span className="text-[color:var(--brand-hairline-strong)]">·</span> placement internacional
        remoto
      </p>

      <h1
        id="hero-heading"
        className="text-balance font-serif text-4xl font-medium leading-[1.08] tracking-tight text-[color:var(--brand-ink)] md:text-6xl"
      >
        Te preparamos para roles remotos que pagan{" "}
        <span className="whitespace-nowrap text-[color:var(--brand-ink-soft)]">4–8×</span> lo que
        pagan aquí.
      </h1>

      <p className="max-w-2xl text-pretty text-base leading-relaxed text-[color:var(--brand-ink-soft)] md:text-lg md:leading-8">
        Diagnóstico, validación en escenarios reales y postulación autónoma a empresas que contratan
        en USD. Cobramos solo cuando firmas oferta.
      </p>
    </section>
  );
}
