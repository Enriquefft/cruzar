import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  ACCENT,
  ACCENT_DARK,
  CARD,
  CHART_1,
  CHART_2,
  CHART_3,
  CHART_4,
  DARK_CARD,
  DARK_HAIRLINE,
  DARK_INK,
  DARK_INK_LABEL,
  DARK_INK_SOFT,
  DARK_PAPER,
  DARK_PAPER_DEEP,
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
  text,
  WORDMARK,
} from "@/lib/tokens";

/**
 * The live tokens page — single source-of-truth rendering of every Cruzar
 * design token. Values are imported from `@/lib/tokens` so drift between this
 * page and the code SSOT is impossible.
 */

type LightSwatch = {
  name: string;
  variable: string;
  value: string;
  role: string;
  warning?: string;
};

const LIGHT_TOKENS: LightSwatch[] = [
  {
    name: "PAPER",
    variable: "--cruzar-paper",
    value: PAPER,
    role: "Primary background — warm cream",
  },
  {
    name: "PAPER_DEEP",
    variable: "--cruzar-paper-deep",
    value: PAPER_DEEP,
    role: "Shelf surface, muted panels",
  },
  {
    name: "CARD",
    variable: "--cruzar-card",
    value: CARD,
    role: "Inset raised rows, cards over paper",
  },
  { name: "INK", variable: "--cruzar-ink", value: INK, role: "Body text, primary buttons" },
  {
    name: "INK_SOFT",
    variable: "--cruzar-ink-soft",
    value: INK_SOFT,
    role: "Secondary text, muted foreground",
  },
  {
    name: "INK_LABEL",
    variable: "--cruzar-ink-label",
    value: INK_LABEL,
    role: "Labels, eyebrows, table column headers only",
    warning: "Fails WCAG AA (3.3–3.5:1). Decorative / label-only — never body text.",
  },
  { name: "HAIRLINE", variable: "--cruzar-hairline", value: HAIRLINE, role: "1px dividers" },
  {
    name: "HAIRLINE_STRONG",
    variable: "--cruzar-hairline-strong",
    value: HAIRLINE_STRONG,
    role: "Section dividers in dense layouts",
  },
  {
    name: "ACCENT",
    variable: "--brand-accent",
    value: ACCENT,
    role: "Wordmark period, § markers, focus rings — surgical use only",
    warning: "Sub-AA on paper (~4.0–4.25:1). Never fill body text or backgrounds.",
  },
  {
    name: "SIGNAL",
    variable: "--brand-signal",
    value: SIGNAL,
    role: "Field-register operator contexts",
  },
  {
    name: "SIGNAL_DIM",
    variable: "--brand-signal-dim",
    value: SIGNAL_DIM,
    role: "Row highlights, status bands",
  },
];

const DARK_TOKENS: LightSwatch[] = [
  { name: "DARK_PAPER", variable: "--cruzar-paper", value: DARK_PAPER, role: "Dark background" },
  {
    name: "DARK_PAPER_DEEP",
    variable: "--cruzar-paper-deep",
    value: DARK_PAPER_DEEP,
    role: "Shelf surface on dark",
  },
  { name: "DARK_CARD", variable: "--cruzar-card", value: DARK_CARD, role: "Raised cards on dark" },
  { name: "DARK_INK", variable: "--cruzar-ink", value: DARK_INK, role: "Body text on dark" },
  {
    name: "DARK_INK_SOFT",
    variable: "--cruzar-ink-soft",
    value: DARK_INK_SOFT,
    role: "Secondary text on dark",
  },
  {
    name: "DARK_INK_LABEL",
    variable: "--cruzar-ink-label",
    value: DARK_INK_LABEL,
    role: "Labels on dark — same WCAG constraints",
  },
  {
    name: "DARK_HAIRLINE",
    variable: "--cruzar-hairline",
    value: DARK_HAIRLINE,
    role: "Dividers on dark",
  },
  {
    name: "ACCENT_DARK",
    variable: "--brand-accent",
    value: ACCENT_DARK,
    role: "Lifted accent — the light-mode ACCENT collapses on dark",
  },
];

const CHART_TOKENS = [
  { name: "CHART_1", role: "Terra · series anchor", value: CHART_1 },
  { name: "CHART_2", role: "Olive", value: CHART_2 },
  { name: "CHART_3", role: "Slate", value: CHART_3 },
  { name: "CHART_4", role: "Ochre", value: CHART_4 },
];

const TYPE_SCALE: { key: keyof typeof text; label: string }[] = [
  { key: "xs", label: "xs · 0.72rem" },
  { key: "sm", label: "sm · 0.88rem" },
  { key: "base", label: "base · 1rem" },
  { key: "lg", label: "lg · 1.25rem" },
  { key: "xl", label: "xl · 1.56rem" },
  { key: "2xl", label: "2xl · 1.95rem" },
  { key: "display3", label: "display3 · clamp" },
  { key: "display2", label: "display2 · clamp" },
  { key: "display1", label: "display1 · clamp" },
];

const SPACE_STEPS: { key: keyof typeof space; label: string }[] = [
  { key: 1, label: "space.1 · 4px" },
  { key: 2, label: "space.2 · 8px" },
  { key: 3, label: "space.3 · 12px" },
  { key: 4, label: "space.4 · 16px" },
  { key: 6, label: "space.6 · 24px" },
  { key: 8, label: "space.8 · 32px" },
  { key: 12, label: "space.12 · 48px" },
  { key: 16, label: "space.16 · 64px" },
  { key: 24, label: "space.24 · 96px" },
];

const RADIUS_SCALE = [
  { name: "sm", variable: "--radius-sm" },
  { name: "md", variable: "--radius-md" },
  { name: "lg", variable: "--radius-lg" },
  { name: "xl", variable: "--radius-xl" },
  { name: "2xl", variable: "--radius-2xl" },
  { name: "3xl", variable: "--radius-3xl" },
  { name: "4xl", variable: "--radius-4xl" },
];

function Eyebrow({ no, label }: { no: string; label: string }) {
  return (
    <div className="flex items-baseline gap-3 text-xs uppercase tracking-[0.18em] text-brand-ink-label font-sans">
      <span className="font-semibold text-[color:var(--brand-accent)]">§ {no}</span>
      <span className="h-px w-8 bg-brand-hairline" />
      <span>{label}</span>
    </div>
  );
}

function Swatch({ token }: { token: LightSwatch }) {
  return (
    <div className="flex flex-col gap-2 rounded-md ring-1 ring-border overflow-hidden bg-card">
      <div className="h-24 w-full" style={{ background: token.value }} />
      <div className="flex flex-col gap-1 p-3">
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-serif text-base font-medium">{token.name}</span>
          <code className="font-mono text-[0.7rem] text-muted-foreground">{token.variable}</code>
        </div>
        <div className="text-xs text-muted-foreground">{token.role}</div>
        <code className="font-mono text-[0.7rem] text-muted-foreground tabular-nums">
          {token.value}
        </code>
        {token.warning ? (
          <div className="mt-1 text-[0.7rem] text-destructive leading-snug">{token.warning}</div>
        ) : null}
      </div>
    </div>
  );
}

export default function FoundationsPage() {
  return (
    <div className="flex flex-col gap-16 px-6 py-8 lg:px-10">
      <header className="flex flex-col gap-3">
        <Eyebrow no="I" label="Foundations" />
        <h1 className="font-serif text-4xl font-normal tracking-tight">
          Cruzar<span className="text-[color:var(--brand-accent)]">.</span>{" "}
          <span className="text-brand-ink-soft">Design Tokens</span>
        </h1>
        <p className="max-w-prose text-brand-ink-soft">
          Every token rendered live from <code className="font-mono text-xs">@/lib/tokens</code>.
          Drift between this page and the code SSOT is impossible by construction.
        </p>
      </header>

      {/* LIGHT COLOR PALETTE */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="II" label="Color — Light" />
        <h2 className="font-serif text-2xl">11 light tokens on paper</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LIGHT_TOKENS.map((t) => (
            <Swatch key={t.name} token={t} />
          ))}
        </div>
        <Alert variant="destructive" className="mt-2">
          <AlertTitle>INK_LABEL fails WCAG AA</AlertTitle>
          <AlertDescription>
            Contrast on paper sits at 3.3–3.5:1. Sanctioned uses are eyebrows, footer metadata,
            hairline-rule captions, and mono table headers — never body text.
          </AlertDescription>
        </Alert>
      </section>

      <Separator />

      {/* DARK COLOR PALETTE */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="III" label="Color — Dark" />
        <h2 className="font-serif text-2xl">8 dark tokens, rendered on dark paper</h2>
        <div className="dark rounded-lg bg-brand-paper p-6 ring-1 ring-border">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DARK_TOKENS.map((t) => (
              <Swatch key={t.name} token={t} />
            ))}
          </div>
        </div>
      </section>

      <Separator />

      {/* CHART PALETTE */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="IV" label="Chart palette" />
        <div className="flex flex-col gap-2">
          <h2 className="font-serif text-2xl">CHART_1..4 — CVD-tested</h2>
          <p className="max-w-prose text-sm text-muted-foreground">
            Hues spread ≥45° apart at matched mid-lightness; verified distinguishable under
            deuteranopia / protanopia / tritanopia simulation.
          </p>
        </div>
        <div className="flex items-end gap-3 rounded-md bg-card p-6 ring-1 ring-border">
          {CHART_TOKENS.map((c, i) => (
            <div key={c.name} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-full rounded-sm"
                style={{ background: c.value, height: `${60 + i * 24}px` }}
              />
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-xs">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.role}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* TYPE STACK */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="V" label="Type stack" />
        <h2 className="font-serif text-2xl">Four families, two registers</h2>

        <div className="flex flex-col gap-2 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <span className="font-serif text-lg font-semibold">Literata</span>
            <span className="font-mono text-xs text-muted-foreground">display · font-serif</span>
          </div>
          <div className="flex flex-col gap-4 pt-2">
            <div className="font-serif text-6xl font-light tracking-tight leading-none">
              {WORDMARK.text}
              <span className="text-[color:var(--brand-accent)]">{WORDMARK.terminal}</span>
            </div>
            <div className="font-serif text-3xl">Cross from local pay to USD pay.</div>
            <div className="font-serif text-lg italic text-brand-ink-soft">
              Editorial voice, x-height holds at 12px.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <span className="font-sans text-lg font-semibold">Funnel Sans</span>
            <span className="font-mono text-xs text-muted-foreground">body · font-sans</span>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <div className="font-sans text-2xl font-semibold">Accountable by construction.</div>
            <div className="font-sans text-base">
              Diagnosis, real-scenario validation, and autonomous applications to international
              remote jobs.
            </div>
            <div className="font-sans text-sm text-brand-ink-soft">
              Institucional, verificable, medible — we price on outcomes, never on promises.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <span className="font-sans-dense text-lg font-semibold">Geologica</span>
            <span className="font-mono text-xs text-muted-foreground">
              bodyDense · font-sans-dense
            </span>
          </div>
          <div className="flex flex-col gap-3 pt-2">
            <div className="font-sans-dense text-xl font-medium">
              Operator register — instrument-panel voice.
            </div>
            <div className="font-sans-dense text-base">
              Denser than Funnel Sans. Used for CV templates, operator dashboards, and internal
              field surfaces.
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 rounded-md bg-card p-6 ring-1 ring-border">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <span className="font-mono text-lg font-semibold">Geist Mono</span>
            <span className="font-mono text-xs text-muted-foreground">mono · font-mono</span>
          </div>
          <div className="flex flex-col gap-2 pt-2 font-mono tabular-nums">
            <div className="text-base">0 1 2 3 4 5 6 7 8 9</div>
            <div className="text-sm">$2,840 · 4.1× · +USD 2,680/mo</div>
            <div className="text-xs text-brand-ink-soft">
              [2026-04-15 14:02Z] placement verified · offer letter on file
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* SPACING SCALE */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="VI" label="Spacing — 4pt scale" />
        <h2 className="font-serif text-2xl">Nine semantic steps</h2>
        <div className="flex flex-col gap-3 rounded-md bg-card p-6 ring-1 ring-border">
          {SPACE_STEPS.map((s) => (
            <div key={s.key} className="grid grid-cols-[180px_1fr] items-center gap-4">
              <div className="font-mono text-xs tabular-nums">{s.label}</div>
              <div
                className="h-3 rounded-sm bg-[color:var(--brand-signal)]"
                style={{ width: space[s.key] }}
              />
            </div>
          ))}
        </div>
      </section>

      <Separator />

      {/* TYPE SCALE */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="VII" label="Type scale" />
        <h2 className="font-serif text-2xl">Modular scale · ratio ~1.25</h2>
        <div className="flex flex-col gap-5 rounded-md bg-card p-6 ring-1 ring-border">
          {TYPE_SCALE.map((s) => {
            const isDisplay = s.key.toString().startsWith("display");
            return (
              <div
                key={s.key}
                className="grid grid-cols-[180px_1fr] items-baseline gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0"
              >
                <div className="font-mono text-xs text-muted-foreground tabular-nums">
                  {s.label}
                </div>
                <div
                  className={isDisplay ? "font-serif leading-[1.05]" : "font-sans"}
                  style={{ fontSize: text[s.key] }}
                >
                  {isDisplay
                    ? "Cruzar del salario local al salario global"
                    : "The quick brown fox jumps over the lazy dog"}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <Separator />

      {/* RADIUS */}
      <section className="flex flex-col gap-5">
        <Eyebrow no="VIII" label="Radius scale" />
        <h2 className="font-serif text-2xl">shadcn radii, Cruzar-derived</h2>
        <div className="flex flex-wrap items-end gap-6 rounded-md bg-card p-6 ring-1 ring-border">
          {RADIUS_SCALE.map((r) => (
            <div key={r.name} className="flex flex-col items-center gap-2">
              <div
                className="size-20 bg-[color:var(--cruzar-paper-deep)] ring-1 ring-border"
                style={{ borderRadius: `var(${r.variable})` }}
              />
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-mono text-xs">{r.name}</span>
                <span className="font-mono text-[0.65rem] text-muted-foreground">{r.variable}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
