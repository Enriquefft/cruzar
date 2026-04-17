import {
  Archivo,
  EB_Garamond,
  Fragment_Mono,
  Funnel_Sans,
  Geist_Mono,
  Geologica,
  Inclusive_Sans,
  Literata,
  Martian_Mono,
  Onest,
  Public_Sans,
  Saira,
  Source_Serif_4,
  Spectral,
} from "next/font/google";
import { ACCENT, HAIRLINE, INK, INK_LABEL, INK_SOFT, PAPER, PAPER_DEEP } from "@/lib/tokens";

/**
 * Capa 2 — Type Lock.
 *
 * Head-to-head stress test of every role in Cruzar's typography stack against
 * defensible alternatives. Renders the SAME content in every candidate so the
 * comparison isolates the typeface, not the composition. Output is consumed
 * only by internal reviewers — this page is not a brand surface.
 *
 * Every candidate is a free Google Font, imported inline here (not via
 * @/lib/fonts) so this exploration doesn't pollute the SSOT font config.
 *
 * Reflex-reject check: no candidate is drawn from impeccable's
 * reflex_fonts_to_reject list (Fraunces, Newsreader, Lora, Crimson*,
 * Playfair, Cormorant, Syne, IBM Plex*, Space Mono, Space Grotesk, Inter,
 * DM Sans, DM Serif*, Outfit, Plus Jakarta Sans, Instrument Sans/Serif).
 */

/* ────────────── DISPLAY SERIF CANDIDATES ────────────── */
const serifCurrent = Source_Serif_4({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ts-serif-current",
});
const serifLiterata = Literata({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ts-serif-literata",
});
const serifSpectral = Spectral({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ts-serif-spectral",
});
const serifGaramond = EB_Garamond({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--ts-serif-garamond",
});

/* ────────────── BODY SANS CANDIDATES (EDITORIAL) ────────────── */
const sansCurrent = Funnel_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--ts-sans-current",
});
const sansOnest = Onest({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--ts-sans-onest",
});
const sansInclusive = Inclusive_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  display: "swap",
  variable: "--ts-sans-inclusive",
});
const sansArchivo = Archivo({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--ts-sans-archivo",
});
const sansPublic = Public_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--ts-sans-public",
});

/* ────────────── FIELD-REGISTER SANS CANDIDATES ────────────── */
const fieldCurrent = Geologica({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--ts-field-current",
});
const fieldSaira = Saira({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--ts-field-saira",
});

/* ────────────── MONO CANDIDATES ────────────── */
const monoCurrent = Fragment_Mono({
  subsets: ["latin", "latin-ext"],
  weight: "400",
  display: "swap",
  variable: "--ts-mono-current",
});
const monoGeist = Geist_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--ts-mono-geist",
});
const monoMartian = Martian_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--ts-mono-martian",
});

const allFontVariables = [
  serifCurrent.variable,
  serifLiterata.variable,
  serifSpectral.variable,
  serifGaramond.variable,
  sansCurrent.variable,
  sansOnest.variable,
  sansInclusive.variable,
  sansArchivo.variable,
  sansPublic.variable,
  fieldCurrent.variable,
  fieldSaira.variable,
  monoCurrent.variable,
  monoGeist.variable,
  monoMartian.variable,
].join(" ");

/* ──────────────────────────── CONTENT ──────────────────────────── */

const HEADLINE = "Cruza del salario local al internacional.";
const EDITORIAL_LEDE_ES =
  "Cruzar diagnostica tu inglés y tus habilidades blandas, valida tu capacidad en escenarios reales de trabajo remoto internacional, y postula en tu nombre a empleos con nómina extranjera. No prometemos: verificamos con carta-oferta firmada y captura del primer pago en USD.";

const ES_STRESS = "España, mañana, ¿cómo está?, niño, año, día, sábado, miércoles, café, después.";
const ES_GLYPHS = "á é í ó ú ñ Ñ ¿ ¡ ü « » — –";

const SMALL_PARAGRAPH_ES =
  "Los diagnósticos se hacen sobre encargos que un gerente extranjero aceptaría sin preguntar. La postulación corre en autopiloto: Cruzar escribe la carta, adapta el CV por vacante y mide el delta salarial contra el mercado local. ¿El resultado? Cohorte 02: 12 de 47 colocados, +$2,840 USD/mes promedio.";
const SMALL_PARAGRAPH_EN =
  "Assessments ride on briefs a foreign hiring manager would accept without flinching. Applications run on autopilot: Cruzar writes the letter, tailors the CV per opening, and measures salary delta against local market baselines. Cohort 02: 12 of 47 placed, +$2,840 USD/month average delta.";

/* ─────────────── DATA TABLE FOR NUMERIC STRESS ─────────────── */
type TableRow = { date: string; scope: string; amount: string; ratio: string; id: string };
const TABLE_ROWS: ReadonlyArray<TableRow> = [
  {
    date: "2026-04-15",
    scope: "Cohort 02 · placement",
    amount: "USD 2,840.00",
    ratio: "4.1×",
    id: "CRZ-2026-04-001",
  },
  {
    date: "2026-04-11",
    scope: "Cohort 02 · placement",
    amount: "USD 3,120.00",
    ratio: "5.2×",
    id: "CRZ-2026-04-002",
  },
  {
    date: "2026-03-27",
    scope: "Cohort 01 · reconciliation",
    amount: "USD 1,980.00",
    ratio: "3.4×",
    id: "CRZ-2026-03-014",
  },
  {
    date: "2026-03-19",
    scope: "Cohort 02 · diagnostic 87.4%",
    amount: "USD 0.00",
    ratio: "—",
    id: "CRZ-2026-03-011",
  },
] as const;

const LOG_LINES: ReadonlyArray<string> = [
  "2026-04-15T09:42:00-05:00  INFO   CRZ-2026-04-001   placement.verified   delta=+2840.00 USD mult=4.1×",
  "2026-04-15T09:42:03-05:00  INFO   CRZ-2026-04-001   offer_letter.hashed  sha256=9f3c…a71e size=187kB",
  "2026-04-15T09:42:04-05:00  DEBUG  CRZ-2026-04-001   payroll.screenshot   ok dims=1440x2960",
  "2026-04-15T09:42:07-05:00  WARN   CRZ-2026-04-002   cv.tailor.retry      attempt=2/3 latency=812ms",
  "2026-04-15T09:42:09-05:00  INFO   CRZ-2026-04-002   cv.tailor.done       model=sonnet tok=2,104",
  "2026-04-15T09:42:11-05:00  ERROR  CRZ-2026-03-014   reconcile.mismatch   local=1980.00 remote=1983.40",
];

/* ──────────────────────── SMALL PRIMITIVES ──────────────────────── */

function SectionHeading({ no, title, note }: { no: string; title: string; note?: string }) {
  return (
    <header
      style={{
        borderTop: `2px solid ${INK}`,
        paddingTop: "32px",
        marginBottom: "40px",
        display: "grid",
        gridTemplateColumns: "auto 1fr auto",
        gap: "24px",
        alignItems: "baseline",
      }}
    >
      <span
        style={{
          color: ACCENT,
          fontFamily: "var(--ts-mono-current)",
          fontSize: "0.72rem",
          letterSpacing: "0.22em",
          fontWeight: 700,
        }}
      >
        § {no}
      </span>
      <h2
        style={{
          margin: 0,
          fontFamily: "var(--ts-serif-current)",
          fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)",
          letterSpacing: "-0.018em",
          fontWeight: 500,
          color: INK,
        }}
      >
        {title}
      </h2>
      {note ? (
        <span
          style={{
            fontFamily: "var(--ts-mono-current)",
            fontSize: "0.7rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: INK_LABEL,
            textAlign: "right",
          }}
        >
          {note}
        </span>
      ) : (
        <span />
      )}
    </header>
  );
}

type CandidateProps = {
  family: string;
  cssVar: string;
  character: string;
  flag?: "current" | "rejected" | "alt";
  children: React.ReactNode;
};

function CandidatePanel({ family, cssVar, character, flag, children }: CandidateProps) {
  const flagLabel =
    flag === "current" ? "CURRENT" : flag === "rejected" ? "PREVIOUSLY REJECTED" : "ALTERNATIVE";
  const flagColor = flag === "current" ? ACCENT : flag === "rejected" ? INK_LABEL : INK_SOFT;
  return (
    <article
      style={{
        border: `1px solid ${HAIRLINE}`,
        background: PAPER,
        padding: "clamp(20px, 2vw, 28px)",
        display: "flex",
        flexDirection: "column",
        gap: "18px",
        minWidth: 0,
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: `1px solid ${HAIRLINE}`,
          paddingBottom: "10px",
          fontFamily: "var(--ts-mono-current)",
          fontSize: "0.68rem",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: INK, fontWeight: 600 }}>{family}</span>
        <span style={{ color: flagColor }}>{flagLabel}</span>
      </header>
      <div style={{ fontFamily: `var(${cssVar}), ui-serif, Georgia, serif` }}>{children}</div>
      <footer
        style={{
          borderTop: `1px dashed ${HAIRLINE}`,
          paddingTop: "10px",
          fontFamily: "var(--ts-sans-current)",
          fontSize: "0.78rem",
          lineHeight: 1.5,
          color: INK_SOFT,
          fontStyle: "italic",
        }}
      >
        {character}
      </footer>
    </article>
  );
}

function WordmarkSample({ cssVar }: { cssVar: string }) {
  return (
    <div
      style={{
        fontFamily: `var(${cssVar})`,
        fontSize: "clamp(3.6rem, 7vw, 5.6rem)",
        fontWeight: 400,
        letterSpacing: "-0.045em",
        lineHeight: 0.92,
        color: INK,
      }}
    >
      Cruzar
      <span style={{ color: ACCENT }}>.</span>
    </div>
  );
}

function HeadlineSample({ cssVar }: { cssVar: string }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: `var(${cssVar})`,
        fontSize: "clamp(1.4rem, 2.2vw, 1.85rem)",
        lineHeight: 1.12,
        letterSpacing: "-0.018em",
        fontWeight: 500,
        color: INK,
        maxWidth: "18ch",
      }}
    >
      {HEADLINE}
    </p>
  );
}

function LedeSample({ cssVar }: { cssVar: string }) {
  return (
    <p
      style={{
        margin: 0,
        fontFamily: `var(${cssVar})`,
        fontSize: "1rem",
        lineHeight: 1.55,
        color: INK_SOFT,
        maxWidth: "42ch",
      }}
    >
      {EDITORIAL_LEDE_ES}
    </p>
  );
}

function BodyParagraphs({ cssVar }: { cssVar: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div
        style={{
          fontFamily: "var(--ts-mono-current)",
          fontSize: "0.62rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_LABEL,
          fontWeight: 700,
        }}
      >
        Cohort 02 · Verified · 2026
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: `var(${cssVar})`,
          fontSize: "0.96rem",
          lineHeight: 1.55,
          color: INK,
          maxWidth: "80ch",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {SMALL_PARAGRAPH_ES}
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: `var(${cssVar})`,
          fontSize: "0.96rem",
          lineHeight: 1.55,
          color: INK_SOFT,
          maxWidth: "80ch",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {SMALL_PARAGRAPH_EN}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "20px",
          fontFamily: `var(${cssVar})`,
          fontVariantNumeric: "tabular-nums lining-nums",
        }}
      >
        <span
          style={{
            fontSize: "1.6rem",
            fontWeight: 600,
            letterSpacing: "-0.015em",
            color: INK,
          }}
        >
          +$2,840
        </span>
        <span style={{ fontSize: "0.8rem", color: INK_LABEL }}>
          USD / month · delta · cohort 02
        </span>
      </div>
    </div>
  );
}

function SpanishGlyphStress({ cssVar }: { cssVar: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div
        style={{
          fontFamily: `var(${cssVar})`,
          fontSize: "1.6rem",
          fontWeight: 400,
          letterSpacing: "-0.012em",
          color: INK,
          lineHeight: 1.25,
        }}
      >
        {ES_STRESS}
      </div>
      <div
        style={{
          fontFamily: `var(${cssVar})`,
          fontSize: "2.4rem",
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: INK_SOFT,
          lineHeight: 1.1,
        }}
      >
        {ES_GLYPHS}
      </div>
    </div>
  );
}

function NumericTable({ cssVar }: { cssVar: string }) {
  return (
    <table
      style={{
        width: "100%",
        borderCollapse: "collapse",
        fontFamily: `var(${cssVar})`,
        fontSize: "0.9rem",
        fontVariantNumeric: "tabular-nums lining-nums",
        color: INK,
      }}
    >
      <thead>
        <tr
          style={{
            borderBottom: `1px solid ${INK}`,
            textAlign: "left",
          }}
        >
          <th
            style={{
              padding: "8px 12px 8px 0",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            Date
          </th>
          <th
            style={{
              padding: "8px 12px",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            Scope
          </th>
          <th
            style={{
              padding: "8px 12px",
              textAlign: "right",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            Amount
          </th>
          <th
            style={{
              padding: "8px 12px",
              textAlign: "right",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            Ratio
          </th>
          <th
            style={{
              padding: "8px 0 8px 12px",
              textAlign: "right",
              fontWeight: 600,
              fontSize: "0.72rem",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: INK_SOFT,
            }}
          >
            ID
          </th>
        </tr>
      </thead>
      <tbody>
        {TABLE_ROWS.map((row, i) => (
          <tr
            key={row.id}
            style={{
              borderBottom: i === TABLE_ROWS.length - 1 ? "none" : `1px solid ${HAIRLINE}`,
            }}
          >
            <td style={{ padding: "10px 12px 10px 0" }}>{row.date}</td>
            <td style={{ padding: "10px 12px", color: INK_SOFT }}>{row.scope}</td>
            <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.amount}</td>
            <td style={{ padding: "10px 12px", textAlign: "right" }}>{row.ratio}</td>
            <td style={{ padding: "10px 0 10px 12px", textAlign: "right", color: INK_SOFT }}>
              {row.id}
            </td>
          </tr>
        ))}
        <tr>
          <td
            colSpan={2}
            style={{ padding: "12px 12px 0 0", fontSize: "0.78rem", color: INK_LABEL }}
          >
            Totals · 87.4% verified
          </td>
          <td style={{ padding: "12px 12px 0", textAlign: "right", fontWeight: 600 }}>
            USD 7,940.00
          </td>
          <td style={{ padding: "12px 12px 0", textAlign: "right", fontWeight: 600 }}>4.1×</td>
          <td style={{ padding: "12px 0 0 12px", textAlign: "right", color: INK_LABEL }}>n=4</td>
        </tr>
      </tbody>
    </table>
  );
}

function MonoLogBlock({ cssVar }: { cssVar: string }) {
  return (
    <pre
      style={{
        margin: 0,
        padding: "18px 20px",
        background: PAPER_DEEP,
        border: `1px solid ${HAIRLINE}`,
        fontFamily: `var(${cssVar})`,
        fontSize: "0.78rem",
        lineHeight: 1.65,
        color: INK,
        overflowX: "auto",
        whiteSpace: "pre",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {LOG_LINES.join("\n")}
    </pre>
  );
}

function SmallSizeStress({ cssVar, label }: { cssVar: string; label: string }) {
  return (
    <div
      style={{
        border: `1px solid ${HAIRLINE}`,
        background: PAPER,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
      }}
    >
      <div
        style={{
          fontFamily: "var(--ts-mono-current)",
          fontSize: "0.62rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK_LABEL,
          fontWeight: 700,
        }}
      >
        {label}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: `var(${cssVar})`,
          fontSize: "12px",
          lineHeight: 1.5,
          color: INK,
          maxWidth: "70ch",
        }}
      >
        <span style={{ color: INK_SOFT }}>12px · </span>
        {SMALL_PARAGRAPH_ES}
      </p>
      <p
        style={{
          margin: 0,
          fontFamily: `var(${cssVar})`,
          fontSize: "14px",
          lineHeight: 1.5,
          color: INK,
          maxWidth: "70ch",
        }}
      >
        <span style={{ color: INK_SOFT }}>14px · </span>
        {SMALL_PARAGRAPH_EN}
      </p>
    </div>
  );
}

/* ──────────────────────────── PAGE ──────────────────────────── */

export default function TypeStudiesPage() {
  return (
    <main
      className={allFontVariables}
      style={{
        background: PAPER,
        color: INK,
        minHeight: "100vh",
        fontFamily: "var(--ts-sans-current), ui-sans-serif, system-ui, sans-serif",
        fontSize: "16px",
        lineHeight: 1.55,
        WebkitFontSmoothing: "antialiased",
        MozOsxFontSmoothing: "grayscale",
        fontVariantNumeric: "tabular-nums lining-nums",
      }}
    >
      {/* ============ MASTHEAD ============ */}
      <header
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(32px, 5vw, 56px) clamp(24px, 5vw, 64px) 24px",
          borderBottom: `2px solid ${INK}`,
          display: "grid",
          gridTemplateColumns: "1fr auto",
          gap: "24px",
          alignItems: "baseline",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--ts-mono-current)",
              fontSize: "0.7rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: ACCENT,
              fontWeight: 700,
            }}
          >
            Capa 02 · Type Lock
          </div>
          <h1
            style={{
              margin: "10px 0 0",
              fontFamily: "var(--ts-serif-current)",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              fontWeight: 400,
              color: INK,
              maxWidth: "28ch",
            }}
          >
            Head-to-head stress test of every typeface role, before the 24-month lock.
          </h1>
        </div>
        <div
          style={{
            fontFamily: "var(--ts-mono-current)",
            fontSize: "0.7rem",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: INK_LABEL,
            textAlign: "right",
            lineHeight: 1.6,
          }}
        >
          <div>2026-04-15</div>
          <div>Internal · not for pitch</div>
          <div>Free Google Fonts only</div>
        </div>
      </header>

      {/* ============ SECTION A — DISPLAY SERIF ============ */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionHeading
          no="A"
          title="Display serif · wordmark · headline · editorial lede"
          note="4 candidates · same copy"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "24px",
          }}
        >
          <CandidatePanel
            family="Source Serif 4 · Frank Grießhammer · 2022"
            cssVar="--ts-serif-current"
            flag="current"
            character="Quarterly-report neutrality. Optical-size aware, tabular by construction. The accent period lands flat and legible — it reads as punctuation first, mark second. Safe and institutional, but the letterforms carry no authorial voice; the brand has to lean on the red period to feel owned."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <WordmarkSample cssVar="--ts-serif-current" />
              <HeadlineSample cssVar="--ts-serif-current" />
              <LedeSample cssVar="--ts-serif-current" />
            </div>
          </CandidatePanel>
          <CandidatePanel
            family="Literata · Type Together · 2018"
            cssVar="--ts-serif-literata"
            character="Designed for long-form on e-readers — open counters, taller x-height, warm bracketed serifs. Reads as university-press serious. The accent period sits slightly low relative to the descender baseline: feels more like a closing statement than a diacritic. This is the most bookish candidate and the one that best carries an editorial lede without fatigue."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <WordmarkSample cssVar="--ts-serif-literata" />
              <HeadlineSample cssVar="--ts-serif-literata" />
              <LedeSample cssVar="--ts-serif-literata" />
            </div>
          </CandidatePanel>
          <CandidatePanel
            family="Spectral · Production Type · 2017"
            cssVar="--ts-serif-spectral"
            character="Warm contemporary, French-rationalist lineage. Higher stroke contrast than Source Serif 4 — looks more editorial, less quarterly. Accent period reads as deliberate, pin-sharp. Slight risk at very small sizes: the thin strokes hairline out. Stronger voice than the current pick, but reads as magazine, not institution."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <WordmarkSample cssVar="--ts-serif-spectral" />
              <HeadlineSample cssVar="--ts-serif-spectral" />
              <LedeSample cssVar="--ts-serif-spectral" />
            </div>
          </CandidatePanel>
          <CandidatePanel
            family="EB Garamond · Georg Duffner · 2011"
            cssVar="--ts-serif-garamond"
            character="Canonical old-style, revival of Claude Garamont. Feels like an 18th-century novel or a university diploma. Beautiful but period-heavy — at display sizes the tall ascenders and low x-height read as overtly literary, which competes with the 'institutional, accountable' tone. Accent period hangs in open air; reads as a full stop, not a branded mark."
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <WordmarkSample cssVar="--ts-serif-garamond" />
              <HeadlineSample cssVar="--ts-serif-garamond" />
              <LedeSample cssVar="--ts-serif-garamond" />
            </div>
          </CandidatePanel>
        </div>
        <p
          style={{
            margin: "24px 0 0",
            maxWidth: "72ch",
            fontSize: "0.86rem",
            color: INK_SOFT,
            lineHeight: 1.55,
          }}
        >
          <strong style={{ color: INK }}>Source Serif Pro</strong> is listed separately in the brief
          but is not a distinct Google Fonts family — Adobe superseded Source Serif Pro with Source
          Serif 4 in 2021, and Google Fonts serves only the latter under the
          <em> Source_Serif_4 </em>entry. Rendering it as a second panel would duplicate the CURRENT
          panel above. Omitted by design, not by oversight.
        </p>
      </section>

      {/* ============ SECTION B — BODY SANS (EDITORIAL) ============ */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)",
          }}
        >
          <SectionHeading
            no="B"
            title="Body sans · editorial register · ES + EN + eyebrow + metric"
            note="5 candidates"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
              gap: "24px",
            }}
          >
            <CandidatePanel
              family="Funnel Sans · Oh no Type · 2023"
              cssVar="--ts-sans-current"
              flag="current"
              character="Subtly flared strokes, generous apertures, ink-trapped joins. Reads warmer than a standard neo-grotesque. Tabular figures land cleanly. Metric +$2,840 has good rhythm. The 'ñ' tilde sits central and balanced. Biggest risk: the flared terminals flatten at very small sizes (<13px), nudging it toward generic geometric grotesque."
            >
              <BodyParagraphs cssVar="--ts-sans-current" />
            </CandidatePanel>
            <CandidatePanel
              family="Onest · Atipo Foundry · 2023"
              cssVar="--ts-sans-onest"
              character="Modern grotesque with warm curvature and open apertures. Slightly rounder than Funnel Sans; reads as trusted software, not editorial press. Tabular numerals excellent. The metric +$2,840 is almost identical in rhythm to the current pick. For a rector-facing serif + sans pairing, Onest is the closest competitor — but its softness tips the pair toward 'startup'."
            >
              <BodyParagraphs cssVar="--ts-sans-onest" />
            </CandidatePanel>
            <CandidatePanel
              family="Inclusive Sans · Olivia King · 2023"
              cssVar="--ts-sans-inclusive"
              character="Designed around accessibility — large counters, unambiguous 1/l/I, distinct a/e. Feels public-sector, almost municipal. A single weight is available on Google Fonts, which is fatal for Cruzar: we need 400/500/600 for the editorial hierarchy. Reject on weight range alone."
            >
              <BodyParagraphs cssVar="--ts-sans-inclusive" />
            </CandidatePanel>
            <CandidatePanel
              family="Archivo · Omnibus Type · 2013"
              cssVar="--ts-sans-archivo"
              character="Slightly condensed grotesque workhorse. Tightens lines at narrow widths — strong for tables. But the condensed proportion conflicts with Source Serif 4's comfortable rhythm in long-form; the eye reads two tempos instead of one. Better for dashboard-density (Section C) than for editorial body."
            >
              <BodyParagraphs cssVar="--ts-sans-archivo" />
            </CandidatePanel>
            <CandidatePanel
              family="Public Sans · USWDS · 2019"
              cssVar="--ts-sans-public"
              flag="rejected"
              character="Rendered to confirm the prior reject. Generic US-gov-style neo-grotesque, derivative of Libre Franklin. Tabular figures correct but flat. The paragraph reads competent and utterly anonymous — it would give Cruzar the 'municipal PDF' voice the brand must avoid. Reject stands."
            >
              <BodyParagraphs cssVar="--ts-sans-public" />
            </CandidatePanel>
          </div>
        </div>
      </section>

      {/* ============ SECTION C — FIELD-REGISTER SANS ============ */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionHeading
          no="C"
          title="Field-register sans · operator voice · dense data"
          note="4 candidates · same field-report copy"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
          }}
        >
          <CandidatePanel
            family="Geologica · Anatoletype · 2023"
            cssVar="--ts-field-current"
            flag="current"
            character="Variable, mechanical, slightly condensed. Instrument-panel voice — reads as dashboard, not press. Excellent at dashboard sizes. Risk: Geologica's flared 'a' and angular 'g' sit in a different idiom from Funnel Sans, giving Cruzar two sans families that can feel unrelated when a surface (e.g. the CV template) juxtaposes editorial and field type in the same viewport."
          >
            <BodyParagraphs cssVar="--ts-field-current" />
          </CandidatePanel>
          <CandidatePanel
            family="Saira · Omnibus Type · 2015"
            cssVar="--ts-field-saira"
            character="Industrial, semi-condensed, rounded corners. Reads as terminal / hardware documentation. Keeps character at 11-12px. The condensation packs tables efficiently, but the rounded terminals add a slight toy quality that competes with the gravitas target. Best use: internal-only dashboards. Rector-visible surfaces should steer clear."
          >
            <BodyParagraphs cssVar="--ts-field-saira" />
          </CandidatePanel>
          <CandidatePanel
            family="Funnel Sans · as unified body"
            cssVar="--ts-sans-current"
            character="Collapse test: can one sans cover both registers? Funnel Sans in dense data feels warmer than Geologica — it softens the field-report voice from 'operator' toward 'report'. For the CV template (field register but employer-facing) this is the RIGHT softening. For an ops-only dashboard, slight loss of density. Net: the collapse is viable and simplifies the system."
          >
            <BodyParagraphs cssVar="--ts-sans-current" />
          </CandidatePanel>
          <CandidatePanel
            family="Public Sans · comparison"
            cssVar="--ts-sans-public"
            flag="rejected"
            character="Consistent with Section B: legible, competent, personality-free. In the field register it reads as the default font of every municipal portal on earth. Any choice that ships Cruzar with this voice fails the 'no emerging-market discount cues' test on employer-facing CVs. Reject stands."
          >
            <BodyParagraphs cssVar="--ts-sans-public" />
          </CandidatePanel>
        </div>
      </section>

      {/* ============ SECTION D — MONO ============ */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)",
          }}
        >
          <SectionHeading
            no="D"
            title="Mono · log line · metric · ID · timestamp"
            note="3 candidates on Google Fonts"
          />
          <p
            style={{
              margin: "0 0 24px",
              maxWidth: "72ch",
              fontSize: "0.88rem",
              color: INK_SOFT,
              lineHeight: 1.55,
            }}
          >
            Note on candidate set: <strong style={{ color: INK }}>Commit Mono</strong> and{" "}
            <strong style={{ color: INK }}>Iosevka</strong> are excellent free monos but are not
            distributed via Google Fonts (Commit Mono is hosted at commitmono.com; Iosevka via
            GitHub releases). This page is constrained to Google Fonts only, so they are substituted
            with the closest-character Google-hosted alternatives:{" "}
            <strong style={{ color: INK }}>Geist Mono</strong> in place of Commit Mono (warm,
            designed for code), and <strong style={{ color: INK }}>Martian Mono</strong> in place of
            Iosevka (technical, narrow, geometric).
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
              gap: "24px",
            }}
          >
            <CandidatePanel
              family="Fragment Mono · Weiweihuanghuang · 2022"
              cssVar="--ts-mono-current"
              flag="current"
              character="Humanist mono with slightly uneven rhythm. Reads as machine-typed rather than code. Single 400 weight only — fatal for a system that wants a BOLD state in logs (error vs info) without introducing a second family. Digit width consistent; tabular layouts hold. Character is right, weight range is wrong."
            >
              <MonoLogBlock cssVar="--ts-mono-current" />
            </CandidatePanel>
            <CandidatePanel
              family="Geist Mono · Vercel · 2023"
              cssVar="--ts-mono-geist"
              character="Warm, precise, designed for code by Vercel. Two weights (400/500) give a clean ERROR/INFO hierarchy in logs. Tabular figures excellent, unambiguous 0/O/1/l/I. Reads as a 2020s developer tool — closest to what an employer's CTO recognizes as 'modern engineering' without the IBM-Plex monoculture tell."
            >
              <MonoLogBlock cssVar="--ts-mono-geist" />
            </CandidatePanel>
            <CandidatePanel
              family="Martian Mono · EvilMartians · 2022"
              cssVar="--ts-mono-martian"
              character="Geometric, narrow, condensed — reads as mainframe-terminal lineage (Iosevka-adjacent). Dense tables pack further, which is useful on the CV and the operator dashboard. Slight legibility cost at 12px in long runs. Strong alternative if the brand wants a harder 'instrument' voice; weaker than Geist Mono for employer-facing surfaces."
            >
              <MonoLogBlock cssVar="--ts-mono-martian" />
            </CandidatePanel>
          </div>
        </div>
      </section>

      {/* ============ SECTION E — SPANISH STRESS ============ */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionHeading
          no="E"
          title="Spanish character stress · ñ · tildes · ¿ ¡ · common words"
          note="Final candidate set"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
            gap: "24px",
          }}
        >
          <CandidatePanel
            family="Display · Literata (proposed lock)"
            cssVar="--ts-serif-literata"
            character="The 'ñ' tilde is broad and confidently placed. Inverted punctuation ¿ ¡ carry full weight — they don't feel like afterthoughts. 'España, mañana, café, después' all render with the warm curvature that carries the editorial register. No weak-glyph fallback to a different font anywhere in the sample."
          >
            <SpanishGlyphStress cssVar="--ts-serif-literata" />
          </CandidatePanel>
          <CandidatePanel
            family="Body · Funnel Sans (lock)"
            cssVar="--ts-sans-current"
            flag="current"
            character="Tildes sit central; ñ is unambiguous at all sizes. ¿ and ¡ are the correct visual weight of the sentence they open. The Oh no Type drawing handles Spanish natively, not as a bolted-on Latin Extended range."
          >
            <SpanishGlyphStress cssVar="--ts-sans-current" />
          </CandidatePanel>
          <CandidatePanel
            family="Field · Funnel Sans (if collapsed) vs Geologica"
            cssVar="--ts-field-current"
            character="Geologica sample: tildes are slightly flatter than in Funnel Sans and the ñ feels mechanical rather than organic. Legibility is fine; aesthetic warmth is lost. Compare against the Funnel Sans panel to the left — the differential is small but visible, and it supports collapsing to Funnel Sans for the field register."
          >
            <SpanishGlyphStress cssVar="--ts-field-current" />
          </CandidatePanel>
          <CandidatePanel
            family="Mono · Geist Mono (proposed lock)"
            cssVar="--ts-mono-geist"
            character="Mono faces rarely render Spanish with care. Geist Mono does — ñ is present, tildes are proportional, ¿ ¡ are drawn at the correct cap-height. Unlike Fragment Mono's slightly uneven diacritic placement, Geist Mono is flat and unsurprising, which is the correct behavior for log lines."
          >
            <SpanishGlyphStress cssVar="--ts-mono-geist" />
          </CandidatePanel>
        </div>
      </section>

      {/* ============ SECTION F — NUMERIC DENSITY ============ */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `1px solid ${HAIRLINE}`,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)",
          }}
        >
          <SectionHeading
            no="F"
            title="Numeric density · dates · USD · % · × · IDs"
            note="Tabular figures on"
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
              gap: "24px",
            }}
          >
            <CandidatePanel
              family="Body · Funnel Sans (editorial register)"
              cssVar="--ts-sans-current"
              flag="current"
              character="Digit widths uniform; the column of amounts (USD 2,840.00 / 3,120.00 / 1,980.00) aligns to the thousandth. The × glyph is drawn, not substituted. Dates (2026-04-15) and IDs (CRZ-2026-04-001) read evenly. No numeric rhythm issues."
            >
              <NumericTable cssVar="--ts-sans-current" />
            </CandidatePanel>
            <CandidatePanel
              family="Field · Geologica"
              cssVar="--ts-field-current"
              character="Slightly denser columns — the condensed proportion is an advantage here, not a liability. But the digit 1 has a short serifed foot that doesn't match the style of 2/3/4; in a column of totals, the eye catches the inconsistency. Funnel Sans is cleaner for totals; Geologica is denser for rows."
            >
              <NumericTable cssVar="--ts-field-current" />
            </CandidatePanel>
            <CandidatePanel
              family="Mono · Geist Mono"
              cssVar="--ts-mono-geist"
              character="Monospaced so all digits land on the same column regardless of value. Best for the operator-facing tables in the CV and the dashboard. Overkill for the editorial register, where Funnel Sans's proportional + tabular figures keep more air on the page."
            >
              <NumericTable cssVar="--ts-mono-geist" />
            </CandidatePanel>
          </div>
        </div>
      </section>

      {/* ============ SECTION G — SMALL SIZE ============ */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionHeading
          no="G"
          title="Screen rendering at small sizes · 12px and 14px paragraphs"
          note="Footnote, caption, dense-ui range"
        />
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "16px",
          }}
        >
          <SmallSizeStress cssVar="--ts-serif-literata" label="Display · Literata" />
          <SmallSizeStress cssVar="--ts-sans-current" label="Body · Funnel Sans" />
          <SmallSizeStress cssVar="--ts-field-current" label="Field · Geologica" />
          <SmallSizeStress cssVar="--ts-mono-geist" label="Mono · Geist Mono" />
        </div>
        <p
          style={{
            margin: "20px 0 0",
            maxWidth: "72ch",
            fontSize: "0.86rem",
            color: INK_SOFT,
            lineHeight: 1.55,
          }}
        >
          At 12px, Literata holds its weight — the taller x-height was drawn for exactly this size
          range and it pays off. Funnel Sans holds at 14px but thins visibly at 12px; most editorial
          surfaces should not drop below 14px. Geologica is the strongest of the four at 12px
          (explicitly designed for dense UI). Geist Mono is legible at 12px and the correct floor
          for CV footer text.
        </p>
      </section>

      {/* ============ SECTION H — RECOMMENDATION ============ */}
      <section
        style={{
          background: INK,
          color: PAPER,
          borderTop: `2px solid ${INK}`,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(64px, 8vw, 112px) clamp(24px, 5vw, 64px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--ts-mono-current)",
              fontSize: "0.7rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: ACCENT,
              fontWeight: 700,
            }}
          >
            § H · Recommendation · 24-month lock
          </div>
          <h2
            style={{
              margin: "14px 0 40px",
              fontFamily: "var(--ts-serif-literata)",
              fontSize: "clamp(2.2rem, 4.2vw, 3.4rem)",
              lineHeight: 1.04,
              letterSpacing: "-0.022em",
              fontWeight: 400,
              color: PAPER,
              maxWidth: "26ch",
            }}
          >
            Two swaps, two holds. The current stack shipped but is not optimal.
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "32px",
            }}
          >
            <LockCard
              usage="DISPLAY"
              family="Literata"
              verdict="SWAP"
              weights="400 / 500 / 600 · italic 400"
              reason="Editorial register needs a serif with a voice. Source Serif 4 is neutral to the point of anonymous — the brand leans on the red period to feel owned. Literata was drawn for long-form on screen, has open counters that hold at 12px (Section G), and renders Spanish diacritics with care (Section E). University-press gravitas without the costume-drama tax of EB Garamond."
            />
            <LockCard
              usage="BODY"
              family="Funnel Sans"
              verdict="HOLD"
              weights="400 / 500 / 600"
              reason="Off the reflex-reject list, subtle flared strokes, warm without being startup-soft. Only Onest came close; Onest is slightly rounder and tips the pair toward software, not press. Funnel Sans stays."
            />
            <LockCard
              usage="BODY-DENSE"
              family="Funnel Sans (collapse)"
              verdict="SWAP / COLLAPSE"
              weights="500 / 600 (same family as BODY)"
              reason="The two-sans split (Funnel + Geologica) creates a subtle incoherence on hybrid surfaces (CV, employer email, dashboard header). Funnel Sans carries the field register well enough (Section C) and renders Spanish more warmly (Section E). Eliminating the second sans family also drops ~35kB of font payload. If a dense-only surface ever needs a denser cut, use Funnel Sans at 14px semibold — not a second font."
            />
            <LockCard
              usage="MONO"
              family="Geist Mono"
              verdict="SWAP"
              weights="400 / 500"
              reason="Fragment Mono is single-weight, which collapses the error/info hierarchy in logs. Geist Mono ships two weights, renders Spanish diacritics correctly (Section E), is off the IBM-Plex monoculture tell, and reads as engineered-by-2020s. Employer-facing CV code samples gain credibility, not cost it."
            />
          </div>

          <hr
            style={{
              margin: "56px 0 40px",
              border: 0,
              borderTop: `1px solid ${INK_SOFT}`,
              opacity: 0.5,
            }}
          />

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", maxWidth: "80ch" }}
          >
            <div>
              <div
                style={{
                  fontFamily: "var(--ts-mono-current)",
                  fontSize: "0.68rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: ACCENT,
                  fontWeight: 700,
                  marginBottom: "10px",
                }}
              >
                Biggest single risk · current stack (pre-swap)
              </div>
              <p
                style={{
                  margin: 0,
                  fontFamily: "var(--ts-serif-literata)",
                  fontSize: "clamp(1.2rem, 1.8vw, 1.5rem)",
                  lineHeight: 1.4,
                  letterSpacing: "-0.01em",
                  color: PAPER,
                  opacity: 0.92,
                }}
              >
                The combination of Source Serif 4 (neutral) + Funnel Sans (warm) + Geologica
                (mechanical) + Fragment Mono (humanist, single-weight) gives Cruzar FOUR unrelated
                type voices. The brand survives only because the accent period visually ties
                editorial surfaces together. Remove the period — say, on a CV footer or an operator
                dashboard that the design system says should not carry the accent — and the stack
                loses cohesion. The proposed lock reduces the system from 4 families to 3 (Literata
                + Funnel Sans + Geist Mono), each with a clear job and a defensible voice.
              </p>
            </div>
            <div
              style={{
                fontFamily: "var(--ts-mono-current)",
                fontSize: "0.78rem",
                letterSpacing: "0.04em",
                color: PAPER,
                opacity: 0.7,
                lineHeight: 1.7,
                borderTop: `1px solid ${INK_SOFT}`,
                paddingTop: "16px",
              }}
            >
              Total CSS payload, locked stack (latin + latin-ext, woff2, Next auto-subset):
              <br />
              Literata 400/500/600 + italic ≈ 112 kB · Funnel Sans 400/500/600 ≈ 58 kB · Geist Mono
              400/500 ≈ 42 kB · total ≈ 212 kB. vs. current stack ≈ 265 kB. Net saving ≈ 53 kB.
            </div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer
        style={{
          borderTop: `2px solid ${INK}`,
          background: PAPER,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "28px clamp(24px, 5vw, 64px)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "16px",
            fontFamily: "var(--ts-mono-current)",
            fontSize: "0.7rem",
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: INK_LABEL,
          }}
        >
          <span>Cruzar · Capa 02 · Type Lock</span>
          <span>Internal review · 2026-04-15</span>
          <span>apps/brand/app/brand/type-studies</span>
        </div>
      </footer>
    </main>
  );
}

function LockCard({
  usage,
  family,
  verdict,
  weights,
  reason,
}: {
  usage: string;
  family: string;
  verdict: "HOLD" | "SWAP" | "SWAP / COLLAPSE";
  weights: string;
  reason: string;
}) {
  const verdictColor = verdict === "HOLD" ? INK_LABEL : ACCENT;
  return (
    <article
      style={{
        border: `1px solid ${INK_SOFT}`,
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        background: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "var(--ts-mono-current)",
          fontSize: "0.66rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        <span style={{ color: PAPER_DEEP, opacity: 0.7 }}>{usage}</span>
        <span style={{ color: verdictColor, fontWeight: 700 }}>{verdict}</span>
      </div>
      <div
        style={{
          fontFamily: "var(--ts-serif-literata)",
          fontSize: "2rem",
          lineHeight: 1,
          letterSpacing: "-0.02em",
          color: PAPER,
          fontWeight: 400,
        }}
      >
        {family}
      </div>
      <div
        style={{
          fontFamily: "var(--ts-mono-current)",
          fontSize: "0.74rem",
          letterSpacing: "0.08em",
          color: PAPER,
          opacity: 0.7,
        }}
      >
        {weights}
      </div>
      <p
        style={{
          margin: 0,
          fontFamily: "var(--ts-sans-current)",
          fontSize: "0.9rem",
          lineHeight: 1.55,
          color: PAPER,
          opacity: 0.85,
        }}
      >
        {reason}
      </p>
    </article>
  );
}
