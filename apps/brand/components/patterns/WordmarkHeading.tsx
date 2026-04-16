/**
 * WordmarkHeading — locked Cruzar wordmark treatment, semantic-tag-aware.
 *
 * Renders "Cruzar" with the canonical Literata-Regular setting + accent
 * period (`ACCENT` token, never `currentColor`) + tracking `-0.045em` per
 * Capa 1 lock (brand-guidelines.md A.1, A.5).
 *
 * Use this anywhere the wordmark appears as text (mastheads, system
 * headers, signatures, colophons). Where the wordmark is rendered as a
 * pixel-perfect SVG (favicons, OG cards, email PNGs), prefer the SVG
 * `<Logotype />` from `@/components/Logotype`.
 *
 * Tracking, font-family, accent color, and minimum size are NOT props —
 * they are brand locks.
 */

import { cn } from "@/lib/utils";
import { WORDMARK } from "@/lib/tokens";

type DisplayPreset = "display1" | "display2" | "display3";

type Props = {
  /** Semantic tag. `div` when the wordmark is decorative beside an h1. */
  as?: "h1" | "h2" | "h3" | "div";
  /**
   * Type size. A number is consumed as `px`; a preset uses the token-fluid
   * `text-{display1|display2|display3}` clamp() scale.
   * Default: `display3` — the safe inline size.
   */
  size?: number | DisplayPreset;
  /**
   * `true` when rendered on dark surfaces. The wordmark inherits
   * `currentColor` so callers must already be on an inverted surface;
   * the prop only flips the hint that the surrounding context is dark
   * (used for the period token via the .dark mapping in globals.css).
   */
  inverted?: boolean;
  className?: string;
};

const PRESET_CLASS: Record<DisplayPreset, string> = {
  display1: "text-[clamp(4.5rem,16vw,12.5rem)] leading-[0.9]",
  display2: "text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.02]",
  display3: "text-[clamp(1.4rem,2.2vw,1.9rem)] leading-[1.1]",
};

export function WordmarkHeading({
  as: Tag = "h1",
  size = "display3",
  inverted = false,
  className,
}: Props) {
  const sizeClass =
    typeof size === "string"
      ? PRESET_CLASS[size]
      : undefined;
  const sizeStyle =
    typeof size === "number"
      ? {
          fontSize: `${Math.max(WORDMARK.minSize, size)}px`,
          lineHeight: 0.95,
        }
      : undefined;

  return (
    <Tag
      data-pattern="wordmark-heading"
      data-inverted={inverted || undefined}
      className={cn(
        "font-serif font-normal tracking-[-0.045em]",
        sizeClass,
        className,
      )}
      style={sizeStyle}
    >
      {WORDMARK.text}
      <span
        aria-hidden
        // The accent period is the ONE always-accent mark per surface.
        // `--brand-accent` flips automatically on `.dark` ancestors.
        style={{ color: "var(--brand-accent)" }}
      >
        {WORDMARK.terminal}
      </span>
    </Tag>
  );
}

export type { Props as WordmarkHeadingProps };
