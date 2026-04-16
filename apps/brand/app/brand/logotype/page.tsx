import { Logotype } from "@/components/Logotype";
import { body, display } from "@/lib/fonts";
import {
  ACCENT,
  HAIRLINE,
  INK,
  INK_LABEL,
  INK_SOFT,
  PAPER,
  PAPER_DEEP,
} from "@/lib/tokens";

/**
 * Logotype asset preview.
 *
 * Not part of the DIRECTIONS rotation — accessible only by direct URL at
 * /brand/logotype. The job of this page is verification: render the SVG
 * component at the sizes a designer will actually specify in practice
 * (favicon / inline-body / hero / masthead) on both paper and ink grounds,
 * then sit the output next to the LIVE wordmark from the editorial
 * direction so the two can be A/B'd visually.
 *
 * If this page shows a pixel-perfect match between the component render
 * and the editorial-page render, the Logotype is safe to ship across
 * apps/web, deck, CV, and email.
 */

const SIZES = [32, 64, 128, 320] as const;

function LiveEditorialWordmark() {
  // This block is an exact, isolated copy of the glyph render inside
  // apps/brand/app/direction/editorial/page.tsx (h1, line ~156-168).
  // It exists here ONLY as a comparison target for visual diffing.
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: "var(--cruzar-display), ui-serif, Georgia, serif",
        fontSize: "clamp(4.5rem, 16vw, 12.5rem)",
        fontWeight: 400,
        letterSpacing: "-0.045em",
        lineHeight: 0.9,
        color: INK,
      }}
    >
      Cruzar<span style={{ color: ACCENT }}>.</span>
    </h1>
  );
}

function SizeRow({
  height,
  surface,
  variant,
}: {
  height: number;
  surface: "paper" | "ink";
  variant: "default" | "inverted";
}) {
  const bg = surface === "paper" ? PAPER : INK;
  const color = surface === "paper" ? INK : PAPER;
  const caption = surface === "paper" ? INK_LABEL : "rgba(249,245,236,0.55)";

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "120px 1fr",
        alignItems: "center",
        gap: "24px",
        padding: "32px",
        background: bg,
        color,
      }}
    >
      <div
        style={{
          fontFamily: "var(--cruzar-body)",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: caption,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {height}px · {surface}
      </div>
      <Logotype height={height} variant={variant} />
    </div>
  );
}

export default function LogotypePreview() {
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
      }}
    >
      <header
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "48px clamp(24px, 5vw, 64px) 24px",
          borderBottom: `2px solid ${INK}`,
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
        <span>Cruzar · Asset Preview</span>
        <span>The Logotype · SVG + Component</span>
        <span style={{ fontVariantNumeric: "tabular-nums" }}>
          Internal verification page
        </span>
      </header>

      {/* ============== SIDE-BY-SIDE WITH LIVE EDITORIAL RENDER ============== */}
      <section
        style={{
          maxWidth: "1320px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
          borderBottom: `1px solid ${HAIRLINE}`,
        }}
      >
        <p
          style={{
            margin: "0 0 24px",
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK_LABEL,
            fontWeight: 600,
          }}
        >
          Parity check · Component vs. editorial page &lt;h1&gt;
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "48px",
          }}
        >
          <figure style={{ margin: 0 }}>
            <figcaption
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: INK_SOFT,
                marginBottom: "16px",
              }}
            >
              Logotype component · height 320px
            </figcaption>
            <Logotype height={320} />
          </figure>
          <figure style={{ margin: 0 }}>
            <figcaption
              style={{
                fontSize: "0.78rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: INK_SOFT,
                marginBottom: "16px",
              }}
            >
              Editorial page &lt;h1&gt; · clamp(4.5rem, 16vw, 12.5rem)
            </figcaption>
            <LiveEditorialWordmark />
          </figure>
        </div>
        <p
          style={{
            marginTop: "32px",
            maxWidth: "60ch",
            fontSize: "0.9rem",
            color: INK_SOFT,
            lineHeight: 1.6,
          }}
        >
          The component render should match the live wordmark glyph-for-glyph:
          same stroke thickness, same kerning, same period position. The
          component uses an SVG-internal font-size (200px) and letter-spacing
          (-9px) that resolve to the editorial page's -0.045em ratio.
        </p>
      </section>

      {/* ============== SIZES ON PAPER ============== */}
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
          <p
            style={{
              margin: "0 0 32px",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK_LABEL,
              fontWeight: 600,
            }}
          >
            Default · Wordmark in ink · Period in accent
          </p>
          <div
            style={{
              border: `1px solid ${HAIRLINE}`,
              background: PAPER,
            }}
          >
            {SIZES.map((h, i) => (
              <div
                key={`paper-${h}`}
                style={{
                  borderTop: i === 0 ? "none" : `1px solid ${HAIRLINE}`,
                }}
              >
                <SizeRow height={h} surface="paper" variant="default" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== SIZES ON INK ============== */}
      <section>
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
          }}
        >
          <p
            style={{
              margin: "0 0 32px",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK_LABEL,
              fontWeight: 600,
            }}
          >
            Inverted · Wordmark in paper · Period in accent
          </p>
          <div
            style={{
              border: `1px solid ${INK}`,
            }}
          >
            {SIZES.map((h, i) => (
              <div
                key={`ink-${h}`}
                style={{
                  borderTop: i === 0 ? "none" : "1px solid rgba(249,245,236,0.12)",
                }}
              >
                <SizeRow height={h} surface="ink" variant="inverted" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== STANDALONE SVG FILES ============== */}
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
            padding: "clamp(48px, 6vw, 96px) clamp(24px, 5vw, 64px)",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "32px",
          }}
        >
          <figure
            style={{
              margin: 0,
              background: PAPER,
              padding: "32px",
              border: `1px solid ${HAIRLINE}`,
              color: INK,
            }}
          >
            <figcaption
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: INK_LABEL,
                marginBottom: "16px",
              }}
            >
              /cruzar-wordmark.svg
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cruzar-wordmark.svg"
              alt="Cruzar wordmark"
              style={{ display: "block", height: "120px", width: "auto" }}
            />
          </figure>
          <figure
            style={{
              margin: 0,
              background: INK,
              padding: "32px",
              color: PAPER,
            }}
          >
            <figcaption
              style={{
                fontSize: "0.72rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(249,245,236,0.55)",
                marginBottom: "16px",
              }}
            >
              /cruzar-wordmark-inverted.svg
            </figcaption>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cruzar-wordmark-inverted.svg"
              alt="Cruzar wordmark, inverted"
              style={{ display: "block", height: "120px", width: "auto" }}
            />
          </figure>
        </div>
      </section>
    </main>
  );
}
