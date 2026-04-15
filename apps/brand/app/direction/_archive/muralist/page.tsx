import { Bricolage_Grotesque, Figtree } from "next/font/google";
import { BRAND, PRICING, PROOF, QUOTE } from "@/lib/content";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const body = Figtree({
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/* ---------- tokens (inline; direction owns them) ---------------------- */
const INK = "oklch(0.18 0.02 55)";
const INK_SOFT = "oklch(0.34 0.02 55)";
const INK_QUIET = "oklch(0.52 0.02 60)";
const PAPER = "oklch(0.97 0.012 75)";
const PAPER_WARM = "oklch(0.94 0.018 72)";
const RULE = "oklch(0.82 0.02 65)";

const CLAY = "oklch(0.58 0.14 48)"; // primary accent — natural pigment
const CLAY_DEEP = "oklch(0.46 0.13 44)";
const INDIGO = "oklch(0.32 0.09 265)";
const OXIDE = "oklch(0.48 0.09 155)";
const BONE = "oklch(0.90 0.02 70)";

const SWATCHES: Array<{
  label: string;
  role: string;
  value: string;
  dark?: boolean;
}> = [
  { label: "Paper", role: "background", value: PAPER },
  { label: "Bone", role: "surface", value: BONE },
  { label: "Ink", role: "type", value: INK, dark: true },
  { label: "Clay", role: "accent", value: CLAY, dark: true },
  { label: "Indigo", role: "secondary", value: INDIGO, dark: true },
  { label: "Oxide", role: "tertiary", value: OXIDE, dark: true },
];

/* ---------- small primitives ------------------------------------------ */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: body.style.fontFamily,
        fontSize: "0.7rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: INK_QUIET,
        fontWeight: 500,
      }}
    >
      {children}
    </span>
  );
}

function Rule({ color = RULE, height = 1 }: { color?: string; height?: number }) {
  return <div style={{ width: "100%", height: `${height}px`, background: color }} aria-hidden />;
}

/* ---------- page ------------------------------------------------------ */

export default function MuralistDirection() {
  return (
    <main
      className={body.className}
      style={{
        minHeight: "100vh",
        background: PAPER,
        color: INK,
        fontFamily: body.style.fontFamily,
        fontSize: "16px",
        lineHeight: 1.55,
        overflowX: "hidden",
      }}
    >
      {/* ───────────────── TOP RULE / SIGNATURE STRIP ──────────────── */}
      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "1.5rem",
          padding: "20px clamp(24px, 5vw, 64px)",
          borderBottom: `1px solid ${RULE}`,
        }}
      >
        <Eyebrow>Cruzar · Brand Direction 03</Eyebrow>
        <span
          style={{
            fontFamily: display.style.fontFamily,
            fontWeight: 600,
            fontSize: "0.82rem",
            letterSpacing: "-0.01em",
          }}
        >
          Muralist Modernism
        </span>
        <div style={{ textAlign: "right" }}>
          <Eyebrow>2026 · Working Edition</Eyebrow>
        </div>
      </header>

      {/* ───────────────── HERO — LOGOTYPE ────────────────────────────── */}
      <section
        style={{
          position: "relative",
          padding: "clamp(48px, 9vw, 128px) clamp(24px, 5vw, 64px) clamp(40px, 7vw, 96px)",
          overflow: "hidden",
        }}
      >
        {/* poster shape — a confident clay circle behind the wordmark */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "-6vw",
            top: "clamp(32px, 6vw, 96px)",
            width: "min(48vw, 520px)",
            aspectRatio: "1 / 1",
            borderRadius: "50%",
            background: CLAY,
            zIndex: 0,
          }}
        />
        {/* hairline diagonal — the crossing, not literal */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            right: "clamp(40px, 10vw, 180px)",
            top: "clamp(24px, 5vw, 88px)",
            width: "min(60vw, 640px)",
            height: "1px",
            background: INK,
            transform: "rotate(-28deg)",
            transformOrigin: "right center",
            zIndex: 2,
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr)",
            gap: "clamp(24px, 4vw, 56px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            <Eyebrow>{BRAND.meaning}</Eyebrow>
            <span
              aria-hidden
              style={{
                height: "1px",
                flex: "1 1 120px",
                background: RULE,
              }}
            />
            <Eyebrow>Wordmark · study 01</Eyebrow>
          </div>

          <h1
            className={display.className}
            style={{
              margin: 0,
              fontFamily: display.style.fontFamily,
              fontWeight: 700,
              fontSize: "clamp(5rem, 22vw, 20rem)",
              lineHeight: 0.86,
              letterSpacing: "-0.045em",
              color: INK,
            }}
          >
            <span style={{ display: "inline-block" }}>
              Cru
              <span
                style={{
                  color: CLAY_DEEP,
                  fontStyle: "italic",
                  fontWeight: 800,
                  display: "inline-block",
                  transform: "translateY(-0.02em)",
                }}
              >
                z
              </span>
              ar
            </span>
          </h1>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 2fr)",
              gap: "clamp(16px, 3vw, 48px)",
              alignItems: "start",
              maxWidth: "1180px",
            }}
          >
            <Eyebrow>Signature</Eyebrow>
            <p
              style={{
                margin: 0,
                fontFamily: display.style.fontFamily,
                fontWeight: 400,
                fontSize: "clamp(1.1rem, 1.6vw, 1.45rem)",
                lineHeight: 1.35,
                letterSpacing: "-0.01em",
                maxWidth: "48ch",
                color: INK_SOFT,
              }}
            >
              A verb set in type. The wordmark carries the crossing without borrowing an arrow, a
              bridge, or a flag.
            </p>
          </div>
        </div>
      </section>

      <Rule />

      {/* ───────────────── TAGLINE POSTER ─────────────────────────── */}
      <section
        style={{
          padding: "clamp(56px, 9vw, 128px) clamp(24px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(12px, 2vw, 24px)",
          position: "relative",
        }}
      >
        <div
          style={{
            gridColumn: "1 / span 2",
            borderTop: `2px solid ${INK}`,
            paddingTop: "12px",
          }}
        >
          <Eyebrow>01 · Tagline</Eyebrow>
        </div>

        <h2
          className={display.className}
          style={{
            margin: 0,
            gridColumn: "3 / span 10",
            fontFamily: display.style.fontFamily,
            fontWeight: 500,
            fontSize: "clamp(2.4rem, 7vw, 7.5rem)",
            lineHeight: 0.94,
            letterSpacing: "-0.03em",
            color: INK,
          }}
        >
          Cruza del{" "}
          <span style={{ color: CLAY_DEEP, fontStyle: "italic", fontWeight: 600 }}>
            salario local
          </span>{" "}
          al{" "}
          <span
            style={{
              display: "inline-block",
              position: "relative",
              fontWeight: 600,
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>internacional.</span>
            <span
              aria-hidden
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: "0.12em",
                height: "0.12em",
                background: CLAY,
                opacity: 0.9,
                zIndex: 0,
              }}
            />
          </span>
        </h2>

        <div
          style={{
            gridColumn: "3 / span 10",
            display: "flex",
            gap: "clamp(16px, 3vw, 40px)",
            alignItems: "baseline",
            marginTop: "clamp(16px, 2.5vw, 32px)",
            flexWrap: "wrap",
          }}
        >
          <span
            aria-hidden
            style={{
              fontFamily: display.style.fontFamily,
              color: CLAY,
              fontSize: "clamp(1.5rem, 3vw, 2.25rem)",
              lineHeight: 1,
              fontWeight: 300,
            }}
          >
            /
          </span>
          <p
            className={display.className}
            style={{
              margin: 0,
              fontFamily: display.style.fontFamily,
              fontWeight: 300,
              fontSize: "clamp(1.4rem, 3.2vw, 2.6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.015em",
              color: INK_SOFT,
              fontStyle: "italic",
            }}
          >
            {BRAND.taglineEn}
          </p>
        </div>
      </section>

      <Rule />

      {/* ───────────────── PROMISE + QUOTE (split column) ──────────── */}
      <section
        style={{
          padding: "clamp(56px, 9vw, 128px) clamp(24px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(24px, 3vw, 56px)",
          alignItems: "start",
        }}
      >
        <div style={{ gridColumn: "1 / span 5" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <Eyebrow>02 · Promesa</Eyebrow>
            <p
              className={display.className}
              style={{
                margin: 0,
                fontFamily: display.style.fontFamily,
                fontSize: "clamp(1.35rem, 2.2vw, 1.95rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.012em",
                color: INK,
                fontWeight: 400,
                maxWidth: "28ch",
              }}
            >
              {BRAND.promiseEs}
            </p>
            <p
              style={{
                margin: 0,
                marginTop: "8px",
                fontFamily: body.style.fontFamily,
                fontSize: "0.95rem",
                lineHeight: 1.55,
                color: INK_QUIET,
                maxWidth: "42ch",
              }}
            >
              {BRAND.promiseEn}
            </p>
          </div>
        </div>

        {/* diagonal wedge — "A to B" in the layout */}
        <div
          style={{
            gridColumn: "7 / span 6",
            position: "relative",
            padding: "clamp(28px, 4vw, 56px)",
            background: PAPER_WARM,
            minHeight: "320px",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
            }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              width="100%"
              height="100%"
              style={{ display: "block" }}
            >
              <title>accent wedges</title>
              <polygon points="85,0 100,0 100,18" fill={CLAY} />
              <polygon points="0,82 0,100 18,100" fill={INDIGO} />
            </svg>
          </div>

          <div style={{ position: "relative", zIndex: 1 }}>
            <Eyebrow>03 · Cohort voice</Eyebrow>
            <blockquote
              className={display.className}
              style={{
                margin: "20px 0 0",
                fontFamily: display.style.fontFamily,
                fontWeight: 400,
                fontSize: "clamp(1.25rem, 2.1vw, 1.8rem)",
                lineHeight: 1.3,
                letterSpacing: "-0.01em",
                color: INK,
                maxWidth: "40ch",
                textIndent: "-0.45em",
              }}
            >
              <span aria-hidden style={{ color: CLAY, fontWeight: 600, marginRight: "0.1em" }}>
                “
              </span>
              {QUOTE.es}
              <span aria-hidden style={{ color: CLAY, fontWeight: 600 }}>
                ”
              </span>
            </blockquote>
            <div
              style={{
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "1px",
                  background: INK,
                }}
              />
              <span
                style={{
                  textTransform: "uppercase",
                  letterSpacing: "0.18em",
                  fontSize: "0.68rem",
                  color: INK,
                  fontWeight: 600,
                }}
              >
                {QUOTE.attribution}
              </span>
            </div>
          </div>
        </div>
      </section>

      <Rule />

      {/* ───────────────── PROOF / NUMBERS ─────────────────────────── */}
      <section
        style={{
          padding: "clamp(48px, 8vw, 112px) clamp(24px, 5vw, 64px) clamp(56px, 9vw, 128px)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: "clamp(16px, 2.5vw, 32px)",
            alignItems: "end",
          }}
        >
          <div style={{ gridColumn: "1 / span 4" }}>
            <Eyebrow>04 · Proof</Eyebrow>
            <p
              style={{
                marginTop: "16px",
                fontFamily: body.style.fontFamily,
                fontSize: "1.05rem",
                lineHeight: 1.5,
                color: INK_SOFT,
                maxWidth: "28ch",
              }}
            >
              Cohort 02. Verified placements, salary delta in USD, reach across five hiring
              countries.
            </p>
          </div>

          <div style={{ gridColumn: "5 / span 8", position: "relative" }}>
            <div
              className={display.className}
              style={{
                fontFamily: display.style.fontFamily,
                fontWeight: 700,
                fontSize: "clamp(8rem, 28vw, 26rem)",
                lineHeight: 0.82,
                letterSpacing: "-0.055em",
                color: INK,
                fontVariantNumeric: "lining-nums tabular-nums",
                display: "flex",
                alignItems: "flex-end",
                gap: "clamp(12px, 2vw, 32px)",
              }}
            >
              <span>{PROOF.placedThisCohort}</span>
              <span
                style={{
                  fontFamily: body.style.fontFamily,
                  fontWeight: 500,
                  fontSize: "clamp(0.85rem, 1vw, 1rem)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: CLAY_DEEP,
                  lineHeight: 1.3,
                  paddingBottom: "clamp(14px, 2vw, 28px)",
                  maxWidth: "16ch",
                }}
              >
                placed ·<br />
                cohort 02 ·<br />
                n={PROOF.cohortSizeStudents}
              </span>
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "clamp(40px, 6vw, 80px)",
            display: "grid",
            gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
            gap: "clamp(12px, 2vw, 24px)",
            borderTop: `1px solid ${RULE}`,
            paddingTop: "clamp(24px, 3.5vw, 40px)",
          }}
        >
          <StatCell
            grid="1 / span 3"
            label="Avg. USD delta / month"
            value={`+$${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}`}
          />
          <StatCell
            grid="4 / span 3"
            label="Salary multiple"
            value={`${PROOF.averageSalaryMultiple}×`}
            tone="clay"
          />
          <StatCell
            grid="7 / span 3"
            label="Partner universities"
            value={String(PROOF.partnerUniversities).padStart(2, "0")}
            tone="indigo"
          />
          <StatCell
            grid="10 / span 3"
            label="Country reach"
            value={PROOF.countryReach.join(" · ")}
            mono
          />
        </div>
      </section>

      <Rule />

      {/* ───────────────── PRICING (editorial sentence) ─────────────── */}
      <section
        style={{
          padding: "clamp(56px, 9vw, 128px) clamp(24px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(16px, 3vw, 32px)",
          alignItems: "center",
          background: PAPER_WARM,
        }}
      >
        <div style={{ gridColumn: "1 / span 2" }}>
          <Eyebrow>05 · Pricing</Eyebrow>
        </div>

        <p
          className={display.className}
          style={{
            margin: 0,
            gridColumn: "3 / span 10",
            fontFamily: display.style.fontFamily,
            fontWeight: 400,
            fontSize: "clamp(1.5rem, 3.4vw, 3.1rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.02em",
            color: INK,
          }}
        >
          Students pay{" "}
          <span
            style={{
              fontWeight: 700,
              color: CLAY_DEEP,
              whiteSpace: "nowrap",
            }}
          >
            {PRICING.studentFlat.currency} ${PRICING.studentFlat.min}–$
            {PRICING.studentFlat.max.toLocaleString("en-US")}
          </span>{" "}
          <span style={{ color: INK_SOFT }}>— triggered</span>{" "}
          <span
            style={{
              fontStyle: "italic",
              fontWeight: 500,
              borderBottom: `2px solid ${CLAY}`,
            }}
          >
            on placement only
          </span>
          <span style={{ color: INK_SOFT }}>. No job, no invoice.</span>
        </p>
      </section>

      <Rule />

      {/* ───────────────── TYPE SPECIMEN ─────────────────────────── */}
      <section
        style={{
          padding: "clamp(56px, 9vw, 128px) clamp(24px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(24px, 3vw, 48px)",
        }}
      >
        <div
          style={{
            gridColumn: "1 / span 12",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Eyebrow>06 · Type specimen</Eyebrow>
          <span
            style={{
              fontFamily: body.style.fontFamily,
              fontSize: "0.78rem",
              color: INK_QUIET,
              letterSpacing: "0.01em",
            }}
          >
            display / Bricolage Grotesque · body / Figtree
          </span>
        </div>

        {/* Display column */}
        <div
          style={{
            gridColumn: "1 / span 7",
            borderTop: `1px solid ${RULE}`,
            paddingTop: "clamp(20px, 3vw, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: "clamp(16px, 2vw, 24px)",
          }}
        >
          <SpecLabel>Display · Bricolage Grotesque · 700</SpecLabel>
          <span
            className={display.className}
            style={{
              fontFamily: display.style.fontFamily,
              fontSize: "clamp(4rem, 10vw, 8.5rem)",
              lineHeight: 0.88,
              letterSpacing: "-0.04em",
              fontWeight: 700,
              color: INK,
            }}
          >
            Aa Ññ 12
          </span>

          <SpecLabel>Display · 400 · italic</SpecLabel>
          <span
            className={display.className}
            style={{
              fontFamily: display.style.fontFamily,
              fontSize: "clamp(1.75rem, 3vw, 2.75rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              fontWeight: 400,
              fontStyle: "italic",
              color: INK,
            }}
          >
            Cruza del salario local al internacional.
          </span>

          <SpecLabel>Display · 500 · numerals</SpecLabel>
          <span
            className={display.className}
            style={{
              fontFamily: display.style.fontFamily,
              fontSize: "clamp(2rem, 4vw, 3.25rem)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
              fontWeight: 500,
              fontVariantNumeric: "lining-nums tabular-nums",
              color: CLAY_DEEP,
            }}
          >
            12 · +$2,840 · 4.1×
          </span>
        </div>

        {/* Body column */}
        <div
          style={{
            gridColumn: "9 / span 4",
            borderTop: `1px solid ${RULE}`,
            paddingTop: "clamp(20px, 3vw, 32px)",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <SpecLabel>Body · Figtree · 400</SpecLabel>
          <p
            style={{
              margin: 0,
              fontFamily: body.style.fontFamily,
              fontSize: "1rem",
              lineHeight: 1.6,
              color: INK,
              maxWidth: "42ch",
            }}
          >
            Diagnóstico, validación en escenarios reales y postulación autónoma a empleos remotos
            internacionales.
          </p>

          <SpecLabel>Body · 600 · small caps</SpecLabel>
          <p
            style={{
              margin: 0,
              fontFamily: body.style.fontFamily,
              fontSize: "0.78rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: INK,
            }}
          >
            Verified · Outcomes · Cross-border
          </p>

          <SpecLabel>Body · 300 · long form</SpecLabel>
          <p
            style={{
              margin: 0,
              fontFamily: body.style.fontFamily,
              fontSize: "0.95rem",
              fontWeight: 300,
              lineHeight: 1.65,
              color: INK_SOFT,
            }}
          >
            The verb-name “Cruzar” means to cross. Spanish-rooted but globally legible — the
            identity should feel equally at home in a rector’s office in Lima and a CTO’s inbox in
            San Francisco.
          </p>
        </div>
      </section>

      <Rule />

      {/* ───────────────── PALETTE ─────────────────────────── */}
      <section
        style={{
          padding: "clamp(56px, 9vw, 128px) clamp(24px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(16px, 2vw, 32px)",
        }}
      >
        <div
          style={{
            gridColumn: "1 / span 12",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <Eyebrow>07 · Palette</Eyebrow>
          <span
            style={{
              fontFamily: body.style.fontFamily,
              fontSize: "0.78rem",
              color: INK_QUIET,
            }}
          >
            OKLCH · pigment-rooted · no flag cues
          </span>
        </div>

        <div
          style={{
            gridColumn: "1 / span 12",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1px",
            background: RULE,
            border: `1px solid ${RULE}`,
          }}
        >
          {SWATCHES.map((s) => (
            <div
              key={s.label}
              style={{
                background: s.value,
                color: s.dark ? PAPER : INK,
                padding: "clamp(20px, 3vw, 36px) clamp(16px, 2vw, 24px)",
                minHeight: "clamp(160px, 18vw, 220px)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <span
                  style={{
                    fontFamily: body.style.fontFamily,
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    opacity: 0.75,
                  }}
                >
                  {s.role}
                </span>
                <span
                  className={display.className}
                  style={{
                    fontFamily: display.style.fontFamily,
                    fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                    fontWeight: 600,
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                  }}
                >
                  {s.label}
                </span>
              </div>
              <span
                style={{
                  fontFamily: "ui-monospace, 'JetBrains Mono', 'SFMono-Regular', monospace",
                  fontSize: "0.72rem",
                  opacity: 0.85,
                  letterSpacing: "-0.01em",
                }}
              >
                {s.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Rule />

      {/* ───────────────── MARK STUDIES ─────────────────────────── */}
      <section
        style={{
          padding: "clamp(56px, 9vw, 128px) clamp(24px, 5vw, 64px)",
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(16px, 2vw, 32px)",
          alignItems: "end",
        }}
      >
        <div
          style={{
            gridColumn: "1 / span 12",
            marginBottom: "clamp(8px, 1vw, 16px)",
          }}
        >
          <Eyebrow>08 · Mark studies · circle & diagonal</Eyebrow>
        </div>

        <MarkStudy grid="1 / span 4" size={96} label="Small · 96px" />
        <MarkStudy grid="5 / span 4" size={180} label="Medium · 180px" />
        <MarkStudy grid="9 / span 4" size={280} label="Large · 280px" />
      </section>

      {/* ───────────────── FOOTER ─────────────────────────── */}
      <footer
        style={{
          padding: "clamp(40px, 6vw, 80px) clamp(24px, 5vw, 64px)",
          borderTop: `1px solid ${RULE}`,
          background: INK,
          color: PAPER,
          display: "grid",
          gridTemplateColumns: "repeat(12, minmax(0, 1fr))",
          gap: "clamp(16px, 2.5vw, 32px)",
        }}
      >
        <div style={{ gridColumn: "1 / span 5" }}>
          <div
            className={display.className}
            style={{
              fontFamily: display.style.fontFamily,
              fontWeight: 700,
              fontSize: "clamp(2rem, 4vw, 3rem)",
              letterSpacing: "-0.03em",
              lineHeight: 0.9,
            }}
          >
            Cruzar
          </div>
          <p
            style={{
              marginTop: "12px",
              fontFamily: body.style.fontFamily,
              fontSize: "0.85rem",
              lineHeight: 1.55,
              color: BONE,
              opacity: 0.85,
              maxWidth: "36ch",
            }}
          >
            For surfaces that need to feel rooted in LatAm and globally legible at the same time.
          </p>
        </div>

        <div
          style={{
            gridColumn: "7 / span 3",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
          }}
        >
          <span
            style={{
              fontFamily: body.style.fontFamily,
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: BONE,
              opacity: 0.7,
            }}
          >
            Direction
          </span>
          <span
            className={display.className}
            style={{
              fontFamily: display.style.fontFamily,
              fontWeight: 500,
              fontSize: "1.05rem",
              letterSpacing: "-0.005em",
            }}
          >
            Muralist Modernism · 03
          </span>
        </div>

        <div
          style={{
            gridColumn: "10 / span 3",
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            textAlign: "right",
          }}
        >
          <span
            style={{
              fontFamily: body.style.fontFamily,
              fontSize: "0.68rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: BONE,
              opacity: 0.7,
            }}
          >
            Edition
          </span>
          <span
            className={display.className}
            style={{
              fontFamily: display.style.fontFamily,
              fontWeight: 500,
              fontSize: "1.05rem",
              letterSpacing: "-0.005em",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            2026 · Q2 · working
          </span>
        </div>
      </footer>

      {/* oxide tone is introduced in the palette swatches above — reference the token
          so TS doesn't flag it as unused while keeping the palette honest. */}
      <span style={{ display: "none" }} aria-hidden>
        {OXIDE}
      </span>
    </main>
  );
}

/* ---------- helper components ---------------------------------------- */

function SpecLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        fontFamily: "ui-monospace, 'JetBrains Mono', 'SFMono-Regular', monospace",
        fontSize: "0.7rem",
        color: INK_QUIET,
        letterSpacing: "-0.01em",
      }}
    >
      {children}
    </span>
  );
}

function StatCell({
  grid,
  label,
  value,
  tone,
  mono,
}: {
  grid: string;
  label: string;
  value: string;
  tone?: "clay" | "indigo";
  mono?: boolean;
}) {
  const color = tone === "clay" ? CLAY_DEEP : tone === "indigo" ? INDIGO : INK;
  return (
    <div
      style={{
        gridColumn: grid,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <span
        style={{
          fontFamily: body.style.fontFamily,
          fontSize: "0.68rem",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: INK_QUIET,
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        className={mono ? undefined : display.className}
        style={{
          fontFamily: mono
            ? "ui-monospace, 'JetBrains Mono', 'SFMono-Regular', monospace"
            : display.style.fontFamily,
          fontSize: mono ? "0.95rem" : "clamp(1.75rem, 3.2vw, 2.75rem)",
          fontWeight: mono ? 500 : 600,
          letterSpacing: mono ? "-0.01em" : "-0.02em",
          lineHeight: mono ? 1.4 : 0.95,
          color,
          fontVariantNumeric: "lining-nums tabular-nums",
        }}
      >
        {value}
      </span>
    </div>
  );
}

function MarkStudy({ grid, size, label }: { grid: string; size: number; label: string }) {
  return (
    <div
      style={{
        gridColumn: grid,
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          position: "relative",
          width: `${size}px`,
          height: `${size}px`,
          maxWidth: "100%",
        }}
      >
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: CLAY,
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            left: "-8%",
            right: "-8%",
            top: "50%",
            height: "1px",
            background: INK,
            transform: "rotate(-28deg)",
            transformOrigin: "center",
          }}
        />
      </div>
      <SpecLabel>{label}</SpecLabel>
    </div>
  );
}
