import { Fragment_Mono, Geologica } from "next/font/google";
import { BRAND, PRICING, PROOF, QUOTE } from "@/lib/content";

/**
 * Direction: Field Report / Operator
 *
 * Operator-grade layout. Light paper-cream background, hairline rules, dense
 * tabular data, one signal color (terra/brick) used surgically. Reads as the
 * inside of a system — the skin Miura would actually want on the operator
 * dashboard, and the tone a CTO recognizes as competent at a glance.
 */

const mono = Fragment_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--fr-mono",
});

const sans = Geologica({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--fr-sans",
});

// ---- Palette (OKLCH, tinted warm) ----------------------------------------
const C = {
  paper: "oklch(0.968 0.008 75)", // background
  card: "oklch(0.985 0.006 78)", // paper, inset surfaces
  ink: "oklch(0.22 0.012 60)", // primary type
  dim: "oklch(0.45 0.010 65)", // secondary type
  faint: "oklch(0.62 0.008 68)", // tertiary type, labels
  hairline: "oklch(0.82 0.010 70)", // 1px rules
  hairlineStrong: "oklch(0.72 0.012 65)", // emphasized rule
  signal: "oklch(0.55 0.16 35)", // terra / brick — the ONE accent
  signalDim: "oklch(0.55 0.16 35 / 0.12)", // surface tint of signal
} as const;

const BUILD_ID = "0001";
const BUILD_DATE = "2026-04-15";
const REPORT_TS = "2026-04-15T09:42:00-05:00";

// ---- Small primitives (inline, scoped to this file) ----------------------
const labelStyle: React.CSSProperties = {
  fontFamily: "var(--fr-mono)",
  fontSize: "0.68rem",
  textTransform: "uppercase",
  letterSpacing: "0.14em",
  color: C.faint,
  fontVariantNumeric: "tabular-nums",
};

const ruleStyle: React.CSSProperties = {
  height: 1,
  background: C.hairline,
  width: "100%",
};

const cellStyle: React.CSSProperties = {
  padding: "12px 16px",
  borderBottom: `1px solid ${C.hairline}`,
  fontSize: "0.88rem",
  fontVariantNumeric: "tabular-nums",
};

export default function FieldReport() {
  return (
    <main
      className={`${mono.variable} ${sans.variable}`}
      style={{
        minHeight: "100vh",
        background: C.paper,
        color: C.ink,
        fontFamily: "var(--fr-sans), ui-sans-serif, system-ui, sans-serif",
        fontFeatureSettings: '"ss01", "cv11"',
        fontVariantNumeric: "tabular-nums",
        padding: 0,
      }}
    >
      {/* ================== HEADER BAR ================== */}
      <header
        style={{
          borderBottom: `1px solid ${C.hairlineStrong}`,
          padding: "14px clamp(24px, 4vw, 56px)",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          alignItems: "center",
          gap: "32px",
          fontFamily: "var(--fr-mono)",
          fontSize: "0.72rem",
          background: C.card,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "12px",
            letterSpacing: "0.28em",
            fontWeight: 700,
            color: C.ink,
          }}
        >
          <span aria-hidden style={{ color: C.signal }}>
            ●
          </span>
          <span>CRUZAR</span>
          <span style={{ color: C.faint, letterSpacing: "0.2em" }}>/ OPERATOR</span>
        </div>
        <div
          style={{
            color: C.dim,
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            textAlign: "center",
          }}
        >
          FIELD REPORT · BUILD {BUILD_ID} · {BUILD_DATE}
        </div>
        <div
          style={{
            color: C.faint,
            fontVariantNumeric: "tabular-nums",
            letterSpacing: "0.08em",
          }}
        >
          T · {REPORT_TS}
        </div>
      </header>

      {/* ================== META STRIP ================== */}
      <div
        style={{
          borderBottom: `1px solid ${C.hairline}`,
          padding: "10px clamp(24px, 4vw, 56px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "32px",
          fontFamily: "var(--fr-mono)",
          fontSize: "0.7rem",
          color: C.dim,
          letterSpacing: "0.08em",
        }}
      >
        <MetaItem k="STATUS" v="NOMINAL" dot={C.signal} />
        <MetaItem k="COHORT" v="02" />
        <MetaItem k="REGION" v="LATAM → GLOBAL" />
        <MetaItem k="CHANNEL" v="REMOTE" />
        <MetaItem k="CLASSIFICATION" v="INTERNAL · SHAREABLE" />
        <span style={{ marginLeft: "auto", color: C.faint }}>PAGE 01 / 01</span>
      </div>

      {/* ================== BODY GRID ================== */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 5fr) minmax(0, 3fr)",
          gap: 0,
          borderBottom: `1px solid ${C.hairlineStrong}`,
        }}
      >
        {/* ---- LEFT COLUMN ---- */}
        <section
          style={{
            padding: "clamp(32px, 4vw, 56px)",
            borderRight: `1px solid ${C.hairline}`,
            display: "flex",
            flexDirection: "column",
            gap: "48px",
          }}
        >
          {/* 0 — Section head */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <span style={labelStyle}>§01 · IDENTITY</span>
            <span style={{ ...labelStyle, color: C.signal }}>◐ ACTIVE</span>
          </div>

          {/* 1 — Logotype + meaning */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "24px",
                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontFamily: "var(--fr-sans)",
                  fontSize: "clamp(3.5rem, 9vw, 6.5rem)",
                  lineHeight: 0.92,
                  letterSpacing: "-0.035em",
                  fontWeight: 500,
                  color: C.ink,
                  fontFeatureSettings: '"ss01", "ss02"',
                }}
              >
                {BRAND.name}
              </h1>
              <div
                style={{
                  fontFamily: "var(--fr-mono)",
                  fontSize: "0.78rem",
                  color: C.dim,
                  lineHeight: 1.5,
                  paddingBottom: "14px",
                  borderTop: `1px solid ${C.hairline}`,
                  paddingTop: "10px",
                }}
              >
                <div style={{ color: C.signal, letterSpacing: "0.12em" }}>
                  [ {BRAND.meaning.toUpperCase()} ]
                </div>
                <div style={{ marginTop: "4px", color: C.faint }}>/kɾu.ˈθaɾ/ · transitive</div>
              </div>
            </div>
            <div style={ruleStyle} />
          </div>

          {/* 2 — Tagline (ES + EN, equal weight) */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "auto 1fr",
              columnGap: "24px",
              rowGap: "20px",
              alignItems: "baseline",
            }}
          >
            <span style={labelStyle}>ES</span>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--fr-sans)",
                fontSize: "clamp(1.4rem, 2.4vw, 1.95rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
                fontWeight: 400,
                color: C.ink,
                maxWidth: "32ch",
              }}
            >
              {BRAND.taglineEs}
            </p>
            <span style={labelStyle}>EN</span>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--fr-sans)",
                fontSize: "clamp(1.4rem, 2.4vw, 1.95rem)",
                lineHeight: 1.2,
                letterSpacing: "-0.015em",
                fontWeight: 400,
                color: C.ink,
                maxWidth: "32ch",
              }}
            >
              {BRAND.taglineEn}
            </p>
          </div>

          <div style={ruleStyle} />

          {/* 3 — Promise */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1fr",
              gap: "24px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={labelStyle}>§02</span>
              <span style={labelStyle}>PROMESA</span>
            </div>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--fr-sans)",
                fontSize: "1.02rem",
                lineHeight: 1.55,
                color: C.ink,
                maxWidth: "62ch",
                fontWeight: 400,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--fr-mono)",
                  color: C.signal,
                  marginRight: "10px",
                  fontSize: "0.82rem",
                }}
              >
                ▸
              </span>
              {BRAND.promiseEs}
            </p>
          </div>

          {/* 4 — PROOF TABLE */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}
            >
              <span style={labelStyle}>§03 · PROOF · COHORT 02</span>
              <span
                style={{
                  ...labelStyle,
                  color: C.faint,
                }}
              >
                SRC / internal dashboard · verified
              </span>
            </div>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--fr-mono)",
                fontSize: "0.85rem",
                background: C.card,
                border: `1px solid ${C.hairline}`,
              }}
            >
              <thead>
                <tr style={{ background: C.paper }}>
                  <Th>Metric</Th>
                  <Th align="right">Value</Th>
                  <Th align="right">Unit</Th>
                </tr>
              </thead>
              <tbody>
                <Row
                  k="placed_this_cohort"
                  v={PROOF.placedThisCohort.toString().padStart(3, "0")}
                  u="students"
                  hi
                />
                <Row
                  k="avg_salary_delta"
                  v={`+${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}`}
                  u="USD / month"
                />
                <Row
                  k="avg_salary_multiple"
                  v={`×${PROOF.averageSalaryMultiple.toFixed(1)}`}
                  u="ratio"
                />
                <Row
                  k="cohort_size"
                  v={PROOF.cohortSizeStudents.toString().padStart(3, "0")}
                  u="students"
                />
                <Row
                  k="partner_universities"
                  v={PROOF.partnerUniversities.toString().padStart(2, "0")}
                  u="institutions"
                />
                <Row
                  k="country_reach"
                  v={PROOF.countryReach.join(" · ")}
                  u={`${PROOF.countryReach.length} iso3166`}
                  last
                />
              </tbody>
            </table>
            <span style={{ ...labelStyle, color: C.faint }}>
              Figures point-in-time. Next reconciliation: T+7d.
            </span>
          </div>

          {/* 5 — Pull quote */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={labelStyle}>§04 · TRANSCRIPT · STUDENT</span>
              <span style={labelStyle}>ID / U0-02-007</span>
            </div>
            <figure
              style={{
                margin: 0,
                padding: "24px 28px",
                background: C.signalDim,
                border: `1px solid ${C.hairline}`,
                display: "flex",
                flexDirection: "column",
                gap: "18px",
              }}
            >
              <div
                aria-hidden
                style={{
                  fontFamily: "var(--fr-mono)",
                  fontSize: "0.72rem",
                  color: C.signal,
                  letterSpacing: "0.14em",
                }}
              >
                • Estudiante · placement verificado · 2026-04-08
              </div>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: "var(--fr-sans)",
                  fontSize: "clamp(1.15rem, 1.8vw, 1.45rem)",
                  lineHeight: 1.45,
                  color: C.ink,
                  letterSpacing: "-0.005em",
                  fontWeight: 400,
                  maxWidth: "52ch",
                }}
              >
                &ldquo;{QUOTE.es}&rdquo;
              </blockquote>
              <figcaption
                style={{
                  fontFamily: "var(--fr-mono)",
                  fontSize: "0.75rem",
                  color: C.dim,
                  letterSpacing: "0.06em",
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <span style={{ color: C.signal }}>—</span>
                <span>{QUOTE.attribution}</span>
                <span style={{ color: C.faint }}>· verified placement</span>
              </figcaption>
            </figure>
          </div>
        </section>

        {/* ---- RIGHT COLUMN ---- */}
        <aside
          style={{
            padding: "clamp(32px, 3vw, 40px)",
            display: "flex",
            flexDirection: "column",
            gap: "40px",
            background: C.card,
          }}
        >
          {/* 6 — Lead metric callout */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={labelStyle}>§05 · LEAD METRIC</span>
            <div
              style={{
                border: `1px solid ${C.hairlineStrong}`,
                padding: "24px 20px 20px",
                background: C.paper,
                position: "relative",
              }}
            >
              <div
                style={{
                  fontFamily: "var(--fr-mono)",
                  fontSize: "0.7rem",
                  color: C.faint,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                }}
              >
                ▌ PLACED / COHORT 02
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "10px",
                  marginTop: "10px",
                  fontFamily: "var(--fr-mono)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <span
                  style={{
                    color: C.signal,
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  [
                </span>
                <span
                  style={{
                    fontSize: "clamp(4rem, 7vw, 5.6rem)",
                    lineHeight: 0.9,
                    color: C.ink,
                    fontWeight: 400,
                    letterSpacing: "-0.04em",
                  }}
                >
                  {PROOF.placedThisCohort.toString().padStart(2, "0")}
                </span>
                <span
                  style={{
                    color: C.signal,
                    fontSize: "0.9rem",
                    letterSpacing: "0.1em",
                  }}
                >
                  ]
                </span>
                <span
                  style={{
                    marginLeft: "auto",
                    fontSize: "0.72rem",
                    color: C.dim,
                    textAlign: "right",
                    letterSpacing: "0.1em",
                  }}
                >
                  / {PROOF.cohortSizeStudents}
                  <br />
                  <span style={{ color: C.faint }}>enrolled</span>
                </span>
              </div>
              <div
                style={{
                  marginTop: "18px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "2px",
                  background: C.hairline,
                  border: `1px solid ${C.hairline}`,
                }}
              >
                <MiniStat
                  label="DELTA"
                  value={`+$${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}`}
                  sub="USD / mo"
                />
                <MiniStat
                  label="MULT"
                  value={`×${PROOF.averageSalaryMultiple.toFixed(1)}`}
                  sub="salary ratio"
                />
              </div>
            </div>
          </div>

          {/* 7 — Pricing spec table */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={labelStyle}>§06 · PRICING · SPEC</span>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontFamily: "var(--fr-mono)",
                fontSize: "0.8rem",
                border: `1px solid ${C.hairline}`,
                background: C.paper,
              }}
            >
              <tbody>
                <PriceRow
                  scope="STUDENT · FLAT"
                  range={`${PRICING.studentFlat.min.toLocaleString("en-US")}–${PRICING.studentFlat.max.toLocaleString(
                    "en-US",
                  )}`}
                  currency={PRICING.studentFlat.currency}
                  trigger={PRICING.studentFlat.trigger}
                />
                <PriceRow
                  scope="INSTITUTION · ANCHOR"
                  range={`${PRICING.institutionAnchor.min.toLocaleString("en-US")}–${PRICING.institutionAnchor.max.toLocaleString(
                    "en-US",
                  )}`}
                  currency={PRICING.institutionAnchor.currency}
                  trigger={`per ${PRICING.institutionAnchor.per}`}
                  last
                />
              </tbody>
            </table>
            <span style={{ ...labelStyle, color: C.faint }}>
              Outcomes-capped. No placement → no invoice.
            </span>
          </div>

          {/* 8 — Type specimen */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={labelStyle}>§07 · TYPE · SPECIMEN</span>
            <div
              style={{
                border: `1px solid ${C.hairline}`,
                background: C.paper,
              }}
            >
              <SpecimenRow
                family="Geologica"
                role="DISPLAY · SANS"
                sample="Cruzar"
                fontFamily="var(--fr-sans)"
                size="2.6rem"
                weight={500}
                letterSpacing="-0.03em"
              />
              <SpecimenRow
                family="Geologica / 400"
                role="BODY · PROSE"
                sample="Diagnóstico, validación, postulación."
                fontFamily="var(--fr-sans)"
                size="1.02rem"
                weight={400}
                letterSpacing="-0.005em"
              />
              <SpecimenRow
                family="Fragment Mono / 400"
                role="DATA · META"
                sample="0123456789 · +$2,840 · ×4.1"
                fontFamily="var(--fr-mono)"
                size="0.88rem"
                weight={400}
              />
              <SpecimenRow
                family="Fragment Mono / label"
                role="LABEL · ALL-CAPS"
                sample="FIELD REPORT · BUILD 0001"
                fontFamily="var(--fr-mono)"
                size="0.72rem"
                weight={400}
                letterSpacing="0.18em"
                upper
                last
              />
            </div>
          </div>

          {/* 9 — Palette swatches */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <span style={labelStyle}>§08 · PALETTE · OKLCH</span>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1px",
                background: C.hairline,
                border: `1px solid ${C.hairline}`,
              }}
            >
              <Swatch role="BACKGROUND" value="oklch(0.968 0.008 75)" fill={C.paper} ink={C.ink} />
              <Swatch role="PAPER" value="oklch(0.985 0.006 78)" fill={C.card} ink={C.ink} />
              <Swatch role="INK" value="oklch(0.22 0.012 60)" fill={C.ink} ink={C.paper} />
              <Swatch role="DIM" value="oklch(0.45 0.010 65)" fill={C.dim} ink={C.paper} />
              <Swatch role="HAIRLINE" value="oklch(0.82 0.010 70)" fill={C.hairline} ink={C.ink} />
              <Swatch
                role="SIGNAL"
                value="oklch(0.55 0.16 35)"
                fill={C.signal}
                ink={C.paper}
                accent
              />
            </div>
          </div>
        </aside>
      </div>

      {/* ================== FOOTER SIGNATURE ================== */}
      <footer
        style={{
          padding: "20px clamp(24px, 4vw, 56px) 28px",
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          gap: "32px",
          alignItems: "center",
          fontFamily: "var(--fr-mono)",
          fontSize: "0.72rem",
          color: C.dim,
          letterSpacing: "0.1em",
        }}
      >
        <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
          <span style={{ color: C.signal }}>●</span>
          <span style={{ color: C.ink, letterSpacing: "0.2em", fontWeight: 600 }}>
            FIELD&nbsp;REPORT
          </span>
          <span style={{ color: C.faint }}>/ direction 02 of 03</span>
        </div>
        <p
          style={{
            margin: 0,
            color: C.dim,
            maxWidth: "78ch",
            lineHeight: 1.5,
            letterSpacing: "0.02em",
            fontFamily: "var(--fr-sans)",
            fontSize: "0.82rem",
            textAlign: "center",
          }}
        >
          For internal operator surfaces and any moment Cruzar must read as engineered, not
          marketed.
        </p>
        <div style={{ textAlign: "right", color: C.faint }}>
          SYS / CRZ-FR-{BUILD_ID} · {BUILD_DATE}
        </div>
      </footer>
    </main>
  );
}

// ===========================================================================
// Subcomponents (scoped to this file — directions are self-contained)
// ===========================================================================

function MetaItem({ k, v, dot }: { k: string; v: string; dot?: string }) {
  return (
    <span style={{ display: "inline-flex", gap: "8px", alignItems: "baseline" }}>
      {dot && <span style={{ color: dot }}>●</span>}
      <span style={{ color: C.faint }}>{k}</span>
      <span style={{ color: C.ink, letterSpacing: "0.1em" }}>{v}</span>
    </span>
  );
}

function Th({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th
      style={{
        padding: "10px 16px",
        textAlign: align,
        borderBottom: `1px solid ${C.hairlineStrong}`,
        fontFamily: "var(--fr-mono)",
        fontSize: "0.68rem",
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: C.faint,
        fontWeight: 400,
      }}
    >
      {children}
    </th>
  );
}

function Row({
  k,
  v,
  u,
  hi,
  last,
}: {
  k: string;
  v: string;
  u: string;
  hi?: boolean;
  last?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          ...cellStyle,
          borderBottom: last ? "none" : cellStyle.borderBottom,
          color: C.ink,
          display: "table-cell",
        }}
      >
        <span style={{ color: C.faint, marginRight: "10px" }}>{hi ? "▸" : "·"}</span>
        {k}
      </td>
      <td
        style={{
          ...cellStyle,
          borderBottom: last ? "none" : cellStyle.borderBottom,
          textAlign: "right",
          color: hi ? C.signal : C.ink,
          fontWeight: hi ? 600 : 400,
          fontSize: hi ? "1.02rem" : "0.9rem",
          letterSpacing: "-0.005em",
        }}
      >
        {v}
      </td>
      <td
        style={{
          ...cellStyle,
          borderBottom: last ? "none" : cellStyle.borderBottom,
          textAlign: "right",
          color: C.faint,
          fontSize: "0.72rem",
          letterSpacing: "0.08em",
          textTransform: "lowercase",
        }}
      >
        {u}
      </td>
    </tr>
  );
}

function MiniStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div
      style={{
        background: C.paper,
        padding: "12px 14px",
        display: "flex",
        flexDirection: "column",
        gap: "4px",
      }}
    >
      <span
        style={{
          fontFamily: "var(--fr-mono)",
          fontSize: "0.64rem",
          color: C.faint,
          letterSpacing: "0.16em",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontFamily: "var(--fr-mono)",
          fontSize: "1.02rem",
          color: C.ink,
          letterSpacing: "-0.01em",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "var(--fr-mono)",
          fontSize: "0.66rem",
          color: C.dim,
          letterSpacing: "0.08em",
        }}
      >
        {sub}
      </span>
    </div>
  );
}

function PriceRow({
  scope,
  range,
  currency,
  trigger,
  last,
}: {
  scope: string;
  range: string;
  currency: string;
  trigger: string;
  last?: boolean;
}) {
  return (
    <tr>
      <td
        style={{
          padding: "14px 16px",
          borderBottom: last ? "none" : `1px solid ${C.hairline}`,
          verticalAlign: "top",
          width: "42%",
        }}
      >
        <div style={{ color: C.faint, fontSize: "0.64rem", letterSpacing: "0.16em" }}>SCOPE</div>
        <div style={{ color: C.ink, marginTop: "4px", letterSpacing: "0.08em" }}>{scope}</div>
      </td>
      <td
        style={{
          padding: "14px 16px",
          borderBottom: last ? "none" : `1px solid ${C.hairline}`,
          verticalAlign: "top",
        }}
      >
        <div style={{ color: C.faint, fontSize: "0.64rem", letterSpacing: "0.16em" }}>
          RANGE / {currency}
        </div>
        <div
          style={{
            color: C.signal,
            marginTop: "4px",
            fontSize: "1.02rem",
            letterSpacing: "-0.01em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          ${range}
        </div>
        <div style={{ color: C.dim, marginTop: "6px", fontSize: "0.7rem" }}>{trigger}</div>
      </td>
    </tr>
  );
}

function SpecimenRow({
  family,
  role,
  sample,
  fontFamily,
  size,
  weight,
  letterSpacing,
  upper,
  last,
}: {
  family: string;
  role: string;
  sample: string;
  fontFamily: string;
  size: string;
  weight: number;
  letterSpacing?: string;
  upper?: boolean;
  last?: boolean;
}) {
  return (
    <div
      style={{
        padding: "16px 18px",
        borderBottom: last ? "none" : `1px solid ${C.hairline}`,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--fr-mono)",
          fontSize: "0.64rem",
          color: C.faint,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
        }}
      >
        <span>{family}</span>
        <span>{role}</span>
      </div>
      <div
        style={{
          fontFamily,
          fontSize: size,
          fontWeight: weight,
          letterSpacing,
          color: C.ink,
          lineHeight: 1.15,
          textTransform: upper ? "uppercase" : "none",
        }}
      >
        {sample}
      </div>
    </div>
  );
}

function Swatch({
  role,
  value,
  fill,
  ink,
  accent,
}: {
  role: string;
  value: string;
  fill: string;
  ink: string;
  accent?: boolean;
}) {
  return (
    <div
      style={{
        background: fill,
        padding: "16px 14px",
        minHeight: 76,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: "12px",
        position: "relative",
      }}
    >
      <span
        style={{
          fontFamily: "var(--fr-mono)",
          fontSize: "0.64rem",
          color: ink,
          letterSpacing: "0.16em",
          opacity: 0.85,
        }}
      >
        {accent ? "◆ " : ""}
        {role}
      </span>
      <span
        style={{
          fontFamily: "var(--fr-mono)",
          fontSize: "0.68rem",
          color: ink,
          opacity: 0.78,
          letterSpacing: "0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}
