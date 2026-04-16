# ADR-07 — English verified via external cert pre-required; no in-product assessment in MVP 0

**Status:** Accepted
**Date:** 2026-04-15
**Owner:** Enrique

## Context

U0 target roles are voice-first remote jobs (SDR, customer support, account management, executive assistant, digital marketing junior). CEFR B2+ is a hard prerequisite. Earlier MVP 0 drafts specified an in-product English assessment: 5 spoken Deepgram-streamed questions + Claude CEFR rubric scoring + optional written proxy.

The U0 persona explicitly sources from "alumno Aprendly actual" with "CEFR B2+ verificable (via diagnostic Cruzar o evaluación Aprendly reciente)." Aprendly already runs voice-based English evaluation on its students. The first cohort arrives pre-validated.

Building an in-product CEFR assessment costs:

- Deepgram account + streaming STT plumbing
- MediaRecorder + iOS Safari fallback (`audio/mp4` vs `audio/webm`)
- R2 audio upload + re-record UX + countdown timer
- Claude CEFR rubric prompt (vocab, grammar, coherence, task achievement) + Zod validation
- CEFR eval harness with reference audio + ground-truth scoring + CI gate (credibility floor)

Rough cost: 5–8h on the student-facing side alone, plus ongoing prompt maintenance and eval harness.

## Decision

Students must present a verifiable B2+ English certification at onboarding. Accepted kinds:

- IELTS (5.5+)
- TOEFL iBT (72+)
- Cambridge (FCE / CAE / CPE)
- Aprendly internal evaluation (recent)
- Other institutional certifications (manually reviewed)

Capture model (`english_certs` table):

```
id, student_id, kind, score (raw), level (A2/B1/B2/C1/C2), issued_at, attestation_r2_key, verified
```

Student uploads an attestation (screenshot or PDF of the cert) to R2 at onboarding. Miura verifies during `/cruzar onboard`; `verified = true` flips once the attestation matches the claimed score.

Score-to-CEFR mapping lives in a typed file (`cefr_map.ts`) and is documented — not inferred by Claude per-student.

Below-B2 students are blocked at onboarding with a clear message explaining the requirement.

No in-product voice or written English assessment in MVP 0.

## Alternatives considered

- **In-product voice assessment.** Rejected per cost at 5 users. The Aprendly pre-filter already solves validation. Miura can do a 2-minute WhatsApp voice-note exchange with any student whose cert is ambiguous — zero infra, higher premium feel.
- **Written English proxy (score the intake batches).** Rejected per signal quality — written English doesn't validate the oral fluency voice-first roles need, and WhatsApp-typed responses are not uniformly the student's unassisted writing.
- **Accept self-reported CEFR without attestation.** Rejected per brand risk. Cruzar's entire pitch depends on the profile claims being true.

## Consequences

Positive:
- Saves 5–8h in MVP 0.
- Validation is externalized to institutions whose job it is (IELTS, Cambridge, Aprendly).
- Onboarding is shorter; reduces drop-off.
- Attestation is durable evidence on the student row; defensible to universities + employers.

Negative:
- Students without a recent cert are blocked from the MVP 0 cohort. Acceptable — Aprendly sourcing solves this. Non-Aprendly students who lack a cert get pointed to free IELTS prep or to Aprendly itself.
- Mapping table is one more thing to maintain. Small; stable; low-risk.
- If an institution's cert turns out to be unreliable, Cruzar has no second-line validation. Mitigation: `/cruzar onboard` requires Miura's explicit verification flip; if Miura hears a C1-claimed student speaking at B1 level on the WhatsApp voice-note exchange, the onboarding pauses.

## Sunset criteria

Revisit when:

- Cohort sources expand beyond Aprendly and cert availability becomes the bottleneck (likely during Phase 1 continuation when universities channel students directly).
- A high-signal in-product voice assessment becomes a product differentiator (scenario simulation → CEFR inference as a side effect).

On sunset, the in-product voice assessment from the earlier draft comes back — now with a real eval harness and a real operational justification.
