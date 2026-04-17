/**
 * CvHeaderBlock — top-of-CV block.
 *
 * Renders the locked masthead the field-register CV template depends on:
 *   1. Wordmark inline + "Verified by Cruzar" stamp on the same baseline.
 *   2. Candidate name (huge, Geologica) + role (mono).
 *   3. Locale (city · country) hung to the right.
 *
 * The candidate name is rendered in `font-sans-dense` (Geologica) per
 * the field register lock — Literata is reserved for editorial surfaces
 * and would mis-signal a "magazine person" rather than "operator".
 */

import { cn } from "@/lib/utils";
import { VerificationStamp } from "./VerificationStamp";
import { WordmarkHeading } from "./WordmarkHeading";

type Props = {
  name: string;
  jobTitle: string;
  locale: { city: string; country: string };
  /** Optional: when set, renders the verification stamp inline. */
  verificationHash?: string;
  className?: string;
};

export function CvHeaderBlock({ name, jobTitle, locale, verificationHash, className }: Props) {
  return (
    <header
      data-pattern="cv-header-block"
      className={cn(
        "flex flex-col gap-6 border-b border-brand-hairline-strong pb-6 font-sans-dense tabular-nums",
        className,
      )}
    >
      {/* Wordmark + verification stamp share the masthead baseline. */}
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <WordmarkHeading as="div" size={20} />
        {verificationHash ? <VerificationStamp hash={verificationHash} placement="inline" /> : null}
      </div>

      {/* Name + role + locale. */}
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="m-0 font-sans-dense text-[clamp(2rem,3.6vw,2.8rem)] font-semibold leading-[1.05] tracking-[-0.02em] text-foreground">
            {name}
          </h1>
          <p className="m-0 font-mono text-sm font-medium uppercase tracking-[0.12em] text-brand-ink-soft">
            {jobTitle}
          </p>
        </div>
        <div className="font-mono text-xs font-medium uppercase tracking-[0.12em] text-brand-ink-label">
          {locale.city} · {locale.country}
        </div>
      </div>
    </header>
  );
}

export type { Props as CvHeaderBlockProps };
