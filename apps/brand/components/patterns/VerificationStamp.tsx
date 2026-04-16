/**
 * VerificationStamp — "Verified by Cruzar · cruzar.io/v/<hash>" mark.
 *
 * Used on CVs, emails, and externally-shared artifacts to anchor the
 * verification claim to a public canonical URL. Hash is rendered in
 * `font-mono` for trust signal (looks operationally real). Bilingual:
 * the verb is the only translated piece.
 *
 * Two placements:
 *  - `inline`  : single-line, e.g. beside the candidate name on a CV header.
 *  - `footer`  : two-line stacked, e.g. at the bottom of a PDF.
 */

import { CheckCircle2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

type Lang = "es" | "en";

type Props = {
  /** The opaque verification hash (8–16 chars, base32/base58/hex). */
  hash: string;
  placement?: "inline" | "footer";
  lang?: Lang;
  className?: string;
};

const VERB: Record<Lang, string> = {
  es: "Verificado por Cruzar",
  en: "Verified by Cruzar",
};

const URL_BASE = "cruzar.io/v/";

export function VerificationStamp({
  hash,
  placement = "inline",
  lang = "en",
  className,
}: Props) {
  if (placement === "footer") {
    return (
      <div
        data-pattern="verification-stamp"
        data-placement="footer"
        className={cn("flex flex-col gap-1 tabular-nums", className)}
      >
        <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-[0.12em] text-foreground">
          <CheckCircle2Icon
            className="size-3.5"
            style={{ color: "var(--brand-accent)" }}
            aria-hidden
          />
          <span>{VERB[lang]}</span>
        </div>
        <a
          href={`https://${URL_BASE}${hash}`}
          className="font-mono text-[0.72rem] text-brand-ink-soft underline-offset-2 hover:underline"
        >
          {URL_BASE}
          {hash}
        </a>
      </div>
    );
  }

  return (
    <span
      data-pattern="verification-stamp"
      data-placement="inline"
      className={cn(
        "inline-flex items-baseline gap-1.5 text-xs font-medium uppercase tracking-[0.1em] text-foreground tabular-nums",
        className,
      )}
    >
      <CheckCircle2Icon
        className="size-3 self-center"
        style={{ color: "var(--brand-accent)" }}
        aria-hidden
      />
      <span>{VERB[lang]}</span>
      <span aria-hidden className="text-brand-ink-label">·</span>
      <a
        href={`https://${URL_BASE}${hash}`}
        className="font-mono normal-case tracking-normal text-brand-ink-soft underline-offset-2 hover:underline"
      >
        {URL_BASE}
        {hash}
      </a>
    </span>
  );
}

export type { Props as VerificationStampProps };
