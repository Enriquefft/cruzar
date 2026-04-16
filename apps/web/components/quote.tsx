import { QUOTE } from "@cruzar/brand/content";

export function Quote() {
  return (
    <section
      aria-label="Testimonio de cohorte"
      className="mx-auto max-w-3xl border-t border-[color:var(--brand-hairline)] py-10 md:py-12"
    >
      <blockquote className="flex flex-col gap-6">
        <p className="max-w-2xl text-pretty font-serif text-xl italic leading-snug text-[color:var(--brand-ink)] md:text-2xl">
          {QUOTE.es}
        </p>
        <footer className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--brand-ink-label)]">
          {QUOTE.attribution}
        </footer>
      </blockquote>
    </section>
  );
}
