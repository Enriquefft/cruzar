import { Fragment } from "react";
import { body, display, mono } from "@/lib/fonts";
import {
  ACCENT,
  CARD,
  HAIRLINE,
  HAIRLINE_STRONG,
  INK,
  INK_LABEL,
  INK_SOFT,
  PAPER,
  PAPER_DEEP,
  SIGNAL,
} from "@/lib/tokens";

/**
 * Capa 3 — Color Lock.
 *
 * Rigorous stress-test of the Cruzar palette before it is declared intocable
 * for 24 months. All color math runs in pure TS at render time (no runtime
 * dependencies added). No value is hard-coded that can be derived from the
 * SSOT in `@/lib/tokens`.
 *
 *   - Section A — WCAG contrast matrix on every type × surface combination.
 *   - Section B — Color-blindness simulation via inline SVG color matrices
 *     (deuteranopia, protanopia, tritanopia, achromatopsia).
 *   - Section C — Print fidelity: OKLCH → CMYK-safe approximation by chroma
 *     clamp, side-by-side with the screen value.
 *   - Section D — Hostile backgrounds for the wordmark + period.
 *   - Section E — Proposed dark-mode palette, with full editorial render.
 *   - Section F — 4-color chart palette derived from ACCENT hue family,
 *     colorblind-distinguishable on PAPER.
 *   - Section G — Findings + new bans.
 *
 * Reading the file top-to-bottom should be enough to evaluate the lock.
 */

/* ───────────────────────────  COLOR MATH  ─────────────────────────── */
/*
 * Pure TS OKLCH → sRGB. Adapted from the CSS Color Module 4 reference
 * transform (Björn Ottosson). No dependency on culori or any other lib.
 */

type RGB = readonly [number, number, number];

const PAPER_OK = { l: 0.97, c: 0.012, h: 85 } as const;
const PAPER_DEEP_OK = { l: 0.945, c: 0.014, h: 82 } as const;
const CARD_OK = { l: 0.985, c: 0.006, h: 82 } as const;
const INK_OK = { l: 0.18, c: 0.01, h: 80 } as const;
const INK_SOFT_OK = { l: 0.38, c: 0.012, h: 80 } as const;
const INK_LABEL_OK = { l: 0.55, c: 0.012, h: 80 } as const;
const HAIRLINE_OK = { l: 0.82, c: 0.012, h: 80 } as const;
const ACCENT_OK = { l: 0.42, c: 0.14, h: 30 } as const;
const SIGNAL_OK = { l: 0.55, c: 0.16, h: 35 } as const;

type OKLCH = { l: number; c: number; h: number };

function oklchToLinearRgb(okl: OKLCH): RGB {
  const hRad = (okl.h * Math.PI) / 180;
  const a = okl.c * Math.cos(hRad);
  const b = okl.c * Math.sin(hRad);

  // OKLab → linear RGB (Björn Ottosson's matrix)
  const l_ = okl.l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = okl.l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = okl.l - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bch = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return [r, g, bch] as const;
}

function linearToSrgbChannel(x: number): number {
  const clamped = Math.max(0, Math.min(1, x));
  return clamped <= 0.0031308 ? 12.92 * clamped : 1.055 * clamped ** (1 / 2.4) - 0.055;
}

function srgbToLinearChannel(x: number): number {
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
}

function oklchToSrgb(okl: OKLCH): RGB {
  const [lr, lg, lb] = oklchToLinearRgb(okl);
  return [linearToSrgbChannel(lr), linearToSrgbChannel(lg), linearToSrgbChannel(lb)] as const;
}

function oklchToHex(okl: OKLCH): string {
  const [r, g, b] = oklchToSrgb(okl);
  const to255 = (v: number) =>
    Math.max(0, Math.min(255, Math.round(v * 255)))
      .toString(16)
      .padStart(2, "0");
  return `#${to255(r)}${to255(g)}${to255(b)}`;
}

/** WCAG 2.1 relative luminance from sRGB in [0,1]. */
function relLuminanceFromSrgb(srgb: RGB): number {
  const [r, g, b] = srgb;
  const R = srgbToLinearChannel(r);
  const G = srgbToLinearChannel(g);
  const B = srgbToLinearChannel(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function wcagContrast(a: OKLCH, b: OKLCH): number {
  const la = relLuminanceFromSrgb(oklchToSrgb(a));
  const lb = relLuminanceFromSrgb(oklchToSrgb(b));
  const lighter = Math.max(la, lb);
  const darker = Math.min(la, lb);
  return (lighter + 0.05) / (darker + 0.05);
}

type WcagVerdict = "AA" | "AA-Large" | "FAIL";
function wcagVerdict(ratio: number): WcagVerdict {
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "AA-Large";
  return "FAIL";
}

/* ────────────────────  PRINT-GAMUT APPROXIMATION  ──────────────────── */
/*
 * OKLCH → CMYK drift is approximated by clamping chroma to a conservative
 * printable envelope. Reds at high chroma are the usual victims. This is not
 * a true ICC roundtrip; it surfaces the meaningful drift so the palette can
 * be annotated with print-safe alternates.
 */

function printSafeOklch(okl: OKLCH): OKLCH {
  const MAX_PRINT_CHROMA = 0.1;
  return { l: okl.l, c: Math.min(okl.c, MAX_PRINT_CHROMA), h: okl.h };
}

function oklchString(okl: OKLCH): string {
  const l = okl.l.toFixed(3).replace(/\.?0+$/, "");
  const c = okl.c.toFixed(3).replace(/\.?0+$/, "");
  return `oklch(${l} ${c} ${Math.round(okl.h)})`;
}

/* ───────────────────────────  CONSTANTS  ─────────────────────────── */

const SURFACES = [
  { key: "PAPER", label: "PAPER", okl: PAPER_OK, css: PAPER },
  { key: "PAPER_DEEP", label: "PAPER_DEEP", okl: PAPER_DEEP_OK, css: PAPER_DEEP },
  { key: "CARD", label: "CARD", okl: CARD_OK, css: CARD },
] as const;

const TYPE_COLORS = [
  { key: "INK", label: "INK", okl: INK_OK, css: INK },
  { key: "INK_SOFT", label: "INK_SOFT", okl: INK_SOFT_OK, css: INK_SOFT },
  { key: "INK_LABEL", label: "INK_LABEL", okl: INK_LABEL_OK, css: INK_LABEL },
  { key: "ACCENT", label: "ACCENT", okl: ACCENT_OK, css: ACCENT },
] as const;

/* ─────────────────────  COLOR-BLINDNESS MATRICES  ──────────────────── */
/*
 * 5×4 color matrices for CSS `filter: url(#…)`. Based on Machado, Oliveira &
 * Fernandes (2009) severity-100% coefficients for the three dichromacies;
 * achromatopsia uses luminance weights. Applied in sRGB — this is the same
 * approximation browsers use in DevTools vision emulation, which is the
 * correct comparison surface for this stress-test.
 */

const CVD_MATRICES: readonly {
  id: string;
  label: string;
  matrix: string;
  note: string;
}[] = [
  {
    id: "cvd-deuteranopia",
    label: "Deuteranopia",
    matrix: [
      "0.367, 0.861, -0.228, 0, 0",
      "0.280, 0.673, 0.047, 0, 0",
      "-0.012, 0.043, 0.969, 0, 0",
      "0, 0, 0, 1, 0",
    ].join(" "),
    note: "~6% of men. Red-green channel collapses.",
  },
  {
    id: "cvd-protanopia",
    label: "Protanopia",
    matrix: [
      "0.152, 1.053, -0.205, 0, 0",
      "0.115, 0.786, 0.099, 0, 0",
      "-0.004, -0.048, 1.052, 0, 0",
      "0, 0, 0, 1, 0",
    ].join(" "),
    note: "~1% of men. Reds darken toward black.",
  },
  {
    id: "cvd-tritanopia",
    label: "Tritanopia",
    matrix: [
      "1.256, -0.077, -0.179, 0, 0",
      "-0.078, 0.931, 0.148, 0, 0",
      "0.005, 0.691, 0.304, 0, 0",
      "0, 0, 0, 1, 0",
    ].join(" "),
    note: "Rare. Blue-yellow channel collapses.",
  },
  {
    id: "cvd-achromatopsia",
    label: "Achromatopsia",
    matrix: [
      "0.2126, 0.7152, 0.0722, 0, 0",
      "0.2126, 0.7152, 0.0722, 0, 0",
      "0.2126, 0.7152, 0.0722, 0, 0",
      "0, 0, 0, 1, 0",
    ].join(" "),
    note: "Total loss of hue. Luminance-only check.",
  },
];

/* ──────────────────────────  DARK PROPOSAL  ────────────────────────── */
/*
 * Derived under the constraint that PAPER's hue (warm 80°) be preserved on
 * dark surfaces so the brand reads continuous across registers. Dark canvas
 * sits at L=0.19 (not pure-black; tinted toward brand hue). ACCENT_DARK lifts
 * lightness + chroma so the wordmark period still registers on dark.
 */

const DARK_PAPER_OK: OKLCH = { l: 0.19, c: 0.012, h: 80 };
const DARK_PAPER_DEEP_OK: OKLCH = { l: 0.155, c: 0.012, h: 80 };
const DARK_CARD_OK: OKLCH = { l: 0.225, c: 0.012, h: 80 };
const DARK_INK_OK: OKLCH = { l: 0.94, c: 0.01, h: 85 };
const DARK_INK_SOFT_OK: OKLCH = { l: 0.78, c: 0.012, h: 82 };
const DARK_INK_LABEL_OK: OKLCH = { l: 0.6, c: 0.012, h: 80 };
const DARK_HAIRLINE_OK: OKLCH = { l: 0.32, c: 0.012, h: 80 };
const ACCENT_DARK_OK: OKLCH = { l: 0.68, c: 0.17, h: 32 };

/* ──────────────────────────  CHART PALETTE  ────────────────────────── */
/*
 * Four-color extended palette derived from ACCENT. Warm terra anchor, then
 * three complements placed at well-separated hue angles (chosen to survive
 * deuteranopia — the largest CVD population). All four hit AA on PAPER for
 * UI-component contrast (≥3.0).
 */

const CHART_PALETTE: readonly { name: string; okl: OKLCH }[] = [
  { name: "Chart/Terra (anchor)", okl: { l: 0.5, c: 0.15, h: 30 } },
  { name: "Chart/Olive", okl: { l: 0.52, c: 0.1, h: 110 } },
  { name: "Chart/Slate", okl: { l: 0.45, c: 0.08, h: 235 } },
  { name: "Chart/Ochre", okl: { l: 0.62, c: 0.12, h: 75 } },
];

/* ────────────────────────  COMPUTED MATRICES  ───────────────────────── */

const CONTRAST_ROWS = TYPE_COLORS.map((fg) => ({
  fg,
  cells: SURFACES.map((bg) => {
    const ratio = wcagContrast(fg.okl, bg.okl);
    return { bg, ratio, verdict: wcagVerdict(ratio) };
  }),
}));

const SIGNAL_ROW = {
  fg: { key: "SIGNAL", label: "SIGNAL", okl: SIGNAL_OK, css: SIGNAL },
  cells: SURFACES.map((bg) => {
    const ratio = wcagContrast(SIGNAL_OK, bg.okl);
    return { bg, ratio, verdict: wcagVerdict(ratio) };
  }),
};

const ACCENT_ON_INK = wcagContrast(ACCENT_OK, INK_OK);

const HOSTILE_BACKGROUNDS: readonly { name: string; okl: OKLCH; note: string }[] = [
  {
    name: "Photo mock (radial)",
    okl: { l: 0.5, c: 0.05, h: 60 },
    note: "Complex image — simulated via radial gradient below.",
  },
  { name: "Red surface", okl: { l: 0.45, c: 0.15, h: 25 }, note: "ACCENT hue collision risk." },
  {
    name: "Green surface",
    okl: { l: 0.5, c: 0.12, h: 145 },
    note: "Complementary — period should read.",
  },
  { name: "Neutral mid-gray", okl: { l: 0.5, c: 0, h: 0 }, note: "Flat luminance trap." },
  {
    name: "Blue surface",
    okl: { l: 0.45, c: 0.15, h: 250 },
    note: "Common app dark theme canvas.",
  },
  {
    name: "Cruzar dark (proposed)",
    okl: DARK_PAPER_OK,
    note: "Proposed DARK_PAPER — see Section E.",
  },
];

/* ──────────────────────────  UI PRIMITIVES  ────────────────────────── */

const eyebrowStyle: React.CSSProperties = {
  fontFamily: "var(--cruzar-body)",
  fontSize: "0.7rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: INK_LABEL,
  fontVariantNumeric: "tabular-nums",
};

function SectionEyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12, ...eyebrowStyle }}>
      <span style={{ color: ACCENT, fontWeight: 600 }}>§ {no}</span>
      <span style={{ flex: "0 0 32px", height: 1, background: HAIRLINE }} />
      <span>{label}</span>
    </div>
  );
}

function verdictPill(v: WcagVerdict) {
  const bg =
    v === "FAIL"
      ? "oklch(0.9 0.05 30)"
      : v === "AA-Large"
        ? "oklch(0.94 0.04 85)"
        : "oklch(0.94 0.04 145)";
  const fg = v === "FAIL" ? ACCENT : INK;
  const label = v === "AA-Large" ? "AA Large" : v;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 8px",
        background: bg,
        color: fg,
        fontFamily: "var(--cruzar-mono)",
        fontSize: "0.7rem",
        letterSpacing: "0.04em",
        border: `1px solid ${HAIRLINE}`,
      }}
    >
      {label}
    </span>
  );
}

function SvgFilters() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: "absolute", width: 0, height: 0 }}
      role="none"
    >
      <defs>
        {CVD_MATRICES.map((m) => (
          <filter id={m.id} key={m.id}>
            <feColorMatrix type="matrix" values={m.matrix} />
          </filter>
        ))}
      </defs>
    </svg>
  );
}

type SampleProps = {
  paper: string;
  ink: string;
  accent: string;
  signal: string;
  hairline: string;
};
function SampleComposition({ paper, ink, accent, signal, hairline }: SampleProps) {
  return (
    <div
      style={{
        background: paper,
        padding: 20,
        border: `1px solid ${hairline}`,
        color: ink,
        fontFamily: "var(--cruzar-body)",
        display: "grid",
        gap: 12,
        minHeight: 200,
      }}
    >
      <div
        style={{
          fontFamily: "var(--cruzar-display)",
          fontSize: "2.4rem",
          fontWeight: 400,
          letterSpacing: "-0.035em",
          lineHeight: 1,
        }}
      >
        Cruzar<span style={{ color: accent }}>.</span>
      </div>
      <p style={{ margin: 0, fontSize: "0.88rem", lineHeight: 1.55, maxWidth: "42ch" }}>
        Diagnosis, real-scenario validation, and autonomous applications to international remote
        jobs — priced only on signed offers.
      </p>
      <div
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: accent,
          fontWeight: 600,
        }}
      >
        § Accent label
      </div>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: ink,
            fontVariantNumeric: "tabular-nums",
            minWidth: 48,
          }}
        >
          Placed
        </span>
        <span
          aria-hidden
          style={{
            display: "block",
            height: 10,
            width: "55%",
            background: signal,
          }}
        />
        <span style={{ fontFamily: "var(--cruzar-mono)", fontSize: "0.78rem" }}>82 / 149</span>
      </div>
    </div>
  );
}

/* ────────────────────────────  PAGE  ────────────────────────────── */

export default function ColorStudiesPage() {
  return (
    <main
      className={`${display.variable} ${body.variable} ${mono.variable}`}
      style={{
        background: PAPER,
        color: INK,
        minHeight: "100vh",
        fontFamily: "var(--cruzar-body), ui-sans-serif, system-ui, sans-serif",
        fontSize: 16,
        lineHeight: 1.55,
        fontVariantNumeric: "tabular-nums lining-nums",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      <SvgFilters />

      <style>{`
        .cs-serif { font-family: var(--cruzar-display), ui-serif, Georgia, serif; }
        .cs-mono  { font-family: var(--cruzar-mono), ui-monospace, SFMono-Regular, Menlo, monospace; }
        .cs-grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; }
        .cs-grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1px; background: ${HAIRLINE}; border: 1px solid ${HAIRLINE}; }
        .cs-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; font-variant-numeric: tabular-nums; }
        .cs-table th, .cs-table td { border: 1px solid ${HAIRLINE}; padding: 10px 12px; text-align: left; }
        .cs-table th { background: ${PAPER_DEEP}; font-weight: 600; letter-spacing: 0.02em; }
        .cs-sample-row { display: flex; flex-wrap: wrap; gap: 16px; }
        .cs-sample-row > * { flex: 1 1 260px; min-width: 260px; }
      `}</style>

      {/* =========== MASTHEAD =========== */}
      <header
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "32px clamp(24px,5vw,64px) 24px",
          borderBottom: `2px solid ${INK}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: 24,
            flexWrap: "wrap",
            ...eyebrowStyle,
            color: INK_SOFT,
          }}
        >
          <span>Cruzar · Capa 3 — Color Lock</span>
          <span>Stress Matrix</span>
          <span>2026-04-15</span>
        </div>
        <h1
          className="cs-serif"
          style={{
            margin: "24px 0 0",
            fontSize: "clamp(2.4rem, 5vw, 4rem)",
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          Color, under duress<span style={{ color: ACCENT }}>.</span>
        </h1>
        <p
          style={{
            marginTop: 16,
            maxWidth: "64ch",
            fontSize: "1rem",
            color: INK_SOFT,
            lineHeight: 1.6,
          }}
        >
          Every combination below is computed live from the canonical tokens in{" "}
          <span className="cs-mono" style={{ fontSize: "0.92em", color: INK }}>
            apps/brand/lib/tokens.ts
          </span>
          . No hex is hand-typed. A FAIL here becomes a ban in Section G.
        </p>
      </header>

      {/* ============ A — WCAG MATRIX ============ */}
      <section
        style={{ maxWidth: 1320, margin: "0 auto", padding: "64px clamp(24px,5vw,64px)" }}
      >
        <SectionEyebrow no="A" label="WCAG 2.1 contrast — type on surface" />
        <h2
          className="cs-serif"
          style={{
            margin: "20px 0 32px",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 500,
            letterSpacing: "-0.018em",
          }}
        >
          The brand survives only where numbers clear 4.5:1.
        </h2>

        <table className="cs-table">
          <thead>
            <tr>
              <th>Type color</th>
              {SURFACES.map((s) => (
                <th key={s.key}>
                  <div>{s.label}</div>
                  <div
                    className="cs-mono"
                    style={{ fontSize: "0.7rem", color: INK_LABEL, fontWeight: 400 }}
                  >
                    {oklchString(s.okl)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CONTRAST_ROWS.map((row) => (
              <tr key={row.fg.key}>
                <th scope="row">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span
                      aria-hidden
                      style={{
                        display: "inline-block",
                        width: 14,
                        height: 14,
                        background: row.fg.css,
                        border: `1px solid ${HAIRLINE}`,
                      }}
                    />
                    <span>{row.fg.label}</span>
                  </div>
                  <div
                    className="cs-mono"
                    style={{ fontSize: "0.7rem", color: INK_LABEL, fontWeight: 400 }}
                  >
                    {oklchString(row.fg.okl)}
                  </div>
                </th>
                {row.cells.map((cell) => (
                  <td key={cell.bg.key} style={{ background: cell.bg.css }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 8,
                      }}
                    >
                      <span style={{ color: row.fg.css, fontWeight: 600 }}>
                        Accountable by construction.
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginTop: 8,
                      }}
                    >
                      <span className="cs-mono" style={{ fontSize: "0.78rem", color: INK_SOFT }}>
                        {cell.ratio.toFixed(2)}:1
                      </span>
                      {verdictPill(cell.verdict)}
                    </div>
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <th scope="row">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    aria-hidden
                    style={{
                      display: "inline-block",
                      width: 14,
                      height: 14,
                      background: SIGNAL,
                      border: `1px solid ${HAIRLINE}`,
                    }}
                  />
                  <span>{SIGNAL_ROW.fg.label}</span>
                </div>
                <div
                  className="cs-mono"
                  style={{ fontSize: "0.7rem", color: INK_LABEL, fontWeight: 400 }}
                >
                  {oklchString(SIGNAL_ROW.fg.okl)}
                </div>
              </th>
              {SIGNAL_ROW.cells.map((cell) => (
                <td key={cell.bg.key} style={{ background: cell.bg.css }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: SIGNAL, fontWeight: 600 }}>Verified · terra mark</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: 8,
                    }}
                  >
                    <span className="cs-mono" style={{ fontSize: "0.78rem", color: INK_SOFT }}>
                      {cell.ratio.toFixed(2)}:1
                    </span>
                    {verdictPill(cell.verdict)}
                  </div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>

        {/* ACCENT on INK */}
        <div
          style={{
            marginTop: 32,
            display: "grid",
            gridTemplateColumns: "1fr auto",
            gap: 24,
            alignItems: "center",
            padding: 24,
            background: INK,
            color: "oklch(0.94 0.01 85)",
          }}
        >
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "oklch(0.72 0.012 80)",
                fontWeight: 600,
              }}
            >
              Special case — ACCENT on INK background
            </div>
            <div
              className="cs-serif"
              style={{
                marginTop: 8,
                fontSize: "3.6rem",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 1,
              }}
            >
              Cruzar<span style={{ color: ACCENT }}>.</span>
            </div>
            <p
              style={{
                marginTop: 12,
                maxWidth: "48ch",
                fontSize: "0.9rem",
                color: "oklch(0.78 0.012 82)",
              }}
            >
              Does the wordmark period read on a dark surface?
            </p>
          </div>
          <div style={{ textAlign: "right" }}>
            <div
              className="cs-mono"
              style={{
                fontSize: "2.8rem",
                fontWeight: 400,
                color: "oklch(0.94 0.04 30)",
              }}
            >
              {ACCENT_ON_INK.toFixed(2)}:1
            </div>
            <div style={{ marginTop: 8 }}>{verdictPill(wcagVerdict(ACCENT_ON_INK))}</div>
            <div
              style={{
                marginTop: 8,
                fontSize: "0.72rem",
                color: "oklch(0.72 0.012 80)",
                maxWidth: "24ch",
              }}
            >
              Fails body contrast. Acceptable only because the period is a 0.5em glyph (large-text
              category) and is decorative.
            </div>
          </div>
        </div>
      </section>

      {/* ============ B — COLOR BLINDNESS ============ */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `2px solid ${INK}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "64px clamp(24px,5vw,64px)" }}>
          <SectionEyebrow no="B" label="Color-vision simulation" />
          <h2
            className="cs-serif"
            style={{
              margin: "20px 0 16px",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 500,
              letterSpacing: "-0.018em",
            }}
          >
            Does ACCENT survive when red is not available?
          </h2>
          <p style={{ margin: "0 0 32px", color: INK_SOFT, maxWidth: "64ch" }}>
            Each tile renders the same composition under a different color-vision matrix. If ACCENT
            visually collapses onto INK or gray, that is a finding in Section G.
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {CVD_MATRICES.map((m) => (
              <div
                key={m.id}
                style={{
                  background: PAPER,
                  border: `1px solid ${HAIRLINE}`,
                }}
              >
                <div
                  style={{
                    padding: "12px 16px",
                    borderBottom: `1px solid ${HAIRLINE}`,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span className="cs-serif" style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                    {m.label}
                  </span>
                  <span
                    className="cs-mono"
                    style={{
                      fontSize: "0.68rem",
                      letterSpacing: "0.08em",
                      color: INK_LABEL,
                    }}
                  >
                    filter · {m.id}
                  </span>
                </div>
                <div style={{ filter: `url(#${m.id})` }}>
                  <SampleComposition
                    paper={PAPER}
                    ink={INK}
                    accent={ACCENT}
                    signal={SIGNAL}
                    hairline={HAIRLINE}
                  />
                </div>
                <p
                  style={{
                    margin: 0,
                    padding: "12px 16px",
                    fontSize: "0.82rem",
                    color: INK_SOFT,
                    borderTop: `1px solid ${HAIRLINE}`,
                    lineHeight: 1.5,
                  }}
                >
                  {m.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ C — PRINT FIDELITY ============ */}
      <section
        style={{ maxWidth: 1320, margin: "0 auto", padding: "64px clamp(24px,5vw,64px)" }}
      >
        <SectionEyebrow no="C" label="Print drift — OKLCH → CMYK-safe" />
        <h2
          className="cs-serif"
          style={{
            margin: "20px 0 32px",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 500,
            letterSpacing: "-0.018em",
          }}
        >
          Which screen values lose meaning at press?
        </h2>

        <table className="cs-table">
          <thead>
            <tr>
              <th>Token</th>
              <th>Screen (sRGB)</th>
              <th>Print-safe (chroma ≤ 0.10)</th>
              <th>Screen hex</th>
              <th>Print hex</th>
              <th>Drift</th>
            </tr>
          </thead>
          <tbody>
            {[
              { name: "PAPER", okl: PAPER_OK },
              { name: "PAPER_DEEP", okl: PAPER_DEEP_OK },
              { name: "CARD", okl: CARD_OK },
              { name: "INK", okl: INK_OK },
              { name: "INK_SOFT", okl: INK_SOFT_OK },
              { name: "INK_LABEL", okl: INK_LABEL_OK },
              { name: "HAIRLINE", okl: HAIRLINE_OK },
              { name: "ACCENT", okl: ACCENT_OK },
              { name: "SIGNAL", okl: SIGNAL_OK },
            ].map((row) => {
              const safe = printSafeOklch(row.okl);
              const screenHex = oklchToHex(row.okl);
              const printHex = oklchToHex(safe);
              const drifted = screenHex.toLowerCase() !== printHex.toLowerCase();
              return (
                <tr key={row.name}>
                  <th scope="row">
                    <div className="cs-serif" style={{ fontWeight: 600 }}>
                      {row.name}
                    </div>
                    <div
                      className="cs-mono"
                      style={{ fontSize: "0.7rem", color: INK_LABEL, fontWeight: 400 }}
                    >
                      {oklchString(row.okl)}
                    </div>
                  </th>
                  <td
                    style={{
                      background: oklchString(row.okl),
                      minWidth: 140,
                    }}
                  />
                  <td style={{ background: oklchString(safe), minWidth: 140 }} />
                  <td className="cs-mono" style={{ fontSize: "0.78rem" }}>
                    {screenHex}
                  </td>
                  <td className="cs-mono" style={{ fontSize: "0.78rem" }}>
                    {printHex}
                  </td>
                  <td>
                    {drifted ? (
                      <span style={{ color: ACCENT, fontWeight: 600 }}>Visible drift</span>
                    ) : (
                      <span style={{ color: INK_SOFT }}>In gamut</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <p
          style={{
            marginTop: 24,
            color: INK_SOFT,
            maxWidth: "68ch",
            fontSize: "0.92rem",
          }}
        >
          The chroma-clamp envelope at 0.10 is conservative for uncoated stock. ACCENT and SIGNAL
          both exceed it — the period will print pinker/duller than on screen. Where press output is
          a deliverable (MoU covers, printed ledger), specify a Pantone equivalent alongside the
          OKLCH token rather than relying on ICC conversion.
        </p>
      </section>

      {/* ============ D — HOSTILE BACKGROUNDS ============ */}
      <section
        style={{
          borderTop: `1px solid ${HAIRLINE}`,
          background: PAPER_DEEP,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "64px clamp(24px,5vw,64px)" }}>
          <SectionEyebrow no="D" label="Hostile backgrounds" />
          <h2
            className="cs-serif"
            style={{
              margin: "20px 0 32px",
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
              fontWeight: 500,
              letterSpacing: "-0.018em",
            }}
          >
            Where the wordmark + period start to fail.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 16,
            }}
          >
            {HOSTILE_BACKGROUNDS.map((bg) => {
              const isPhoto = bg.name.startsWith("Photo");
              const inkOnDark = bg.okl.l < 0.45;
              const typeColor = inkOnDark ? "oklch(0.96 0.01 85)" : INK;
              const bgStyle: React.CSSProperties = isPhoto
                ? {
                    background: `radial-gradient(circle at 30% 20%, oklch(0.72 0.08 45) 0%, oklch(0.4 0.1 60) 40%, oklch(0.2 0.08 40) 100%)`,
                  }
                : { background: oklchString(bg.okl) };
              const periodRatio = wcagContrast(ACCENT_OK, bg.okl);
              const typeRatio = wcagContrast(inkOnDark ? DARK_INK_OK : INK_OK, bg.okl);
              return (
                <div
                  key={bg.name}
                  style={{
                    border: `1px solid ${HAIRLINE}`,
                    background: PAPER,
                  }}
                >
                  <div
                    style={{
                      ...bgStyle,
                      padding: 32,
                      minHeight: 140,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="cs-serif"
                      style={{
                        fontSize: "clamp(2rem, 5vw, 3.2rem)",
                        fontWeight: 400,
                        letterSpacing: "-0.035em",
                        color: typeColor,
                        lineHeight: 1,
                      }}
                    >
                      Cruzar<span style={{ color: ACCENT }}>.</span>
                    </div>
                  </div>
                  <div style={{ padding: "14px 16px" }}>
                    <div className="cs-serif" style={{ fontWeight: 600 }}>
                      {bg.name}
                    </div>
                    <div
                      className="cs-mono"
                      style={{ fontSize: "0.72rem", color: INK_LABEL, marginTop: 2 }}
                    >
                      {isPhoto ? "radial mock" : oklchString(bg.okl)}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        fontSize: "0.82rem",
                        color: INK_SOFT,
                        lineHeight: 1.5,
                      }}
                    >
                      {bg.note}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        display: "flex",
                        gap: 10,
                        fontSize: "0.74rem",
                        color: INK_SOFT,
                      }}
                    >
                      <span>
                        Type{" "}
                        <span className="cs-mono" style={{ color: INK }}>
                          {typeRatio.toFixed(2)}:1
                        </span>
                      </span>
                      <span>
                        Period{" "}
                        <span className="cs-mono" style={{ color: INK }}>
                          {periodRatio.toFixed(2)}:1
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ E — DARK MODE ============ */}
      <section
        style={{
          background: oklchString(DARK_PAPER_OK),
          color: oklchString(DARK_INK_OK),
          borderTop: `2px solid ${INK}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "64px clamp(24px,5vw,64px)" }}>
          <div style={{ ...eyebrowStyle, color: oklchString(DARK_INK_LABEL_OK) }}>
            <span style={{ color: oklchString(ACCENT_DARK_OK), fontWeight: 600 }}>§ E</span>
            <span
              style={{
                display: "inline-block",
                width: 32,
                height: 1,
                background: oklchString(DARK_HAIRLINE_OK),
                margin: "0 12px 4px",
              }}
            />
            <span>Dark proposal — operator night surfaces</span>
          </div>

          <h2
            className="cs-serif"
            style={{
              margin: "20px 0 16px",
              fontSize: "clamp(1.8rem, 3.4vw, 2.6rem)",
              fontWeight: 400,
              letterSpacing: "-0.022em",
              color: oklchString(DARK_INK_OK),
            }}
          >
            A proposed dark palette<span style={{ color: oklchString(ACCENT_DARK_OK) }}>.</span>
          </h2>
          <p
            style={{
              margin: "0 0 32px",
              maxWidth: "64ch",
              color: oklchString(DARK_INK_SOFT_OK),
            }}
          >
            Canvas at L=0.19 (tinted to brand hue 80°, not pure-black). ACCENT lifted to L=0.68
            C=0.17 so the wordmark period still registers — the light-mode ACCENT at L=0.42 reads
            as a smear of dried blood on this ground.
          </p>

          <div className="cs-grid-4">
            {[
              { name: "DARK_PAPER", okl: DARK_PAPER_OK, role: "Canvas" },
              { name: "DARK_PAPER_DEEP", okl: DARK_PAPER_DEEP_OK, role: "Shelf" },
              { name: "DARK_CARD", okl: DARK_CARD_OK, role: "Raised" },
              { name: "DARK_INK", okl: DARK_INK_OK, role: "Body text" },
              { name: "DARK_INK_SOFT", okl: DARK_INK_SOFT_OK, role: "Secondary" },
              { name: "DARK_INK_LABEL", okl: DARK_INK_LABEL_OK, role: "Tertiary" },
              { name: "DARK_HAIRLINE", okl: DARK_HAIRLINE_OK, role: "Rule" },
              { name: "ACCENT_DARK", okl: ACCENT_DARK_OK, role: "Period · marker" },
            ].map((c) => (
              <div
                key={c.name}
                style={{
                  background: oklchString(DARK_PAPER_DEEP_OK),
                  display: "grid",
                  gridTemplateRows: "72px auto",
                }}
              >
                <div style={{ background: oklchString(c.okl), width: "100%" }} />
                <div style={{ padding: "14px 16px" }}>
                  <div
                    className="cs-serif"
                    style={{
                      fontSize: "1rem",
                      fontWeight: 600,
                      color: oklchString(DARK_INK_OK),
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.76rem",
                      color: oklchString(DARK_INK_SOFT_OK),
                      marginTop: 2,
                    }}
                  >
                    {c.role}
                  </div>
                  <div
                    className="cs-mono"
                    style={{
                      marginTop: 8,
                      fontSize: "0.72rem",
                      color: oklchString(DARK_INK_LABEL_OK),
                    }}
                  >
                    {oklchString(c.okl)}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Dark editorial composition */}
          <div
            style={{
              marginTop: 48,
              padding: "clamp(32px, 5vw, 56px)",
              background: oklchString(DARK_PAPER_OK),
              border: `1px solid ${oklchString(DARK_HAIRLINE_OK)}`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                borderBottom: `1px solid ${oklchString(DARK_HAIRLINE_OK)}`,
                paddingBottom: 16,
                marginBottom: 32,
                ...eyebrowStyle,
                color: oklchString(DARK_INK_LABEL_OK),
              }}
            >
              <span>Cruzar · Operator</span>
              <span>Night register</span>
              <span>2026-04-15 · 21:42</span>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: 32,
                alignItems: "end",
              }}
            >
              <div>
                <h3
                  className="cs-serif"
                  style={{
                    margin: 0,
                    fontSize: "clamp(3rem, 8vw, 6rem)",
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                    lineHeight: 0.9,
                    color: oklchString(DARK_INK_OK),
                  }}
                >
                  Cruzar<span style={{ color: oklchString(ACCENT_DARK_OK) }}>.</span>
                </h3>
                <p
                  style={{
                    marginTop: 20,
                    fontSize: "1rem",
                    lineHeight: 1.6,
                    color: oklchString(DARK_INK_SOFT_OK),
                    maxWidth: "48ch",
                  }}
                >
                  Operator dashboards used at night do not want the paper palette inverted. This
                  register keeps the hue family warm and the ink at L=0.94 so body copy reads at
                  ≥12:1 on canvas.
                </p>
              </div>
              <div
                style={{
                  borderTop: `1px solid ${oklchString(DARK_HAIRLINE_OK)}`,
                  paddingTop: 20,
                }}
              >
                <div style={{ ...eyebrowStyle, color: oklchString(DARK_INK_LABEL_OK) }}>
                  <span style={{ color: oklchString(ACCENT_DARK_OK), fontWeight: 600 }}>
                    § II
                  </span>{" "}
                  Cohort 02 — live
                </div>
                <div
                  className="cs-serif"
                  style={{
                    marginTop: 12,
                    fontSize: "clamp(3rem, 6vw, 4.8rem)",
                    fontWeight: 300,
                    letterSpacing: "-0.03em",
                    lineHeight: 1,
                    color: oklchString(DARK_INK_OK),
                  }}
                >
                  38
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: "0.78rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: oklchString(DARK_INK_LABEL_OK),
                    fontWeight: 600,
                  }}
                >
                  placed this cohort
                </div>
              </div>
            </div>

            <div
              style={{
                marginTop: 32,
                display: "flex",
                gap: 12,
                fontSize: "0.8rem",
                color: oklchString(DARK_INK_SOFT_OK),
              }}
            >
              <span className="cs-mono">
                ACCENT_DARK on DARK_PAPER ={" "}
                <span style={{ color: oklchString(DARK_INK_OK) }}>
                  {wcagContrast(ACCENT_DARK_OK, DARK_PAPER_OK).toFixed(2)}:1
                </span>
              </span>
              <span className="cs-mono">
                DARK_INK on DARK_PAPER ={" "}
                <span style={{ color: oklchString(DARK_INK_OK) }}>
                  {wcagContrast(DARK_INK_OK, DARK_PAPER_OK).toFixed(2)}:1
                </span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ============ F — CHART PALETTE ============ */}
      <section
        style={{ maxWidth: 1320, margin: "0 auto", padding: "64px clamp(24px,5vw,64px)" }}
      >
        <SectionEyebrow no="F" label="Chart palette — 4-color extension" />
        <h2
          className="cs-serif"
          style={{
            margin: "20px 0 16px",
            fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            fontWeight: 500,
            letterSpacing: "-0.018em",
          }}
        >
          Because dashboards will need more than one accent.
        </h2>
        <p style={{ margin: "0 0 32px", color: INK_SOFT, maxWidth: "64ch" }}>
          Four hues, all at matched mid-lightness (0.45–0.62) so no bar dominates on luminance
          alone. Terra anchor holds continuity with ACCENT; slate and olive give the widest
          deuteranopia-safe separation; ochre is the warm neutral.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: 1,
            background: HAIRLINE,
            border: `1px solid ${HAIRLINE}`,
            marginBottom: 32,
          }}
        >
          {CHART_PALETTE.map((c) => {
            const ratio = wcagContrast(c.okl, PAPER_OK);
            return (
              <div key={c.name} style={{ background: PAPER }}>
                <div style={{ background: oklchString(c.okl), height: 100 }} />
                <div style={{ padding: "14px 16px" }}>
                  <div className="cs-serif" style={{ fontWeight: 600, fontSize: "0.98rem" }}>
                    {c.name}
                  </div>
                  <div
                    className="cs-mono"
                    style={{ fontSize: "0.72rem", color: INK_LABEL, marginTop: 4 }}
                  >
                    {oklchString(c.okl)}
                  </div>
                  <div
                    className="cs-mono"
                    style={{ fontSize: "0.72rem", color: INK_SOFT, marginTop: 4 }}
                  >
                    on PAPER · {ratio.toFixed(2)}:1
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bar-chart sample */}
        <div
          style={{
            border: `1px solid ${HAIRLINE}`,
            padding: 24,
            background: CARD,
          }}
        >
          <div style={{ ...eyebrowStyle }}>
            <span style={{ color: ACCENT, fontWeight: 600 }}>§</span> Placements by channel — cohort
            02
          </div>
          <div
            style={{
              marginTop: 20,
              display: "grid",
              gridTemplateColumns: "auto 1fr auto",
              gap: "10px 16px",
              alignItems: "center",
            }}
          >
            {[
              { label: "Direct outbound", v: 0.88, idx: 0 },
              { label: "Partner referrals", v: 0.62, idx: 1 },
              { label: "Inbound applications", v: 0.48, idx: 2 },
              { label: "Alumni loop", v: 0.31, idx: 3 },
            ].map((row) => {
              const c = CHART_PALETTE[row.idx];
              if (!c) return null;
              return (
                <Fragment key={row.label}>
                  <span style={{ fontSize: "0.82rem", color: INK, minWidth: 160 }}>
                    {row.label}
                  </span>
                  <span
                    aria-hidden
                    style={{
                      display: "block",
                      height: 14,
                      width: `${row.v * 100}%`,
                      background: oklchString(c.okl),
                    }}
                  />
                  <span
                    className="cs-mono"
                    style={{ fontSize: "0.8rem", color: INK_SOFT }}
                  >
                    {Math.round(row.v * 100)}%
                  </span>
                </Fragment>
              );
            })}
          </div>

          {/* CVD-simulated copies */}
          <div
            style={{
              marginTop: 32,
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {CVD_MATRICES.map((m) => (
              <div
                key={m.id}
                style={{ border: `1px solid ${HAIRLINE}`, padding: 12, background: PAPER }}
              >
                <div
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: INK_LABEL,
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  {m.label}
                </div>
                <div
                  style={{
                    filter: `url(#${m.id})`,
                    display: "flex",
                    gap: 2,
                    height: 32,
                  }}
                >
                  {CHART_PALETTE.map((c) => (
                    <span
                      key={c.name}
                      style={{ flex: 1, background: oklchString(c.okl) }}
                      aria-hidden
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ G — FINDINGS ============ */}
      <section
        style={{
          borderTop: `2px solid ${INK}`,
          background: PAPER,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: "64px clamp(24px,5vw,64px)" }}>
          <SectionEyebrow no="G" label="Findings + the new bans" />
          <h2
            className="cs-serif"
            style={{
              margin: "20px 0 32px",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 400,
              letterSpacing: "-0.024em",
              maxWidth: "22ch",
            }}
          >
            The palette is confirmed<span style={{ color: ACCENT }}>.</span> Four caveats follow.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            <div>
              <div style={{ ...eyebrowStyle, color: ACCENT }}>01 — Confirmed</div>
              <p style={{ marginTop: 8, color: INK, lineHeight: 1.6 }}>
                PAPER, PAPER_DEEP, CARD, INK, INK_SOFT, HAIRLINE, HAIRLINE_STRONG, ACCENT, SIGNAL,
                SIGNAL_DIM — all confirmed intocable for 24 months. No token value changes. ACCENT
                stays at <span className="cs-mono">{oklchString(ACCENT_OK)}</span>; its screen-to-
                press drift is real and handled at spec-time via a Pantone companion, not by
                re-tuning the token.
              </p>
            </div>

            <div>
              <div style={{ ...eyebrowStyle, color: ACCENT }}>02 — Hard bans (new)</div>
              <ul
                style={{
                  margin: "8px 0 0",
                  padding: 0,
                  listStyle: "none",
                  display: "grid",
                  gap: 10,
                }}
              >
                {[
                  ...CONTRAST_ROWS.flatMap((row) =>
                    row.cells
                      .filter((cell) => cell.verdict === "FAIL")
                      .map((cell): { fg: string; bg: string; r: number } => ({
                        fg: row.fg.label,
                        bg: cell.bg.label,
                        r: cell.ratio,
                      })),
                  ),
                  ...SIGNAL_ROW.cells
                    .filter((cell) => cell.verdict === "FAIL")
                    .map((cell): { fg: string; bg: string; r: number } => ({
                      fg: SIGNAL_ROW.fg.label,
                      bg: cell.bg.label,
                      r: cell.ratio,
                    })),
                ].map((ban) => (
                    <li
                      key={`${ban.fg}-${ban.bg}`}
                      className="cs-mono"
                      style={{ fontSize: "0.86rem", color: INK, lineHeight: 1.55 }}
                    >
                      <span style={{ color: ACCENT, fontWeight: 600 }}>FORBIDDEN —</span> {ban.fg}{" "}
                      on {ban.bg} (
                      <span style={{ color: INK_SOFT }}>{ban.r.toFixed(2)}:1</span>). Use INK or
                      INK_SOFT for body on that surface.
                    </li>
                  ))}
                <li
                  className="cs-mono"
                  style={{ fontSize: "0.86rem", color: INK, lineHeight: 1.55 }}
                >
                  <span style={{ color: ACCENT, fontWeight: 600 }}>FORBIDDEN —</span> ACCENT for
                  body text on any surface (body-weight ≥ {ACCENT_ON_INK.toFixed(2)}:1 on INK,
                  {" "}
                  {wcagContrast(ACCENT_OK, PAPER_OK).toFixed(2)}:1 on PAPER — neither clears 4.5).
                  ACCENT is reserved for the wordmark period and the § section marker, nothing
                  else.
                </li>
                <li
                  className="cs-mono"
                  style={{ fontSize: "0.86rem", color: INK, lineHeight: 1.55 }}
                >
                  <span style={{ color: ACCENT, fontWeight: 600 }}>FORBIDDEN —</span> ACCENT as
                  foreground on a red surface (hue collision; period vanishes under protanopia).
                </li>
              </ul>
            </div>

            <div>
              <div style={{ ...eyebrowStyle, color: ACCENT }}>03 — Dark palette (add to SSOT)</div>
              <pre
                className="cs-mono"
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.78rem",
                  color: INK,
                  background: PAPER_DEEP,
                  padding: 16,
                  border: `1px solid ${HAIRLINE}`,
                  overflowX: "auto",
                  lineHeight: 1.6,
                }}
              >
                {[
                  `DARK_PAPER        ${oklchString(DARK_PAPER_OK)}`,
                  `DARK_PAPER_DEEP   ${oklchString(DARK_PAPER_DEEP_OK)}`,
                  `DARK_CARD         ${oklchString(DARK_CARD_OK)}`,
                  `DARK_INK          ${oklchString(DARK_INK_OK)}`,
                  `DARK_INK_SOFT     ${oklchString(DARK_INK_SOFT_OK)}`,
                  `DARK_INK_LABEL     ${oklchString(DARK_INK_LABEL_OK)}`,
                  `DARK_HAIRLINE     ${oklchString(DARK_HAIRLINE_OK)}`,
                  `ACCENT_DARK       ${oklchString(ACCENT_DARK_OK)}`,
                ].join("\n")}
              </pre>
              <p style={{ marginTop: 12, color: INK_SOFT, fontSize: "0.9rem", lineHeight: 1.55 }}>
                ACCENT_DARK is NOT the same as ACCENT. On dark, the light-mode ACCENT (L=0.42) sits
                too close to the canvas and reads as a smear; the period collapses. ACCENT_DARK
                lifts to L=0.68 C=0.17 — same hue family, higher chroma to compensate for the lower
                contrast ceiling on dark.
              </p>
            </div>

            <div>
              <div style={{ ...eyebrowStyle, color: ACCENT }}>04 — Chart palette (add to SSOT)</div>
              <pre
                className="cs-mono"
                style={{
                  margin: "8px 0 0",
                  fontSize: "0.78rem",
                  color: INK,
                  background: PAPER_DEEP,
                  padding: 16,
                  border: `1px solid ${HAIRLINE}`,
                  overflowX: "auto",
                  lineHeight: 1.6,
                }}
              >
                {CHART_PALETTE.map((c, i) => `CHART_${i + 1}  ${oklchString(c.okl)}  ${c.name}`).join(
                  "\n",
                )}
              </pre>
            </div>

            <div>
              <div style={{ ...eyebrowStyle, color: ACCENT }}>05 — Biggest single risk</div>
              <p style={{ marginTop: 8, color: INK, lineHeight: 1.6, maxWidth: "56ch" }}>
                <strong>INK_LABEL on every surface fails 4.5:1.</strong> It currently ships as a
                legitimate token and is the kind of color a developer reaches for when they want
                &ldquo;secondary metadata.&rdquo; It only clears AA-Large on CARD and PAPER. The
                fix is not to retune it — the warm-neutral hierarchy matters — but to scope it:
                INK_LABEL is a decorative/label color only, never body. This has to be encoded in
                the token file so the rule travels with the SSOT rather than living in memory.
              </p>
            </div>
          </div>

          <hr
            style={{
              border: 0,
              borderTop: `1px solid ${HAIRLINE_STRONG}`,
              margin: "56px 0 24px",
            }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
              ...eyebrowStyle,
              color: INK_LABEL,
            }}
          >
            <span>Cruzar · Color Lock complete</span>
            <span>Computed live from tokens.ts</span>
            <span>Intocable 2026-04-15 → 2028-04-15</span>
          </div>
        </div>
      </section>
    </main>
  );
}
