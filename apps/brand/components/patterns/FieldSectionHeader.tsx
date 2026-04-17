/**
 * FieldSectionHeader — operator-grade equivalent of the editorial rail.
 *
 * `§<NN>` glyph in mono, hairline, uppercase mono label, optional status
 * dot on the right. Field surfaces (operator dashboards, CV section
 * dividers) avoid the editorial ACCENT and instead use SIGNAL surgically
 * (B.3) — only when `status` is set.
 *
 * Status semantics (mirrors the field-report direction page):
 *   - `active`  : SIGNAL dot, "ACTIVE" affordance
 *   - `nominal` : INK_SOFT dot, "NOMINAL" affordance
 *   - `alert`   : SIGNAL dot, "ALERT" affordance
 */

import { cn } from "@/lib/utils";

type Status = "active" | "nominal" | "alert";

type Props = {
  /** Section number — usually a 2-digit zero-padded string ("01", "02"). */
  no: string;
  /** Uppercase mono label. */
  label: string;
  /** Optional operator status indicator. */
  status?: Status;
  className?: string;
};

const STATUS_COPY: Record<Status, string> = {
  active: "ACTIVE",
  nominal: "NOMINAL",
  alert: "ALERT",
};

const STATUS_DOT: Record<Status, string> = {
  active: "var(--brand-signal)",
  nominal: "var(--cruzar-ink-soft)",
  alert: "var(--brand-signal)",
};

export function FieldSectionHeader({ no, label, status, className }: Props) {
  return (
    <div
      data-pattern="field-section-header"
      data-status={status}
      className={cn(
        "flex items-baseline justify-between gap-4 font-mono text-[0.7rem] font-medium uppercase tracking-[0.18em] text-brand-ink-label tabular-nums",
        className,
      )}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-foreground">§{no}</span>
        <span aria-hidden className="h-px w-6 bg-brand-hairline" />
        <span className="text-foreground">{label}</span>
      </div>
      {status ? (
        <div className="flex items-center gap-2">
          <span
            aria-hidden
            className="inline-block size-1.5 rounded-full"
            style={{ background: STATUS_DOT[status] }}
          />
          <span style={{ color: status === "alert" ? "var(--brand-signal)" : undefined }}>
            {STATUS_COPY[status]}
          </span>
        </div>
      ) : null}
    </div>
  );
}

export type { Props as FieldSectionHeaderProps };
