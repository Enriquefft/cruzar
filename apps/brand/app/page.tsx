import Link from "next/link";
import { ARCHIVED_DIRECTIONS, DIRECTIONS } from "@/lib/content";
import { HAIRLINE, INK, INK_MUTE, INK_SOFT, PAPER } from "@/lib/tokens";

export default function Index() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: PAPER,
        color: INK,
        fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
        padding: "clamp(2rem, 6vw, 6rem)",
      }}
    >
      <header style={{ maxWidth: "70ch", marginBottom: "5rem" }}>
        <p
          style={{
            textTransform: "uppercase",
            letterSpacing: "0.18em",
            fontSize: "0.72rem",
            color: INK_MUTE,
            marginBottom: "1rem",
          }}
        >
          Cruzar · Brand System · Two-Register Decision
        </p>
        <h1
          style={{
            fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
            lineHeight: 1.05,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            margin: 0,
          }}
        >
          One identity, two registers.
        </h1>
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: "1.05rem",
            lineHeight: 1.55,
            color: INK_SOFT,
            maxWidth: "62ch",
          }}
        >
          Editorial leads for rector-facing surfaces; Field Report leads for operator and employer
          surfaces. Both derive color, type, and space from a single token module (
          <code style={{ fontFamily: "ui-monospace, monospace" }}>lib/tokens.ts</code>
          ). Change there propagates everywhere.
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gap: "1px",
          background: HAIRLINE,
          border: `1px solid ${HAIRLINE}`,
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        }}
      >
        {DIRECTIONS.map((d, i) => (
          <Link
            key={d.slug}
            href={`/direction/${d.slug}`}
            style={{
              background: PAPER,
              padding: "2.5rem 2rem",
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
              minHeight: "280px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.7rem",
                fontVariantNumeric: "tabular-nums",
                color: INK_MUTE,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              <span>
                {String(i + 1).padStart(2, "0")} / {String(DIRECTIONS.length).padStart(2, "0")}
              </span>
              <span>{d.role}</span>
            </div>
            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 500,
                letterSpacing: "-0.015em",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              {d.name}
            </h2>
            <p style={{ margin: 0, lineHeight: 1.5, color: INK_SOFT }}>{d.oneLiner}</p>
            <p
              style={{
                marginTop: "auto",
                fontSize: "0.85rem",
                color: INK_MUTE,
                lineHeight: 1.5,
              }}
            >
              {d.audience}
            </p>
          </Link>
        ))}
      </section>

      {ARCHIVED_DIRECTIONS.length > 0 && (
        <section
          style={{
            marginTop: "4rem",
            borderTop: `1px solid ${HAIRLINE}`,
            paddingTop: "2rem",
            maxWidth: "70ch",
          }}
        >
          <p
            style={{
              textTransform: "uppercase",
              letterSpacing: "0.18em",
              fontSize: "0.72rem",
              color: INK_MUTE,
              marginBottom: "1rem",
            }}
          >
            Archived — not routed
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.75rem" }}>
            {ARCHIVED_DIRECTIONS.map((d) => (
              <li key={d.slug} style={{ fontSize: "0.9rem", lineHeight: 1.55, color: INK_SOFT }}>
                <strong style={{ color: INK }}>{d.name}</strong> — {d.note}
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer
        style={{
          marginTop: "5rem",
          fontSize: "0.78rem",
          color: INK_MUTE,
          maxWidth: "70ch",
          lineHeight: 1.6,
        }}
      >
        Internal-only. Not deployed. Once promotion is complete, tokens migrate to the shared module
        and <code style={{ fontFamily: "ui-monospace, monospace" }}>apps/web</code>
        &nbsp;consumes them.
      </footer>
    </main>
  );
}
