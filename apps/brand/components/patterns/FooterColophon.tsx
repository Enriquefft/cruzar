/**
 * FooterColophon — wordmark + meaning + canonical metadata.
 *
 * Used at the bottom of every editorial surface and at the bottom of the
 * field-register CV. Renders:
 *   - Wordmark (display3) on the left.
 *   - "verb · español · to cross" meaning beneath it.
 *   - Canonical metadata strip on the right: cruzar.io · MMXXVI · register.
 *
 * Editorial register uses serif voice for the meaning; field register
 * swaps to mono.
 */

import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/content";
import { WordmarkHeading } from "./WordmarkHeading";

type Register = "editorial" | "field";

type Props = {
  register?: Register;
  className?: string;
};

const YEAR_ROMAN = "MMXXVI";

export function FooterColophon({ register = "editorial", className }: Props) {
  return (
    <footer
      data-pattern="footer-colophon"
      data-register={register}
      className={cn(
        "flex flex-col gap-6 border-t-2 border-brand-ink py-8 md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <WordmarkHeading as="div" size="display3" />
        <p
          className={cn(
            "m-0 max-w-[42ch] tabular-nums",
            register === "editorial"
              ? "font-serif text-sm italic text-brand-ink-soft"
              : "font-mono text-xs uppercase tracking-[0.14em] text-brand-ink-label",
          )}
        >
          {BRAND.meaning}
        </p>
      </div>
      <div className="flex flex-col gap-1 font-mono text-xs uppercase tracking-[0.14em] text-brand-ink-label tabular-nums md:items-end">
        <div>cruzar.io</div>
        <div>{YEAR_ROMAN}</div>
        <div>
          <span aria-hidden>· </span>
          {register === "editorial" ? "Editorial register" : "Field register"}
        </div>
      </div>
    </footer>
  );
}

export type { Props as FooterColophonProps };
