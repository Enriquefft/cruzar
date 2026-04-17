/**
 * StudentQuote — magazine-style pull quote with attribution.
 *
 * Editorial register: Literata at large, hung-indent for the opening
 * smart-quote, attribution in `font-sans` small caps. Field register:
 * Geologica at moderate size with mono hairline brackets, ID-style
 * attribution.
 *
 * The text is wrapped in real `<blockquote>` + `<figcaption>` for
 * semantic correctness. The leading/trailing curly quotes are rendered
 * as decorative children (aria-hidden) so screen readers receive only
 * the quote text.
 */

import type { ReactNode } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type Register = "editorial" | "field";

type Props = {
  text: ReactNode;
  attribution: string;
  /** Affects only the lang attribute and quote glyph variant (en uses ASCII pair). */
  lang?: "es" | "en";
  /** `editorial` (default) or `field`. */
  register?: Register;
  className?: string;
};

const LANG_QUOTES: Record<NonNullable<Props["lang"]>, [string, string]> = {
  es: ["\u00AB", "\u00BB"],
  en: ["\u201C", "\u201D"],
};

export function StudentQuote({
  text,
  attribution,
  lang = "es",
  register = "editorial",
  className,
}: Props) {
  const [open, close] = LANG_QUOTES[lang];

  if (register === "field") {
    return (
      <figure
        data-pattern="student-quote"
        data-register="field"
        lang={lang}
        className={cn("flex flex-col gap-4 font-sans-dense tabular-nums", className)}
      >
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-ink-label"
          >
            [QUOTE
          </span>
          <blockquote className="m-0 max-w-[60ch] text-base leading-[1.55] text-foreground">
            {text}
          </blockquote>
          <span
            aria-hidden
            className="ml-auto font-mono text-xs font-medium uppercase tracking-[0.18em] text-brand-ink-label"
          >
            ]
          </span>
        </div>
        <Separator className="bg-brand-hairline" />
        <figcaption className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brand-ink-soft">
          {attribution}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure
      data-pattern="student-quote"
      data-register="editorial"
      lang={lang}
      className={cn(
        "grid grid-cols-1 items-start gap-8 md:grid-cols-[2fr_1fr] md:gap-16 tabular-nums",
        className,
      )}
    >
      <blockquote
        className="m-0 font-serif text-[clamp(1.7rem,3.4vw,2.9rem)] font-normal leading-[1.14] tracking-[-0.012em] text-foreground"
        style={{ textIndent: "-0.5em", paddingLeft: "0.5em" }}
      >
        <span aria-hidden className="text-brand-ink-label">
          {open}
        </span>
        {text}
        <span aria-hidden className="text-brand-ink-label">
          {close}
        </span>
      </blockquote>
      <div className="flex flex-col gap-4">
        <Separator className="max-w-[120px] bg-brand-hairline" />
        <figcaption className="font-sans text-[0.92rem] font-semibold uppercase tracking-[0.14em] text-foreground">
          {attribution}
        </figcaption>
      </div>
    </figure>
  );
}

export type { Props as StudentQuoteProps };
