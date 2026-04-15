# apps/web — conventions

@AGENTS.md

This file scopes to `apps/web`. It stacks on top of `../../CLAUDE.md` (repo root engineering principles) and `./AGENTS.md` (Next 16 breaking-change notice). It does not repeat them.

SSOT for build work is [`product/cruzar/architecture.md`](../../product/cruzar/architecture.md) + [`product/cruzar/roadmap.md`](../../product/cruzar/roadmap.md). Every session reads those first.

---

## Next 16 reminder

Next 16 is not the Next you know. Before writing any route code, read `node_modules/next/dist/docs/` for the exact API. Heed deprecation notices. Examples:

- Caching defaults changed.
- `revalidate` exports may have new shapes.
- Async APIs that used to be sync may have flipped.

Do not guess from Next 15 knowledge. Read the current docs.

---

## Hard rules (enforced by typecheck or review)

1. **Zod is SSOT.** Every entity has exactly one Zod schema under `schemas/`. Drizzle tables in `db/schema.ts` derive types from the Zod schema. TypeScript types use `z.infer`. Never duplicate.
2. **Never `any`.** Use `unknown` + narrowing, generics, or an explicit type.
3. **Never `as` casting.** `as const` is allowed. Everything else uses type guards, Zod parses, or structural fixes. If a third-party type is wrong, file a patch or add a typed wrapper — do not cast around it.
4. **Every LLM structured output is Zod-validated.** One retry on validation fail. Then an honest error + Sentry. No silent `JSON.parse`.
5. **Every mutation is typed.** Student-side: server actions with Zod-validated input. Operator-side: scripts under `../operator-scripts/` with Zod-validated I/O.
6. **Prefer server actions over API routes.** API routes only for third-party webhooks and presigned-URL handoffs.
7. **Idempotency keys are the ones in Architecture.** `applications` on `(student_id, company_normalized, role_normalized, job_url)`. `intake_batches` on `(intake_id, batch_num)`. Never invent new keys without updating Architecture.
8. **PII never logs.** No `email`, `name`, `whatsapp`, `local_salary_usd`, `attestation_r2_key` in Sentry breadcrumbs, stdout, or any log line. IDs only.
9. **No abstractions without a second caller.** Three similar lines are fine. Wait until there are three real callers before extracting a helper.
10. **No comments explaining what.** Identifiers do that. Comments only for hidden invariants or non-obvious constraints.

---

## Directory layout

```
apps/web/
├── app/             Next App Router routes
│   ├── (public)/    landing, /p/<slug>
│   ├── onboarding/
│   ├── profile/
│   ├── status/
│   └── api/         auth + webhooks only
├── db/              Drizzle schema, migrations, client
├── schemas/         Zod schemas (SSOT)
├── lib/             domain helpers: auth, r2, llm, cefr-map, prompts/, counter, env
├── components/      shadcn/ui + ours
└── public/          static assets
```

- **schemas/** is read by both `db/schema.ts` (to derive tables) and every server action (to validate input). It is the one file to change when a contract changes.
- **lib/prompts/** holds every Claude prompt as a typed string constant + Zod output schema. Prompt version stamped on each export.

---

## Working a block from the Roadmap

1. Paste the block's CC prompt template into the session.
2. Read the referenced Architecture section(s) + ADR(s).
3. Read the files listed in the block before writing new ones.
4. Write + `bun run typecheck`.
5. Tick the block status in `product/cruzar/roadmap.md`.
6. Commit with a message naming the block (`M3: landing + ISR counter`).

If the block cannot land in one session + 50% slack, escalate per `roadmap.md §Escalation rules`.

---

## Deps worth knowing

- `drizzle-orm` + `drizzle-kit` — run migrations via `bun run db:generate` then `bun run db:push`.
- `better-auth` — email + magic link. Handler at `app/api/auth/[...all]/route.ts`. Config in `lib/auth.ts`.
- LLM access via `lib/llm.ts` (fetch → Z.ai OpenAI-compatible API). Two tiers: strong (`AI_STRONG_MODEL`) + weak (`AI_WEAK_MODEL`).
- `@vercel/og` — available for future OG runtime (not wired in MVP 0).
- `resend` — transactional email from `hello@cruzar.io`.
- `postgres` — Neon driver used by Drizzle.
- `@biomejs/biome` — lint + format. `bun run format`.
- `zod` — v4 API. Use `z.infer<typeof X>` for types, `X.parse(...)` for validation.

---

## Commands

- `bun run dev` — Next dev server
- `bun run build` — production build
- `bun run typecheck` — `tsc --noEmit`, must be green
- `bun run lint` — ESLint (Next's eslint-config-next)
- `bun run format` — Biome format
- `bun run db:generate` — Drizzle kit: generate migrations from schema
- `bun run db:migrate` — apply migrations
- `bun run db:push` — push schema to Neon (dev only)
- `bun run db:studio` — Drizzle Studio
- `bun run db:seed` — insert the 10-role catalog (idempotent on `roles.title`); never auto-runs

Typecheck + format must be green before any commit. `lefthook.yml` enforces it at the repo root.

---

## Manual verification (M1)

Env-gated smoke tests for the M1 block. Run after `.env` is populated:

1. `bun run db:push` — applies the initial migration to Neon. Verify the 16 tables and all enums land (16 = 4 Better Auth + 12 app).
2. `bun run db:seed` — inserts the 10-role catalog. Second run should print `Seeded 0 new role rows` (idempotent on `roles.title`).
3. `bun run dev` + magic-link round trip — POST `/api/auth/sign-in/magic-link` with a real email, click the link from Resend, land authenticated. First link must hit the Primary inbox on an external Gmail (DKIM/SPF/DMARC must be green before this test).
