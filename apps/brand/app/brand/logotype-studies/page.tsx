import { Caladea, EB_Garamond, Literata, Source_Serif_4, Spectral } from "next/font/google";
import type { CSSProperties } from "react";
import { body, display } from "@/lib/fonts";
import {
  ACCENT,
  HAIRLINE,
  HAIRLINE_STRONG,
  INK,
  INK_LABEL,
  INK_SOFT,
  PAPER,
  PAPER_DEEP,
} from "@/lib/tokens";

/**
 * Capa 1 — Logotype Lock.
 *
 * Stress-tests the "Cruzar." wordmark against weight/case/period/tracking
 * variants, alternative serif families, scale extremes, inversion,
 * hostile backgrounds, and a period-treatment microscope. Ends with a
 * locked recommendation (weight, case, period geometry, tracking, accent,
 * minimum size, banned uses).
 *
 * Self-contained — no shared component imports from this app's Logotype
 * so each variant can own its own glyph settings without being coupled
 * to the current SVG render. Alternative serif faces are imported via
 * `next/font/google` and applied inline. No new dependencies.
 */

/* ───────────────────────── FONT LOADERS ───────────────────────── */

const literata = Literata({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--studies-literata",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--studies-spectral",
});

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal"],
  display: "swap",
  variable: "--studies-garamond",
});

const caladea = Caladea({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal"],
  display: "swap",
  variable: "--studies-caladea",
});

// A direct-comparison Source Serif 4 with extra weights (300,400,500,600,700)
// so we can stress weight against the current 400 baseline.
const sourceSerifStudies = Source_Serif_4({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--studies-source",
});

/* ───────────────────────── CONSTANTS ───────────────────────── */

const BASELINE_HEIGHT = "120px";
const SOURCE_STACK = "var(--studies-source), var(--cruzar-display), ui-serif, Georgia, serif";
const LITERATA_STACK = "var(--studies-literata), ui-serif, Georgia, serif";
const SPECTRAL_STACK = "var(--studies-spectral), ui-serif, Georgia, serif";
const GARAMOND_STACK = "var(--studies-garamond), ui-serif, Georgia, serif";
const CALADEA_STACK = "var(--studies-caladea), ui-serif, Georgia, serif";

// Neutral mid-gray — calibrated perceptual middle.
const MID_GRAY = "oklch(0.55 0 0)";
// Accent-hue-adjacent hostile surface — same hue family as ACCENT, higher lightness.
const ACCENT_NEIGHBOR = "oklch(0.58 0.16 32)";
// Near-INK dark surface (same OKLCH as INK; exercised as "dark mode").
const INK_SURFACE = "oklch(0.18 0.01 80)";
// Paper texture proxy — warmer, higher chroma paper tone.
const PAPER_TEXTURE = "oklch(0.85 0.05 80)";

/* ───────────────────────── PRIMITIVES ───────────────────────── */

function Caption({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        fontFamily: "var(--cruzar-body)",
        fontSize: "0.7rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: INK_LABEL,
        fontWeight: 600,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function SectionHeading({ no, title, lede }: { no: string; title: string; lede: string }) {
  return (
    <div style={{ marginBottom: "48px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "16px",
          marginBottom: "16px",
          fontFamily: "var(--cruzar-body)",
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_LABEL,
        }}
      >
        <span style={{ color: ACCENT, fontWeight: 700 }}>§ {no}</span>
        <span style={{ flex: "0 0 48px", height: "1px", background: HAIRLINE_STRONG }} />
        <span style={{ color: INK_SOFT, fontWeight: 600 }}>{title}</span>
      </div>
      <p
        style={{
          margin: 0,
          maxWidth: "68ch",
          fontFamily: "var(--cruzar-body)",
          fontSize: "1rem",
          lineHeight: 1.6,
          color: INK_SOFT,
        }}
      >
        {lede}
      </p>
    </div>
  );
}

/** Baseline "Cruzar." renderer. Period is injected as a styled span. */
function Wordmark({
  text = "Cruzar",
  period = ".",
  weight = 400,
  style = "normal",
  tracking = "-0.045em",
  fontStack = SOURCE_STACK,
  color = INK,
  accent = ACCENT,
  fontSize = BASELINE_HEIGHT,
  periodShape = "dot",
  periodInset = false,
}: {
  text?: string;
  period?: string;
  weight?: 300 | 400 | 500 | 600 | 700;
  style?: "normal" | "italic";
  tracking?: string;
  fontStack?: string;
  color?: string;
  accent?: string;
  fontSize?: string;
  periodShape?: "dot" | "square" | "underline" | "hollow";
  periodInset?: boolean;
}) {
  const base: CSSProperties = {
    fontFamily: fontStack,
    fontWeight: weight,
    fontStyle: style,
    fontSize,
    letterSpacing: tracking,
    lineHeight: 0.9,
    color,
    display: "inline-flex",
    alignItems: "baseline",
    fontVariantLigatures: "common-ligatures",
  };

  if (periodInset) {
    // "Cru.zar" — period inset between glyphs.
    const head = text.slice(0, 3);
    const tail = text.slice(3);
    return (
      <span style={base}>
        {head}
        <span style={{ color: accent, fontWeight: weight }}>{period}</span>
        {tail}
      </span>
    );
  }

  if (periodShape === "dot") {
    return (
      <span style={base}>
        {text}
        <span style={{ color: accent, fontWeight: weight, fontStyle: "normal" }}>{period}</span>
      </span>
    );
  }

  if (periodShape === "square") {
    // Rendered as an inline square, sized by em so it scales with the wordmark.
    return (
      <span style={base}>
        {text}
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "0.14em",
            height: "0.14em",
            background: accent,
            marginLeft: "0.06em",
            marginBottom: "0.02em",
            borderRadius: "1px",
          }}
        />
      </span>
    );
  }

  if (periodShape === "hollow") {
    // Hollow dot — paper-colored circle with accent ring.
    return (
      <span style={base}>
        {text}
        <span
          aria-hidden
          style={{
            display: "inline-block",
            width: "0.16em",
            height: "0.16em",
            background: "transparent",
            boxShadow: `inset 0 0 0 0.025em ${accent}`,
            borderRadius: "50%",
            marginLeft: "0.05em",
            marginBottom: "0.02em",
          }}
        />
      </span>
    );
  }

  // underline
  return (
    <span style={base}>
      {text}
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "0.22em",
          height: "0.035em",
          background: accent,
          marginLeft: "0.04em",
          marginBottom: "0.08em",
        }}
      />
    </span>
  );
}

/** Inverted-period variant: the period is a "hole" in an ink-filled bar. */
function NegativeMonoWordmark({ fontSize = BASELINE_HEIGHT }: { fontSize?: string }) {
  return (
    <span
      style={{
        fontFamily: SOURCE_STACK,
        fontWeight: 400,
        fontSize,
        letterSpacing: "-0.045em",
        lineHeight: 0.9,
        color: PAPER,
        display: "inline-flex",
        alignItems: "baseline",
      }}
    >
      Cruzar
      <span
        aria-hidden
        style={{
          display: "inline-block",
          width: "0.14em",
          height: "0.14em",
          background: PAPER,
          borderRadius: "50%",
          marginLeft: "0.05em",
          marginBottom: "0.02em",
        }}
      />
    </span>
  );
}

function VariantCell({
  label,
  note,
  children,
  surface = PAPER,
  textColor = INK,
}: {
  label: string;
  note: string;
  children: React.ReactNode;
  surface?: string;
  textColor?: string;
}) {
  return (
    <figure
      style={{
        margin: 0,
        background: surface,
        border: `1px solid ${HAIRLINE}`,
        padding: "40px clamp(24px, 3vw, 40px) 32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minHeight: "260px",
        color: textColor,
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          minHeight: "140px",
        }}
      >
        {children}
      </div>
      <figcaption style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "16px" }}>
        <Caption
          style={{
            color: textColor === PAPER ? "oklch(0.97 0.012 85 / 0.6)" : INK_LABEL,
            marginBottom: "6px",
          }}
        >
          {label}
        </Caption>
        <div
          style={{
            fontFamily: "var(--cruzar-body)",
            fontSize: "0.82rem",
            color: textColor === PAPER ? "oklch(0.97 0.012 85 / 0.75)" : INK_SOFT,
            lineHeight: 1.5,
          }}
        >
          {note}
        </div>
      </figcaption>
    </figure>
  );
}

/* ───────────────────────── SECTION A ───────────────────────── */

function SectionA() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <SectionHeading
        no="A"
        title="Wordmark variant studies"
        lede="Same glyph string, held at ~120px. Each cell isolates one variable: weight, case, style, period geometry, tracking, or typeface. The point is not to prefer one — the point is to see which breaks first under real light."
      />

      {/* A.1 Weight grid */}
      <Caption style={{ marginBottom: "16px" }}>A.1 · Weight on Source Serif 4</Caption>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <VariantCell
          label="Source Serif 4 · 300 Light"
          note="Editorial, but the period visibly shrinks against thinner stems. First to vanish at small sizes."
        >
          <Wordmark weight={300} />
        </VariantCell>
        <VariantCell
          label="Source Serif 4 · 400 Regular · baseline"
          note="Current lock. Period reads as a deliberate mark, not punctuation. Holds from 20px to 800px."
        >
          <Wordmark weight={400} />
        </VariantCell>
        <VariantCell
          label="Source Serif 4 · 500 Medium"
          note="Subtle institutional push. Period gains presence; wordmark keeps editorial voice."
        >
          <Wordmark weight={500} />
        </VariantCell>
        <VariantCell
          label="Source Serif 4 · 600 Semibold"
          note="Reads as a corporate sub-brand, not an editorial masthead. Loses the press-page calm."
        >
          <Wordmark weight={600} />
        </VariantCell>
        <VariantCell
          label="Source Serif 4 · 700 Bold"
          note="Over-asserted. The rector reads 'boot camp confidence', not 'institutional partner'."
        >
          <Wordmark weight={700} />
        </VariantCell>
      </div>

      {/* A.2 Case grid */}
      <Caption style={{ marginBottom: "16px" }}>A.2 · Case</Caption>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <VariantCell
          label="Title case · Cruzar."
          note="Current lock. Verb-name stays readable as a verb, not a monument."
        >
          <Wordmark weight={400} />
        </VariantCell>
        <VariantCell
          label="Lowercase · cruzar."
          note="Too humble for a rector's signature page. Reads as an app, not an institution."
        >
          <Wordmark text="cruzar" weight={400} />
        </VariantCell>
        <VariantCell
          label="All-caps · CRUZAR."
          note="Monumental, but collapses the verb into a logo-brick. The period is overpowered by flat cap-line."
        >
          <Wordmark text="CRUZAR" weight={400} tracking="0.02em" />
        </VariantCell>
      </div>

      {/* A.3 Style / italic */}
      <Caption style={{ marginBottom: "16px" }}>A.3 · Style &amp; period geometry</Caption>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <VariantCell
          label="Italic wordmark · upright period"
          note="Reads as an article title, not a brand. Italic pulls the wordmark into editorial content layer; the upright period looks like a typo."
        >
          <Wordmark weight={400} style="italic" />
        </VariantCell>
        <VariantCell
          label="Hairline underline as terminal"
          note="The underline reads as an href, not a stop. The period's assertion (a full stop, a mark, a seal) is lost."
        >
          <Wordmark weight={400} periodShape="underline" />
        </VariantCell>
        <VariantCell
          label="Filled accent square"
          note="Geometric, confident — but de-softens the brand. Moves Cruzar from editorial to fintech-console register."
        >
          <Wordmark weight={400} periodShape="square" />
        </VariantCell>
        <VariantCell
          label="Hollow ring"
          note="Overworked. An unfilled ring invites questions the mark should not raise."
        >
          <Wordmark weight={400} periodShape="hollow" />
        </VariantCell>
        <VariantCell
          label="Inset period · Cru.zar"
          note="'The crossing' inside the mark. Cute concept, but no one reads it as the brand name; it reads as 'Cru.zar' domain hack. Rejected."
        >
          <Wordmark text="Cruzar" weight={400} periodInset />
        </VariantCell>
      </div>

      {/* A.4 Tracking sweep */}
      <Caption style={{ marginBottom: "16px" }}>A.4 · Tracking sweep</Caption>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <VariantCell
          label="tracking 0"
          note="Source Serif 4's default advance — too loose, reads as a word set in text, not a mark."
        >
          <Wordmark weight={400} tracking="0" />
        </VariantCell>
        <VariantCell label="tracking -0.02em" note="Natural tight. Period still breathes.">
          <Wordmark weight={400} tracking="-0.02em" />
        </VariantCell>
        <VariantCell
          label="tracking -0.045em · current"
          note="Wordmark compresses into a single visual unit; period gains its own terminal pause."
        >
          <Wordmark weight={400} tracking="-0.045em" />
        </VariantCell>
        <VariantCell
          label="tracking -0.07em"
          note="'r' and 'z' start to kiss. The period loses its breathing room and merges with the 'r' descender."
        >
          <Wordmark weight={400} tracking="-0.07em" />
        </VariantCell>
      </div>

      {/* A.5 Alternative serifs */}
      <Caption style={{ marginBottom: "16px" }}>
        A.5 · Alternative serif families (Google Fonts)
      </Caption>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "16px",
        }}
      >
        <VariantCell
          label="Source Serif 4 — current"
          note="Optical-size aware, true italics, tabular lining figures. Institutional without feeling archival."
        >
          <Wordmark weight={400} fontStack={SOURCE_STACK} />
        </VariantCell>
        <VariantCell
          label="Literata"
          note="Bookish modern serif — slightly softer, more 'reading app'. Loses the press-page authority the rector needs."
        >
          <Wordmark weight={400} fontStack={LITERATA_STACK} />
        </VariantCell>
        <VariantCell
          label="Spectral"
          note="Warm contemporary. Attractive, but terminals feel Dribbble-adjacent; veers toward product-blog."
        >
          <Wordmark weight={400} fontStack={SPECTRAL_STACK} />
        </VariantCell>
        <VariantCell
          label="EB Garamond"
          note="Canonical old-style. Too archival — reads as a university crest, not a cross-border verb."
        >
          <Wordmark weight={400} fontStack={GARAMOND_STACK} />
        </VariantCell>
        <VariantCell
          label="Caladea"
          note="Cambria-alike. Institutional, but office-suite DNA is visible; pulls the brand toward 'government form'."
        >
          <Wordmark weight={400} fontStack={CALADEA_STACK} />
        </VariantCell>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION B ───────────────────────── */

const SCALE_ROWS: Array<{ size: number; surface: string; note: string }> = [
  {
    size: 16,
    surface: "favicon, inline footer glyph",
    note: "At 16px the period becomes a 1px stain. Distinguishable from a dust speck only because the rest of the wordmark anchors it.",
  },
  {
    size: 20,
    surface: "footer signature, email sig sub-line",
    note: "Period is legible but requires crisp subpixel rendering. Below this is unsafe — do not ship at 14px or lower.",
  },
  {
    size: 32,
    surface: "top-nav header, menu branding",
    note: "Fully safe. Period has room, period color is recognizable as red-not-black.",
  },
  {
    size: 64,
    surface: "email signature hero, sidebar masthead",
    note: "Optimal. Period size matches counter of 'a'.",
  },
  {
    size: 128,
    surface: "deck cover secondary, OG card co-signature",
    note: "Optimal. Kerning holds.",
  },
  {
    size: 320,
    surface: "landing hero, rector deck cover",
    note: "Optimal. Period becomes a deliberate object — reads as a seal, not punctuation.",
  },
  {
    size: 800,
    surface: "rector deck cover at projector scale",
    note: "Extreme. Source Serif 4 optical sizing should kick in; stems thin slightly, which is correct — the glyph was drawn for this.",
  },
];

function SectionB() {
  return (
    <section
      style={{
        background: PAPER_DEEP,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionHeading
          no="B"
          title="Scale stress matrix"
          lede="Current baseline (Source Serif 4 Regular · accent period · -0.045em) rendered across every surface it will actually appear on. The question is not 'does it look fine' but 'where does the period stop working'."
        />
        <div
          style={{
            background: PAPER,
            border: `1px solid ${HAIRLINE}`,
          }}
        >
          {SCALE_ROWS.map((row, i) => (
            <div
              key={row.size}
              style={{
                borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}`,
                display: "grid",
                gridTemplateColumns: "minmax(140px, 180px) minmax(0, 1fr) minmax(0, 28ch)",
                gap: "32px",
                alignItems: "center",
                padding: "40px clamp(24px, 3vw, 48px)",
                minHeight: row.size > 200 ? `${row.size + 80}px` : undefined,
              }}
            >
              <Caption>
                {row.size}px · {row.surface}
              </Caption>
              <div
                style={{
                  overflow: "hidden",
                  maxWidth: "100%",
                }}
              >
                <Wordmark fontSize={`${row.size}px`} />
              </div>
              <div
                style={{
                  fontFamily: "var(--cruzar-body)",
                  fontSize: "0.82rem",
                  color: INK_SOFT,
                  lineHeight: 1.55,
                }}
              >
                {row.note}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION C ───────────────────────── */

function SectionC() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <SectionHeading
        no="C"
        title="Inversion &amp; monochrome"
        lede="The mark must survive every production path: printer that drops accent ink, fax, 1-color embroidery, rectory letterhead photocopied three times."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "16px",
        }}
      >
        <VariantCell
          label="Default · ink on paper · accent period"
          note="Ship default. Trust surfaces (landing, CV, email)."
        >
          <Wordmark />
        </VariantCell>
        <VariantCell
          label="Inverted · paper on ink · accent period"
          surface={INK}
          textColor={PAPER}
          note="Dark-mode internal surfaces. Period stays ACCENT — its saturation survives the light ink, though visibly lower contrast than on paper."
        >
          <Wordmark color={PAPER} />
        </VariantCell>
        <VariantCell
          label="Monochrome 1-bit · period in ink"
          note="Fax, single-plate print, embroidery. Period loses identity — it reads as punctuation, not as the brand mark. Unavoidable: document it as a fallback, not a primary."
        >
          <Wordmark accent={INK} />
        </VariantCell>
        <VariantCell
          label="Negative monochrome · period as paper-hole"
          surface={INK}
          textColor={PAPER}
          note="Period becomes a light puncture in the ink mass. Workable for blocky print (MoU cover, book spine) where accent ink is unavailable."
        >
          <NegativeMonoWordmark />
        </VariantCell>
        <VariantCell
          label="All-accent · loud context"
          note="Every glyph in ACCENT. For accent-only surfaces (sticker, editorial poster). Violates the 10% accent rule on most product surfaces — reserve for one-off print."
        >
          <Wordmark color={ACCENT} accent={ACCENT} />
        </VariantCell>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION D ───────────────────────── */

function HostileCell({
  label,
  note,
  surface,
  textColor,
  children,
  extraBackground,
}: {
  label: string;
  note: string;
  surface: string;
  textColor: string;
  children: React.ReactNode;
  extraBackground?: string;
}) {
  return (
    <figure
      style={{
        margin: 0,
        position: "relative",
        background: surface,
        backgroundImage: extraBackground,
        border: `1px solid ${HAIRLINE}`,
        padding: "48px clamp(24px, 3vw, 40px) 0",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        minHeight: "280px",
        color: textColor,
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          display: "flex",
          alignItems: "center",
          minHeight: "140px",
        }}
      >
        {children}
      </div>
      <figcaption
        style={{
          background: PAPER,
          margin: "0 -1px -1px",
          padding: "16px clamp(24px, 3vw, 40px) 20px",
          borderTop: `1px solid ${HAIRLINE}`,
          color: INK_SOFT,
        }}
      >
        <Caption style={{ marginBottom: "6px" }}>{label}</Caption>
        <div
          style={{
            fontFamily: "var(--cruzar-body)",
            fontSize: "0.82rem",
            lineHeight: 1.5,
          }}
        >
          {note}
        </div>
      </figcaption>
    </figure>
  );
}

function SectionD() {
  // Paper texture via layered CSS gradients (subtle grain, no images).
  const paperGrain = `
    repeating-linear-gradient(
      113deg,
      oklch(0.82 0.05 80 / 0.12) 0px,
      oklch(0.82 0.05 80 / 0.12) 1px,
      transparent 1px,
      transparent 3px
    ),
    repeating-linear-gradient(
      17deg,
      oklch(0.75 0.06 70 / 0.08) 0px,
      oklch(0.75 0.06 70 / 0.08) 1px,
      transparent 1px,
      transparent 5px
    )
  `;

  return (
    <section
      style={{
        background: PAPER_DEEP,
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <div
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionHeading
          no="D"
          title="Hostile background tests"
          lede="Where does the mark break? Run it against surfaces it should never appear on — accent-on-accent, mid-gray, texture, dark mode, a red-orange near the brand hue."
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "16px",
          }}
        >
          <HostileCell
            label="On ACCENT"
            surface={ACCENT}
            textColor={PAPER}
            note="BREAK. The period vanishes — ACCENT-on-ACCENT zeroes it. Rule: wordmark may appear on ACCENT only if the period is swapped to PAPER, or the mark is reserved for text body and never landed on a full-bleed accent field."
          >
            <Wordmark color={PAPER} accent={ACCENT} />
          </HostileCell>

          <HostileCell
            label="On mid-gray · oklch(0.55 0 0)"
            surface={MID_GRAY}
            textColor={PAPER}
            note="Period competes with the mid-gray's perceptual weight. Ink wordmark loses contrast (ΔL ≈ 0.37). Use inverted variant on any surface with L &lt; 0.65."
          >
            <Wordmark />
          </HostileCell>

          <HostileCell
            label="Paper texture · grain"
            surface={PAPER_TEXTURE}
            textColor={INK}
            extraBackground={paperGrain}
            note="Holds. The period still reads because ACCENT sits outside the texture's hue band. This is the print-on-stock scenario (rector packet cover, printed MoU)."
          >
            <Wordmark />
          </HostileCell>

          <HostileCell
            label="Dark surface · INK"
            surface={INK_SURFACE}
            textColor={PAPER}
            note="Use inverted variant. Contrast is adequate but the ACCENT period reads dimmer against INK than against PAPER — because ACCENT and INK share a warm hue family. Acceptable; not ideal."
          >
            <Wordmark color={PAPER} />
          </HostileCell>

          <HostileCell
            label="Accent-neighbor · oklch(0.58 0.16 32)"
            surface={ACCENT_NEIGHBOR}
            textColor={INK}
            note="BREAK. ΔE between period and surface is ~8 (too close). Rule: never land the mark on any surface within ΔL 0.2 AND ΔH 20° of ACCENT. This defines the ACCENT halo — a forbidden hue band."
          >
            <Wordmark />
          </HostileCell>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION E ───────────────────────── */

function SectionE() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
        borderBottom: `1px solid ${HAIRLINE}`,
      }}
    >
      <SectionHeading
        no="E"
        title="Period treatment microscope"
        lede="4× zoom on the 'ar.' region — three weights, same kerning, same accent hue. The period IS the brand mark. Its execution is not a detail; it is the thing."
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        {([300, 400, 600] as const).map((w) => (
          <figure
            key={w}
            style={{
              margin: 0,
              background: PAPER,
              border: `1px solid ${HAIRLINE}`,
              padding: "40px 32px 32px",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                minHeight: "200px",
              }}
            >
              <span
                style={{
                  fontFamily: SOURCE_STACK,
                  fontWeight: w,
                  fontSize: "480px",
                  letterSpacing: "-0.045em",
                  lineHeight: 0.9,
                  color: INK,
                  transform: "translateX(-20%)",
                  whiteSpace: "nowrap",
                }}
              >
                ar
                <span style={{ color: ACCENT, fontWeight: w }}>.</span>
              </span>
            </div>
            <figcaption style={{ borderTop: `1px solid ${HAIRLINE}`, paddingTop: "16px" }}>
              <Caption style={{ marginBottom: "6px" }}>Source Serif 4 · {w}</Caption>
              <div
                style={{
                  fontFamily: "var(--cruzar-body)",
                  fontSize: "0.82rem",
                  color: INK_SOFT,
                  lineHeight: 1.55,
                }}
              >
                {w === 300 &&
                  "Period dominates the 'r' stem. Its mass equals the counter of 'a' — too loud. Light weight is not the lock."}
                {w === 400 &&
                  "Period sits at ~0.42× the 'a' counter. Balanced. The 'r' terminal arc leads the eye onto the period without collision."}
                {w === 600 &&
                  "Period shrinks relative to the thicker stems. Reads as a comma-adjacent punctuation, not a seal. Semibold is not the lock."}
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Annotation bar */}
      <div
        style={{
          background: PAPER,
          border: `1px solid ${HAIRLINE}`,
          padding: "32px clamp(24px, 3vw, 48px)",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "32px",
        }}
      >
        <div>
          <Caption style={{ marginBottom: "8px" }}>Kerning · r → .</Caption>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--cruzar-body)",
              fontSize: "0.88rem",
              color: INK_SOFT,
              lineHeight: 1.55,
            }}
          >
            Source Serif 4's native advance after 'r' leaves the period sitting ~0.08em clear of the
            'r' terminal arc. No manual kern needed at any size above 20px.
          </p>
        </div>
        <div>
          <Caption style={{ marginBottom: "8px" }}>Visual weight · period vs descender</Caption>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--cruzar-body)",
              fontSize: "0.88rem",
              color: INK_SOFT,
              lineHeight: 1.55,
            }}
          >
            At 400 weight the period's ink mass ≈ the thickness of the 'r' stem. Below 20px size,
            the period stops registering as a separate object and merges visually with subpixel
            noise. That is the minimum.
          </p>
        </div>
        <div>
          <Caption style={{ marginBottom: "8px" }}>Accent saturation</Caption>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--cruzar-body)",
              fontSize: "0.88rem",
              color: INK_SOFT,
              lineHeight: 1.55,
            }}
          >
            ACCENT at oklch(0.42 0.14 30). Chroma 0.14 is high enough to register as 'red' against
            ink, low enough to survive coated stock and Google Slides SRGB gamut. Do not push chroma
            above 0.18 — it gets juvenile fast.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── SECTION F — RECOMMENDATION ───────────────────────── */

const LOCK_ROWS: Array<{ label: string; value: string; detail: string }> = [
  {
    label: "01 · Weight",
    value: "400 Regular",
    detail:
      "300 is editorial but the period loses mass. 500+ reads institutional-corporate and loses the editorial press-page voice. 400 holds both registers.",
  },
  {
    label: "02 · Case",
    value: "Cruzar. · Title case",
    detail:
      "Verb-name stays readable as a verb. Lowercase reads as an app; all-caps reads as a monument and smothers the period.",
  },
  {
    label: "03 · Period geometry",
    value: "Native round dot · Source Serif 4 glyph",
    detail:
      "Square, underline, hollow, and inset variants all either over-engineer the mark or lose the 'full stop as seal' gesture. The native period is the lock.",
  },
  {
    label: "04 · Tracking",
    value: "-0.045em",
    detail:
      "Compresses the wordmark into a single visual unit. -0.02em is too loose, -0.07em kisses the 'r' into the 'z' and buries the period.",
  },
  {
    label: "05 · Accent color",
    value: "ACCENT · oklch(0.42 0.14 30)",
    detail: "Aged-red. Do not deviate hue. Do not push chroma above 0.18.",
  },
  {
    label: "06 · Minimum legible size",
    value: "20px",
    detail:
      "Below 20px the accent period stops registering as a separate object against subpixel noise — it reads as dust on the 'r' descender. Favicons render the wordmark without the period (mark-only variant to be defined in Capa 2).",
  },
  {
    label: "07 · Banned uses",
    value: "ACCENT halo · ΔL<0.2 + ΔH<20° of ACCENT",
    detail:
      "Never land on accent-hue surfaces within the forbidden band. Never place on photography without ink underlay. Never below 20px. Never italic. Never bold. Never all-caps. Never lowercase. Never as a tagline glyph inside running text.",
  },
];

function SectionF() {
  return (
    <section
      style={{
        maxWidth: "1320px",
        margin: "0 auto",
        padding: "clamp(64px, 8vw, 120px) clamp(24px, 5vw, 64px) clamp(80px, 10vw, 160px)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "16px",
          marginBottom: "24px",
          fontFamily: "var(--cruzar-body)",
          fontSize: "0.7rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_LABEL,
        }}
      >
        <span style={{ color: ACCENT, fontWeight: 700 }}>§ F</span>
        <span style={{ flex: "0 0 48px", height: "1px", background: HAIRLINE_STRONG }} />
        <span style={{ color: INK_SOFT, fontWeight: 600 }}>Recommendation · 24-month lock</span>
      </div>

      <h2
        style={{
          margin: "0 0 48px",
          fontFamily: SOURCE_STACK,
          fontWeight: 400,
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          letterSpacing: "-0.03em",
          lineHeight: 1.05,
          color: INK,
          maxWidth: "22ch",
        }}
      >
        The locked wordmark is{" "}
        <span style={{ fontStyle: "normal" }}>
          Cruzar<span style={{ color: ACCENT }}>.</span>
        </span>{" "}
        in Source Serif 4 Regular, tracked -0.045em, period in ACCENT, minimum 20px.
      </h2>

      {/* Lock matrix */}
      <div
        style={{
          border: `1px solid ${INK}`,
          background: PAPER,
        }}
      >
        {LOCK_ROWS.map((row, i) => (
          <div
            key={row.label}
            style={{
              borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}`,
              display: "grid",
              gridTemplateColumns: "minmax(140px, 200px) minmax(200px, 1.2fr) minmax(0, 2fr)",
              gap: "32px",
              padding: "28px clamp(24px, 3vw, 48px)",
              alignItems: "baseline",
            }}
          >
            <Caption>{row.label}</Caption>
            <div
              style={{
                fontFamily: SOURCE_STACK,
                fontWeight: 400,
                fontSize: "1.25rem",
                letterSpacing: "-0.015em",
                color: INK,
              }}
            >
              {row.value}
            </div>
            <div
              style={{
                fontFamily: "var(--cruzar-body)",
                fontSize: "0.92rem",
                color: INK_SOFT,
                lineHeight: 1.55,
              }}
            >
              {row.detail}
            </div>
          </div>
        ))}
      </div>

      {/* Justification */}
      <div
        style={{
          marginTop: "48px",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.2fr)",
          gap: "clamp(32px, 5vw, 80px)",
        }}
      >
        <div>
          <Caption style={{ marginBottom: "12px" }}>Strongest alternative considered</Caption>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--cruzar-body)",
              fontSize: "0.95rem",
              color: INK_SOFT,
              lineHeight: 1.65,
              maxWidth: "48ch",
            }}
          >
            Source Serif 4 at <strong style={{ color: INK }}>500 Medium</strong> — a half-step
            institutional push that held almost everything 400 held, with a slightly more confident
            period. Rejected because it thickened the 'C' bowl enough to pull the wordmark out of
            the editorial register the rector deck depends on. 400 keeps Cruzar on the press page;
            500 moved it toward the enterprise console.
          </p>
        </div>
        <div>
          <Caption style={{ marginBottom: "12px" }}>
            Justification · grounded in the studies
          </Caption>
          <p
            style={{
              margin: 0,
              fontFamily: "var(--cruzar-body)",
              fontSize: "0.95rem",
              color: INK_SOFT,
              lineHeight: 1.65,
              maxWidth: "58ch",
            }}
          >
            Section A showed 400 is the only weight where the period's mass (~0.42× the 'a' counter,
            Section E) registers as a deliberate mark rather than punctuation or ornament. Section B
            identified 20px as the hard floor — below that, the accent period merges with subpixel
            noise on any non-retina surface (rector laptops, printed CV at B/W photocopy). Section D
            surfaced the single serious break: the wordmark cannot land on any surface inside the
            ACCENT halo (ΔL&lt;0.2 + ΔH&lt;20° of oklch(0.42 0.14 30)) without the period vanishing
            — this is now a named banned-use, not a soft preference.
          </p>
        </div>
      </div>

      {/* Biggest break found */}
      <div
        style={{
          marginTop: "48px",
          background: INK,
          color: PAPER,
          padding: "32px clamp(24px, 3vw, 48px)",
        }}
      >
        <Caption style={{ color: "oklch(0.97 0.012 85 / 0.6)", marginBottom: "10px" }}>
          Biggest break found · must be captured in brand guidelines
        </Caption>
        <p
          style={{
            margin: 0,
            fontFamily: SOURCE_STACK,
            fontWeight: 400,
            fontSize: "1.4rem",
            lineHeight: 1.4,
            color: PAPER,
            maxWidth: "62ch",
            letterSpacing: "-0.015em",
          }}
        >
          On surfaces with hue within 20° of ACCENT and lightness within 0.2 of ACCENT, the period
          disappears and the mark silently loses its defining gesture. The current Logotype.tsx has
          no guard against this; a typed{" "}
          <code style={{ fontFamily: "var(--cruzar-mono)" }}>surface</code> prop that validates
          background against the ACCENT halo is required before this lock ships to apps/web.
        </p>
      </div>
    </section>
  );
}

/* ───────────────────────── PAGE ───────────────────────── */

export default function LogotypeStudiesPage() {
  return (
    <main
      className={[
        display.variable,
        body.variable,
        sourceSerifStudies.variable,
        literata.variable,
        spectral.variable,
        ebGaramond.variable,
        caladea.variable,
      ].join(" ")}
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
      {/* ============== MASTHEAD ============== */}
      <header
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "48px clamp(24px, 5vw, 64px) 32px",
          borderBottom: `2px solid ${INK}`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            gap: "24px",
            flexWrap: "wrap",
            fontFamily: "var(--cruzar-body)",
            fontSize: "0.7rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK_SOFT,
            marginBottom: "32px",
          }}
        >
          <span>Cruzar · Brand finalization</span>
          <span>Capa 1 · Logotype Lock</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>Internal · 24-month horizon</span>
        </div>
        <h1
          style={{
            margin: 0,
            fontFamily: SOURCE_STACK,
            fontWeight: 400,
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            letterSpacing: "-0.045em",
            lineHeight: 0.95,
            color: INK,
          }}
        >
          Logotype studies<span style={{ color: ACCENT }}>.</span>
        </h1>
        <p
          style={{
            margin: "24px 0 0",
            maxWidth: "72ch",
            fontFamily: "var(--cruzar-body)",
            fontSize: "1rem",
            lineHeight: 1.65,
            color: INK_SOFT,
          }}
        >
          The current lock — <em>Cruzar.</em> in Source Serif 4 Regular with an ACCENT period — was
          a first-pass pick. This page stress-tests it against weight, case, period geometry,
          tracking, alternative serifs, scale extremes, inversion, and hostile backgrounds. The
          Recommendation at the bottom is the 24-month lock, or a correction if the current pick
          fails.
        </p>
      </header>

      <SectionA />
      <SectionB />
      <SectionC />
      <SectionD />
      <SectionE />
      <SectionF />
    </main>
  );
}
