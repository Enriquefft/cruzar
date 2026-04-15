# apps/brand — conventions

Internal-only Next 16 app for exploring and locking in Cruzar's visual identity. Not deployed publicly. Once a direction is picked, the chosen tokens, fonts, and primitives become the SSOT consumed by `apps/web`, `apps/career-ops`, and any future surface.

Stacks on top of `../../CLAUDE.md` (repo) and `../CLAUDE.md` (apps).

## Purpose

- Render multiple complete brand directions side-by-side as real interfaces (not flat mockups).
- Capture screenshots reproducibly via `bun run screenshot`.
- Iterate with the impeccable / critique skills until one direction wins.

## Hard rules

1. **One file per direction** under `app/direction/<slug>/page.tsx`. Self-contained — no shared component imports between directions. Each direction is a complete aesthetic statement.
2. **Same content, different language.** All directions render the facts exported from `lib/content.ts`. If you need new content, add it there once — never duplicate inline.
3. **Inline styles or scoped Tailwind, not global tokens.** Until a direction is picked, there is no global token system. Each direction owns its visual choices in full.
4. **No fonts from the impeccable reflex-reject list.** See `.impeccable.md` design context. Pick something the user will actually be surprised by.
5. **Bilingual-tolerant.** Every layout must accommodate Spanish (longer) and English (shorter) without breaking. Test with both `taglineEs` and `taglineEn`.

## Promotion path

When a direction is approved:
1. Extract its tokens (color, type, scale, radii, motion) into a real shared module.
2. Decide where it lives — likely `lib/brand/` inside this app, exported as a workspace dependency.
3. Update `apps/web/app/globals.css` to consume those tokens.
4. Migrate other apps. Delete the unused direction routes from this app, or keep them archived under `app/direction/_archive/`.

## Commands

- `bun run dev` — port 3100
- `bun run screenshot` — captures `/`, `/direction/editorial`, `/direction/field-report`, `/direction/muralist` at desktop + mobile
- `bun run typecheck` — must be green before commit
- `bun run format` — Biome
