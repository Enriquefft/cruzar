import { Fragment_Mono, Funnel_Sans, Geologica, Source_Serif_4 } from "next/font/google";

/**
 * Cruzar — font configurations (SSOT).
 *
 * Every consuming surface (apps/web landing, apps/brand previews, future
 * apps/deck) imports these same three configurations so weights, subsets,
 * and CSS variable contracts stay aligned.
 *
 * The `variable` strings here mirror `CSS_VAR.*` in `./tokens.ts`. They
 * MUST stay synchronized — Next.js requires `next/font/google` options to be
 * written as literals (it does not allow imported constants), so the strings
 * cannot be programmatically derived from `CSS_VAR`. If you change one,
 * change the other in the same edit.
 */

export const display = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--cruzar-display",
});

export const body = Funnel_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--cruzar-body",
});

export const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--cruzar-mono",
});

/**
 * Field-register sans (Geologica) — denser, more instrument-panel character
 * than `body`. Used by the operator/field surfaces (dashboards, CV, dense
 * data tables) where Funnel Sans's geometric warmth would soften the
 * intended "ground-truth document" voice.
 *
 * Both `body` and `bodyDense` are off the impeccable reflex-reject list.
 */
export const bodyDense = Geologica({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--cruzar-body-dense",
});

/** All four CSS variable classes joined — apply to <html> or <body>. */
export const fontVariables = [
  display.variable,
  body.variable,
  bodyDense.variable,
  mono.variable,
].join(" ");
