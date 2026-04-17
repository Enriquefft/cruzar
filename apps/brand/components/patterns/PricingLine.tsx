/**
 * PricingLine — single editorial sentence stating Cruzar's price.
 *
 * Brand voice forbids "from $X" / "starts at" — pricing is stated as a
 * range with the trigger condition. The numbers are tabular and bold;
 * the surrounding sentence is set in display serif. When `langPrimary`
 * is provided, both ES and EN sentences render stacked so a single
 * surface (landing top-fold, deck slide) reads bilingually without
 * picking sides.
 *
 * Mechanically composes the canonical sentence from PRICING in
 * `lib/content.ts` callers — the pattern doesn't fetch content; it
 * receives it as props so it remains pure.
 */

import { cn } from "@/lib/utils";

type Lang = "es" | "en";

type Props = {
  range: { min: number; max: number };
  currency: string;
  /** Trigger phrase (e.g. "on placement only", "sólo al firmar el contrato"). */
  trigger: string;
  /**
   * If set, BOTH languages are rendered in stacked sentences with the
   * specified language on top. If omitted, only the trigger language is
   * inferred from the trigger string and rendered.
   */
  langPrimary?: Lang;
  className?: string;
};

const SENTENCE: Record<
  Lang,
  (parts: { range: string; trigger: string; currency: string }) => string[]
> = {
  es: ({ range, trigger }) => ["Los estudiantes pagan ", range, `, ${trigger}.`],
  en: ({ range, trigger }) => ["Students pay ", range, `, ${trigger}.`],
};

function formatRange(range: Props["range"], currency: string) {
  return `${currency} ${range.min.toLocaleString("en-US")}–${range.max.toLocaleString("en-US")}`;
}

function Sentence({
  lang,
  range,
  trigger,
  currency,
  emphasis,
}: {
  lang: Lang;
  range: string;
  trigger: string;
  currency: string;
  emphasis: boolean;
}) {
  const [pre, _, post] = SENTENCE[lang]({ range, trigger, currency });
  return (
    <p
      lang={lang}
      className={cn(
        "m-0 max-w-[34ch] font-serif tracking-[-0.012em] tabular-nums",
        emphasis
          ? "text-[clamp(1.6rem,3vw,2.4rem)] font-normal leading-[1.22] text-foreground"
          : "text-[clamp(1.1rem,1.8vw,1.4rem)] font-normal italic leading-[1.3] text-brand-ink-soft",
      )}
    >
      {pre}
      <span className="font-semibold text-foreground not-italic">{range}</span>
      {post}
    </p>
  );
}

export function PricingLine({ range, currency, trigger, langPrimary, className }: Props) {
  const formatted = formatRange(range, currency);

  if (!langPrimary) {
    // Default: render the canonical English sentence on its own.
    return (
      <div data-pattern="pricing-line" className={cn("flex flex-col", className)}>
        <Sentence lang="en" range={formatted} trigger={trigger} currency={currency} emphasis />
      </div>
    );
  }

  const secondary: Lang = langPrimary === "es" ? "en" : "es";

  return (
    <div
      data-pattern="pricing-line"
      data-lang-primary={langPrimary}
      className={cn("flex flex-col gap-6", className)}
    >
      <Sentence
        lang={langPrimary}
        range={formatted}
        trigger={trigger}
        currency={currency}
        emphasis
      />
      <Sentence
        lang={secondary}
        range={formatted}
        trigger={trigger}
        currency={currency}
        emphasis={false}
      />
    </div>
  );
}

export type { Props as PricingLineProps };
