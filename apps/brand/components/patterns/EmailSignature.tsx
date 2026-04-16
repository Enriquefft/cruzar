/**
 * EmailSignature — locked Cruzar email signature.
 *
 * Format from brand-guidelines.md G.1:
 *   <Name>
 *   <Role>
 *   Cruzar.            ← wordmark inline, height ~18px (font-size matched)
 *   cruzar.io · <email>
 *
 * Hard rules enforced:
 *  - No motivational quote / mobile disclaimer (G.2).
 *  - No social icons (G.2).
 *  - Wordmark uses the canonical period treatment via WordmarkHeading.
 *  - Name + role in INK; contact line in INK_SOFT.
 */

import { cn } from "@/lib/utils";
import { WordmarkHeading } from "./WordmarkHeading";

type Props = {
  name: string;
  role: string;
  email: string;
  className?: string;
};

const DOMAIN = "cruzar.io";

export function EmailSignature({ name, role, email, className }: Props) {
  return (
    <div
      data-pattern="email-signature"
      className={cn(
        "flex flex-col gap-1 font-sans text-sm leading-snug tabular-nums",
        className,
      )}
    >
      <div className="font-medium text-foreground">{name}</div>
      <div className="text-brand-ink-soft">{role}</div>
      <div className="pt-1">
        <WordmarkHeading as="div" size={18} />
      </div>
      <div className="font-mono text-xs text-brand-ink-soft">
        {DOMAIN}
        <span aria-hidden className="px-1.5 text-brand-ink-label">·</span>
        <a href={`mailto:${email}`} className="hover:underline">
          {email}
        </a>
      </div>
    </div>
  );
}

export type { Props as EmailSignatureProps };
