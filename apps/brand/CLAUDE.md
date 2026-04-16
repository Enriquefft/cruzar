# apps/brand — conventions

Next 16 workspace that owns Cruzar's visual identity — brand tokens, fonts, content strings, and every shadcn primitive consumed by the rest of the monorepo. Published as `@cruzar/brand` via workspace protocol. No public deployment; it hosts the `/brand/*` studies (Capa 1-5 decisions) and the navigable `/system/*` design-system showcase.

Stacks on top of `../../CLAUDE.md` (repo) and `../CLAUDE.md` (apps).

## Hard rules

1. **Tokens are SSOT in [`lib/tokens.ts`](./lib/tokens.ts).** The CSS variables in [`app/globals.css`](./app/globals.css) mirror them — if you change a value, change both in the same edit. Both files carry a header comment documenting this contract. Never introduce a color, radius, space, or type-scale value inline in a component; add it to `tokens.ts` first and reference it (or its CSS variable) everywhere else.
2. **Fonts are SSOT in [`lib/fonts.ts`](./lib/fonts.ts).** The four CSS-variable strings (`--cruzar-display`, `--cruzar-body`, `--cruzar-body-dense`, `--cruzar-mono`) must match the `CSS_VAR` entries in `tokens.ts`. `next/font/google` requires literal string options (subsets, weights, styles) for build-time extraction — they cannot be derived from `tokens.ts`. That constraint is documented at the top of both files and is the only sanctioned duplication in the workspace.
3. **shadcn primitives are SSOT in [`components/ui/`](./components/ui/).** Never re-add a shadcn component to another workspace's local `components/ui/`. Consuming apps always import from `@cruzar/brand/ui` (or `@cruzar/brand/ui/<name>` for single-primitive imports). No consumer workspace contains a `components.json` of its own.
4. **Brand-locked decisions (Capa 1-5)** are documented and must not be reinterpreted elsewhere:
   - [`app/brand/logotype-studies/page.tsx`](./app/brand/logotype-studies/page.tsx) — Capa 1 (wordmark, clear space, minimum sizes, halo-zone ban).
   - [`app/brand/type-studies/page.tsx`](./app/brand/type-studies/page.tsx) — Capa 2 (four-role type stack: Literata / Funnel Sans / Geologica / Geist Mono).
   - [`app/brand/color-studies/page.tsx`](./app/brand/color-studies/page.tsx) — Capa 3 (light + dark tokens, WCAG matrix, CVD-tested chart palette).
   - [`../../product/cruzar/brand-voice.md`](../../product/cruzar/brand-voice.md) — voice register.
   - [`../../product/cruzar/brand-guidelines.md`](../../product/cruzar/brand-guidelines.md) — consolidated guide (tokens, color, type, layout, charts, promotion).
5. **Design-system showcase at `/system/*` is the live reference for every primitive.** When proposing a new pattern — new variant, new composition, new register — validate it against the showcase first. If a primitive is missing from `/system/*`, it is not shippable; add a showcase block in the same PR that adds the primitive.

## Consumption from other workspaces

`@cruzar/brand` is wired as a workspace dependency. Step-by-step integration:

```jsonc
// apps/<consumer>/package.json
{
  "dependencies": {
    "@cruzar/brand": "workspace:*"
  }
}
```

```ts
// apps/<consumer>/app/layout.tsx (or equivalent root entry)
import "@cruzar/brand/globals.css";
import { fontVariables } from "@cruzar/brand/fonts";
import { cn } from "@cruzar/brand/cn";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cn(fontVariables)}>
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// apps/<consumer>/app/some-route/page.tsx
import { Button, Card, CardContent, CardHeader, CardTitle } from "@cruzar/brand/ui";
import { PAPER, INK, ACCENT } from "@cruzar/brand/tokens";
```

The package exports map (`apps/brand/package.json`):

| Subpath | Source | Use |
| --- | --- | --- |
| `@cruzar/brand/tokens` | `lib/tokens.ts` | Color, type-scale, space, radii, mark |
| `@cruzar/brand/fonts` | `lib/fonts.ts` | `next/font/google` configs + `fontVariables` |
| `@cruzar/brand/content` | `lib/content.ts` | Brand copy (name, tagline, promise, proof, pricing) |
| `@cruzar/brand/ui` | `components/ui/index.ts` | All shadcn primitives (barrel) |
| `@cruzar/brand/ui/*` | `components/ui/*.tsx` | Single-primitive import (tree-shake friendly) |
| `@cruzar/brand/cn` | `lib/utils.ts` | `cn` helper (clsx + tailwind-merge) |
| `@cruzar/brand/globals.css` | `app/globals.css` | CSS bridge: tokens → CSS vars → shadcn semantic names |

After changing any exports, run `bun install` from the repo root to refresh workspace symlinks.

## Banned patterns (review-rejecting)

Any of these in a PR is a blocker. Reviewer rejects; author fixes before re-request.

1. **Re-adding shadcn primitives to a non-brand workspace.** No `components.json`, no `bunx shadcn add` outside `apps/brand/`. Always import from `@cruzar/brand/ui`.
2. **Inline brand color values in any consuming file.** `color: "oklch(0.18 ...)"`, `background: "#f6f1e5"`, `border-color: "var(--brand-accent)"` where `--brand-accent` is declared locally — all banned. Import the token: `import { INK } from "@cruzar/brand/tokens"`.
3. **`className` overrides changing a primitive's color or typography.** Only layout overrides (`flex`, `grid`, `gap-*`, `w-*`, `p-*`, etc.) are permitted on primitives. Changing color, font-family, or text size via `className` on a shadcn primitive is banned — introduce a variant in the primitive instead.
4. **`border-left:` / `border-right:` > 1px as a colored stripe.** Absolute ban per [`SKILL.md#absolute_bans`](../../.claude/skills/impeccable/SKILL.md). Applies to cards, list items, callouts, alerts. Hairlines only (`1px solid HAIRLINE` or `HAIRLINE_STRONG`).
5. **Adding `--font-*` CSS variables other than the four locked ones** (`--cruzar-display`, `--cruzar-body`, `--cruzar-body-dense`, `--cruzar-mono`). The four-role stack is closed; new roles require a documented Capa extension in `brand-guidelines.md` before any CSS change.

## Adding a new primitive

```bash
cd apps/brand
bunx --bun shadcn@latest add <component>
# 1. Verify the token bridge: open /system/<category> in dev and confirm no
#    greyscale leak (no oklch() values outside globals.css, no bg-slate-*, etc.).
# 2. Add a showcase block to the appropriate /system page so the primitive is
#    visible in the live reference.
# 3. Append the export line to components/ui/index.ts (alphabetical).
# 4. Run `bun run typecheck` and `bun run screenshot`; attach the screenshot.
```

If a newly-added primitive uses a default export or an icon from a non-`lucide-react` set, normalize it before committing: switch to a named export, swap the icon to `lucide-react`. Never suppress mismatches with `@ts-ignore`.

## Per-register usage

The two visual registers — `editorial` (marketing, deck, long-form prose) and `field` (operator dashboards, CV, data tables) — are **context**, not separate primitives. The same `<Button>`, `<Card>`, `<Badge>` renders correctly in both. Choose the register by the three knobs below; never fork a primitive.

1. **Font on the parent.** `font-serif` (Literata) drives editorial; `font-mono` (Geist Mono) or `font-sans-dense` (Geologica) drives field. Primitives inherit from the parent.
2. **Accent budget.** Editorial: `ACCENT` is rare — wordmark + at most one § section marker per surface (B.3). Field: `ACCENT` is not used; `SIGNAL` appears surgically in status dots, lead metric, highlighted column header (≤3 instances; `SIGNAL_DIM` row tints don't count).
3. **Layout density.** Editorial allows asymmetric compositions, wide measure, generous whitespace (`space.12`+). Field uses hairline grids, tight rhythms, `space.3`/`space.4` cell gaps, tabular-nums always on.

If a design needs to behave differently in the two registers, the difference belongs in the parent context (font, color token, layout), not in a primitive fork.

## Promotion path (how brand changes reach consumers)

1. Make the change in `lib/tokens.ts`, `lib/fonts.ts`, `lib/content.ts`, or `components/ui/<name>.tsx` — whichever is canonical.
2. Update the mirrored CSS in `app/globals.css` if a token changed. Both files' header comments call out this linkage.
3. If it's a new primitive: append to `components/ui/index.ts` and add a showcase block under `app/system/*`.
4. Run `bun run typecheck` and `bun run screenshot`. Both must be green.
5. Commit. No consumer-side action is required — workspace symlinks pick up the change on next dev/build.
6. In the same PR, grep the monorepo for any consumer code that had been working around the pre-change behavior (inline hex, local re-implementations). Delete the workarounds; a workaround shipped is a workaround owned forever.

## Patterns layer

Lives in [`components/patterns/`](./components/patterns/), exported as
`@cruzar/brand/patterns` (barrel) and `@cruzar/brand/patterns/<Name>`
(single-pattern import). The layer sits **between** raw shadcn primitives
(`components/ui/`, exported as `@cruzar/brand/ui`) and full pages
(`apps/web/app/*`, deck slides, CV templates).

### What patterns are vs primitives

- **Primitives** (`components/ui/`) are generic: `Button`, `Card`, `Badge`,
  `Table`. They know nothing about Cruzar's domain — they could ship in any
  shadcn project. They consume tokens but never product knowledge.
- **Patterns** (`components/patterns/`) are Cruzar-specific compositions
  that encode product knowledge: what the six placement statuses are and
  how each looks (`PlacementStatusBadge`), how the wordmark is rendered
  per the Capa 1 lock (`WordmarkHeading`), what a CV masthead must include
  (`CvHeaderBlock`). They compose primitives + tokens; they NEVER reach
  for raw HTML where a primitive exists.

A pattern is the right answer when consuming surfaces would otherwise
copy the same composition into 2+ places. If the shape only exists once,
it stays inline in that surface until repetition forces extraction.

### How to add a new pattern

1. Confirm the composition isn't already a primitive. If you find yourself
   wanting to add a new shadcn component, run `bunx --bun shadcn@latest add <name>`
   first — patterns compose primitives, they don't replace them.
2. Create `components/patterns/<PatternName>.tsx` with a single named
   export plus its props type. The props type must be strongly typed
   (no `any`, no string magic). Domain-entity types (`PlacementStatus`)
   should be declared in the pattern file and re-exported from the barrel.
3. Tokens, not raw values. Color via the `text-brand-*` / `bg-brand-*`
   utilities (token bridge), font via `font-serif` / `font-sans-dense` /
   `font-mono` / `font-sans`. Use `var(--brand-accent)` and
   `var(--brand-signal)` only via inline `style` for the surgical accent
   marks (period, status dots) — never the body of the pattern.
4. Per-register awareness: if the pattern's layout legitimately differs
   between editorial and field, expose `register?: "editorial" | "field"`
   with a sensible default. If the pattern works identically across
   registers (it just inherits the parent's font), do NOT add the prop —
   the register lives on the parent.
5. Append the `export *` line to `components/patterns/index.ts`
   (alphabetical).
6. Add a `<PatternBlock>` in `app/system/patterns/page.tsx` with the
   rendered output, a one-paragraph description, and the props signature
   as code.
7. Re-capture `screenshots/system-patterns.png` via
   `bun run scripts/screenshot-patterns.ts` and run `bun run typecheck`.

### When a pattern should become a primitive

Promote a composition out of `patterns/` and into `components/ui/` only
when **all three** are true:

1. **≥3 patterns share the same internal composition**, identically.
2. The composition is **generic enough to live in shadcn upstream** —
   no Cruzar-specific copy, no domain-entity props, no brand-locked
   visual treatment.
3. Adding it as a primitive **does not duplicate** an existing shadcn
   component (search the registry first; `bunx --bun shadcn@latest search`).

If only one or two patterns share the composition, it stays a private
helper inside the pattern file. Premature primitive promotion bloats the
public `@cruzar/brand/ui` surface and entangles the design system with
product semantics — the exact coupling patterns exist to prevent.

## Commands

- `bun run dev` — port 3100 (studies + `/system/*` showcase).
- `bun run screenshot` — captures `/`, the `/brand/*` studies, and key `/system/*` routes at desktop + mobile.
- `bun run typecheck` — must be green before commit.
- `bun run format` — Biome.
