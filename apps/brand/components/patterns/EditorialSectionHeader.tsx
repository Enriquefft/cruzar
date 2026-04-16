/**
 * EditorialSectionHeader — `§ <num>` accent marker + hairline + uppercase eyebrow.
 *
 * Capa-1-locked rail used across every editorial surface (landing, deck,
 * brand-guidelines preview). The `§` glyph carries the lone editorial
 * accent permitted on most surfaces (B.3 — the wordmark + this marker
 * is the entire accent budget).
 *
 * The number is rendered verbatim — typically a Roman numeral
 * ("I", "II", "III") to match the editorial direction page.
 */

import { cn } from "@/lib/utils";

type Props = {
  /** Section number — usually a Roman numeral string. */
  no: string;
  /** Uppercase eyebrow label, written sentence-cased; transforms to upper. */
  label: string;
  lang?: "es" | "en";
  className?: string;
};

export function EditorialSectionHeader({ no, label, lang, className }: Props) {
  return (
    <div
      data-pattern="editorial-section-header"
      lang={lang}
      className={cn(
        "flex items-baseline gap-3 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-brand-ink-label tabular-nums",
        className,
      )}
    >
      <span style={{ color: "var(--brand-accent)" }}>§ {no}</span>
      <span aria-hidden className="h-px w-8 bg-brand-hairline" />
      <span>{label}</span>
    </div>
  );
}

export type { Props as EditorialSectionHeaderProps };
