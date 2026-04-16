# ADR-09 — `profile_md` is the per-student SSOT; CVs generated dynamically

**Status:** Accepted — supersedes [ADR-06](./06-cv-markdown-persisted.md)
**Date:** 2026-04-15
**Owner:** Enrique

## Context

ADR-06 treated the generated **master CV** as the durable artifact: `profiles.cv_markdown` + `cv_version` held the authoritative rendering of a student, and every per-JD tailoring derived from it.

In practice a CV is a *projection* of a student, filtered through a JD. Two JDs deserve meaningfully different CVs because they weight different stories. Persisting a single master CV as the source-of-truth forces a lossy collapse: either the master is generic (and every tailoring re-invents the content) or it is over-fit to one flavour of role (and every tailoring fights it). Both modes waste the richest signal the product collects — the raw stories, skills, evaluations, and operator notes captured over the intake + assessment + review loops.

The richer SSOT is a single narrative document per student — `profile_md` — that holds *everything worth knowing* (background, stories, skills, preferences, findings, plan context, operator anecdotes). CVs become what they always were: per-purpose derivations rendered on demand from `profile_md` + the target (JD, showcase, partner).

## Decision

1. **`profile_md` is the SSOT per student.** Column on `profiles`: `profile_md text NOT NULL`. Populated by the assessment pipeline (Flow C). Evergreen — intake answers + assessment findings + Miura notes merge into this document over the student's lifecycle. Versioned via `profile_md_version` (monotonic integer) + `profile_md_generated_at timestamp`. `prompt_version text` captures which synthesis prompt produced the current content.

2. **No master `cv_markdown` on `profiles`.** The old columns `cv_markdown`, `cv_r2_key`, `cv_version`, `generated_at` are removed. Any CV that exists on disk is the result of an explicit render, never the canonical form of the student.

3. **Per-JD CVs stay on `generated_cvs`.** Shape unchanged from ADR-06: `{ id, student_id, application_id, cv_markdown, cv_r2_key, version, created_at }`. The derivation input is now `profile_md` (at the `profile_md_version` the generation read), not a persisted master CV. `generated_cvs` remains append-only for audit.

4. **Public profile shows `profile_md`, not a CV.** Flow 3 (`/p/<slug>`) renders the profile document directly — a more honest public artifact than a CV the student never wrote. For LinkedIn-previewable link sharing, `profiles.showcase_cv_r2_key text` (nullable) holds a pre-rendered canonical CV PDF generated once when a student first toggles `consent_public_profile = true`; invalidated + regenerated when `profile_md` changes.

5. **Raw intake survives.** `intake_batch_answers` remains untouched — the raw Q/A history is the audit trail behind the synthesised `profile_md` and must not be lost.

## Alternatives considered

- **Keep master `cv_markdown` + add `profile_md` alongside.** Rejected per SSOT — two sources claiming to describe the student decay the moment they disagree.
- **`profile_md` stored in R2 only.** Rejected per operator ergonomics — every profile read becomes an R2 fetch. A text column is cheap; keep it inline.
- **Per-JD CVs derived fresh from `intake_batch_answers`.** Rejected per prompt cost + drift — answers are raw and low-density; `profile_md` is the curated, prompt-efficient derivation that every CV starts from.
- **Version table (`profile_md_versions`).** Deferred. Current scheme (single row + monotonic version int) is enough until we need diff-per-change — surface if Phase 1 introduces self-service edits.

## Consequences

Positive:
- **LLM context is richer.** CV generation prompts see a curated narrative per student, not a 40-row Q/A shred. CV quality rises at no extra infra cost.
- **One canonical document per student.** Miura edits one file; every downstream derivation reflects the change.
- **Public profile is honest.** `/p/<slug>` renders what the student actually is, not a generic CV template.
- **Simpler data model.** Three fewer columns on `profiles`; the compound relationship between master CV and per-JD CV dissolves.
- **Prompt evolution is a single axis.** A new synthesis prompt bumps `prompt_version` and `profile_md_version` together.

Negative:
- **Synthesis cost.** Assessment pipeline gains one LLM call (intake + findings → `profile_md`). Budget: ~$0.10 per student per assessment. Negligible at MVP 0 scale.
- **Per-JD CV generation always pays the tailoring cost.** No master-CV shortcut. Budget: same as before (the master was already re-read every tailoring).
- **Showcase CV caching must invalidate on `profile_md` change.** New invariant: on `profile_md` UPDATE, if `showcase_cv_r2_key` is set, enqueue a regeneration (or clear the key and regenerate on next public view).
- **Grep-by-skill becomes full-text.** A column called `skills_jsonb` no longer exists on the profile side. Operator queries that used to be `skills_jsonb @> 'python'` become `profile_md ILIKE '%python%'` or a Postgres FTS index. `roles.skills_jsonb` is unaffected.

## Sunset criteria

Revisit when:

- `profile_md` grows past ~100 KB per student (move to R2 with a text preview column).
- Self-service student edits introduce concurrent-write contention (add `profile_md_versions` audit table).
- FTS over `profile_md` becomes too slow for operator queries at >1k students (add structured metadata alongside).

## Migration from ADR-06

ADR-06 is marked **Superseded**. No data migration is required — ADR-06 was accepted on the same day as this ADR, before any production `profiles` rows existed. Schema work that landed under ADR-06 (`cv_markdown`, `cv_r2_key`, `cv_version`, `generated_at` on `profiles`) is unwound in the same M1 diff that introduces `profile_md`.
