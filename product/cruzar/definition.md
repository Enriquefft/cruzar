# Cruzar — Product Definition (Shape 1)

**Date:** 2026-04-14
**Status:** Active

---

## One Paragraph

Cruzar is an AI system that takes a university's students from enrollment to international job placement. It diagnoses each student in 15 minutes (English level, role fit, soft skills, gaps). It validates them through realistic AI-powered work scenario simulations where the student interacts with a hyper-realistic AI person (prospect, client, stakeholder) and a separate evaluator agent scores their performance. It applies to matched international jobs on their behalf at volume. It gives the university a live dashboard tracking every student from diagnosis to placement. The university buys outcomes; Cruzar delivers them end to end.

---

## Four Pillars

### Pillar 1: Diagnose

**What it does:** Takes a student from "unknown" to "calibrated profile with a concrete international career path."

**Inputs:**
- Structured questionnaire (LLM-driven, conversational)
- Spoken English assessment (5 questions, browser microphone)

**Outputs (Readiness Profile):**
- CEFR English level (B1/B2/C1) with confidence score
- Top 3 role matches from catalog with compensation ranges
- Soft skills baseline indicators (from structured responses)
- Readiness verdict
- Named gaps (skills, English, experience, certifications)
- Salary delta: local vs. international
- Recommended next actions

### Pillar 2: Validate & Prepare

**Two modes:**

#### Mode 1: Interview Practice
- AI voice interviewer conducts adaptive job interview for a target role
- Standard interview questions + context-aware follow-ups
- Produces feedback report: scores, strengths, gaps, practice plan
- Purpose: prepare the candidate for real interviews

#### Mode 2: Scenario Simulation (the differentiator)
- AI agent plays a hyper-realistic person in a work scenario relevant to the target role
- The simulated person has personality, quirks, flaws, emotional reactions, human errors
- Candidate interacts naturally (cold call a prospect, handle a frustrated customer, manage a stakeholder)
- Separate evaluator agent scores the interaction on soft skills:
  - Communication (clarity, structure, active listening)
  - Problem-solving (reasoning, adaptability to unexpected situations)
  - Persuasion/influence (for sales-adjacent roles)
  - Empathy and emotional intelligence
  - Composure under pressure
  - Leadership signals (initiative, conviction)
- Produces a **Behavioral Credential:** scored soft skills profile from realistic performance, not self-reported traits

**Why this matters:**
- Traditional soft skills assessment: psychometric games (Pymetrics) or video analysis (HireVue). Passive. Artificial. Employer-side.
- Cruzar's approach: put the candidate IN the job. Active. Realistic. Observable. Supply-side credential.
- The differentiator is the combination: CEFR + role readiness + soft skills from a single voice session, candidate-owned, portable. Nobody does all three together.
- MSP realism (~60-70% via conversation-aware prompting) matches sales training competitors (Hyperbound, Second Nature). The moat extension — cognitive architecture for 85%+ realism — is 2+ months of R&D, post-traction.

**Scenario examples by niche:**

| Niche | Scenario | AI Plays | Evaluates |
|---|---|---|---|
| SDR/BDR | Cold call | Skeptical prospect with real objections | Objection handling, rapport, persistence |
| Customer Support | Escalation | Frustrated customer, partially unreasonable | De-escalation, empathy, problem-solving |
| Ops/PM | Stakeholder alignment | Exec who keeps changing priorities | Communication, adaptability, leadership |
| Account Management | Renewal at risk | Client considering churn | Relationship building, strategic thinking |

### Pillar 3: Place

**What it does:** Gets validated candidates into real international jobs.

**How:**
1. System generates CV from diagnostic profile data
2. Autonomous application to matched roles at volume (50-100+ per candidate)
3. Track: applied → viewed → rejected → interview invited → offer
4. When real interview scheduled: Mode 1 (interview practice) targets that specific company and role

**Framing for institutions:** "Students enter active international hiring processes." Outcome-focused, mechanism invisible.

**MSP approach:** Founder runs the fork manually. Wizard of Oz.

### Pillar 4: Track

**What it does:** Gives the institution proof.

**Dashboard shows:**
- Cohort view: every student, stage, scores, trajectory
- Funnel: Enrolled → Diagnosed → Validating → Ready → Applying → Interviewing → Offered → Placed
- Behavioral credentials: soft skills profiles per student
- Aggregate metrics: conversion rates, median time per stage, projected placements
- Exportable reports

**Who sees what:**
- Career services (U2): full operational dashboard
- VP Academic (C1): summary metrics, projections, exports
- Student (U1): their profile, scores, scenario results, application status

---

## Niche Strategy

**External (university pitch):** Broad. "We place your students in international jobs." All viable roles.

**Internal (targeting and differentiation):** Prioritize niches where soft skills validation compounds:
1. SDR/BDR — soft skills ARE the job, 30%+ YoY growth, no dominant LatAm player
2. Customer Support/Success (L2+) — high volume, soft-skill-dependent
3. Ops/PM (non-VA tier) — underserved, high soft-skill weight

**Role catalog spans all viable niches** (8-10 roles across technical and non-technical). But scenario simulations are built first for priority niches.

---

## What Makes Cruzar Different (vs. everyone)

| Existing category | What they do | What Cruzar does differently |
|---|---|---|
| LatAm talent marketplaces (Near, Toptal, Turing) | Employer-side. Match pre-vetted devs. | Supply-side. Diagnose, validate, place. Institution is the customer. |
| AI recruiting tools (HireVue, Apriora) | Employer-side screening. Disposable scores. | Candidate-side validation. Portable behavioral credential. |
| Bootcamps (Henry, Laboratoria) | Teach skills. Maybe place. | Don't teach. Validate through simulation. Place via automation. |
| Career platforms (Handshake) | Job board for universities. | Not a job board. An end-to-end placement engine. |
| Assessment companies (Pymetrics, Arctic Shores) | Game-based psychometrics. Employer tool. | Realistic scenario simulation. Candidate credential. |

**The compound advantage:** CEFR + role readiness + soft skills behavioral credential, all from voice interactions, supply-side, portable. Nobody does all of these together.

---

## Shape 2 Preview (not built now, but the architecture enables it)

The behavioral credential becomes the product employers pay for. Instead of running their own interview process, employers buy access to Cruzar-verified candidates with proven scenario performance. "This candidate scored 85/100 on a realistic cold call simulation, with strong objection handling and B2+ English." That's more signal than a resume and a 30-minute screen.
