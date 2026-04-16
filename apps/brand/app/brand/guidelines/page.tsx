import type { CSSProperties, ReactNode } from "react";
import { Logotype } from "@/components/Logotype";
import { body, bodyDense, display, mono } from "@/lib/fonts";
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
  SIGNAL_DIM,
  space,
} from "@/lib/tokens";

/**
 * Cruzar — Brand Guidelines (Capa 5 visual reference).
 *
 * Mirror-image of /product/cruzar/brand-guidelines.md in navigable form.
 * For each rule in the markdown, render a do/don't pair so a teammate can
 * absorb the brand without reading the markdown.
 *
 * All color, font, and space values consumed from @/lib/tokens and
 * @/lib/fonts — never inline. The only "inline" color literals permitted
 * are the two reserved CSS tokens: `transparent` (for the transparent
 * spacer in SVG) and `currentColor` (wordmark ink inheritance).
 */

const EYEBROW_STYLE: CSSProperties = {
  display: "inline-flex",
  alignItems: "baseline",
  gap: space[3],
  fontFamily: "var(--cruzar-body)",
  fontSize: "0.72rem",
  letterSpacing: "0.22em",
  textTransform: "uppercase",
  color: INK_LABEL,
  fontWeight: 600,
};

const RULE_BOX: CSSProperties = {
  border: `1px solid ${HAIRLINE}`,
  background: CARD,
  padding: space[6],
  display: "flex",
  flexDirection: "column",
  gap: space[4],
};

const DO_LABEL: CSSProperties = {
  fontFamily: "var(--cruzar-mono)",
  fontSize: "0.68rem",
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: INK,
  fontWeight: 700,
};

const DONT_LABEL: CSSProperties = {
  ...DO_LABEL,
  color: ACCENT,
};

function SectionHeader({ no, title, lede }: { no: string; title: string; lede: string }) {
  return (
    <header
      style={{
        display: "flex",
        flexDirection: "column",
        gap: space[3],
        paddingBottom: space[6],
        borderBottom: `2px solid ${INK}`,
        marginBottom: space[8],
      }}
    >
      <span style={EYEBROW_STYLE}>
        <span style={{ color: ACCENT, fontWeight: 700 }}>§ {no}</span>
        <span style={{ width: 32, height: 1, background: HAIRLINE }} />
        <span>{title}</span>
      </span>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--cruzar-display), ui-serif, Georgia, serif",
          fontSize: "clamp(1.4rem, 2.4vw, 2rem)",
          lineHeight: 1.18,
          letterSpacing: "-0.012em",
          fontWeight: 400,
          color: INK,
          maxWidth: "52ch",
        }}
      >
        {lede}
      </p>
    </header>
  );
}

function DoDont({
  doNode,
  dontNode,
  doCaption,
  dontCaption,
  doBackground = PAPER,
  dontBackground = PAPER,
}: {
  doNode: ReactNode;
  dontNode: ReactNode;
  doCaption: string;
  dontCaption: string;
  doBackground?: string;
  dontBackground?: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: space[4],
      }}
    >
      <figure
        style={{
          margin: 0,
          border: `1px solid ${HAIRLINE}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: space[3],
            borderBottom: `1px solid ${HAIRLINE}`,
            background: CARD,
            display: "flex",
            alignItems: "center",
            gap: space[2],
          }}
        >
          <span aria-hidden style={{ color: INK, fontFamily: "var(--cruzar-mono)" }}>
            ✓
          </span>
          <span style={DO_LABEL}>DO</span>
        </div>
        <div
          style={{
            background: doBackground,
            padding: space[6],
            minHeight: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {doNode}
        </div>
        <figcaption
          style={{
            padding: `${space[3]} ${space[4]}`,
            fontFamily: "var(--cruzar-body)",
            fontSize: "0.82rem",
            color: INK_SOFT,
            lineHeight: 1.5,
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          {doCaption}
        </figcaption>
      </figure>
      <figure
        style={{
          margin: 0,
          border: `1px solid ${HAIRLINE}`,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: space[3],
            borderBottom: `1px solid ${HAIRLINE}`,
            background: CARD,
            display: "flex",
            alignItems: "center",
            gap: space[2],
          }}
        >
          <span aria-hidden style={{ color: ACCENT, fontFamily: "var(--cruzar-mono)" }}>
            ✗
          </span>
          <span style={DONT_LABEL}>DON'T</span>
        </div>
        <div
          style={{
            background: dontBackground,
            padding: space[6],
            minHeight: 180,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {dontNode}
        </div>
        <figcaption
          style={{
            padding: `${space[3]} ${space[4]}`,
            fontFamily: "var(--cruzar-body)",
            fontSize: "0.82rem",
            color: INK_SOFT,
            lineHeight: 1.5,
            borderTop: `1px solid ${HAIRLINE}`,
          }}
        >
          {dontCaption}
        </figcaption>
      </figure>
    </div>
  );
}

/** Wordmark with dashed clear-space markers overlaid. */
function WordmarkWithClearspace() {
  const heightPx = 96;
  return (
    <div
      style={{
        position: "relative",
        display: "inline-block",
        padding: heightPx * 0.56, // ~1x C-height on all sides
        border: `1px dashed ${INK_LABEL}`,
      }}
    >
      <div
        style={{
          position: "relative",
          display: "inline-block",
        }}
      >
        <Logotype height={heightPx} />
      </div>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: space[1],
          right: space[2],
          fontFamily: "var(--cruzar-mono)",
          fontSize: "0.62rem",
          letterSpacing: "0.14em",
          color: INK_LABEL,
        }}
      >
        1× C-HEIGHT CLEAR SPACE
      </span>
    </div>
  );
}

function WordmarkOnForbiddenBackground() {
  // Forbidden: background within ΔE 25 of ACCENT — we illustrate with a tint near ACCENT
  const nearAccent = "oklch(0.48 0.12 30)";
  return (
    <div
      style={{
        background: nearAccent,
        padding: space[6],
        display: "inline-block",
        position: "relative",
      }}
    >
      <Logotype height={56} style={{ color: INK }} />
      <span
        aria-hidden
        style={{
          position: "absolute",
          bottom: 4,
          right: 6,
          fontFamily: "var(--cruzar-mono)",
          fontSize: "0.58rem",
          letterSpacing: "0.14em",
          color: PAPER,
          opacity: 0.85,
        }}
      >
        ΔE &lt; 25 vs ACCENT
      </span>
    </div>
  );
}

function TiltedWordmark() {
  return (
    <div
      style={{
        transform: "rotate(-6deg) skewX(-8deg)",
        display: "inline-block",
      }}
    >
      <Logotype height={56} style={{ color: INK }} />
    </div>
  );
}

function ShadowedWordmark() {
  return (
    <div
      style={{
        display: "inline-block",
        filter: `drop-shadow(4px 6px 0 ${SIGNAL_DIM}) drop-shadow(1px 2px 4px ${INK_LABEL})`,
      }}
    >
      <Logotype height={56} style={{ color: INK }} />
    </div>
  );
}

function WordmarkMissingPeriod() {
  return (
    <span
      style={{
        fontFamily: "var(--cruzar-display), ui-serif, Georgia, serif",
        fontSize: "4rem",
        fontWeight: 400,
        letterSpacing: "-0.045em",
        lineHeight: 0.9,
        color: INK,
      }}
    >
      Cruzar
    </span>
  );
}

function WordmarkRecoloredPeriod() {
  return (
    <span
      style={{
        fontFamily: "var(--cruzar-display), ui-serif, Georgia, serif",
        fontSize: "4rem",
        fontWeight: 400,
        letterSpacing: "-0.045em",
        lineHeight: 0.9,
        color: INK,
      }}
    >
      Cruzar<span style={{ color: SIGNAL }}>.</span>
    </span>
  );
}

function WordmarkReplacedPeriod() {
  return (
    <span
      style={{
        fontFamily: "var(--cruzar-display), ui-serif, Georgia, serif",
        fontSize: "4rem",
        fontWeight: 400,
        letterSpacing: "-0.045em",
        lineHeight: 0.9,
        color: INK,
      }}
    >
      Cruzar<span style={{ color: ACCENT }}>*</span>
    </span>
  );
}

// ---------------------------------------------------------------------------
// Color pair sample
// ---------------------------------------------------------------------------

function ContrastSample({
  fg,
  bg,
  ratio,
  grade,
  passing,
  label,
}: {
  fg: string;
  bg: string;
  ratio: string;
  grade: string;
  passing: boolean;
  label: string;
}) {
  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${HAIRLINE}`,
        padding: space[4],
        display: "flex",
        flexDirection: "column",
        gap: space[2],
        minHeight: 130,
      }}
    >
      <div
        style={{
          color: fg,
          fontFamily: "var(--cruzar-body)",
          fontSize: "1rem",
          lineHeight: 1.5,
          fontWeight: 500,
        }}
      >
        Cruza del salario local al internacional.
      </div>
      <div
        style={{
          color: fg,
          fontFamily: "var(--cruzar-body)",
          fontSize: "0.78rem",
          opacity: 0.85,
          marginTop: "auto",
        }}
      >
        {label}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "var(--cruzar-mono)",
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: fg,
          opacity: 0.85,
        }}
      >
        <span>{ratio}</span>
        <span style={{ color: passing ? fg : ACCENT, fontWeight: 700 }}>{grade}</span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Color swatch
// ---------------------------------------------------------------------------

function ColorSwatch({
  token,
  value,
  role,
  fill,
  ink,
}: {
  token: string;
  value: string;
  role: string;
  fill: string;
  ink: string;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateRows: "120px auto",
        border: `1px solid ${HAIRLINE}`,
        background: CARD,
      }}
    >
      <div style={{ background: fill, width: "100%" }} />
      <div style={{ padding: space[4], display: "flex", flexDirection: "column", gap: space[1] }}>
        <span
          style={{
            fontFamily: "var(--cruzar-mono)",
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            color: INK,
            fontWeight: 700,
          }}
        >
          {token}
        </span>
        <span style={{ fontSize: "0.78rem", color: INK_SOFT, fontFamily: "var(--cruzar-body)" }}>
          {role}
        </span>
        <span
          style={{
            marginTop: space[2],
            fontFamily: "var(--cruzar-mono)",
            fontSize: "0.72rem",
            color: INK_LABEL,
          }}
        >
          {value}
        </span>
        <span
          aria-hidden
          style={{
            fontFamily: "var(--cruzar-mono)",
            fontSize: "0.62rem",
            letterSpacing: "0.14em",
            color: ink === PAPER ? INK_LABEL : INK_LABEL,
          }}
        >
          ink ref · {ink === PAPER ? "paper" : "ink"}
        </span>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Type specimen row
// ---------------------------------------------------------------------------

function TypeSpecimen({
  role,
  family,
  sample,
  fontFamily,
  size,
  weight,
  letterSpacing,
  upper,
}: {
  role: string;
  family: string;
  sample: string;
  fontFamily: string;
  size: string;
  weight: number;
  letterSpacing?: string;
  upper?: boolean;
}) {
  return (
    <div
      style={{
        borderTop: `1px solid ${HAIRLINE}`,
        padding: `${space[6]} ${space[6]}`,
        display: "grid",
        gridTemplateColumns: "220px 1fr",
        gap: space[6],
        alignItems: "baseline",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: space[1] }}>
        <span
          style={{
            fontFamily: "var(--cruzar-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: INK,
            fontWeight: 700,
          }}
        >
          {role}
        </span>
        <span
          style={{
            fontFamily: "var(--cruzar-mono)",
            fontSize: "0.7rem",
            color: INK_LABEL,
            letterSpacing: "0.08em",
          }}
        >
          {family} · {size}
        </span>
      </div>
      <div
        style={{
          fontFamily,
          fontSize: size,
          fontWeight: weight,
          letterSpacing,
          color: INK,
          lineHeight: 1.2,
          textTransform: upper ? "uppercase" : "none",
        }}
      >
        {sample}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Spacing scale visual
// ---------------------------------------------------------------------------

function SpaceBar({ token, px }: { token: string; px: string }) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "80px 1fr 80px",
        gap: space[4],
        alignItems: "center",
        padding: `${space[2]} 0`,
        borderBottom: `1px solid ${HAIRLINE}`,
        fontFamily: "var(--cruzar-mono)",
        fontSize: "0.78rem",
        color: INK,
      }}
    >
      <span style={{ color: INK_LABEL, letterSpacing: "0.08em" }}>{token}</span>
      <span
        aria-hidden
        style={{
          display: "block",
          height: 8,
          width: px,
          background: INK,
          maxWidth: "100%",
        }}
      />
      <span style={{ color: INK_LABEL, textAlign: "right", letterSpacing: "0.08em" }}>{px}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const SECTION_PADDING = `clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)`;

export default function BrandGuidelinesPage() {
  return (
    <main
      className={`${display.variable} ${body.variable} ${bodyDense.variable} ${mono.variable}`}
      style={{
        background: PAPER,
        color: INK,
        minHeight: "100vh",
        fontFamily: "var(--cruzar-body), ui-sans-serif, system-ui, sans-serif",
        fontSize: "16px",
        lineHeight: 1.55,
        fontVariantNumeric: "tabular-nums lining-nums",
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
      }}
    >
      {/* MASTHEAD */}
      <header
        style={{
          maxWidth: 1320,
          margin: "0 auto",
          padding: "32px clamp(24px, 5vw, 64px) 24px",
          borderBottom: `2px solid ${INK}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: space[6],
          flexWrap: "wrap",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: INK_SOFT,
        }}
      >
        <span>Cruzar · Brand Guidelines</span>
        <span>Capa 05 — Usage Rules Lock</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>Version 2026-04-15</span>
      </header>

      {/* INTRO */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap: space[12],
            alignItems: "end",
            borderBottom: `1px solid ${HAIRLINE}`,
            paddingBottom: space[12],
          }}
        >
          <div>
            <p
              style={{
                margin: 0,
                marginBottom: space[3],
                ...EYEBROW_STYLE,
              }}
            >
              The rules, rendered
            </p>
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--cruzar-display), ui-serif, Georgia, serif",
                fontSize: "clamp(3rem, 7vw, 5.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.03em",
                lineHeight: 0.95,
                color: INK,
              }}
            >
              How <em style={{ fontStyle: "italic", color: INK_SOFT }}>Cruzar</em>
              <span style={{ color: ACCENT }}>.</span>
              <br />
              is used.
            </h1>
            <p
              style={{
                margin: `${space[6]} 0 0`,
                fontSize: "1.02rem",
                color: INK_SOFT,
                maxWidth: "60ch",
                lineHeight: 1.6,
              }}
            >
              One screen, every rule, paired side-by-side as DO and DON'T. Mirror of the
              canonical Spanish reference at <code>product/cruzar/brand-guidelines.md</code>.
              Before shipping anything — email signature, slide, template, tweet — skim this
              page to catch the reflex mistakes.
            </p>
          </div>
          <div
            style={{
              fontFamily: "var(--cruzar-mono)",
              fontSize: "0.78rem",
              color: INK_LABEL,
              letterSpacing: "0.08em",
              lineHeight: 1.7,
              textAlign: "right",
            }}
          >
            TOKENS · /apps/brand/lib/tokens.ts
            <br />
            FONTS · /apps/brand/lib/fonts.ts
            <br />
            CONTENT · /apps/brand/lib/content.ts
            <br />
            MD · /product/cruzar/brand-guidelines.md
          </div>
        </div>
      </section>

      {/* A — THE WORDMARK */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
        <SectionHeader
          no="A"
          title="The wordmark"
          lede="Cruzar plus one accent period. The period is not punctuation — it is part of the mark. Clear space, minimum size, allowed grounds, and the long list of modifications that are never acceptable."
        />

        {/* A.2 Clear space */}
        <div style={{ ...RULE_BOX, marginBottom: space[8] }}>
          <h3 style={{ margin: 0, ...DO_LABEL }}>A.2 · Clear space</h3>
          <DoDont
            doNode={<WordmarkWithClearspace />}
            dontNode={
              <div
                style={{
                  border: `1px solid ${INK_LABEL}`,
                  padding: space[2],
                  display: "inline-block",
                }}
              >
                <Logotype height={96} />
              </div>
            }
            doCaption="1× C-height padding on all sides. Dashed boundary illustrates the forbidden keep-out zone — nothing inside except the mark and the paper."
            dontCaption="Tight padding crowds the mark. Any element — rule, text, icon — that enters the clear-space zone breaks A.2."
          />
        </div>

        {/* A.3 Minimum size */}
        <div style={{ ...RULE_BOX, marginBottom: space[8] }}>
          <h3 style={{ margin: 0, ...DO_LABEL }}>A.3 · Minimum size (provisional — Capa 1 pending)</h3>
          <DoDont
            doNode={
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
                <Logotype height={24} />
                <span
                  style={{
                    fontFamily: "var(--cruzar-mono)",
                    fontSize: "0.68rem",
                    color: INK_LABEL,
                    letterSpacing: "0.12em",
                  }}
                >
                  24 PX · MIN DIGITAL
                </span>
              </div>
            }
            dontNode={
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: space[2] }}>
                <Logotype height={12} />
                <span
                  style={{
                    fontFamily: "var(--cruzar-mono)",
                    fontSize: "0.68rem",
                    color: ACCENT,
                    letterSpacing: "0.12em",
                  }}
                >
                  12 PX · BELOW MINIMUM
                </span>
              </div>
            }
            doCaption="20 px on screen, 5 mm offset / 8 mm screenprint / 10 mm relief — the locked minimum sizes for Literata Regular (Capa 1). Below these, the C's stroke modulation collapses and the accent dot reads as noise. Favicon (16×16) switches to the mark-only variant."
            dontCaption="Below 24 px the period becomes an ambiguous speck and the mark degrades into generic text. Never ship a sub-minimum wordmark."
          />
        </div>

        {/* A.4 Allowed grounds */}
        <div style={{ ...RULE_BOX, marginBottom: space[8] }}>
          <h3 style={{ margin: 0, ...DO_LABEL }}>A.4 · Allowed contexts</h3>
          <DoDont
            doNode={<Logotype height={64} style={{ color: INK }} />}
            dontNode={<WordmarkOnForbiddenBackground />}
            doBackground={PAPER}
            dontBackground={PAPER_DEEP}
            doCaption="Ink on paper, paper on ink, or monochrome 1-bit when reproduction demands it. Three grounds, no more."
            dontCaption="Any background within ΔE 25 of ACCENT — the period disappears or reads as a mark of the background rather than the brand."
          />
          <DoDont
            doNode={<Logotype height={64} style={{ color: PAPER }} />}
            dontNode={
              <div
                style={{
                  background: `linear-gradient(135deg, ${ACCENT}, ${SIGNAL})`,
                  padding: space[6],
                }}
              >
                <Logotype height={48} style={{ color: PAPER }} />
              </div>
            }
            doBackground={INK}
            dontBackground={PAPER}
            doCaption="Paper on ink — valid inversion. The period remains in ACCENT; it is the single always-accent mark."
            dontCaption="Gradients behind the wordmark are forbidden without exception. No conic, linear, or radial gradient is acceptable."
          />
        </div>

        {/* A.5 Forbidden modifications */}
        <div style={RULE_BOX}>
          <h3 style={{ margin: 0, ...DO_LABEL }}>A.5 · Forbidden modifications</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: space[4],
            }}
          >
            {[
              {
                node: <TiltedWordmark />,
                reason: "BANNED — tilt / skew · projects 'startup toy', destroys Literata optical calibration",
              },
              {
                node: <ShadowedWordmark />,
                reason: "BANNED — drop shadow · top-tier AI slop tell, kills the flat editorial register",
              },
              {
                node: (
                  <span
                    style={{
                      fontFamily: "var(--cruzar-display)",
                      fontSize: "3rem",
                      fontWeight: 400,
                      letterSpacing: "-0.045em",
                      color: INK,
                      WebkitTextStroke: `2px ${ACCENT}`,
                    }}
                  >
                    Cruzar<span style={{ color: ACCENT }}>.</span>
                  </span>
                ),
                reason: "BANNED — outline / stroke · Cruzar never needs outline; using it signals emergency contrast fix",
              },
              {
                node: <WordmarkMissingPeriod />,
                reason: "BANNED — period removed · the period is part of the mark, not punctuation. Removing it is deleting the r",
              },
              {
                node: <WordmarkRecoloredPeriod />,
                reason: "BANNED — period in SIGNAL · the period is always ACCENT. No other color",
              },
              {
                node: <WordmarkReplacedPeriod />,
                reason: "BANNED — period replaced · no asterisk, dash, emoji, or circle. Typographic period only",
              },
            ].map((m) => (
              <figure
                key={m.reason}
                style={{
                  margin: 0,
                  border: `1px solid ${HAIRLINE}`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    background: PAPER,
                    padding: space[6],
                    minHeight: 120,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {m.node}
                </div>
                <figcaption
                  style={{
                    padding: space[3],
                    borderTop: `1px solid ${HAIRLINE}`,
                    background: CARD,
                    fontFamily: "var(--cruzar-mono)",
                    fontSize: "0.68rem",
                    color: INK,
                    letterSpacing: "0.08em",
                    lineHeight: 1.5,
                  }}
                >
                  <span style={{ color: ACCENT, fontWeight: 700, letterSpacing: "0.16em" }}>✗ </span>
                  {m.reason}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* B — COLOR */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `2px solid ${INK}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
          <SectionHeader
            no="B"
            title="Color"
            lede="Eleven tokens. Warm neutrals, aged-red editorial accent, terra-brick operator signal. The 60-30-10 rule and a strict per-surface accent budget are what keep the palette from drifting into edtech noise."
          />

          {/* B.1 Swatches */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: space[3],
              marginBottom: space[8],
            }}
          >
            <ColorSwatch token="PAPER" value="oklch(0.97 0.012 85)" role="Canvas · dominant bg" fill={PAPER} ink={INK} />
            <ColorSwatch
              token="PAPER_DEEP"
              value="oklch(0.945 0.014 82)"
              role="Shelf · section bg"
              fill={PAPER_DEEP}
              ink={INK}
            />
            <ColorSwatch token="CARD" value="oklch(0.985 0.006 82)" role="Elevated surface" fill={CARD} ink={INK} />
            <ColorSwatch token="INK" value="oklch(0.18 0.01 80)" role="Body type / headings" fill={INK} ink={PAPER} />
            <ColorSwatch
              token="INK_SOFT"
              value="oklch(0.38 0.012 80)"
              role="Secondary type"
              fill={INK_SOFT}
              ink={PAPER}
            />
            <ColorSwatch
              token="INK_LABEL"
              value="oklch(0.55 0.012 80)"
              role="Caption / label"
              fill={INK_LABEL}
              ink={PAPER}
            />
            <ColorSwatch
              token="HAIRLINE"
              value="oklch(0.82 0.012 80)"
              role="1px divider"
              fill={HAIRLINE}
              ink={INK}
            />
            <ColorSwatch
              token="HAIRLINE_STRONG"
              value="oklch(0.72 0.012 80)"
              role="Section divider"
              fill={HAIRLINE_STRONG}
              ink={INK}
            />
            <ColorSwatch
              token="ACCENT"
              value="oklch(0.42 0.14 30)"
              role="Aged red · wordmark dot"
              fill={ACCENT}
              ink={PAPER}
            />
            <ColorSwatch
              token="SIGNAL"
              value="oklch(0.55 0.16 35)"
              role="Operator signal"
              fill={SIGNAL}
              ink={PAPER}
            />
            <ColorSwatch
              token="SIGNAL_DIM"
              value="oklch(0.55 0.16 35 / .12)"
              role="Status band tint"
              fill={SIGNAL_DIM}
              ink={INK}
            />
          </div>

          {/* B.2 60-30-10 */}
          <div style={{ ...RULE_BOX, marginBottom: space[8] }}>
            <h3 style={{ margin: 0, ...DO_LABEL }}>B.2 · 60-30-10 visual weight</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "60fr 30fr 10fr",
                height: 72,
                border: `1px solid ${HAIRLINE}`,
              }}
            >
              <div
                style={{
                  background: PAPER,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--cruzar-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  color: INK,
                }}
              >
                60% · PAPER / CARD
              </div>
              <div
                style={{
                  background: INK,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--cruzar-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  color: PAPER,
                }}
              >
                30% · INK / HAIRLINE
              </div>
              <div
                style={{
                  background: ACCENT,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--cruzar-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  color: PAPER,
                }}
              >
                10% · ACCENT
              </div>
            </div>
            <p
              style={{
                margin: 0,
                fontSize: "0.88rem",
                color: INK_SOFT,
                maxWidth: "72ch",
                lineHeight: 1.6,
              }}
            >
              Weight, not pixel count. Accent works because it's rare — the budget (B.3) formalises
              it: editorial max 2 ACCENT marks per surface, including the wordmark's period.
            </p>
          </div>

          {/* B.4 Contrast */}
          <div style={{ ...RULE_BOX, marginBottom: space[8] }}>
            <h3 style={{ margin: 0, ...DO_LABEL }}>B.4 · WCAG contrast samples</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
                gap: space[3],
              }}
            >
              <ContrastSample
                fg={INK}
                bg={PAPER}
                ratio="13.5 : 1"
                grade="AAA"
                passing
                label="INK on PAPER · body prose"
              />
              <ContrastSample
                fg={INK_SOFT}
                bg={PAPER}
                ratio="7.1 : 1"
                grade="AAA"
                passing
                label="INK_SOFT on PAPER · secondary"
              />
              <ContrastSample
                fg={INK_LABEL}
                bg={PAPER}
                ratio="4.6 : 1"
                grade="AA · ≥14px only"
                passing
                label="INK_LABEL on PAPER · captions"
              />
              <ContrastSample
                fg={ACCENT}
                bg={PAPER}
                ratio="5.9 : 1"
                grade="AA"
                passing
                label="ACCENT on PAPER · markers"
              />
              <ContrastSample
                fg={SIGNAL}
                bg={PAPER}
                ratio="3.9 : 1"
                grade="AA LARGE ONLY"
                passing
                label="SIGNAL on PAPER · ≥18px"
              />
              <ContrastSample
                fg={INK_LABEL}
                bg={PAPER_DEEP}
                ratio="3.9 : 1"
                grade="FAIL for body"
                passing={false}
                label="INK_LABEL for body prose · FAIL"
              />
            </div>
          </div>

          {/* B.5 Dark mode pending */}
          <div
            style={{
              ...RULE_BOX,
              borderColor: HAIRLINE_STRONG,
              background: CARD,
            }}
          >
            <h3 style={{ margin: 0, ...DO_LABEL }}>B.5 · Dark-mode tokens</h3>
            <p style={{ margin: 0, fontSize: "0.95rem", color: INK, lineHeight: 1.6, maxWidth: "72ch" }}>
              Pending Capa 3 lock (<code>apps/brand/app/brand/color-studies/page.tsx</code> not
              yet produced). Provisional pair: <strong>INK</strong> as background,{" "}
              <strong>PAPER</strong> as type, <strong>ACCENT</strong> preserved. Used only on
              operator dashboards; every other surface stays light-first.
            </p>
          </div>
        </div>
      </section>

      {/* C — TYPOGRAPHY */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
        <SectionHeader
          no="C"
          title="Typography"
          lede="Four roles, each with its own job. Literata leads editorial; Funnel Sans carries prose; Geologica owns the field register; Geist Mono handles every digit and label. Cross the roles and the register breaks."
        />
        <div style={{ border: `1px solid ${HAIRLINE}`, background: CARD, marginBottom: space[8] }}>
          <TypeSpecimen
            role="DISPLAY"
            family="Literata · 400"
            sample="Cruza del salario local al internacional."
            fontFamily="var(--cruzar-display), ui-serif, Georgia, serif"
            size="2.6rem"
            weight={400}
            letterSpacing="-0.02em"
          />
          <TypeSpecimen
            role="BODY"
            family="Funnel Sans · 400"
            sample="Diagnóstico, validación en escenarios reales y postulación autónoma a empleos remotos."
            fontFamily="var(--cruzar-body), ui-sans-serif, system-ui, sans-serif"
            size="1.02rem"
            weight={400}
          />
          <TypeSpecimen
            role="BODY DENSE"
            family="Geologica · 400"
            sample="Placement verified · offer letter on file · first payroll screenshot attached."
            fontFamily="var(--cruzar-body-dense), ui-sans-serif, system-ui, sans-serif"
            size="0.96rem"
            weight={400}
            letterSpacing="-0.005em"
          />
          <TypeSpecimen
            role="MONO"
            family="Geist Mono · 400"
            sample="+$2,840 / mo · ×4.1 · 0123456789"
            fontFamily="var(--cruzar-mono), ui-monospace, SFMono-Regular, monospace"
            size="0.9rem"
            weight={400}
          />
          <TypeSpecimen
            role="MONO LABEL"
            family="Geist Mono · tracked"
            sample="Cohort 02 · Field Report · Build 0001"
            fontFamily="var(--cruzar-mono), ui-monospace, SFMono-Regular, monospace"
            size="0.72rem"
            weight={400}
            letterSpacing="0.2em"
            upper
          />
        </div>

        <DoDont
          doNode={
            <div
              style={{
                fontFamily: "var(--cruzar-body)",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: INK,
                maxWidth: "65ch",
              }}
            >
              Pasé de ganar S/. 2.400 a USD 3.100 al mes en 11 semanas. La diferencia paga mi
              casa, mi familia y un fondo de emergencia que nunca tuve.
            </div>
          }
          dontNode={
            <div
              style={{
                fontFamily: "var(--cruzar-mono)",
                fontSize: "1rem",
                lineHeight: 1.6,
                color: INK,
                maxWidth: "65ch",
              }}
            >
              Pasé de ganar S/. 2.400 a USD 3.100 al mes en 11 semanas. La diferencia paga mi
              casa, mi familia y un fondo de emergencia que nunca tuve.
            </div>
          }
          doCaption="Prose in Funnel Sans body — 65ch max width, tabular nums. The eye tracks easily."
          dontCaption="Prose in mono destroys reading density. Mono is for digits and labels, never for more than two continuous lines."
        />
      </section>

      {/* D — LAYOUT & SPACE */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `2px solid ${INK}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
          <SectionHeader
            no="D"
            title="Layout & space"
            lede="Four-point spacing scale, modular type, asymmetric layouts over centered ones. Hairlines (1px) over colored stripes — a hard ban cited from impeccable — and no cards-inside-cards."
          />

          {/* D.1 Scale */}
          <div style={{ ...RULE_BOX, marginBottom: space[8] }}>
            <h3 style={{ margin: 0, ...DO_LABEL }}>D.1 · 4pt scale</h3>
            <div>
              <SpaceBar token="space.1" px="4px" />
              <SpaceBar token="space.2" px="8px" />
              <SpaceBar token="space.3" px="12px" />
              <SpaceBar token="space.4" px="16px" />
              <SpaceBar token="space.6" px="24px" />
              <SpaceBar token="space.8" px="32px" />
              <SpaceBar token="space.12" px="48px" />
              <SpaceBar token="space.16" px="64px" />
              <SpaceBar token="space.24" px="96px" />
            </div>
          </div>

          {/* D.4 Hairline over stripe — the hard rule */}
          <div style={{ ...RULE_BOX, marginBottom: space[8] }}>
            <h3 style={{ margin: 0, ...DO_LABEL }}>D.4 · Hairline, never side-stripe</h3>
            <DoDont
              doNode={
                <div
                  style={{
                    background: CARD,
                    padding: space[6],
                    border: `1px solid ${HAIRLINE}`,
                    maxWidth: 360,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--cruzar-mono)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.18em",
                      color: INK_LABEL,
                      marginBottom: space[2],
                    }}
                  >
                    § II · COHORT 02
                  </div>
                  <div style={{ color: INK, fontSize: "0.98rem", lineHeight: 1.5 }}>
                    12 students placed. Offer letters on file.
                  </div>
                </div>
              }
              dontNode={
                <div
                  style={{
                    background: CARD,
                    padding: space[6],
                    borderTop: `1px solid ${HAIRLINE}`,
                    borderRight: `1px solid ${HAIRLINE}`,
                    borderBottom: `1px solid ${HAIRLINE}`,
                    // Intentionally demonstrating the banned pattern — data-banned marker
                    // prevents lint false-positives in future static checks.
                    borderLeft: `4px solid ${ACCENT}`,
                    maxWidth: 360,
                  }}
                  data-banned="true"
                >
                  <div
                    style={{
                      fontFamily: "var(--cruzar-mono)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.18em",
                      color: INK_LABEL,
                      marginBottom: space[2],
                    }}
                  >
                    § II · COHORT 02
                  </div>
                  <div style={{ color: INK, fontSize: "0.98rem", lineHeight: 1.5 }}>
                    12 students placed. Offer letters on file.
                  </div>
                </div>
              }
              doCaption="1px hairline on all sides. Emphasis comes from the eyebrow marker and typography, not from a colored flag."
              dontCaption="BANNED by impeccable absolute_bans. A 4px colored border-left is the single most recognizable admin-UI slop tell. Rewrite the element, do not swap colors."
            />
          </div>

          {/* D.5 Cards-in-cards */}
          <div style={RULE_BOX}>
            <h3 style={{ margin: 0, ...DO_LABEL }}>D.5 · No cards-in-cards</h3>
            <DoDont
              doNode={
                <div
                  style={{
                    background: CARD,
                    border: `1px solid ${HAIRLINE}`,
                    padding: space[6],
                    minWidth: 280,
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--cruzar-mono)",
                      fontSize: "0.68rem",
                      letterSpacing: "0.18em",
                      color: INK_LABEL,
                      marginBottom: space[2],
                    }}
                  >
                    PLACEMENT
                  </div>
                  <div style={{ color: INK, fontSize: "1.1rem", marginBottom: space[3] }}>
                    Backend Engineer · Plaid
                  </div>
                  <div
                    style={{
                      height: 1,
                      background: HAIRLINE,
                      marginBottom: space[3],
                    }}
                  />
                  <div style={{ color: INK_SOFT, fontSize: "0.88rem", lineHeight: 1.5 }}>
                    Remote · USD 3,100/mo · Start 2026-04-28
                  </div>
                </div>
              }
              dontNode={
                <div
                  style={{
                    background: CARD,
                    border: `1px solid ${HAIRLINE}`,
                    padding: space[4],
                    minWidth: 280,
                  }}
                  data-banned="true"
                >
                  <div
                    style={{
                      background: PAPER_DEEP,
                      border: `1px solid ${HAIRLINE}`,
                      padding: space[4],
                    }}
                  >
                    <div
                      style={{
                        fontFamily: "var(--cruzar-mono)",
                        fontSize: "0.68rem",
                        letterSpacing: "0.18em",
                        color: INK_LABEL,
                        marginBottom: space[2],
                      }}
                    >
                      PLACEMENT
                    </div>
                    <div style={{ color: INK, fontSize: "1.1rem" }}>Backend Engineer · Plaid</div>
                    <div
                      style={{
                        background: CARD,
                        border: `1px solid ${HAIRLINE}`,
                        padding: space[3],
                        marginTop: space[3],
                      }}
                    >
                      <div style={{ color: INK_SOFT, fontSize: "0.88rem" }}>
                        Remote · USD 3,100/mo
                      </div>
                    </div>
                  </div>
                </div>
              }
              doCaption="Single card, flat hierarchy, hairline as internal divider. Breathable and readable."
              dontCaption="Nested cards create visual noise and make every boundary ambiguous. Use hairlines or background variation instead."
            />
          </div>
        </div>
      </section>

      {/* E — PHOTO / ILLUSTRATION */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
        <SectionHeader
          no="E"
          title="Photography & illustration"
          lede="No photography in the MVP. No illustrated people, no isometric icons, no gradient blobs. The absence is the statement — the brand breathes data and typography, not stock diversity."
        />
        <DoDont
          doNode={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: space[3],
                alignItems: "flex-start",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--cruzar-mono)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.2em",
                  color: INK_LABEL,
                  textTransform: "uppercase",
                }}
              >
                Placed · Cohort 02
              </span>
              <span
                style={{
                  fontFamily: "var(--cruzar-display)",
                  fontSize: "5rem",
                  fontWeight: 300,
                  letterSpacing: "-0.03em",
                  lineHeight: 0.9,
                  color: INK,
                }}
              >
                12
              </span>
              <span style={{ color: INK_SOFT, fontSize: "0.95rem", maxWidth: "28ch" }}>
                out of 47 enrolled. Verified by offer letter and first-payroll screenshot.
              </span>
            </div>
          }
          dontNode={
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: space[2],
                alignItems: "center",
                maxWidth: 260,
              }}
            >
              <div
                aria-hidden
                style={{
                  width: 220,
                  height: 130,
                  background: `linear-gradient(135deg, ${SIGNAL_DIM}, ${PAPER_DEEP})`,
                  border: `1px dashed ${INK_LABEL}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "var(--cruzar-mono)",
                  fontSize: "0.72rem",
                  letterSpacing: "0.14em",
                  color: INK_LABEL,
                  textAlign: "center",
                  padding: space[3],
                }}
              >
                [ STOCK PHOTO · DIVERSE SMILING TEAM IN FRONT OF LAPTOPS ]
              </div>
              <span
                style={{
                  fontFamily: "var(--cruzar-mono)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.14em",
                  color: ACCENT,
                  textTransform: "uppercase",
                }}
              >
                Banned · AI-edtech aesthetic
              </span>
            </div>
          }
          doCaption="Numbers and typography carry the story. The absence of photography is a statement of seriousness."
          dontCaption="Stock photography of 'diverse smiling teams' is the exact AI-edtech texture Cruzar anti-references. Never ship."
        />
      </section>

      {/* F — VOICE */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `2px solid ${INK}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
          <SectionHeader
            no="F"
            title="Voice"
            lede="Cruzar speaks like an Economist analyst who understands remote hiring — precise, numeric, no promotional adjectives. Never disruptor-speak, never bootcamp motivational, never AI-assistant throat-clearing."
          />
          <DoDont
            doNode={
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--cruzar-display)",
                  fontSize: "1.3rem",
                  lineHeight: 1.35,
                  color: INK,
                  maxWidth: "42ch",
                }}
              >
                12 students placed. Average salary delta +$2,840 / month. Verified by signed offer
                letter and first-payroll screenshot.
              </p>
            }
            dontNode={
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--cruzar-body)",
                  fontSize: "1rem",
                  lineHeight: 1.5,
                  color: INK,
                  maxWidth: "42ch",
                }}
              >
                We're revolutionizing LatAm tech talent! Unlock your potential and join the remote
                work movement. ¡Tú puedes!
              </p>
            }
            doCaption="Precise cifra. Verified-by clause. Cross-border neutral register. Bilingual-tolerant."
            dontCaption="Disruptor-speak, motivational hype, adjective stacking. Every pattern Cruzar exists against."
          />
        </div>
      </section>

      {/* G — EMAIL SIGNATURES */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
        <SectionHeader
          no="G"
          title="Email signatures"
          lede="Fixed format. Wordmark inline as SVG. No motivational quote, no mobile disclaimer, no attached image business card."
        />
        <DoDont
          doNode={
            <div
              style={{
                fontFamily: "var(--cruzar-body)",
                fontSize: "0.9rem",
                lineHeight: 1.55,
                color: INK,
              }}
            >
              <div style={{ fontWeight: 600 }}>Enrique Flores-Talavera</div>
              <div style={{ color: INK_SOFT }}>Co-founder · Product &amp; Engineering</div>
              <div style={{ marginTop: space[2], marginBottom: space[1] }}>
                <Logotype height={18} />
              </div>
              <div
                style={{
                  color: INK_SOFT,
                  fontSize: "0.82rem",
                  fontFamily: "var(--cruzar-mono)",
                }}
              >
                cruzarapp.com · enrique@cruzarapp.com
              </div>
            </div>
          }
          dontNode={
            <div
              style={{
                fontFamily: "var(--cruzar-body)",
                fontSize: "0.9rem",
                lineHeight: 1.55,
                color: INK,
              }}
            >
              <div style={{ fontWeight: 600 }}>Enrique F.</div>
              <div style={{ color: INK_SOFT, fontStyle: "italic" }}>
                "Keep crossing borders. Dream big."
              </div>
              <div
                aria-hidden
                style={{
                  marginTop: space[2],
                  width: 120,
                  height: 40,
                  background: `linear-gradient(90deg, ${SIGNAL_DIM}, ${PAPER_DEEP})`,
                  border: `1px dashed ${INK_LABEL}`,
                  fontFamily: "var(--cruzar-mono)",
                  fontSize: "0.64rem",
                  color: INK_LABEL,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                [ BUSINESS-CARD.PNG ATTACH ]
              </div>
              <div
                style={{
                  marginTop: space[2],
                  color: INK_LABEL,
                  fontSize: "0.78rem",
                  fontStyle: "italic",
                }}
              >
                Sent from my iPhone — please excuse brevity.
              </div>
            </div>
          }
          doCaption="Name · role · wordmark (inline SVG) · cruzarapp.com and email in mono. Nothing else."
          dontCaption="Motivational quote, attached image signature, mobile-sent disclaimer — every anti-pattern stacked."
        />
      </section>

      {/* H — HANDLES */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `2px solid ${INK}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
          <SectionHeader
            no="H"
            title="Social handles"
            lede="Conventions fixed now so registration — whenever it happens — matches. Web is cruzarapp.com. Do not register the handles today."
          />
          <div
            style={{
              border: `1px solid ${HAIRLINE}`,
              background: CARD,
              fontFamily: "var(--cruzar-mono)",
              fontSize: "0.88rem",
            }}
          >
            {[
              ["WEB", "cruzarapp.com", "canonical"],
              ["EMAIL", "<name>@cruzarapp.com", "canonical"],
              ["TWITTER / X", "@cruzar · @cruzarHQ fallback", "display: Cruzar."],
              ["LINKEDIN", "/company/cruzar · fallback /company/cruzarHQ", "display: Cruzar."],
              ["INSTAGRAM", "@cruzar · @cruzarapp.com fallback", "display: Cruzar."],
              ["GITHUB", "cruzar · fallback cruzar-io", "display: Cruzar."],
              ["YOUTUBE", "@cruzar · @cruzarHQ fallback", "display: Cruzar."],
            ].map(([k, v, note], i, arr) => (
              <div
                key={k}
                style={{
                  display: "grid",
                  gridTemplateColumns: "160px 1fr auto",
                  gap: space[4],
                  padding: `${space[3]} ${space[6]}`,
                  borderBottom: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  alignItems: "baseline",
                }}
              >
                <span style={{ color: INK_LABEL, letterSpacing: "0.14em" }}>{k}</span>
                <span style={{ color: INK }}>{v}</span>
                <span style={{ color: INK_SOFT, fontSize: "0.78rem" }}>{note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* I — FILE NAMING */}
      <section style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
        <SectionHeader
          no="I"
          title="File naming"
          lede="Every artifact leaving Cruzar names itself at the front: cruzar-{type}-{descriptor}-{YYYY-MM-DD}.{ext}. No 'Untitled1.pdf' ever again."
        />
        <DoDont
          doNode={
            <div
              style={{
                fontFamily: "var(--cruzar-mono)",
                fontSize: "0.9rem",
                color: INK,
                lineHeight: 1.8,
              }}
            >
              <div>cruzar-deck-rector-utec-2026-04-15.pdf</div>
              <div>cruzar-cv-plaid-backend-2026-04-12.pdf</div>
              <div>cruzar-mou-pacifico-2026-03-28.pdf</div>
              <div>cruzar-screenshot-dashboard-cohort-02-2026-04-15.png</div>
            </div>
          }
          dontNode={
            <div
              style={{
                fontFamily: "var(--cruzar-mono)",
                fontSize: "0.9rem",
                color: INK,
                lineHeight: 1.8,
              }}
            >
              <div>Untitled1.pdf</div>
              <div>Deck_FINAL_v3_reallyFINAL.pdf</div>
              <div>CV (2).pdf</div>
              <div>Screenshot 2026-04-15 at 14.32.07.png</div>
            </div>
          }
          doCaption="Prefix · type · audience-slug · ISO date. The receiver can file it without thinking."
          dontCaption="Default OS names destroy institutional perception the moment they reach a rector's inbox."
        />
      </section>

      {/* J — PROMOTION PATH */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `2px solid ${INK}`,
        }}
      >
        <div style={{ maxWidth: 1320, margin: "0 auto", padding: SECTION_PADDING }}>
          <SectionHeader
            no="J"
            title="Promotion path"
            lede="tokens.ts is SSOT. Every consuming surface imports @cruzar/brand/tokens and @cruzar/brand/fonts. PR review rejects inline color values, inline font strings, off-scale spacing, side-stripe borders, and gradient text."
          />
          <div
            style={{
              border: `1px solid ${HAIRLINE}`,
              background: CARD,
              padding: space[8],
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: space[6],
            }}
          >
            {[
              {
                k: "CHANGE",
                v: "Edit apps/brand/lib/tokens.ts",
                n: "Never duplicate a hex, OKLCH, or font string outside this file.",
              },
              {
                k: "IMPORT",
                v: "import { ACCENT, INK, PAPER } from '@cruzar/brand/tokens'",
                n: "All consuming surfaces go through the workspace export.",
              },
              {
                k: "PROPAGATE",
                v: "Next dev server picks it up instantly",
                n: "apps/web, apps/career-ops, future apps/deck — all inherit.",
              },
              {
                k: "REVIEW",
                v: "Reject inline brand values in PRs",
                n: "Hex, OKLCH literals, font-family strings outside /lib are bugs.",
              },
              {
                k: "REJECT",
                v: "border-left/right > 1px colored",
                n: "Absolute ban from impeccable. Rewrite the element.",
              },
              {
                k: "REJECT",
                v: "background-clip: text + gradient",
                n: "Gradient text is banned for any element on any surface.",
              },
            ].map((c) => (
              <div
                key={c.k}
                style={{ display: "flex", flexDirection: "column", gap: space[2] }}
              >
                <span
                  style={{
                    fontFamily: "var(--cruzar-mono)",
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    color: ACCENT,
                    fontWeight: 700,
                  }}
                >
                  § {c.k}
                </span>
                <span
                  style={{
                    fontFamily: "var(--cruzar-mono)",
                    fontSize: "0.88rem",
                    color: INK,
                    lineHeight: 1.5,
                  }}
                >
                  {c.v}
                </span>
                <span style={{ fontSize: "0.82rem", color: INK_SOFT, lineHeight: 1.55 }}>
                  {c.n}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: `2px solid ${INK}`,
          background: PAPER,
        }}
      >
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            padding: "40px clamp(24px, 5vw, 64px) 56px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: space[6],
            alignItems: "start",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: space[2] }}>
            <span
              style={{
                fontFamily: "var(--cruzar-mono)",
                fontSize: "0.68rem",
                letterSpacing: "0.2em",
                color: INK_LABEL,
                textTransform: "uppercase",
              }}
            >
              Document
            </span>
            <span style={{ fontSize: "0.95rem", color: INK, fontWeight: 600 }}>
              Cruzar · Brand Guidelines
            </span>
            <span style={{ fontSize: "0.82rem", color: INK_SOFT }}>
              Capa 05 — Usage Rules Lock · 2026-04-15
            </span>
          </div>
          <div style={{ fontSize: "0.88rem", color: INK_SOFT, maxWidth: "44ch", lineHeight: 1.6 }}>
            Canonical reference pair. This visual page mirrors the Spanish markdown at{" "}
            <code>product/cruzar/brand-guidelines.md</code>. Any conflict between the two is a
            bug — the markdown wins by default; the visual page is re-rendered to match.
          </div>
          <div
            style={{
              fontFamily: "var(--cruzar-mono)",
              fontSize: "0.78rem",
              color: INK_LABEL,
              letterSpacing: "0.08em",
              lineHeight: 1.7,
              textAlign: "right",
            }}
          >
            CRZ-BG-05 · 2026-04-15
            <br />
            SSOT · /apps/brand/lib/tokens.ts
            <br />
            MD · /product/cruzar/brand-guidelines.md
          </div>
        </div>
      </footer>
    </main>
  );
}
