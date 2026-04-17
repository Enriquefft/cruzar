import { BRAND, PRICING, PROOF, QUOTE } from "@/lib/content";
import { body, display } from "@/lib/fonts";
import { ACCENT, HAIRLINE, INK, INK_LABEL, INK_SOFT, PAPER, PAPER_DEEP } from "@/lib/tokens";

/**
 * Direction: Editorial Institutional — Cruzar's primary register.
 *
 * Anchors: The Economist, MIT Technology Review, Stripe docs (early),
 * Mercury statements, FT.com, the New Yorker article pages.
 *
 * Numbers are the protagonist. Text and data interplay in asymmetric
 * two-column compositions. Warm cream paper, rich ink, one restrained
 * aged-red accent. Every figure is tabular.
 *
 * Color, type, and spacing derive from `@cruzar/brand` modules (SSOT).
 */

function SectionEyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: "12px",
        fontSize: "0.7rem",
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: INK_LABEL,
        fontFamily: "var(--cruzar-body)",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span style={{ color: ACCENT, fontWeight: 600 }}>§ {no}</span>
      <span style={{ flex: "0 0 32px", height: "1px", background: HAIRLINE }} />
      <span>{label}</span>
    </div>
  );
}

export default function EditorialDirection() {
  const {
    placedThisCohort,
    averageSalaryDeltaUsd,
    averageSalaryMultiple,
    cohortSizeStudents,
    partnerUniversities,
    countryReach,
  } = PROOF;

  return (
    <main
      className={`${display.variable} ${body.variable}`}
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
      <style>{`
        .ed-serif { font-family: var(--cruzar-display), ui-serif, Georgia, serif; }
        .ed-sans  { font-family: var(--cruzar-body), ui-sans-serif, system-ui, sans-serif; }
        .ed-figure-huge {
          font-family: var(--cruzar-display);
          font-weight: 300;
          font-feature-settings: "tnum" 1, "lnum" 1;
          letter-spacing: -0.03em;
          line-height: 0.88;
        }
        .ed-rule {
          border: 0;
          border-top: 1px solid ${HAIRLINE};
          margin: 0;
        }
        .ed-smallcaps {
          font-variant-caps: all-small-caps;
          letter-spacing: 0.08em;
        }
        @media (max-width: 860px) {
          .ed-grid-2 { grid-template-columns: 1fr !important; }
          .ed-grid-3 { grid-template-columns: 1fr !important; }
          .ed-ledger { grid-template-columns: 1fr 1fr !important; }
        }
        @media (max-width: 520px) {
          .ed-ledger { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ============== MASTHEAD ============== */}
      <header
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "32px clamp(24px, 5vw, 64px) 24px",
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
            fontSize: "0.72rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: INK_SOFT,
          }}
        >
          <span>Cruzar · Brand Direction No. 01</span>
          <span>Editorial Institutional</span>
          <span style={{ fontVariantNumeric: "tabular-nums" }}>MMXXVI · Vol. 01 · No. 01</span>
        </div>
      </header>

      {/* ============== LOGOTYPE ============== */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 8vw, 96px) clamp(24px, 5vw, 64px) clamp(32px, 5vw, 48px)",
        }}
      >
        <div
          className="ed-grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr auto",
            alignItems: "end",
            gap: "24px",
            borderBottom: `1px solid ${HAIRLINE}`,
            paddingBottom: "24px",
          }}
        >
          <div>
            <p
              className="ed-sans"
              style={{
                margin: 0,
                marginBottom: "12px",
                fontSize: "0.72rem",
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: INK_LABEL,
                fontWeight: 600,
              }}
            >
              The Logotype
            </p>
            <h1
              className="ed-serif"
              style={{
                margin: 0,
                fontSize: "clamp(4.5rem, 16vw, 12.5rem)",
                fontWeight: 400,
                letterSpacing: "-0.045em",
                lineHeight: 0.9,
                color: INK,
              }}
            >
              Cruzar<span style={{ color: ACCENT }}>.</span>
            </h1>
            <p
              className="ed-sans"
              style={{
                margin: 0,
                marginTop: "16px",
                fontSize: "0.82rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: INK_SOFT,
              }}
            >
              {BRAND.meaning}
            </p>
          </div>
          <div
            className="ed-sans"
            style={{
              textAlign: "right",
              fontSize: "0.78rem",
              color: INK_LABEL,
              maxWidth: "22ch",
              lineHeight: 1.5,
            }}
          >
            Set in Literata at 400, with a single terminal accent in aged red to carry the voice
            across long-form print and screen.
          </div>
        </div>
      </section>

      {/* ============== TAGLINE + LEDE ============== */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(24px, 4vw, 48px) clamp(24px, 5vw, 64px) clamp(48px, 6vw, 80px)",
        }}
      >
        <div
          className="ed-grid-2"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1fr)",
            gap: "clamp(32px, 5vw, 80px)",
            alignItems: "start",
          }}
        >
          {/* ES tagline + lede */}
          <div>
            <SectionEyebrow no="I" label="Español" />
            <h2
              className="ed-serif"
              style={{
                margin: "20px 0 32px",
                fontSize: "clamp(2rem, 4.2vw, 3.4rem)",
                lineHeight: 1.03,
                letterSpacing: "-0.022em",
                fontWeight: 500,
                maxWidth: "16ch",
              }}
            >
              {BRAND.taglineEs}
            </h2>
            <p
              style={{
                fontFamily: "var(--cruzar-body)",
                margin: 0,
                fontSize: "1.08rem",
                lineHeight: 1.6,
                color: INK,
                maxWidth: "42ch",
              }}
            >
              {BRAND.promiseEs}{" "}
              <span style={{ color: INK_SOFT }}>
                Los diagnósticos se hacen sobre escenarios reales de trabajo remoto internacional;
                la validación no es un test, es un encargo acotado que un gerente extranjero
                aceptaría sin preguntar.
              </span>
            </p>
          </div>

          {/* EN tagline + lede */}
          <div
            style={{
              borderTop: `1px solid ${HAIRLINE}`,
              paddingTop: "32px",
              marginTop: "28px",
            }}
          >
            <SectionEyebrow no="I" label="English" />
            <h2
              className="ed-serif"
              style={{
                margin: "20px 0 24px",
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                lineHeight: 1.05,
                letterSpacing: "-0.018em",
                fontWeight: 400,
                fontStyle: "italic",
                color: INK_SOFT,
                maxWidth: "22ch",
              }}
            >
              {BRAND.taglineEn}
            </h2>
            <p
              style={{
                margin: 0,
                fontSize: "0.98rem",
                lineHeight: 1.65,
                color: INK_SOFT,
                maxWidth: "42ch",
              }}
            >
              {BRAND.promiseEn}
            </p>
          </div>
        </div>
      </section>

      {/* ============== PROOF / NUMBERS ============== */}
      <section
        style={{
          background: PAPER_DEEP,
          borderTop: `2px solid ${INK}`,
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(56px, 7vw, 96px) clamp(24px, 5vw, 64px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
              flexWrap: "wrap",
              gap: "16px",
              marginBottom: "clamp(32px, 5vw, 56px)",
            }}
          >
            <SectionEyebrow no="II" label="Cohort 02 — Verified Proof" />
            <span
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: INK_LABEL,
              }}
            >
              As of 2026-04-15
            </span>
          </div>

          {/* Lead number, hung beside the copy */}
          <div
            className="ed-grid-2"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              gap: "clamp(32px, 5vw, 72px)",
              alignItems: "end",
            }}
          >
            <div style={{ position: "relative" }}>
              <span
                className="ed-figure-huge"
                style={{
                  display: "block",
                  fontSize: "clamp(10rem, 28vw, 22rem)",
                  color: INK,
                }}
              >
                {placedThisCohort}
              </span>
              <span
                className="ed-sans"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "-4px",
                  fontSize: "1.1rem",
                  color: INK_LABEL,
                  fontWeight: 600,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                25.5% of cohort
              </span>
            </div>
            <div style={{ paddingBottom: "clamp(16px, 3vw, 40px)" }}>
              <p
                className="ed-serif"
                style={{
                  margin: 0,
                  fontSize: "clamp(1.6rem, 2.4vw, 2.1rem)",
                  lineHeight: 1.18,
                  letterSpacing: "-0.012em",
                  fontWeight: 400,
                  maxWidth: "22ch",
                }}
              >
                students placed into international remote roles this cohort.
              </p>
              <p
                style={{
                  margin: "16px 0 0",
                  fontSize: "0.9rem",
                  color: INK_SOFT,
                  lineHeight: 1.55,
                  maxWidth: "38ch",
                }}
              >
                Out of {cohortSizeStudents} enrolled. Each placement is verified by signed offer
                letter and first-payroll screenshot, held on file and available on audit request.
              </p>
            </div>
          </div>

          {/* Secondary numbers ledger — asymmetric: 1 large + 3 small */}
          <div
            className="ed-ledger"
            style={{
              marginTop: "clamp(48px, 6vw, 72px)",
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr",
              borderTop: `1px solid ${HAIRLINE}`,
              borderBottom: `1px solid ${HAIRLINE}`,
            }}
          >
            {[
              {
                figure: `+$${averageSalaryDeltaUsd.toLocaleString("en-US")}`,
                suffix: " / mo",
                label: "Avg. salary delta",
                note: "USD, monthly, post-placement",
                scale: "lead" as const,
              },
              {
                figure: `${averageSalaryMultiple.toFixed(1)}`,
                suffix: "×",
                label: "Avg. salary multiple",
                note: "Vs. pre-cohort local pay",
                scale: "small" as const,
              },
              {
                figure: `${cohortSizeStudents}`,
                suffix: "",
                label: "Students in cohort",
                note: "Enrolled, cohort 02",
                scale: "small" as const,
              },
              {
                figure: `${partnerUniversities}`,
                suffix: "",
                label: "Partner universities",
                note: "Signed MOUs, Peru",
                scale: "small" as const,
              },
            ].map((item, i, arr) => (
              <div
                key={item.label}
                style={{
                  padding: item.scale === "lead" ? "36px 32px" : "28px 24px",
                  borderRight: i < arr.length - 1 ? `1px solid ${HAIRLINE}` : "none",
                  background: item.scale === "lead" ? PAPER : "transparent",
                }}
              >
                <div
                  className="ed-serif"
                  style={{
                    fontSize:
                      item.scale === "lead"
                        ? "clamp(3rem, 5.2vw, 4.6rem)"
                        : "clamp(1.7rem, 2.6vw, 2.3rem)",
                    fontWeight: item.scale === "lead" ? 300 : 400,
                    letterSpacing: "-0.022em",
                    lineHeight: 1,
                    color: INK,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {item.figure}
                  <span
                    style={{
                      fontSize: "0.5em",
                      color: INK_LABEL,
                      fontWeight: 300,
                      marginLeft: "2px",
                    }}
                  >
                    {item.suffix}
                  </span>
                </div>
                <div
                  style={{
                    marginTop: item.scale === "lead" ? "16px" : "12px",
                    fontSize: item.scale === "lead" ? "0.84rem" : "0.74rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.14em",
                    color: INK,
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    marginTop: "4px",
                    fontSize: item.scale === "lead" ? "0.88rem" : "0.78rem",
                    color: INK_LABEL,
                    lineHeight: 1.45,
                  }}
                >
                  {item.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PULL QUOTE ============== */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(72px, 9vw, 128px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionEyebrow no="III" label="In the words of — cohort 02" />
        <figure
          className="ed-grid-2"
          style={{
            margin: "32px 0 0",
            display: "grid",
            gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
            gap: "clamp(24px, 5vw, 64px)",
            alignItems: "start",
          }}
        >
          <blockquote
            className="ed-serif"
            style={{
              margin: 0,
              fontSize: "clamp(1.7rem, 3.4vw, 2.9rem)",
              lineHeight: 1.14,
              letterSpacing: "-0.012em",
              fontWeight: 400,
              color: INK,
              textIndent: "-0.5em",
              paddingLeft: "0.5em",
            }}
          >
            <span
              aria-hidden
              style={{
                color: INK_LABEL,
                fontWeight: 400,
                marginRight: "0.04em",
              }}
            >
              &ldquo;
            </span>
            {QUOTE.es}
            <span aria-hidden style={{ color: INK_LABEL, fontWeight: 400 }}>
              &rdquo;
            </span>
          </blockquote>
          <div>
            <p
              style={{
                margin: 0,
                fontStyle: "italic",
                color: INK_SOFT,
                fontSize: "1.02rem",
                lineHeight: 1.55,
                maxWidth: "34ch",
              }}
            >
              {QUOTE.en}
            </p>
            <hr className="ed-rule" style={{ margin: "24px 0 16px", maxWidth: "120px" }} />
            <figcaption
              className="ed-smallcaps"
              style={{
                fontFamily: "var(--cruzar-body)",
                fontSize: "0.92rem",
                letterSpacing: "0.14em",
                color: INK,
                fontWeight: 600,
              }}
            >
              {QUOTE.attribution}
            </figcaption>
          </div>
        </figure>
      </section>

      {/* ============== TYPE SPECIMEN ============== */}
      <section
        style={{
          borderTop: `2px solid ${INK}`,
          background: PAPER,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(56px, 7vw, 96px) clamp(24px, 5vw, 64px)",
          }}
        >
          <SectionEyebrow no="IV" label="The Typographic System" />
          <div
            className="ed-grid-2"
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)",
              gap: "clamp(32px, 5vw, 72px)",
              alignItems: "start",
            }}
          >
            {/* Display face */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderBottom: `1px solid ${HAIRLINE}`,
                  paddingBottom: "8px",
                  marginBottom: "24px",
                }}
              >
                <span className="ed-serif" style={{ fontSize: "1.2rem", fontWeight: 600 }}>
                  Literata
                </span>
                <span
                  style={{
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: INK_LABEL,
                  }}
                >
                  Display · Type Together
                </span>
              </div>
              <div className="ed-serif" style={{ display: "grid", gap: "16px", color: INK }}>
                <div
                  style={{
                    fontSize: "4.5rem",
                    fontWeight: 300,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                >
                  Cruzar — 300
                </div>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: 400,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  Cross from local pay — 400
                </div>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Cruza del salario local — 600
                </div>
                <div
                  style={{
                    fontSize: "1.25rem",
                    fontStyle: "italic",
                    color: INK_SOFT,
                  }}
                >
                  verified by signed offer letter & first-payroll screenshot
                </div>
                <div
                  style={{
                    fontVariantNumeric: "tabular-nums lining-nums",
                    fontSize: "2.2rem",
                    fontWeight: 300,
                    letterSpacing: "-0.02em",
                  }}
                >
                  0 1 2 3 4 5 6 7 8 9 · $2,840 · 4.1×
                </div>
              </div>
            </div>

            {/* Body face */}
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  borderBottom: `1px solid ${HAIRLINE}`,
                  paddingBottom: "8px",
                  marginBottom: "24px",
                }}
              >
                <span style={{ fontSize: "1rem", fontWeight: 600 }}>Funnel Sans</span>
                <span
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.16em",
                    textTransform: "uppercase",
                    color: INK_LABEL,
                  }}
                >
                  Body · Google Fonts
                </span>
              </div>
              <div style={{ display: "grid", gap: "14px", color: INK }}>
                <div
                  style={{
                    fontSize: "1.3rem",
                    fontWeight: 600,
                    letterSpacing: "-0.005em",
                  }}
                >
                  Accountable by construction.
                </div>
                <div style={{ fontSize: "1rem", lineHeight: 1.55 }}>
                  Diagnosis, real-scenario validation, and autonomous applications to international
                  remote jobs.
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: INK_SOFT,
                    lineHeight: 1.6,
                  }}
                >
                  Institucional, verificable, medible — we price on outcomes, never on promises. The
                  brand respires receipts.
                </div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: INK,
                    fontWeight: 600,
                  }}
                >
                  Cohort 02 · Verified · 2026
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== PALETTE ============== */}
      <section
        style={{
          borderTop: `1px solid ${HAIRLINE}`,
          background: PAPER_DEEP,
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(56px, 7vw, 96px) clamp(24px, 5vw, 64px)",
          }}
        >
          <SectionEyebrow no="V" label="The Chromatic Register" />
          <div
            style={{
              marginTop: "40px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "1px",
              background: HAIRLINE,
              border: `1px solid ${HAIRLINE}`,
            }}
          >
            {[
              {
                name: "Paper",
                role: "Background",
                value: "0.97 0.012 85",
                swatch: PAPER,
              },
              {
                name: "Paper, deep",
                role: "Shelf surface",
                value: "0.945 0.014 82",
                swatch: PAPER_DEEP,
              },
              {
                name: "Ink",
                role: "Body text",
                value: "0.18 0.01 80",
                swatch: INK,
              },
              {
                name: "Ink, soft",
                role: "Secondary text",
                value: "0.38 0.012 80",
                swatch: INK_SOFT,
              },
              {
                name: "Hairline",
                role: "Dividers · 1px",
                value: "0.82 0.012 80",
                swatch: HAIRLINE,
              },
              {
                name: "Aged red",
                role: "Accent · sparingly",
                value: "0.42 0.14 30",
                swatch: ACCENT,
              },
            ].map((c) => (
              <div
                key={c.name}
                style={{
                  background: PAPER,
                  display: "grid",
                  gridTemplateRows: "120px auto",
                }}
              >
                <div style={{ background: c.swatch, width: "100%" }} />
                <div style={{ padding: "18px 20px 20px" }}>
                  <div
                    className="ed-serif"
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      letterSpacing: "-0.005em",
                      color: INK,
                    }}
                  >
                    {c.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.78rem",
                      color: INK_SOFT,
                      marginTop: "2px",
                    }}
                  >
                    {c.role}
                  </div>
                  <div
                    style={{
                      marginTop: "12px",
                      fontSize: "0.78rem",
                      fontVariantNumeric: "tabular-nums",
                      color: INK_LABEL,
                    }}
                  >
                    oklch({c.value})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PRICING ============== */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(72px, 9vw, 128px) clamp(24px, 5vw, 64px)",
        }}
      >
        <SectionEyebrow no="VI" label="On Price" />
        <p
          className="ed-serif"
          style={{
            margin: "28px 0 0",
            fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
            lineHeight: 1.22,
            letterSpacing: "-0.012em",
            fontWeight: 400,
            color: INK,
            maxWidth: "32ch",
          }}
        >
          Students pay{" "}
          <span style={{ color: INK, fontWeight: 600 }}>
            USD {PRICING.studentFlat.min.toLocaleString("en-US")}–
            {PRICING.studentFlat.max.toLocaleString("en-US")}
          </span>
          , only once the international contract is signed — never before.
        </p>
        <p
          style={{
            marginTop: "20px",
            fontSize: "0.98rem",
            color: INK_SOFT,
            lineHeight: 1.6,
            maxWidth: "60ch",
          }}
        >
          No deposit. No subscription. No tuition. The price is a single flat fee triggered{" "}
          <em>on placement only</em>. Institutions anchor separately at USD{" "}
          {PRICING.institutionAnchor.min.toLocaleString("en-US")}–
          {PRICING.institutionAnchor.max.toLocaleString("en-US")} per year, outcomes-capped.
        </p>
      </section>

      {/* ============== FOOTER COLOPHON ============== */}
      <footer
        style={{
          borderTop: `2px solid ${INK}`,
          background: PAPER,
        }}
      >
        <div
          className="ed-grid-3"
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "40px clamp(24px, 5vw, 64px) 48px",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
            gap: "32px",
            alignItems: "start",
          }}
        >
          <div>
            <div
              className="ed-smallcaps"
              style={{
                fontSize: "0.88rem",
                fontWeight: 600,
                letterSpacing: "0.12em",
                color: INK,
              }}
            >
              Direction No. 01
            </div>
            <div
              className="ed-serif"
              style={{
                fontSize: "1.4rem",
                fontWeight: 500,
                marginTop: "6px",
                letterSpacing: "-0.01em",
              }}
            >
              Editorial Institutional
            </div>
          </div>
          <div
            style={{
              fontSize: "0.88rem",
              color: INK_SOFT,
              lineHeight: 1.55,
              maxWidth: "40ch",
            }}
          >
            For surfaces where institutional credibility is the entire game — rector offices, signed
            MOUs, parent-facing landing pages, the quarterly placement ledger.
          </div>
          <div
            style={{
              fontSize: "0.82rem",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: INK_LABEL,
              textAlign: "right",
              fontVariantNumeric: "tabular-nums",
            }}
          >
            <div>2026 · 04 · 15</div>
            <div style={{ marginTop: "4px" }}>Cruzar Brand Exploration</div>
            <div style={{ marginTop: "4px" }}>Set in Literata &amp; Funnel Sans</div>
            <div style={{ marginTop: "4px" }}>Reach · {countryReach.join(" · ")}</div>
          </div>
        </div>
      </footer>
    </main>
  );
}
