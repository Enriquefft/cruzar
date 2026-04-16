# Cruzar — Brand Voice Lock (Capa 4)

**Date:** 2026-04-15
**Status:** Locked. Governs every user-facing surface: email, landing, in-product microcopy, deck, WhatsApp, error messages, notifications.

Cross-references:
- [Design context](../../.impeccable.md)
- [Brand content SSOT](../../apps/brand/lib/content.ts)
- [Personas](../../business/personas.md)
- [Problems](../../business/problems.md)
- [Product definition](./definition.md)
- Visual registers: [editorial](../../apps/brand/app/direction/editorial/page.tsx), [field-report](../../apps/brand/app/direction/field-report/page.tsx)

The voice has **one identity, two registers**, mirroring the visual system:
- **Editorial register** — rector, parent, landing top-fold, MoU. Longer sentences, measured cadence, numbers as protagonist. Formal `usted` in ES, no contractions in EN.
- **Field register** — student, operator, employer email, dashboard microcopy. Short clauses, verified data, who/what/when. Informal `tú` in ES with U0, direct in EN.

Same voice. Density and formality shift, never the attributes.

---

## 1. Voice attributes (ranked)

The rationale is business-model derived, not aesthetic.

1. **Accountable** — we charge only on placement (USD 800–1,500 flat, outcome-triggered). The voice never makes a claim that isn't verifiable. Every number has a source, a date, and a unit. No adjective survives unless it earns its place next to a figure.

2. **Institutional** — the existential customer is a VP Académico / Rector anxious about public Ponte en Carrera data and a post-SUNEDU enrollment war with 93 competitors. The voice is the voice of a peer institution signing an MoU, not a startup pitching disruption. We talk like someone the board has already approved.

3. **Bilingual-native** — the product crosses borders by construction. Spanish is not a translation of English; each language is native in its own surface. No code-switching inside a single copy block. A Peruvian rector reads Spanish that is not "translated-feel"; a US hiring manager reads English with no emerging-market markers.

4. **Specific** — U1 students are skeptical and scam-cautious; abstractions trigger their defense. Vague intensifiers ("excelente", "gran oportunidad") read as sales. The voice names the company, the amount, the date, the action. "Linear viewed your application on 2026-04-14" beats "you caught the attention of a top company."

5. **Restrained** — the visual system is light paper, hairline rules, one aged-red accent used sparingly. The voice matches. No exclamation marks on critical-path surfaces. No emoji on rector or employer surfaces. Warmth is shown by doing the work (verifying the placement, writing the interview prep), not by adverbs.

Ranking logic: if two attributes conflict, the higher-ranked one wins. "Accountable" trumps "institutional" when an unverified claim would sound more impressive. "Specific" trumps "restrained" when concision would erase the verifiable detail.

---

## 2. Forbidden vocabulary

Every entry has a replacement. When in doubt, use the replacement.

### 2.1 Category A — startup theater

| Banned | Why | Replacement |
|---|---|---|
| "innovador" / "innovative" | Undefined claim. Rectors have heard it from every edtech vendor. Not a fact. | Name the mechanism: "validación por simulación de escenario real." |
| "revolucionario" / "revolutionary" | Same as above, louder. Triggers vendor-risk alarm in C1. | State the first-mover fact: "Primera universidad peruana con colocación internacional sistemática." |
| "disruptivo" / "disruptive" | Startup posture. The anti-reference. | Describe the category shift with verifiable nouns. |
| "plataforma" / "platform" | Generic. Fits ten thousand SaaS products. | "El sistema de Cruzar," or name the specific pillar: "diagnóstico," "validación," "colocación," "dashboard." |
| "solución" / "solution" | Vendor-speak. Used when you can't describe the thing. | Say what the thing does. "Colocamos candidatos en ofertas internacionales remotas" beats "our placement solution." |
| "impulsado por IA" / "AI-powered" | Weak qualifier. The interesting fact isn't that it's AI; it's what the AI does. | Describe the capability: "El agente simula un cliente frustrado y un evaluador separado puntúa la interacción." |
| "ecosistema" / "ecosystem" | Metaphor that adds no information. | Name the parts. |
| "clase mundial" / "world-class" | Unverifiable superlative. | A named comparison: "El mismo proceso que usan empresas como Linear, Vercel, Deel." |
| "unicorn," "10x," "moonshot" | Investor jargon that reads as amateur outside a Sand Hill room. | Concrete numbers: "4.1× salary multiple, cohort 02, verificado por offer letter + payroll." |

### 2.2 Category B — edtech sentimentality

| Banned | Why | Replacement |
|---|---|---|
| "empoderar" / "empower" | Sentimental, vague. Also a humanizer red flag. | "Damos acceso" / "we give access to." Or describe the mechanical transfer of capability. |
| "transformar vidas" / "transform lives" | Emotional abstraction. Student distrusts it. | "Pasó de S/ 2,400 a USD 3,100 en 11 semanas." Let the number carry the emotion. |
| "cambiar el futuro" / "change the future" | Same. | Same. |
| "sueños" / "dreams" | Parent-poster register. Not Cruzar. | "Objetivos de carrera" / "career goals" when a noun is actually needed. |
| "talento" as abstract mass noun / "talent" (idem) | Dehumanizes U0 into a commodity. | "Los candidatos," "los estudiantes," specific role names. |
| "journey" / "viaje" as career metaphor | Coaching-register cliche. | "Proceso," "ruta," or name the stages: "del diagnóstico a la colocación." |
| "holístico" / "holistic" | Empty qualifier. | Name the axes: "CEFR + role fit + soft skills conductuales." |

### 2.3 Category C — AI-tell patterns (humanizer)

The humanizer skill exists in the ecosystem; these patterns are rejected at draft time, not fixed in edit.

| Banned | Why | Replacement |
|---|---|---|
| Em-dash as rhythm device (>1 per paragraph) | AI-writing fingerprint. | Period. Or colon when introducing a list. One em-dash per email max, only when syntactically earned. |
| "It's important to note that..." / "Cabe resaltar que..." | Filler, AI-default opener. | Delete. If the fact is worth writing, don't announce it. |
| "In today's world..." / "En el mundo actual..." | Padding. | Delete. Start with the fact. |
| "Harness the power of" / "Aprovechar el poder de" | Marketing boilerplate. | Say what the thing does. |
| "Unlock" (metaphorical) / "Desbloquear" | Gamified, AI-default. | "Access," "reach," "get to." |
| "Dive deep" / "Profundizar" as section transition | Filler. | Ask the actual question or state the actual claim. |
| Rule of three ("fast, simple, and powerful") | AI-default cadence. | One adjective, or two when they're actually different dimensions. |
| Negative parallelism ("not X, but Y") used as every sentence opener | Rhetorical tic. | Vary sentence structure. Direct claim preferred. |
| "Seamless" / "sin fricción" | Generic SaaS. Also unverifiable. | State the number of steps: "Tres pasos: diagnóstico, validación, postulación." |
| "Cutting-edge" / "de vanguardia" | Unverifiable. | Name the version / the year / the reference. |
| "Leverage" / "apalancar" as verb for "use" | Corporate tic. | "Use," "usar." |
| "Curated" / "curado" (outside museums) | Overused. | "Seleccionados," "chosen" — with the selection criterion stated. |
| "Game-changer" | Lazy. | Describe the change. |
| "Synergy" / "sinergia" | Banned outright. | Delete the sentence and rewrite. |

### 2.4 Category D — vague intensifiers

| Banned | Why | Replacement |
|---|---|---|
| "muy," "really," "increíble," "amazing," "incredible" | Adds no information. | Delete, or replace with a number. |
| "obviamente," "obviously," "claramente," "clearly" | Condescending; also often masks an unverified claim. | Delete. If obvious, don't say it; if not obvious, prove it. |
| "básicamente," "basically" | Hedge. | Delete. |
| "simplemente," "just," "simply" | Minimizes; patronizing to U0. | Delete. |
| "literalmente," "literally" | Almost never literal. | Delete. |

### 2.5 Category E — punctuation & formatting tells

- **No exclamation marks on critical-path surfaces** (rector email, employer email, landing headline, offer-signed email). Allowed at most once on the "offer signed" WhatsApp to a student — the only moment where the emotion is earned and verifiable.
- **No emoji on rector, employer, landing, or dashboard surfaces.** Allowed sparingly on WhatsApp to U0 students (one per message max, and only a checkmark, a flag, or a folder — never a face).
- **No ALL CAPS for emphasis** except in the field-register mono labels that are part of the visual system (§01 · IDENTITY, etc).
- **No bold inside sentences for emphasis.** Bold is for labels and for a single verifiable figure per paragraph.
- **No ellipses** except in direct quotes from students.

---

## 3. Protocol phrases

Every recurring user-facing moment has locked phrasing. When a drafter writes one of these, they copy the canonical, not rewrite it. Variants exist for constrained contexts (SMS, WhatsApp character limits). Rationale line explains why this phrasing and not the banned alternative.

### 3.1 Welcome / onboarding kickoff — WhatsApp first message to new student

- **Trigger:** student signed Service Agreement, Miura flips verification.
- **Canonical (ES):** "Hola [Nombre], soy [Miura/Enrique] de Cruzar. Te doy la bienvenida a la cohorte. Tu intake comienza con 10 preguntas cortas por este chat — te tomará 15 minutos y con eso armamos tu perfil. ¿Empezamos ahora o prefieres en un rato?"
- **Canonical (EN):** "Hi [Name], this is [Miura/Enrique] from Cruzar. Welcome to the cohort. Your intake starts with 10 short questions in this chat — 15 minutes and we have your profile. Start now, or later today?"
- **Allowed variant (ES, shorter):** "Hola [Nombre], bienvenida/o a Cruzar. Intake = 10 preguntas por chat, 15 min. ¿Ahora o en un rato?"
- **Banned alternative:** "¡Hola! ¡Bienvenido/a a la familia Cruzar! 🎉 Estamos emocionados de empezar este increíble viaje contigo..."
- **Rationale:** U0 is scam-cautious. First message names the sender, sets time budget, offers choice. No exclamation, no "familia," no emoji on first contact.

### 3.2 Intake batch invitation — asking for the next 10-question batch

- **Trigger:** previous batch finalized, next batch generated.
- **Canonical (ES):** "Segundo batch listo: 10 preguntas. Responde cuando puedas; no hay prisa. Si algo no aplica a tu caso, escribe 'N/A' y seguimos."
- **Canonical (EN):** "Batch 2 ready: 10 questions. Reply when you can; no rush. If a question doesn't apply, write 'N/A' and we move on."
- **Allowed variant:** the word "Batch" can be replaced by "Parte" in ES if the student hasn't received the English word yet in the thread.
- **Banned alternative:** "¡Excelente trabajo con el batch anterior! Estamos muy emocionados de seguir conociéndote..."
- **Rationale:** functional, permissive, escape hatch for edge cases. No praise for answering — we're not grading.

### 3.3 Profile-finalized email — intake done, profile live

- **Trigger:** intake closed, readiness profile generated, CV uploaded to R2.
- **Subject (ES):** "Tu perfil Cruzar está listo — [Nombre]"
- **Subject (EN):** "Your Cruzar profile is live — [Name]"
- **Canonical body (ES, first line):** "Tu perfil está listo. CEFR verificado: [B2], top roles: [SDR, CS L2, Ops junior]. Te adjunto el diagnóstico y el CV en inglés. A partir de hoy empezamos a postular por ti."
- **Canonical body (EN, first line):** "Your profile is live. CEFR verified: [B2]. Top roles: [SDR, CS L2, Ops junior]. Diagnostic and English CV attached. We start applying on your behalf today."
- **Banned alternative:** "¡Felicidades! Has completado exitosamente tu intake..."
- **Rationale:** one sentence, three verifiable facts, one next action. No "congratulations" — the intake isn't an achievement, it's a gate.

### 3.4 Application sent on student's behalf — autosubmitted app notification

- **Trigger:** an application was submitted by the Cruzar system for this student.
- **Canonical (ES):** "Postulación enviada: [Rol] en [Empresa], [YYYY-MM-DD]. CV: [link]. Estado: enviada."
- **Canonical (EN):** "Application sent: [Role] at [Company], [YYYY-MM-DD]. CV: [link]. Status: submitted."
- **Allowed variant:** daily digest format — "Postulaciones de hoy (4): [list]."
- **Banned alternative:** "¡Buenas noticias! Hemos postulado por ti a una nueva oportunidad..."
- **Rationale:** log entry, not announcement. U0 will receive dozens of these; they have to scan-read.

### 3.5 Application viewed — employer opened the application

- **Trigger:** tracker flips to viewed.
- **Canonical (ES):** "Tu postulación a [Rol] en [Empresa] fue vista hoy ([YYYY-MM-DD])."
- **Canonical (EN):** "Your application to [Role] at [Company] was viewed today ([YYYY-MM-DD])."
- **Allowed variant:** "Visto por [Empresa] hoy: [Rol]."
- **Banned alternative:** "¡Tu postulación ha captado la atención de [Empresa]!"
- **Rationale:** "vista" / "viewed" is the verifiable fact. "Captado la atención" is a salesy abstraction over an observable event.

### 3.6 Application rejected — passing on this rejection

- **Trigger:** tracker flips to rejected.
- **Canonical (ES):** "[Empresa] descartó esta postulación. Esto pasa en la mayoría — seguimos con las otras [N] activas. Promedio de cohorte 02: ~[60]% de rechazo antes del primer interview invite."
- **Canonical (EN):** "[Company] passed on this application. Most applications end here — we're still active on [N] others. Cohort 02 average: ~[60]% rejection before first interview invite."
- **Allowed variant (batched, weekly digest):** the counts only, no prose, if >3 in a week.
- **Banned alternative:** "Lamentablemente esta oportunidad no resultó. ¡Pero no te desanimes! Seguimos creyendo en ti..."
- **Rationale:** never blame the student. Never perform optimism. Normalize the base rate with a real cohort number. "Descartó" is cleaner than "rechazó tu candidatura" (which puts the student as the object of rejection).

### 3.7 Interview invite — employer scheduled an interview

- **Trigger:** tracker flips to interview scheduled.
- **Canonical (ES):** "[Empresa] quiere entrevistarte para [Rol]. Fecha propuesta: [YYYY-MM-DD, HH:mm ZONA]. ¿Confirmamos?"
- **Canonical (EN):** "[Company] wants to interview you for [Role]. Proposed: [YYYY-MM-DD HH:mm ZONA]. Confirm?"
- **Allowed variant:** if fecha requires negotiation, "Fecha a coordinar — te paso 3 horarios hoy."
- **Banned alternative:** "¡¡¡GRAN NOTICIA!!! ¡Tienes una entrevista con [Empresa]!"
- **Rationale:** the news is its own emotional payload; the voice stays level. Verb "quiere entrevistarte" keeps the student as subject.

### 3.8 Interview prep email — sharing the prep doc

- **Trigger:** interview confirmed, prep artifact generated.
- **Subject (ES):** "Prep para [Empresa] — [YYYY-MM-DD]"
- **Subject (EN):** "Prep for [Company] — [YYYY-MM-DD]"
- **Canonical body (ES, first line):** "Preparé el brief para tu entrevista con [Empresa] ([Rol]). Adentro: sobre la empresa, sobre el entrevistador si lo conocemos, 8 preguntas probables con framework de respuesta, y el simulador de práctica listo para tu rol."
- **Canonical body (EN):** "Brief for your [Company] ([Role]) interview is ready. Inside: the company, the interviewer if we know them, 8 likely questions with answer frameworks, and the practice simulator set up for your role."
- **Banned alternative:** "Te comparto unos tips para que la rompas en tu entrevista..."
- **Rationale:** enumerates what's inside. "La rompas" is coaching-slang register, not Cruzar.

### 3.9 Offer received — the moment that pays the fee

- **Trigger:** employer extended offer, signature pending.
- **Canonical (ES):** "Tienes una oferta de [Empresa] para [Rol]: USD [salary]/mes. Llega en [N] días por email. Cuando la revises, agendamos 20 min para ver términos y decidir."
- **Canonical (EN):** "Offer from [Company] for [Role]: USD [salary]/month. Arriving in [N] days by email. Once you've read it, let's take 20 minutes to go through terms and decide."
- **Banned alternative:** "¡¡¡LO LOGRASTE!!! ¡¡¡OFERTA DE [EMPRESA]!!! 🎉🎉🎉"
- **Rationale:** offer ≠ signed. The celebration line is reserved for 3.10. Keeping this level protects the student from premature elation and us from looking sloppy if the offer renegotiates.

### 3.10 Offer signed / placed — the payable trigger, the celebration line

- **Trigger:** offer signed, verification (LinkedIn update + paycheck/HR email) confirms.
- **Canonical (ES, WhatsApp to student):** "Firmado. Felicitaciones, [Nombre]. Cruzaste."
- **Canonical (EN, WhatsApp to student):** "Signed. Congratulations, [Name]. You crossed."
- **Canonical (public / landing, if student consents):** "[Nombre] cruzó. [Rol] en [Empresa]. [YYYY-MM-DD]."
- **Allowed variant:** one exclamation mark permitted on this single message — "Firmado!" — and nowhere else in the thread.
- **Banned alternative:** "¡¡¡WOW NO PUEDO CREERLO!!! ¡¡¡FELICIDADES!!! ¡Eres la mejor! 🎉🎉🥳🎊"
- **Rationale:** the verb name earns its moment here and only here. "Cruzaste" is the one lyrical beat in the system. Everything before was process; this is the payoff. The restraint makes it land.

### 3.11 Pricing question — how to phrase the fee

- **Trigger:** student, rector, or press asks "how much does this cost?"
- **Canonical for students (ES):** "USD 800–1,500 flat. Se paga sólo cuando firmas una oferta internacional. Sin depósito, sin mensualidad, sin matrícula. Si no colocamos, no se paga."
- **Canonical for students (EN):** "USD 800–1,500 flat. Only once you sign an international offer. No deposit, no subscription, no tuition. No placement, no fee."
- **Canonical for rectors (ES):** "El anclaje institucional es USD 5,000–20,000 al año, con tope por outcomes. El fee del estudiante (USD 800–1,500, pago al firmar oferta) queda como unidad económica principal; la cuota institucional financia infraestructura, soporte y co-branding."
- **Canonical for rectors (EN):** "Institutional anchor: USD 5,000–20,000 per year, outcomes-capped. Student fee (USD 800–1,500, paid on offer signature) remains the primary economic unit; the institutional fee funds infrastructure, support, and co-branding."
- **Banned alternative:** "Tenemos planes flexibles que se adaptan a tus necesidades..." / "Contact us for pricing."
- **Rationale:** price transparency is a trust vector for scam-cautious U0 and risk-averse C1. Naming the amount first de-risks the whole conversation.

### 3.12 Rector cold-outreach opener — first email to a VP Académico

- **Subject (ES):** "Cruzar — propuesta de alianza fundadora para [Universidad]"
- **Subject (EN):** "Cruzar — founding partnership proposal for [University]"
- **Canonical body (ES, first line):** "Dr./Dra. [Apellido], le escribo desde Cruzar. Somos el primer sistema que coloca estudiantes peruanos en empleos remotos internacionales de forma sistemática; nuestra cohorte actual (47 estudiantes, 3 universidades aliadas) reporta 12 colocaciones verificadas con un delta salarial promedio de USD 2,840/mes."
- **Canonical body (EN):** "Dr. [LastName], I'm writing from Cruzar. We are the first system placing Peruvian students into international remote roles systematically; our current cohort (47 students, 3 partner universities) reports 12 verified placements with an average salary delta of USD 2,840/month."
- **Banned alternative:** "Hola! Espero que estés teniendo un excelente día. Quería contarte sobre nuestra increíble plataforma de IA..."
- **Rationale:** `usted`, title, verified numbers in the first sentence, institutional category framing ("alianza fundadora" — implies peer, not vendor). Subject line fits in notification preview and frames the whole conversation.

### 3.13 Rector follow-up after pitch — the ask sentence

- **Trigger:** pitch meeting happened, deck was shown.
- **Canonical (ES):** "Dr./Dra. [Apellido], gracias por el tiempo de ayer. Adjunto la propuesta de piloto: 20 estudiantes, un semestre, sin costo fijo — pagamos si colocamos. Quedo atento a sus observaciones y a la ruta de aprobación interna."
- **Canonical (EN):** "Dr. [LastName], thank you for yesterday's time. Attached, the pilot proposal: 20 students, one semester, zero fixed cost — we charge on placement. I remain at your disposition for comments and for the internal approval path."
- **Banned alternative:** "Hola! Gracias por reunirte conmigo ayer! Fue una conversación súper enriquecedora..."
- **Rationale:** the "zero fixed cost, we pay if we place" line is the risk-reversal sentence that C1 repeats upward. Every word in it is load-bearing.

### 3.14 Refund / no-placement scenario — language that protects the brand when we don't deliver

- **Trigger:** cohort closes without placement for a student; or student pays, no offer materializes within the committed window.
- **Canonical to student (ES):** "[Nombre], en tu caso no llegamos a una oferta firmada dentro de la cohorte. Esto es responsabilidad nuestra, no tuya — el modelo de Cruzar es cobrar por colocación. No hay fee, no hay deuda. Si quieres seguir en la próxima cohorte sin costo adicional, quedas automáticamente inscrita/o; si prefieres cerrar, tu perfil y diagnóstico son tuyos y te los dejamos en [link]."
- **Canonical to student (EN):** "[Name], we did not reach a signed offer for you within this cohort. This is on us, not on you — Cruzar's model is placement-triggered pay. No fee, no debt. If you want to continue into the next cohort at no additional cost, you're already enrolled; if you prefer to close out, your profile and diagnostic are yours and we leave them for you at [link]."
- **Canonical to rector (ES):** "Dr./Dra. [Apellido], de los 20 estudiantes del piloto, colocamos [N]. Los [M] restantes quedan activos en la siguiente cohorte sin recargo. El invoice institucional refleja outcomes efectivos, no matrícula."
- **Banned alternative:** silence; blaming the student's English; blaming the market.
- **Rationale:** no-placement is the highest-stakes moment for the brand. The voice takes responsibility explicitly ("Esto es responsabilidad nuestra"), reaffirms the business model (outcome-priced), and leaves the artifact value (profile, diagnostic) with the student. A rector who sees this language knows we won't weasel when it matters.

---

## 4. Register matrix

Rows: audience. Columns: surface. Each cell: an example on-tone phrase for that intersection. Use these as calibration anchors, not as templates to copy-paste unchanged.

| Audience | Email subject | Email body opener | Landing headline | In-product microcopy | Error message |
|---|---|---|---|---|---|
| **Student U0** (22–32, ES primary, `tú`) | "Tu próximo paso en Cruzar (4 min)" | "Tu perfil está listo. CEFR B2 verificado. Top roles: SDR, CS L2, Ops." | "Cruza del salario local al internacional." | "Guardado." / "12 postulaciones activas." | "No pude guardar tu respuesta. Reintentar en 10s." |
| **Rector C1** (VP Académico, ES primary, `usted`, formal) | "Cruzar — propuesta de alianza fundadora para UTEC" | "Dr. García, le escribo desde Cruzar. Somos el primer sistema que coloca estudiantes peruanos en empleos remotos internacionales de forma sistemática." | "La primera universidad peruana con colocación internacional sistemática será la suya." | "Cohorte 02 · 12 colocados / 47 · $2,840 delta promedio." | "Export no disponible esta semana; datos verificados al 2026-04-15." |
| **Employer hiring manager** (US/EU, EN primary) | "Candidate intro — [Name] for [Role] at [Company]" | "Hi [First], introducing [Candidate Name] for your [Role] opening. Cruzar-verified: CEFR C1, 82/100 on a simulated cold-call scenario, 2 years in a comparable role." | *(not a landing audience)* | *(not an in-product audience in Shape 1)* | *(not applicable)* |
| **Internal operator / founder** | "cohort-02 · reconcile · 2026-04-15" | "Reconcile diff vs landing counter: +1 (placement #13, pending verification)." | *(not applicable)* | "12 / 47 · next reconciliation T+7d" | "SQL write blocked. Use --write flag + confirm." |

Notes on the matrix:

- **`tú` vs `usted` rule (ES):** `tú` for students U0 in all informal channels (WhatsApp, email). `usted` for rectors C1, deans C2, and any first contact with an institution. Never mix inside a thread; the first message sets the register for the relationship.
- **Contractions (EN):** allowed with students and employer-peer emails ("we're," "you'll"). Not allowed in rector English emails or MoU language ("we are," "you will").
- **Role of numbers per surface:** landing headlines lead with a verb, proof panels lead with a number. Rector emails lead with a peer-institution framing, then the number in sentence 2.

---

## 5. Bilingual rules

Binding rules for which language leads, where, and why.

### 5.1 Primary language by audience

| Audience | ES | EN | Notes |
|---|---|---|---|
| Student U0 (cohort-internal) | primary | paired (CV, app emails are EN) | ES everywhere the student is the human; EN everywhere the employer will read the student's output |
| Rector C1, Dean C2 | primary | never lead | EN only if the rector explicitly prefers it |
| Career services U2 (operator) | primary | secondary, for dashboards if requested | ES |
| Employer hiring manager U3 | — | primary | No ES. Ever. No emerging-market markers. |
| US / global investor | — | primary | EN leads |
| LatAm investor | primary | paired | ES leads, EN appendix for pro-rata clauses etc. |
| Internal docs / repo | ES or EN per file | ES or EN per file | CLAUDE.md rule: one language per file, no code-switching |
| Code identifiers | — | EN always | Reaffirmed |
| Structural headings (`Status`, `Historial`, `Open questions`) | — | EN always | Reaffirmed — grep uniformity |

### 5.2 Surface-level rule

The surface determines the language, not the nationality of the reader:

- A Peruvian student reading a CV we wrote for them reads **English** (because the CV's reader is the employer).
- A US investor reading Cruzar's Ponte en Carrera placement data sees **Spanish screenshots with English captions** (because the data source is Spanish).
- A US employer sees **English only** — no "Cruzar, a LatAm company" framing, no `ñ` anywhere they'd decode as emerging-market risk.

### 5.3 Hybrid room rule — Peruvian rector and US investor in the same meeting

This scenario actually happens (pilot pitches where Miura brings a US advisor, or fundraise meetings where a LatAm rector validates the product to a US VC).

**The rule:** **deck is bilingual, spoken language follows the highest-authority decision-maker in the room, written artifacts left behind are ES.**

Concretely:
1. **Slides:** each slide carries its headline in the **primary language of the room** (ES if the rector outranks the investor for that decision; EN if the investor outranks the rector). Secondary language appears as a subordinate line in the editorial `INK_SOFT` color, smaller, italic — the same treatment as the ES/EN pairing on the [editorial direction tagline block](../../apps/brand/app/direction/editorial/page.tsx).
2. **Numbers, company names, role names, URLs:** identical in both languages. These are the load-bearing facts. No translation risk.
3. **Spoken:** whoever controls the decision. Cruzar defaults to ES if both parties are in a Peruvian setting, EN if in a US setting. Miura switches mid-sentence only to answer a direct question in the asker's language, then returns to the room's primary.
4. **Follow-up artifact:** the MoU or term sheet draft is **primary language of the signer**. If the rector signs: ES. If the investor signs: EN. A translated courtesy copy in the other language is attached, marked "Reference translation — binding version is [ES/EN]."

**Why this rule:** the person who signs lives with the document. The document is in their language. The room accommodates the non-signer with the secondary lane.

### 5.4 No code-switching inside a sentence

Exceptions limited to proper nouns that don't translate (role names that are English-native in LatAm remote-hiring vocabulary — "SDR," "Customer Success," "Product Manager" — stay English inside Spanish sentences). "Postulamos por ti a un rol de SDR en Linear" is correct. "Postulamos por ti para un Sales Development Representative en Linear" is worse (overtranslation). "Applied you to an SDR en Linear" is banned (code-switch).

---

## 6. Tone in 5 examples

The fastest calibration: five paired on/off examples. If what you just wrote looks like the right column, rewrite it.

### Example 1 — employer viewed the application

**On:** "Tu postulación a SDR en Linear fue vista hoy (2026-04-14) por el equipo de hiring."

**Off:** "¡Excelentes noticias! Tu candidatura ha captado la atención del equipo de Linear."

*Why on:* factual, who/what/when, real company name as proof, verb "vista" matches the literal event the tracker observed. *Why off:* exclamation, "captado la atención" is a salesy abstraction over the verifiable act of opening the application; "excelentes noticias" primes an expectation that a `viewed` event does not actually justify.

### Example 2 — landing top-fold for a rector

**On:** "Cruzar coloca a los estudiantes de su universidad en empleos remotos internacionales. Cobramos cuando una oferta se firma. Cohorte 02: 12 colocaciones verificadas de 47 estudiantes, delta salarial promedio USD 2,840/mes."

**Off:** "Revolucionamos la empleabilidad universitaria con nuestra innovadora plataforma de IA que empodera a los estudiantes LatAm a alcanzar su máximo potencial en el mercado laboral global."

*Why on:* three verifiable facts, one business-model sentence, zero adjectives that can't be audited. *Why off:* "revolucionamos," "innovadora," "plataforma," "empodera," "máximo potencial" — five banned terms in one sentence. Says nothing a rector can take to the board.

### Example 3 — WhatsApp to a student after an application rejection

**On:** "Stripe descartó la postulación para el rol de CS L2. Base de cohorte 02: ~60% de rechazos antes del primer interview invite. Seguimos con las otras 14 activas; próxima semana postulamos a 8 más."

**Off:** "Hola! Lamentablemente Stripe no continuó con tu proceso esta vez 😔 Pero no te desanimes, ¡cada 'no' te acerca a un 'sí'! Seguimos trabajando duro por ti 💪"

*Why on:* normalizes the base rate with a real cohort number, names what's still active, commits to a next action with a number. *Why off:* sad-face emoji on a routine event patronizes U0; "cada no te acerca a un sí" is a coaching cliche and also statistically false (rejections are independent); "trabajando duro por ti" sounds like sales. The student wants to know the pipeline is alive, not to be consoled.

### Example 4 — offer-signed WhatsApp (the one place restraint lifts)

**On:** "Firmado. Felicitaciones, María. Cruzaste."

**Off:** "¡¡¡FELICIDADES MARÍA!!! 🎉🎉🎉 ¡¡¡FIRMASTE TU OFERTA CON DEEL!!! ¡¡¡ESTOY TAN ORGULLOSO DE TI!!! 🥳🎊✨ ¡Este es el inicio de una nueva etapa increíble! 💪"

*Why on:* three short sentences, each carries one beat. The verb name of the company reappears as the closing word ("Cruzaste") — the one earned lyrical moment in the entire voice system. The restraint is what makes it resonate. *Why off:* the off version empties the emotion by overspending it. If every rejection message had ten emoji and every routine update was "excelentes noticias," this moment has no currency left to celebrate with.

### Example 5 — pilot proposal email subject line to a VP Académico

**On:** "Cruzar — propuesta de piloto semestral para UTEC (sin costo fijo)"

**Off:** "🚀 Transforma la empleabilidad de tus estudiantes con Cruzar — ¡conoce cómo!"

*Why on:* names sender, names document type, names the concrete risk-reversal (sin costo fijo) that will be the reason the rector opens the email. Fits the email preview. `usted`-register implicit through the formality of "para UTEC." *Why off:* rocket emoji in the subject line from an unknown sender triggers the spam filter and the vendor-risk alarm simultaneously; "transforma la empleabilidad" is unverified; "¡conoce cómo!" is a clickbait tell. A VP Académico will not open this; if they do, they will not reply.

---

## Voice governance

- **This document is the lock.** Updates require a dated entry in the `Historial` section below and a note in the commit message explaining the trigger.
- **New protocol phrase:** when a recurring moment appears in operations that isn't covered here (e.g. new application-status transition, new payment scenario), add a section under §3 with the same shape: trigger, canonical ES, canonical EN, one variant, one banned alternative, rationale. Do not invent phrasing inline in a drafter's head.
- **Conflict resolution:** if this document and a draft disagree, the document wins and the draft is rewritten. If this document and `.impeccable.md` disagree, open a reconciliation commit that updates both.

## Historial

| Fecha | Cambio | Trigger |
|---|---|---|
| 2026-04-15 | Initial voice lock (Capa 4). | Brand finalization process, after visual direction lock (editorial + field-report). |
