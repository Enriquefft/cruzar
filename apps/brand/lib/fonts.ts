import { Funnel_Sans, Geist_Mono, Geologica, Literata } from "next/font/google";

/**
 * Cruzar — font configurations (SSOT). Locked 2026-04-15 for 24 months.
 *
 * Every consuming surface (apps/web landing, apps/brand previews, apps/deck
 * slides) imports these same four configurations so weights, subsets, and
 * CSS variable contracts stay aligned.
 *
 * The `variable` strings here mirror `CSS_VAR.*` in `./tokens.ts`. They MUST
 * stay synchronized — Next.js requires `next/font/google` options to be
 * written as literals (it does not allow imported constants), so the strings
 * cannot be programmatically derived from `CSS_VAR`. If you change one,
 * change the other in the same edit.
 *
 * Locked stack (Capa 2 head-to-head test):
 *   display    Literata    (editorial register lead)
 *   body       Funnel Sans (editorial register body)
 *   bodyDense  Geologica   (field register prose — operator/CV)
 *   mono       Geist Mono  (data-density; 2 weights for log hierarchy)
 */

export const display = Literata({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600", "700"],
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

/**
 * Field-register sans (Geologica) — denser, instrument-panel character than
 * `body`. Used by operator/CV/dashboard surfaces where Funnel Sans's
 * geometric warmth would soften the intended "ground-truth document" voice.
 *
 * Both `body` and `bodyDense` are off the impeccable reflex-reject list.
 */
export const bodyDense = Geologica({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--cruzar-body-dense",
});

export const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--cruzar-mono",
});

/** All four CSS variable classes joined — apply to <html> or <body>. */
export const fontVariables = [
  display.variable,
  body.variable,
  bodyDense.variable,
  mono.variable,
].join(" ");
