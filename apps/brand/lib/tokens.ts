/**
 * Cruzar — brand tokens (SSOT).
 *
 * The canonical definitions for color, typography references, spacing, and
 * type scale across every Cruzar surface: landing, deck, CV, email, dashboard.
 *
 * Consumed from `apps/web`, `apps/career-ops`, and the `apps/brand` previews.
 * Change here → propagates everywhere. Never duplicate these values inline.
 */

/* ─────────────────────────────  COLOR  ───────────────────────────── */
/* OKLCH. Neutrals tinted warm (hue ~80°) toward the brand paper tone. */

export const PAPER = "oklch(0.97 0.012 85)";
export const PAPER_DEEP = "oklch(0.945 0.014 82)";
/** Inset card / row surfaces over paper. Slightly lighter than PAPER to read as raised. */
export const CARD = "oklch(0.985 0.006 82)";

export const INK = "oklch(0.18 0.01 80)";
export const INK_SOFT = "oklch(0.38 0.012 80)";
export const INK_MUTE = "oklch(0.55 0.012 80)";

export const HAIRLINE = "oklch(0.82 0.012 80)";
/** Emphasized hairline — header/section dividers in dense layouts. */
export const HAIRLINE_STRONG = "oklch(0.72 0.012 80)";

/** The aged editorial red. Used surgically — wordmark period, section markers. */
export const ACCENT = "oklch(0.42 0.14 30)";

/** Terra/brick, same hue family as ACCENT but brighter for mono/operator contexts. */
export const SIGNAL = "oklch(0.55 0.16 35)";
/** Soft surface tint of SIGNAL — row highlights, status bands. */
export const SIGNAL_DIM = "oklch(0.55 0.16 35 / 0.12)";

export const color = {
  paper: PAPER,
  paperDeep: PAPER_DEEP,
  card: CARD,
  ink: INK,
  inkSoft: INK_SOFT,
  inkMute: INK_MUTE,
  hairline: HAIRLINE,
  hairlineStrong: HAIRLINE_STRONG,
  accent: ACCENT,
  signal: SIGNAL,
  signalDim: SIGNAL_DIM,
} as const;

/* ──────────────────────────  TYPOGRAPHY  ────────────────────────── */
/*
 * Family references. Actual `next/font/google` imports live in each consuming
 * surface so Next can optimize per route; these names exist so callers don't
 * guess and so designers can grep a single file for "what font does Cruzar use".
 */

export const FONT_FAMILY = {
  /** Primary display serif — editorial voice, optical-size aware, tabular lining figures. */
  display: "Source Serif 4",
  /** Primary body sans — off the reflex-reject list, pairs against Source Serif 4. */
  body: "Funnel Sans",
  /** Mono companion — humanist, single-weight, for data-density surfaces (CV, operator, CSV). */
  mono: "Fragment Mono",
} as const;

/** CSS variable names apps expose after importing the Google fonts. Contract: these names. */
export const CSS_VAR = {
  display: "--cruzar-display",
  body: "--cruzar-body",
  mono: "--cruzar-mono",
} as const;

export const FONT_STACK = {
  display: `var(${CSS_VAR.display}), ui-serif, Georgia, serif`,
  body: `var(${CSS_VAR.body}), ui-sans-serif, system-ui, sans-serif`,
  mono: `var(${CSS_VAR.mono}), ui-monospace, SFMono-Regular, Menlo, monospace`,
} as const;

/* ─────────────────────────────  SPACE  ──────────────────────────── */
/* 4pt scale with semantic steps. */

export const space = {
  1: "4px",
  2: "8px",
  3: "12px",
  4: "16px",
  6: "24px",
  8: "32px",
  12: "48px",
  16: "64px",
  24: "96px",
} as const;

/* ────────────────────────  TEXT SCALE  ────────────────────────── */
/*
 * Modular scale, ratio ~1.25. Display sizes are fluid via clamp for marketing
 * surfaces; product UIs (apps/web dashboards) should use the fixed rem steps.
 */

export const text = {
  xs: "0.72rem",
  sm: "0.88rem",
  base: "1rem",
  lg: "1.25rem",
  xl: "1.56rem",
  "2xl": "1.95rem",
  display3: "clamp(1.4rem, 2.2vw, 1.9rem)",
  display2: "clamp(2rem, 4.5vw, 3.5rem)",
  display1: "clamp(4.5rem, 16vw, 12.5rem)",
} as const;

/* ─────────────────────────  MEASURE  ────────────────────────── */

export const measure = {
  /** Body prose max width per impeccable spec. */
  prose: "72ch",
  /** Tight captions, footnotes. */
  caption: "42ch",
  /** Page container. */
  page: "1320px",
} as const;

/* ─────────────────────────  HAIRLINE  ────────────────────────── */

export const rule = {
  thin: `1px solid ${HAIRLINE}`,
  strong: `2px solid ${INK}`,
} as const;

/* ────────────────────────  BRAND MARK  ───────────────────────── */

export const WORDMARK = {
  /** Logotype is "Cruzar" in display font with a single accent period. */
  text: "Cruzar",
  /** The single red character; keep this the only accent instance per surface. */
  terminal: ".",
} as const;

/* ────────────────────────  REGISTER  ─────────────────────────── */
/*
 * Cruzar ships a two-register system:
 *  - editorial → rector-facing, pitch deck, landing top-fold, MoUs
 *  - field     → operator dashboards, CV templates, employer-facing emails
 * Both share color, space, and type scale. They differ in layout density and
 * which font stack leads (display + body for editorial, body + mono for field).
 */

export const REGISTER = {
  editorial: {
    lead: "display",
    body: "body",
    useAccent: true,
  },
  field: {
    lead: "body",
    body: "body",
    mono: "mono",
    useAccent: false,
    useSignal: true,
  },
} as const;

export type RegisterName = keyof typeof REGISTER;
