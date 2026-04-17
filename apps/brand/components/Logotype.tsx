/**
 * Cruzar — Logotype (SSOT React component).
 *
 * Renders the Cruzar wordmark inline as an SVG: "Cruzar" in Literata
 * at 400 plus a single aged-red accent period anchored to the "r" baseline.
 *
 * This is Approach B per the build brief: glyphs are live <text> set in
 * Literata, not outlined paths. The trade-off is stated in
 * /public/cruzar-wordmark.svg — in short, every consuming surface loads
 * Literata via next/font already, so the font dependency is a
 * non-issue in our ecosystem and avoids the duplication of emitting a
 * second canonical copy of glyph geometry.
 *
 * Styling contract:
 *   · The wordmark fill is `currentColor`. Set `color` on the parent to
 *     change the ink shade per surface (INK for light, PAPER for dark).
 *     The component itself sets no default color — it inherits.
 *   · The accent period is locked to ACCENT via inline style (it must NOT
 *     follow currentColor — it is the one always-accent mark).
 *
 * The glyph render relies on the `--cruzar-display` CSS variable being
 * present on an ancestor (see `apps/brand/lib/fonts.ts`). If the variable
 * is absent the font stack falls back through the serif cascade, which
 * matches how the editorial direction page already handles things.
 */

import type { CSSProperties } from "react";
import { ACCENT, FONT_STACK } from "../lib/tokens";

type Variant = "default" | "inverted";

type Props = {
  /**
   * `default` = wordmark inherits `currentColor` (use on light surfaces
   * with `color: INK` on an ancestor).
   *
   * `inverted` = same render strategy; the component is identical because
   * currentColor does all the work. The variant is accepted so callers can
   * document intent and so future divergences (e.g. optical adjustment on
   * dark backgrounds) can land here without touching consumers.
   */
  variant?: Variant;
  /**
   * Accessible label. Defaults to "Cruzar". Pass an empty string to mark
   * the logotype decorative (e.g. when adjacent to a visible text label).
   */
  label?: string;
  /**
   * Constrain by height in CSS pixels (or any valid length). The width
   * derives from the SVG's aspect ratio (1000 × 240 viewBox).
   */
  height?: number | string;
  className?: string;
  style?: CSSProperties;
};

/** Intrinsic SVG box — kept in sync with /public/cruzar-wordmark.svg. */
const VIEWBOX_WIDTH = 1000;
const VIEWBOX_HEIGHT = 240;

/**
 * Glyph render settings. These MUST stay aligned with the SVG asset so the
 * standalone file (consumed by dumb img pipelines, email, embedded print)
 * and the inline component render identically pixel-for-pixel.
 */
const GLYPH_STYLE: CSSProperties = {
  fontFamily: FONT_STACK.display,
  fontWeight: 400,
  fontSize: "200px",
  letterSpacing: "-9px",
};

export function Logotype({
  variant = "default",
  label = "Cruzar",
  height = 64,
  className,
  style,
}: Props) {
  const decorative = label === "";
  const aspect = VIEWBOX_WIDTH / VIEWBOX_HEIGHT;
  const heightPx = typeof height === "number" ? `${height}px` : height;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
      role={decorative ? "presentation" : "img"}
      aria-label={decorative ? undefined : label}
      aria-hidden={decorative || undefined}
      preserveAspectRatio="xMidYMid meet"
      data-logotype-variant={variant}
      className={className}
      style={{
        display: "block",
        height: heightPx,
        width: `calc(${heightPx} * ${aspect})`,
        ...style,
      }}
    >
      {/* Wordmark: inherits the parent's text color via currentColor. */}
      <text x={20} y={180} style={GLYPH_STYLE} fill="currentColor">
        Cruzar
      </text>
      {/*
        Accent period: rendered by re-drawing the whole word as a transparent
        spacer followed by the visible ".". This pins the period to the
        exact kerned position after the "r" without us needing to know the
        font's glyph advance widths at build time.
      */}
      <text x={20} y={180} style={GLYPH_STYLE} fill={ACCENT}>
        <tspan fill="transparent" stroke="none">
          Cruzar
        </tspan>
        .
      </text>
    </svg>
  );
}

export default Logotype;
