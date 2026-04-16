/**
 * Open Graph card generator — three editorial variants.
 *
 * Import: uses `next/og` (Next 16 re-exports `ImageResponse` from `@vercel/og`).
 * The `@vercel/og` dep is pinned in package.json to match apps/web and to
 * guarantee the exact Satori+Resvg engine version across the monorepo.
 *
 * Satori constraints honored below:
 *   - flexbox only (no `display: grid`)
 *   - no `@font-face` (fonts are loaded as ArrayBuffers and passed to ImageResponse)
 *   - no `oklch()` (hex fallbacks derived from the canonical OKLCH tokens)
 *   - every digit rendered with `fontFeatureSettings: '"tnum" 1, "lnum" 1'`
 *
 * Variants (query param `variant`):
 *   wordmark  — Cruzar wordmark + bilingual taglines
 *   stat      — hero "12" placed + cohort 02 caption + ledger row
 *   quote     — pull-quote + attribution, wordmark in corner
 *
 * Output: 1200×630 PNG, editorial register, paper background, ink type, single
 * aged-red accent restricted to the wordmark period only.
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { BRAND, PROOF, QUOTE } from "@/lib/content";

export const runtime = "nodejs";

/* ─────────────────────────── TOKENS (hex fallbacks) ───────────────────────────
 * Derived from apps/brand/lib/tokens.ts OKLCH values. Satori does not render
 * oklch() reliably, so these are the resolved hex equivalents.
 *
 *   PAPER        oklch(0.97 0.012 85)  → #f5efe5   (warm cream)
 *   PAPER_DEEP   oklch(0.945 0.014 82) → #ece5d8
 *   INK          oklch(0.18 0.01 80)   → #1f1c18   (near-black, warm, never pure)
 *   INK_SOFT     oklch(0.38 0.012 80)  → #4a4238
 *   INK_LABEL     oklch(0.55 0.012 80)  → #7a7065
 *   HAIRLINE     oklch(0.82 0.012 80)  → #c7bdae
 *   ACCENT       oklch(0.42 0.14 30)   → #a4332a   (aged editorial red)
 */
const PAPER = "#f5efe5";
const INK = "#1f1c18";
const INK_SOFT = "#4a4238";
const INK_LABEL = "#7a7065";
const HAIRLINE = "#c7bdae";
const ACCENT = "#a4332a";

/* Bundled font files are read once at module scope and reused across every
 * request. No re-fetching, no re-hashing on hot paths. */
const FONTS_DIR = join(process.cwd(), "public", "og-fonts");

const FONT_BUFFERS = {
  serifLight: readFileSync(join(FONTS_DIR, "literata-300.ttf")),
  serifRegular: readFileSync(join(FONTS_DIR, "literata-400.ttf")),
  serifSemi: readFileSync(join(FONTS_DIR, "literata-600.ttf")),
  sansMedium: readFileSync(join(FONTS_DIR, "funnel-sans-500.ttf")),
} as const;

const OG_FONTS = [
  { name: "Literata", data: FONT_BUFFERS.serifLight, weight: 300 as const, style: "normal" as const },
  { name: "Literata", data: FONT_BUFFERS.serifRegular, weight: 400 as const, style: "normal" as const },
  { name: "Literata", data: FONT_BUFFERS.serifSemi, weight: 600 as const, style: "normal" as const },
  { name: "Funnel Sans", data: FONT_BUFFERS.sansMedium, weight: 500 as const, style: "normal" as const },
];

const OG_SIZE = { width: 1200, height: 630 } as const;
const TABULAR = { fontFeatureSettings: '"tnum" 1, "lnum" 1' } as const;

const VARIANTS = ["wordmark", "stat", "quote"] as const;
type Variant = (typeof VARIANTS)[number];

function isVariant(value: string | null): value is Variant {
  return value !== null && (VARIANTS as readonly string[]).includes(value);
}

/* ─────────────────────────── SHARED ELEMENTS ─────────────────────────── */

function Footer() {
  return (
    <div
      style={{
        position: "absolute",
        left: 64,
        right: 64,
        bottom: 32,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderTop: `1px solid ${HAIRLINE}`,
        paddingTop: 16,
        fontFamily: "Funnel Sans",
        fontWeight: 500,
        fontSize: 16,
        letterSpacing: "0.16em",
        textTransform: "uppercase",
        color: INK_LABEL,
        ...TABULAR,
      }}
    >
      <span>cruzar.io</span>
      <span>MMXXVI</span>
    </div>
  );
}

function Wordmark({ size }: { size: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        fontFamily: "Literata",
        fontWeight: 400,
        fontSize: size,
        lineHeight: 0.9,
        letterSpacing: "-0.045em",
        color: INK,
      }}
    >
      <span>Cruzar</span>
      <span style={{ color: ACCENT }}>.</span>
    </div>
  );
}

/* ───────────────────────────── WORDMARK VARIANT ───────────────────────────── */

function WordmarkCard() {
  return (
    <div
      style={{
        position: "relative",
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        background: PAPER,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "72px 64px 96px",
      }}
    >
      {/* Section eyebrow — Direction No. */}
      <div
        style={{
          position: "absolute",
          top: 40,
          left: 64,
          right: 64,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          fontFamily: "Funnel Sans",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_LABEL,
          ...TABULAR,
        }}
      >
        <span>Cruzar · Direction No. 01</span>
        <span>Cohort 02 · MMXXVI</span>
      </div>

      <Wordmark size={240} />

      {/* Hair rule under wordmark */}
      <div
        style={{
          width: 320,
          height: 1,
          background: HAIRLINE,
          marginTop: 32,
          marginBottom: 32,
          display: "flex",
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 500,
            fontSize: 28,
            color: INK,
            textAlign: "center",
            letterSpacing: "-0.005em",
          }}
        >
          {BRAND.taglineEs}
        </div>
        <div
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 500,
            fontSize: 22,
            color: INK_SOFT,
            textAlign: "center",
            letterSpacing: "0.005em",
          }}
        >
          {BRAND.taglineEn}
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ───────────────────────────── STAT VARIANT ───────────────────────────── */

function StatCard() {
  const delta = `+$${PROOF.averageSalaryDeltaUsd.toLocaleString("en-US")}`;
  const multiple = `${PROOF.averageSalaryMultiple.toFixed(1)}×`;

  return (
    <div
      style={{
        position: "relative",
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        background: PAPER,
        display: "flex",
        flexDirection: "column",
        padding: "56px 64px 96px",
      }}
    >
      {/* Masthead */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          borderBottom: `2px solid ${INK}`,
          paddingBottom: 16,
          marginBottom: 56,
          fontFamily: "Funnel Sans",
          fontWeight: 500,
          fontSize: 16,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_SOFT,
          ...TABULAR,
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline" }}>
          <Wordmark size={28} />
          <div style={{ marginLeft: 20, display: "flex" }}>Verified Proof</div>
        </div>
        <span>§ II · Cohort 02</span>
      </div>

      {/* Hero row: big 12 hung left, running caption right */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 56,
          flex: 1,
          marginTop: 24,
        }}
      >
        <div
          style={{
            fontFamily: "Literata",
            fontWeight: 300,
            fontSize: 300,
            lineHeight: 1,
            letterSpacing: "-0.04em",
            color: INK,
            display: "flex",
            flexShrink: 0,
            ...TABULAR,
          }}
        >
          {PROOF.placedThisCohort}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            paddingBottom: 32,
            maxWidth: 540,
          }}
        >
          <div
            style={{
              fontFamily: "Funnel Sans",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: INK_LABEL,
              marginBottom: 12,
              ...TABULAR,
            }}
          >
            Students placed
          </div>
          <div
            style={{
              fontFamily: "Funnel Sans",
              fontWeight: 500,
              fontSize: 32,
              lineHeight: 1.2,
              color: INK,
              letterSpacing: "-0.005em",
            }}
          >
            Students placed into international remote roles · cohort 02
          </div>
          <div
            style={{
              fontFamily: "Funnel Sans",
              fontWeight: 500,
              fontSize: 18,
              lineHeight: 1.45,
              color: INK_SOFT,
              marginTop: 16,
              ...TABULAR,
            }}
          >
            {`Out of ${PROOF.cohortSizeStudents} enrolled — verified by signed offer letter and first-payroll screenshot.`}
          </div>
        </div>
      </div>

      {/* Tabular ledger row along bottom edge */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "baseline",
          gap: 80,
          borderTop: `1px solid ${HAIRLINE}`,
          paddingTop: 20,
          marginTop: 32,
          marginBottom: 56,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              fontFamily: "Literata",
              fontWeight: 400,
              fontSize: 44,
              letterSpacing: "-0.02em",
              color: INK,
              ...TABULAR,
            }}
          >
            <span>{delta}</span>
            <span style={{ fontSize: 22, color: INK_LABEL, marginLeft: 6 }}> / mo</span>
          </div>
          <div
            style={{
              fontFamily: "Funnel Sans",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK_LABEL,
              marginTop: 6,
            }}
          >
            Avg. salary delta
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontFamily: "Literata",
              fontWeight: 400,
              fontSize: 44,
              letterSpacing: "-0.02em",
              color: INK,
              ...TABULAR,
            }}
          >
            {multiple}
          </div>
          <div
            style={{
              fontFamily: "Funnel Sans",
              fontWeight: 500,
              fontSize: 14,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: INK_LABEL,
              marginTop: 6,
            }}
          >
            Avg. salary multiple
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ───────────────────────────── QUOTE VARIANT ───────────────────────────── */

function truncateQuote(text: string, max = 140): string {
  if (text.length <= max) return text;
  // Trim to nearest word boundary below max, then append ellipsis.
  const slice = text.slice(0, max);
  const lastSpace = slice.lastIndexOf(" ");
  const cut = lastSpace > max - 24 ? slice.slice(0, lastSpace) : slice;
  return `${cut.trimEnd()}…`;
}

function QuoteCard() {
  const body = truncateQuote(QUOTE.es, 140);

  return (
    <div
      style={{
        position: "relative",
        width: OG_SIZE.width,
        height: OG_SIZE.height,
        background: PAPER,
        display: "flex",
        flexDirection: "column",
        padding: "56px 64px 96px",
      }}
    >
      {/* Wordmark upper-left + eyebrow upper-right */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
        }}
      >
        <Wordmark size={40} />
        <div
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 500,
            fontSize: 14,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK_LABEL,
            ...TABULAR,
          }}
        >
          § III · In the words of
        </div>
      </div>

      {/* Pull quote */}
      <div
        style={{
          display: "flex",
          flex: 1,
          alignItems: "center",
          marginTop: 32,
        }}
      >
        <div
          style={{
            fontFamily: "Literata",
            fontWeight: 400,
            fontSize: 46,
            lineHeight: 1.18,
            letterSpacing: "-0.012em",
            color: INK,
            display: "flex",
            ...TABULAR,
          }}
        >
          {/* Quote marks stay INK_LABEL — never accent (accent reserved for wordmark period). */}
          {`“${body}”`}
        </div>
      </div>

      {/* Attribution */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          marginBottom: 48,
        }}
      >
        <div
          style={{
            width: 96,
            height: 1,
            background: HAIRLINE,
            display: "flex",
          }}
        />
        <div
          style={{
            fontFamily: "Funnel Sans",
            fontWeight: 500,
            fontSize: 18,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: INK,
            ...TABULAR,
          }}
        >
          {`— ${QUOTE.attribution}`}
        </div>
      </div>

      <Footer />
    </div>
  );
}

/* ────────────────────────────── ROUTE HANDLER ────────────────────────────── */

export function GET(request: Request): Response {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("variant");
  const variant: Variant = isVariant(raw) ? raw : "wordmark";

  const element =
    variant === "stat" ? <StatCard /> : variant === "quote" ? <QuoteCard /> : <WordmarkCard />;

  return new ImageResponse(element, {
    width: OG_SIZE.width,
    height: OG_SIZE.height,
    fonts: OG_FONTS,
    debug: searchParams.get("debug") === "1",
  });
}
