/**
 * ProofLedger — multi-metric ledger with asymmetric hierarchy.
 *
 * Editorial direction § II uses a 1-lead + 3-small layout: the protagonist
 * metric occupies a wide cell on PAPER and renders in display, while the
 * supporting metrics share the remaining space in smaller display weight.
 * Hairline separators between cells; never colored stripes (D.4).
 *
 * Field register swaps display for `font-mono` and prefers SIGNAL on the
 * lead metric (B.3 — accent budget).
 */

import { cn } from "@/lib/utils";

type Register = "editorial" | "field";

type Metric = {
  label: string;
  value: string;
  unit?: string;
};

type Props = {
  /** The protagonist metric — twice the cell width of each support metric. */
  lead: Metric;
  /** 1–3 supporting metrics. Beyond 3 forces a re-think (B.3). */
  support: Metric[];
  /** `editorial` (default) or `field`. */
  register?: Register;
  className?: string;
};

const FIGURE_LEAD: Record<Register, string> = {
  editorial:
    "font-serif text-[clamp(3rem,5.2vw,4.6rem)] font-light tracking-[-0.022em] leading-none",
  field:
    "font-mono text-[clamp(2.4rem,4vw,3.4rem)] font-medium tracking-[-0.015em] leading-none",
};

const FIGURE_SUPPORT: Record<Register, string> = {
  editorial:
    "font-serif text-[clamp(1.7rem,2.6vw,2.3rem)] font-normal tracking-[-0.022em] leading-none",
  field:
    "font-mono text-[clamp(1.3rem,2vw,1.7rem)] font-medium tracking-[-0.015em] leading-none",
};

const LABEL_CLASS: Record<Register, string> = {
  editorial:
    "font-sans text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-foreground",
  field:
    "font-mono text-[0.72rem] font-medium uppercase tracking-[0.14em] text-foreground",
};

function MetricCell({
  metric,
  register,
  scale,
  isLast,
}: {
  metric: Metric;
  register: Register;
  scale: "lead" | "support";
  isLast: boolean;
}) {
  const isLead = scale === "lead";
  return (
    <div
      data-scale={scale}
      className={cn(
        "flex flex-col gap-3",
        isLead ? "p-8 bg-brand-paper" : "p-6 bg-transparent",
        !isLast && "border-r border-brand-hairline",
      )}
    >
      <div className="flex items-baseline gap-1 text-foreground tabular-nums">
        <span
          className={isLead ? FIGURE_LEAD[register] : FIGURE_SUPPORT[register]}
          // Field register tints the lead figure with SIGNAL (B.3).
          style={
            isLead && register === "field"
              ? { color: "var(--brand-signal)" }
              : undefined
          }
        >
          {metric.value}
        </span>
        {metric.unit ? (
          <span className="text-[0.5em] font-light text-brand-ink-label tabular-nums">
            {metric.unit}
          </span>
        ) : null}
      </div>
      <div className={LABEL_CLASS[register]}>{metric.label}</div>
    </div>
  );
}

export function ProofLedger({
  lead,
  support,
  register = "editorial",
  className,
}: Props) {
  const cellCount = 1 + support.length;
  const supportCols =
    support.length <= 1 ? "1fr" : support.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr";

  return (
    <section
      data-pattern="proof-ledger"
      data-register={register}
      className={cn(
        "border-y border-brand-hairline tabular-nums",
        className,
      )}
      style={{
        display: "grid",
        gridTemplateColumns: `2fr ${supportCols}`,
      }}
    >
      <MetricCell
        metric={lead}
        register={register}
        scale="lead"
        isLast={cellCount === 1}
      />
      {support.map((m, i) => (
        <MetricCell
          key={m.label}
          metric={m}
          register={register}
          scale="support"
          isLast={i === support.length - 1}
        />
      ))}
    </section>
  );
}

export type { Props as ProofLedgerProps };
