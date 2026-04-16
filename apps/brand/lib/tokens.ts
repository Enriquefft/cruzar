/**
 * Cruzar — brand tokens (SSOT). Locked 2026-04-15 for 24 months.
 *
 * Canonical color, type references, spacing, and scale across every Cruzar
 * surface: landing, deck, CV, email, dashboard. Consumed from `apps/web`,
 * `apps/career-ops`, `apps/deck`, and `apps/brand` previews.
 *
 * Change here → propagates everywhere via `@cruzar/brand` workspace exports.
 * Never duplicate these values inline.
 *
 * Locked through 5-layer brand-finalization process. See:
 *   - `apps/brand/app/brand/logotype-studies/page.tsx`  (Capa 1)
 *   - `apps/brand/app/brand/type-studies/page.tsx`     (Capa 2)
 *   - `apps/brand/app/brand/color-studies/page.tsx`    (Capa 3)
 *   - `product/cruzar/brand-voice.md`                  (Capa 4)
 *   - `product/cruzar/brand-guidelines.md`             (Capa 5)
 */

/* ─────────────────────────────  COLOR · LIGHT  ────────────────────── */
/* OKLCH. Neutrals tinted warm (hue ~80°) toward the brand paper tone. */

export const PAPER = "oklch(0.97 0.012 85)";
export const PAPER_DEEP = "oklch(0.945 0.014 82)";
/** Inset card / row surfaces over paper. Slightly lighter than PAPER to read as raised. */
export const CARD = "oklch(0.985 0.006 82)";

export const INK = "oklch(0.18 0.01 80)";
export const INK_SOFT = "oklch(0.38 0.012 80)";
/**
 * Decorative / label-only color — fails WCAG AA (3.3–3.5:1) on every Cruzar
 * surface. NEVER use for body text or anything a user must read in long form.
 * Sanctioned uses: small uppercase eyebrows, footer metadata, hairline-rule
 * captions, table column headers in mono.
 */
export const INK_LABEL = "oklch(0.55 0.012 80)";

export const HAIRLINE = "oklch(0.82 0.012 80)";
/** Emphasized hairline — header/section dividers in dense layouts. */
export const HAIRLINE_STRONG = "oklch(0.72 0.012 80)";

/**
 * The aged editorial red. Contrast on every paper surface ≈ 4.0–4.25:1
 * (sub-AA). LOCKED USE: wordmark period and `§` section markers ONLY. Never
 * fill body text, never use as background unless paired with PAPER on top.
 * Ban-zone: any background within ΔL < 0.2 or ΔH < 20° of this color.
 */
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
  inkLabel: INK_LABEL,
  hairline: HAIRLINE,
  hairlineStrong: HAIRLINE_STRONG,
  accent: ACCENT,
  signal: SIGNAL,
  signalDim: SIGNAL_DIM,
} as const;

/* ─────────────────────────────  COLOR · DARK  ─────────────────────── */
/*
 * Dark-register palette for operator dashboards used at night, deck rooms in
 * dim light, or any future dark surface. Capa 3 stress-tested ACCENT at L=0.42
 * on dark paper (≈2.2:1 — fails). ACCENT_DARK is lifted to L=0.68 / C=0.17 to
 * read at ~5.9:1 on DARK_PAPER while preserving hue identity across CVD filters.
 */

export const DARK_PAPER = "oklch(0.19 0.012 80)";
export const DARK_PAPER_DEEP = "oklch(0.155 0.012 80)";
export const DARK_CARD = "oklch(0.225 0.012 80)";
export const DARK_INK = "oklch(0.94 0.01 85)";
export const DARK_INK_SOFT = "oklch(0.78 0.012 82)";
/** Decorative / label-only on dark surfaces. Same constraints as INK_LABEL. */
export const DARK_INK_LABEL = "oklch(0.6 0.012 80)";
export const DARK_HAIRLINE = "oklch(0.32 0.012 80)";
/** Wordmark period color on dark surfaces — DO NOT use ACCENT directly. */
export const ACCENT_DARK = "oklch(0.68 0.17 32)";

export const colorDark = {
  paper: DARK_PAPER,
  paperDeep: DARK_PAPER_DEEP,
  card: DARK_CARD,
  ink: DARK_INK,
  inkSoft: DARK_INK_SOFT,
  inkLabel: DARK_INK_LABEL,
  hairline: DARK_HAIRLINE,
  accent: ACCENT_DARK,
} as const;

/* ─────────────────────────────  CHART PALETTE  ────────────────────── */
/*
 * 4-color extended palette for charts and data-viz where ACCENT alone is
 * insufficient. Hues spread ≥45° apart at matched mid-lightness; verified
 * distinguishable under deuteranopia/protanopia/tritanopia simulation in
 * Capa 3. Order is canonical — series 1 anchors with terra (closest to
 * ACCENT), then olive / slate / ochre.
 */

export const CHART_1 = "oklch(0.50 0.15 30)"; // terra
export const CHART_2 = "oklch(0.52 0.10 110)"; // olive
export const CHART_3 = "oklch(0.45 0.08 235)"; // slate
export const CHART_4 = "oklch(0.62 0.12 75)"; // ochre

export const chart = [CHART_1, CHART_2, CHART_3, CHART_4] as const;

/* ──────────────────────────  TYPOGRAPHY  ────────────────────────── */
/*
 * Family references. Actual `next/font/google` imports live in `lib/fonts.ts`;
 * these names exist so callers don't guess and so designers can grep a single
 * file for "what font does Cruzar use".
 *
 * Locked stack (Capa 2):
 *  - display:    Literata     (editorial voice, x-height holds at 12px)
 *  - body:       Funnel Sans  (warm grotesque, off reflex list)
 *  - bodyDense:  Geologica    (instrument-panel voice for field register)
 *  - mono:       Geist Mono   (2 weights for log hierarchy, off IBM-Plex monoculture)
 */

export const FONT_FAMILY = {
  /** Primary display serif — editorial voice, designed for long-form screen reading. */
  display: "Literata",
  /** Primary body sans — pairs against Literata, off the reflex-reject list. */
  body: "Funnel Sans",
  /** Field-register body sans — instrument-panel voice for operator/CV surfaces. */
  bodyDense: "Geologica",
  /** Mono companion — 400/500 weights for log hierarchy on data-density surfaces. */
  mono: "Geist Mono",
} as const;

/** CSS variable names apps expose after importing the Google fonts. Contract: these names. */
export const CSS_VAR = {
  display: "--cruzar-display",
  body: "--cruzar-body",
  bodyDense: "--cruzar-body-dense",
  mono: "--cruzar-mono",
} as const;

export const FONT_STACK = {
  display: `var(${CSS_VAR.display}), ui-serif, Georgia, serif`,
  body: `var(${CSS_VAR.body}), ui-sans-serif, system-ui, sans-serif`,
  bodyDense: `var(${CSS_VAR.bodyDense}), ui-sans-serif, system-ui, sans-serif`,
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
  /** Minimum legible size for the wordmark, in px. Below this use mark-only variant. */
  minSize: 20,
  /** Tracking value for the wordmark in display font. */
  tracking: "-0.045em",
} as const;

/* ────────────────────────  REGISTER  ─────────────────────────── */
/*
 * Cruzar ships a two-register system:
 *  - editorial → rector-facing, pitch deck, landing top-fold, MoUs
 *  - field     → operator dashboards, CV templates, employer-facing emails
 * Both share color, space, and type scale. They differ in layout density and
 * which font stack leads (display + body for editorial, bodyDense + mono for field).
 */

export const REGISTER = {
  editorial: {
    lead: "display",
    body: "body",
    useAccent: true,
  },
  field: {
    lead: "bodyDense",
    body: "bodyDense",
    mono: "mono",
    useAccent: false,
    useSignal: true,
  },
} as const;

export type RegisterName = keyof typeof REGISTER;
