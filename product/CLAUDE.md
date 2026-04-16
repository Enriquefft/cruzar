# product/

Per-product spec, scope, MSP, UX decisions, product-scoped meetings. One subdir per product (`product/cruzar/`, future products get their own).

## Rules

- **Product-scoped only.** Captable, partnerships, team, org-level strategy belong in `company/`, not here. If the fact applies to the company regardless of which product it is, it is misfiled.
- **Shared tooling or research across products stays out.** Multi-product concerns go in `business/research/` (shared research) or a dedicated `apps/<shared-workspace>/` (shared code).
- **Spec is what, not how.** Implementation details (stack choices, schema design) live with the code in `apps/` when it lands. This folder defines the product; it doesn't build it.

## File choice

- New product → create `product/<product>/` with `definition.md` at minimum.
- Feature spec inside an existing product → section in `definition.md` unless it warrants its own file (independent lifecycle, owned separately).
- Product-scoped meeting → `<product>/meetings/YYYY-MM-DD-<slug>.md`.
