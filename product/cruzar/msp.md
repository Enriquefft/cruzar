# Cruzar — MSP Specification

**Date:** 2026-04-14
**Status:** Active

---

## Principle

Universities buy evidence, not demos. The MSP produces evidence first (Phase 1), then packages it into a sellable product (Phase 2). The user-facing surface is polished and professional. The backend is as simple as the scale allows.

40 students. One institution. Wizard of Oz where it's invisible.

---

## Phase 1: Traction + Foundation (week 1-1.5)

**Dual objective:** Get Aprendly students into international interview processes AND build the product foundation so universities see a real company from day 1.

### 1.1 Operations (Traction)

**Candidate source:** Aprendly's best students, pre-selected by Miura.

**Pipeline:**
1. Students enter the diagnostic (built product, not manual)
2. System produces readiness profiles with CEFR level, role matches, soft skills flags
3. Strongest candidates (B2+, matched to viable roles) enter preparation
4. Voice interview practice + scenario simulation on their target roles (scenarios for priority niches only; technical roles get Mode 1 practice only)
5. Founder runs autonomous application fork manually per candidate: 50-75 applications each
6. Track responses: applied → viewed → rejected → interview invited

**Operational load:** 3-5 candidates × ~60 applications = 180-300 manual applications during Phase 1. The fork's automation handles submission; founder monitors, adjusts targeting, responds to platform challenges (captchas, account blocks). Realistic for one founder if scoped to 3-5 candidates; scale up only after process is smooth.

**Traction target:** At least 1 student receives an international interview invitation. Ideal: 3+. Scope to 3 candidates if operational load becomes the bottleneck.

### 1.2 Build (Product Foundation)

Everything below ships during Phase 1. University conversations start immediately; they'll visit the website, ask for a demo, and see the dashboard.

#### B1. Domain + Email
- Register cruzarapp.com ($38/yr)
- Configure email: enrique@cruzarapp.com
- Every external communication from day 1 is on-brand

#### B2. Brand Basics
- Wordmark
- Color palette (institutional: deep navy or teal family)
- Type system (2 typefaces: display + body)
- Applied to everything below

#### B3. Landing Page (cruzarapp.com)
- Single page. What Cruzar is. Who it's for. Founding partner program.
- Pre-traction: "We're running our first cohort."
- Post-traction: Updated with results ("X students in international interview processes in Y days.")
- Professional, institutional, fast, HTTPS
- No overstated claims

#### B4. Diagnostic Flow
The core product. Built for real from day 1.

**User experience:**
1. Student receives invite link
2. Answers 5+ structured questions (LLM-driven, conversational UI)
   - Background, skills, experience, goals
   - NOT a CV upload (many students don't have one)
3. Completes spoken English assessment: 5 questions via browser microphone
   - Q1: Self-introduction (A2 floor)
   - Q2: Describe a process (B1 discriminator)
   - Q3: Opinion + justification (B1/B2 boundary)
   - Q4: Hypothetical problem-solving (B2/C1 boundary)
   - Q5: Abstract reasoning (C1 ceiling)
4. System produces Readiness Profile:
   - CEFR level (B1/B2/C1) with confidence score
   - Top 3 role matches from catalog with compensation ranges
   - Soft skills flags (preliminary indicators only, validated later via scenario simulation)
   - Readiness verdict (how far from placeable)
   - Named gaps (skills, English, experience)
   - The salary delta: "You earn X locally. These roles pay Y."
   - Recommended next actions

**Technical approach:**
- Browser audio capture (MediaRecorder API)
- Deepgram STT for transcription (streaming, handles LatAm accent, $200 startup credit)
- Claude Sonnet for CEFR rubric scoring (4 sub-dimensions: vocabulary range, grammatical accuracy, coherence, task achievement)
- Claude Sonnet for profile generation (role matching against catalog, gap analysis)
- Structured output with Zod validation

#### B5. Role Catalog (v1)
10 roles. Broad for university pitch (all majors need matches), internally prioritizing niches where soft skills validation compounds.

**Priority Niches (scenarios built in MSP):**
- SDR / Sales Dev Rep — $15K-28K + commission (C1 English)
- Customer Support Specialist — $10K-20K (B2 English)
- Project/Operations Coordinator — $14K-28K (B2+ English)

**Other Non-Technical (Mode 1 interview practice only in MSP):**
- Virtual Assistant / Exec Assistant — $8K-18K (B2 English)
- Digital Marketing Specialist — $14K-28K (B2+ English)
- Technical Writer — $20K-38K (C1 English)

**Technical (Mode 1 interview practice only in MSP):**
- Junior Frontend Developer (React) — $18K-35K (B2 English)
- Backend Developer (Node/Python) — $24K-48K (B2 English)
- QA/Test Engineer — $15K-30K (B2 English)
- Data Analyst — $20K-40K (B2+ English)

Each role: title, compensation range, required English level, key skills, typical employer type, entry-level flag.

Post-traction: expand scenarios to all roles, add more roles as demand signals emerge.

#### B6. Voice Interview + Scenario Simulation
**Two modes, same voice infrastructure:**

**Mode 1: Interview Practice**
- AI voice interviewer conducts adaptive job interview for target role
- Standard interview questions + context-aware follow-ups
- Produces feedback report: scores, strengths, gaps, practice plan

**Mode 2: Scenario Simulation**
- AI agent plays a person in a work scenario relevant to the target role
- For MSP: conversation-aware prompt engineering on OpenAI Realtime API
  - Persona definition: name, personality traits, current mood, goals, specific objections/concerns
  - Per-turn prompt adjustment: persona's mood/patience/cooperativeness updated based on candidate behavior in the previous turn (via a meta-prompt to the LLM before each response)
  - This is NOT a persistent state machine (no external state variable, no memory module). It's context-conditioned prompting.
  - Realism level: ~60-70% — better than static role-play prompting (Hyperbound level), short of cognitive architecture
  - Competitor comparison: Hyperbound, Second Nature use static prompts. MSP matches their quality. Full cognitive architecture (memory with gaps, bounded rationality) is the 2+ month R&D moat — post-sales.
- Separate evaluator agent (Claude Sonnet on transcript + turn timing) scores the interaction on soft skills:
  - Communication, problem-solving, persuasion, empathy, composure, leadership signals
- Produces behavioral score card

**Scenarios built for MSP (priority niches only):**
- SDR: Cold call a skeptical prospect
- Customer Support: Handle a frustrated customer
- Ops/PM: Align a difficult stakeholder

**Technical/other roles in MSP:** Mode 1 only (interview practice). Scenarios for technical and other non-priority roles come post-traction.

**Technical approach:**
- OpenAI Realtime API (single integration: STT + LLM + TTS)
- ~$0.04/min, ~$120 for entire pilot
- 300-500ms latency
- 1-2 days to build voice infrastructure
- Interview logic + scenario personas + evaluator agent on top
- Migration to LiveKit when scale demands it

**Roadmap for scenario realism (NOT MSP, post-sales):**
- Month 2-3: Founder's R&D integrates cognitive architecture (memory with gaps, cognitive load, bounded rationality)
- Realism target: 85%+
- This becomes the proprietary moat
- Only invested in if sales validate the approach

#### B7. Data Model + Database
Even at 40 students, data goes in the right schema from day 1:
- Students, assessments, profiles, role matches
- Interview sessions, scenario sessions, feedback/behavioral reports
- Application tracking (status per job per student)
- Institution (Aprendly for Phase 1, UTEC for Phase 2)

Postgres (Neon free). Drizzle ORM. Zod schemas as SSOT.

#### B8. Dashboard (started)
- Internal tool during Phase 1 (team tracks Aprendly cohort)
- Becomes university-facing product in Phase 2
- Shows: enrolled students, CEFR levels, readiness tiers, current stage, interview/scenario scores, soft skills profiles
- Simple: reads from Postgres. No event architecture. Polling or manual refresh.
- Build the UI right. 40 rows with filters and funnel visualization.
- Funnel: Enrolled → Diagnosed → Validating → Ready → Applying → Interviewing → Offered → Placed

#### B9. Student View
- Student sees: profile, CEFR score, role matches, interview/scenario scores, soft skills profile, progress
- Application status: "Applied to X roles. Y viewed. Z interview invitations." Status updates polled from DB (founder updates in daily batches).
- Students can retake scenarios; score progression visible. Retake is encouraged — scores improve with practice, and the system tracks trajectory.
- Feedback after each scenario: specific strengths, gaps, suggestion for next scenario difficulty/type.
- Clean, professional, basic responsive.

### 1.3 What's Wizard of Oz in Phase 1

| What user sees | What actually happens |
|---|---|
| "You're in 12 active hiring processes" | Founder ran the fork manually, status in the DB |
| "3 companies viewed your application" | Founder checked manually, updated the DB |
| Student receives interview invitation | Founder monitoring email/platform responses |
| Dashboard updates | Team updates statuses, UI polls DB |
| Student onboarding | Team creates account, sends invite link manually |
| Institution setup | Team configures in DB directly |
| Scenario simulation feels human-like | Prompt engineering + basic emotion state (existing tools, not full R&D) |

---

## Phase 2: University Sell (starts when traction confirmed)

### 2.1 Proof Package
Assembled from Phase 1 results:
- Number of students processed
- Number of applications sent
- Number of interview invitations received
- Specific companies and roles (anonymized if needed)
- Salary ranges of matched roles
- Timeline: "From diagnosis to interview invitation in X days"
- Soft skills profiles generated (show the behavioral credential)
- Before/after: readiness tier at start vs. end

### 2.2 Product Polish
Everything from Phase 1 build, refined:
- Dashboard populated with real Phase 1 data
- Diagnostic flow tested and polished through real usage
- Voice interview and scenario simulation demo-ready
- Bugs and UX issues fixed from Phase 1 real-student usage

### 2.3 Trust Signals

**Website update:**
- Landing page updated with Phase 1 proof
- "X students placed into international interview processes in Y days"
- How it works section, For Universities section, Founding Partner CTA

**Sales artifacts:**
- Pilot proposal PDF (Cruzar branded, includes Phase 1 proof, outcomes-based pricing)
- One-page leave-behind (the "carry it to VP Academic" document)
- Founder/team sheet
- Dashboard screenshot configured with mock UTEC data
- Founding partner announcement mockup

### 2.4 Meeting Structure (UTEC career services)

**Two-stage sell:**

**Stage 1 — The meeting (U2 in the room):**
- Career services head is the primary audience
- Budget authority sits higher (VP Academic / Rector); U2 is the champion, not the buyer
- Objective: convince U2 that (a) the product solves their daily pain, (b) it's low-risk to champion upward, (c) it makes them look good institutionally
- U2 must leave with everything they need to present to VP Academic without the founder in the room

**Stage 2 — U2 sells upward (not in the room):**
- Leave-behind materials do the work
- VP Academic/Rector sees: competitive advantage, outcome data, pricing structure, risk profile

**Meeting flow (30-40 min):**
1. The proof: "We ran Aprendly students through Cruzar. Here's what happened." (2 min)
2. Diagnostic demo: live or show completed profile (3 min)
3. Scenario simulation demo: live SDR cold call or similar (3-5 min) — the showpiece
4. Dashboard: real Phase 1 data (2 min)
5. Founding partner proposal (canonical pricing in [pricing.md](./pricing.md)) (5 min)
6. Q&A + next steps (remainder)

**Leave-behind package:**
- Proposal PDF (Cruzar-branded, includes Phase 1 proof, outcomes-based pricing breakdown, founding partner terms)
- One-pager (the document U2 walks into VP Academic's office with)
- Dashboard screenshot configured with mock UTEC cohort data
- Founder/team sheet

**Pricing:** Canonical in [pricing.md](./pricing.md). Phase 2 sales materials derive from that file.

---

## Technical Stack (MSP)

| Concern | Choice | Rationale |
|---|---|---|
| Language | TypeScript | One type system everywhere |
| Runtime | Bun | Dev and prod |
| Framework | Next.js App Router | SSR + Server Actions + API routes in one |
| Database | Neon Postgres + Drizzle ORM | Free tier, SSOT schema from Zod |
| Auth | Better Auth (organization plugin) | Future multi-tenant, simple for now |
| UI | shadcn/ui + Tailwind v4 | Components as source, semantic tokens |
| Diagnostic STT | Deepgram Nova (streaming) | $200 startup credit, handles LatAm accent |
| Diagnostic/scoring LLM | Claude Sonnet | CEFR scoring + profile generation + evaluator agent |
| Voice interview + scenarios | OpenAI Realtime API | Single integration, $120 total, 1-2 day build |
| Hosting | Vercel (free/hobby) | Zero config. Migrate to Fly when commercial. |
| Object storage | Cloudflare R2 (free) | Audio recordings |
| Email | cruzarapp.com domain email | Professional from day 1 |

**Month 1 cost ceiling:** ~$30/month recurring + ~$120 OpenAI Realtime over pilot duration. Deepgram $200 credit covers STT. Neon/Vercel/R2 free tier.

---

## Build Priority (what to build and when)

### Week 1 (parallel with traction operations)

| Day | Build | Operations |
|-----|-------|-----------|
| 1-2 | Domain, email, brand basics, landing page, data model | Miura finalizes student selection |
| 2-4 | Diagnostic flow (questionnaire + English assessment + profile gen) | Students begin diagnostics as soon as flow is ready |
| 3-5 | Voice interview Mode 1 (interview practice) | Strongest candidates begin interview practice |
| 4-6 | Scenario simulation Mode 2 (prompt-engineered personas + evaluator) | Candidates run scenarios for priority niches |
| 5-7 | Dashboard (basic, real data from week's diagnostics) | Founder runs autonomous applications for ready candidates |

### Week 2 (traction + polish)

| Focus | What |
|-------|------|
| Operations | Monitor application responses. Update statuses. Coach candidates with real interviews. |
| Build | Polish diagnostic and voice flows from real usage feedback. Flesh out dashboard. Student view. |
| University | Begin conversations. Point to cruzarapp.com. Show dashboard with live data. |

### Post-traction (Phase 2)

| Focus | What |
|-------|------|
| Proof | Package Phase 1 results into proof narrative |
| Polish | Refine all surfaces for demo readiness |
| Sales | Build artifacts, update website with proof, conduct UTEC meeting |
| R&D (if sales justify) | Founder's cognitive architecture for scenario realism (2 month timeline) |

---

## What's NOT in the MSP

- Full cognitive architecture for human emulation (post-sales R&D, 2+ months)
- Automated placement pipeline in codebase (founder runs manually)
- Event-driven real-time architecture (40 students, polling is fine)
- Self-serve institution onboarding (manual for 1-3 universities)
- Payment processing
- Email notification system (manual sends)
- Mobile optimization beyond basic responsive
- Analytics/tracking
- Employer-side anything
- i18n (English only for v1)
- PDF export automation (screenshot/print for now)

---

## Evolution Path

| Stage | Scenario Simulation | Placement | Dashboard |
|---|---|---|---|
| **MSP (now)** | Prompt engineering + basic emotion state. 60-80% realism. | Founder runs fork manually. | Reads from Postgres. Manual status updates. |
| **Post-sales (month 2-3)** | Founder's R&D: cognitive architecture, memory gaps, bounded rationality. 85%+ realism. | Semi-automated: fork integrated into product, founder reviews. | Event-driven updates. Projections model. |
| **Scale (month 4+)** | Proprietary moat. Full cognitive architecture. Multiple scenario types per role. | Fully automated with quality checks. | Multi-institution. Real-time. Exports. |

---

## Success Criteria

### Phase 1
- [ ] cruzarapp.com live with landing page
- [ ] Professional email configured
- [ ] Brand basics applied
- [ ] Diagnostic flow working end-to-end
- [ ] Role catalog (8-10 roles) loaded
- [ ] Voice interview (Mode 1) working
- [ ] Scenario simulation (Mode 2) working for at least 1 priority niche
- [ ] 3-5 Aprendly students diagnosed and profiled
- [ ] Strongest candidates validated via scenarios
- [ ] 50-100+ applications sent per ready candidate
- [ ] At least 1 international interview invitation received
- [ ] Dashboard showing real cohort data
- [ ] University conversations started with cruzarapp.com as reference

### Phase 2
- [ ] Proof package assembled with Phase 1 results
- [ ] Website updated with traction data
- [ ] Sales artifacts ready
- [ ] All product surfaces demo-ready
- [ ] UTEC meeting conducted
- [ ] Career services has leave-behind for VP Academic

---

## What Changed from the Handoff

| Handoff assumption | Updated reality |
|---|---|
| Build product → demo to university | Get traction → use proof to sell |
| MSP = brand + web + demo + sales artifacts | MSP = traction + product + proof + trust signals |
| University meeting is the deadline | Traction is the deadline. Meeting follows. |
| Dashboard mockup for meeting | Dashboard with real data |
| 7-day sprint to build everything | Phase 1 (1-1.5 weeks ops + build) → Phase 2 (sell with proof) |
| Product line inside Aprendly | Cruzar as independent spinoff (by Aprendly) |
| Voice interview only | Voice interview + scenario simulation (two modes) |
| Soft skills validation as future feature | Core differentiator from day 1 (basic version), proprietary R&D post-sales |
| Single niche | Broad externally, SDR/support/ops prioritized internally |
| Autonomous application deferred | Phase 1 placement mechanism (run manually) |
