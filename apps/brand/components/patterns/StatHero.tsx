/**
 * StatHero — number-protagonist composition.
 *
 * The "12 placed" shape from the editorial direction (§ II): a huge display
 * figure on the left, the descriptive sentence on the right, optional
 * sub-stats arranged as a single hairline-divided row beneath.
 *
 * Brand rules enforced:
 *  - Tabular numerals on every digit (D.5.C.3).
 *  - Asymmetric grid (D.3) — never centered.
 *  - One hairline rule between primary and sub-stats; no colored stripes (D.4).
 *  - Editorial register uses Literata for both figure and caption; field
 *    register swaps to Geologica + mono for the figure.
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

type Register = "editorial" | "field";

type SubStat = {
  label: string;
  value: string;
};

type Props = {
  /** The protagonist figure. Strings are rendered verbatim (allows "+$2,840"). */
  value: string | number;
  /** Optional unit appended in muted ink (e.g. "/ mo", "×", "% of cohort"). */
  unit?: string;
  /** The descriptive sentence to the right of the figure. */
  caption: ReactNode;
  /** Optional supporting metrics rendered beneath the primary block. */
  subStats?: SubStat[];
  /** `editorial` (default) or `field`. */
  register?: Register;
  className?: string;
};

const REGISTER_FIGURE: Record<Register, string> = {
  editorial:
    "font-serif font-light tracking-[-0.03em] text-[clamp(6rem,18vw,14rem)] leading-[0.88]",
  field:
    "font-mono font-medium tracking-[-0.02em] text-[clamp(4rem,11vw,8rem)] leading-[0.92]",
};

const REGISTER_CAPTION: Record<Register, string> = {
  editorial:
    "font-serif text-[clamp(1.4rem,2.2vw,2rem)] font-normal leading-[1.18] tracking-[-0.012em]",
  field:
    "font-sans-dense text-[clamp(1.05rem,1.6vw,1.35rem)] font-medium leading-[1.3]",
};

export function StatHero({
  value,
  unit,
  caption,
  subStats,
  register = "editorial",
  className,
}: Props) {
  return (
    <section
      data-pattern="stat-hero"
      data-register={register}
      className={cn(
        "flex flex-col gap-8 tabular-nums",
        className,
      )}
    >
      {/* Asymmetric primary row: figure (left) + sentence (right). */}
      <div className="grid grid-cols-1 items-end gap-8 md:grid-cols-2 md:gap-16">
        <div className="text-foreground">
          <span className={REGISTER_FIGURE[register]}>{value}</span>
          {unit ? (
            <span className="ml-2 text-[0.42em] font-light text-brand-ink-label">
              {unit}
            </span>
          ) : null}
        </div>
        <div className={cn("max-w-[34ch] text-foreground", REGISTER_CAPTION[register])}>
          {caption}
        </div>
      </div>

      {subStats && subStats.length > 0 ? (
        <>
          <Separator className="bg-brand-hairline" />
          <dl
            className={cn(
              "grid gap-x-6 gap-y-3 text-sm",
              subStats.length === 1 && "grid-cols-1",
              subStats.length === 2 && "grid-cols-2",
              subStats.length >= 3 && "grid-cols-2 md:grid-cols-3",
              register === "field" && "font-mono",
            )}
          >
            {subStats.map((s) => (
              <div key={s.label} className="flex flex-col gap-0.5">
                <dt
                  className={cn(
                    "text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-ink-label",
                    register === "editorial" ? "font-sans" : "font-mono",
                  )}
                >
                  {s.label}
                </dt>
                <dd
                  className={cn(
                    "text-foreground",
                    register === "editorial"
                      ? "font-serif text-2xl font-normal tracking-[-0.012em]"
                      : "font-mono text-lg font-medium",
                  )}
                >
                  {s.value}
                </dd>
              </div>
            ))}
          </dl>
        </>
      ) : null}
    </section>
  );
}

export type { Props as StatHeroProps };
