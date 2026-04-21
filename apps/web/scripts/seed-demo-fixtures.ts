import { randomUUID } from "node:crypto";
import { eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db/client";
import {
  englishCerts,
  intakeBatchAnswers,
  intakeBatches,
  intakes,
  profiles,
  students,
  user,
} from "@/db/schema";
import type { ProfileGap } from "@/schemas/profile";

// Demo fixtures for Part A of demo.md — render `/profile` for the two non-Ready
// verdicts without running the full intake+assess pipeline. Ready is produced
// live in Part B, not seeded here.
//
// Emails use `enrique+<tag>@cruzarapp.com` (Google Workspace plus-aliasing) so
// the magic link lands in the operator's inbox. Pre-flight step in checks.md
// covers triggering the link and capturing the session before the meeting.

interface FixtureQuestion {
  question_key: string;
  question_text: string;
  answer_text: string;
  rationale: string;
  confidence: number;
}

interface FixtureBatch {
  batch_num: 1 | 2 | 3 | 4;
  theme: string;
  questions: readonly FixtureQuestion[];
}

interface Fixture {
  user_id: string;
  profile_id: string;
  email: string;
  name: string;
  whatsapp: string;
  slug: string;
  local_salary_usd: number;
  cert: {
    kind: "ielts" | "toefl" | "cambridge" | "aprendly" | "other";
    score: string;
    level: "B2" | "C1" | "C2";
    r2_key: string;
  };
  verdict: "presentation_gap" | "experience_gap";
  gaps: ProfileGap[];
  plan_markdown: string;
  profile_md: string;
  intake: readonly FixtureBatch[];
}

const now = new Date();
const addDays = (n: number): Date => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

function mkBatch(
  batch_num: 1 | 2 | 3 | 4,
  theme: string,
  qas: readonly [string, string, string][],
): FixtureBatch {
  return {
    batch_num,
    theme,
    questions: qas.map(([question_text, answer_text, rationale], idx) => ({
      question_key: `b${batch_num}_q${idx + 1}`,
      question_text,
      answer_text,
      rationale,
      confidence: 0.9,
    })),
  };
}

// 10 Qs per batch × 4 batches = 40 per student. Matches intake-batch.ts
// prompt contract (`generate-batch` produces exactly 10).
const FABIAN_INTAKE: readonly FixtureBatch[] = [
  mkBatch(1, "Background + motivación", [
    ["¿Qué rol tienes hoy y hace cuánto?", "Soy SDR en una SaaS local desde hace 2 años.", "role"],
    [
      "¿Por qué buscas un rol remoto en USD?",
      "Busco triplicar salario y trabajar con equipos más maduros.",
      "motivation",
    ],
    [
      "¿Cuál fue tu último logro medible?",
      "Superé cuota 4 meses seguidos con 42 SQLs/mes promedio.",
      "achievement",
    ],
    [
      "¿Qué industria conoces mejor?",
      "B2B SaaS horizontal — productividad y operaciones.",
      "industry",
    ],
    ["¿Manejas algún CRM?", "HubSpot hace 2 años, Salesforce básico.", "tools"],
    [
      "¿Cuántas llamadas haces por semana?",
      "180+ de prospección outbound, más follow-ups.",
      "volume",
    ],
    ["¿Trabajas con un AE o solo?", "Pareado con un AE que cierra deals de 5-15k.", "team"],
    ["¿Qué parte del proceso dominas?", "Discovery inicial y calificación BANT.", "strength"],
    ["¿Dónde pierdes deals?", "Demos complejas; aún no las corro yo mismo.", "gap"],
    [
      "¿Has hecho onboarding remoto?",
      "Sí, mi empresa es fully-remote hace 18 meses.",
      "remote_ready",
    ],
  ]),
  mkBatch(2, "Inglés + comunicación", [
    [
      "¿Nivel de inglés verificable?",
      "IELTS 6.5 tomado hace 4 meses, banda hablada 7.0.",
      "english",
    ],
    [
      "¿Has trabajado en inglés?",
      "Reuniones semanales con el equipo de producto (US).",
      "exposure",
    ],
    ["¿Puedes hacer una discovery call en inglés?", "Sí, con prep previa.", "capability"],
    [
      "¿Te sientes cómodo en slack/loom en inglés?",
      "100% — escribo todo en inglés en el trabajo.",
      "async",
    ],
    [
      "¿Último email comercial que escribiste?",
      "Outbound a un CTO en Miami ayer; respondió.",
      "writing",
    ],
    ["¿Dónde te trabas hablando?", "Jerga muy local (sports idioms, US slang).", "weakness"],
    ["¿Has grabado un loom en inglés?", "No aún, pero puedo en 2 días.", "artifact_gap"],
    ["¿Practicas inglés activamente?", "30 min/día en podcasts + 1 clase semanal.", "practice"],
    ["¿Tu CV está en inglés?", "Sí, pero está débil — lista tareas, no resultados.", "cv_state"],
    [
      "¿Tu LinkedIn está en inglés?",
      "Sí, headline genérico: 'Sales Representative'.",
      "linkedin_state",
    ],
  ]),
  mkBatch(3, "Aspiraciones + disponibilidad", [
    ["¿Cuál es tu rol target?", "SDR en B2B SaaS US/EU con path a AE en 18 meses.", "target_role"],
    ["¿Salario mínimo aceptable?", "30k USD base + comisión variable.", "salary_floor"],
    ["¿Salario ideal?", "50k OTE el primer año.", "salary_ideal"],
    ["¿Timezone preferido?", "EST/CST — ya trabajo en EST.", "timezone"],
    ["¿Full-time o contract?", "Full-time con beneficios (salud + PTO).", "engagement"],
    ["¿Cuándo puedes empezar?", "2-4 semanas de notice a mi empleador actual.", "availability"],
    ["¿Te interesa una startup o scale-up?", "Scale-up con 50-200 personas, Series B+.", "stage"],
    ["¿Alguna industria específica?", "DevTools, fintech B2B o vertical SaaS.", "industry_pref"],
    ["¿Remote-only o híbrido?", "Remote-only; no quiero reubicarme.", "location_constraint"],
    [
      "¿Evita algo en un empleador?",
      "Equipos tóxicos de ventas; micromanagement de llamadas.",
      "culture_filter",
    ],
  ]),
  mkBatch(4, "Constraints + compromisos", [
    ["¿Tienes familia / dependientes?", "Pareja, sin hijos; viven conmigo.", "personal"],
    ["¿Compromisos fuera del trabajo?", "Maestría online 2 noches/semana.", "time_commit"],
    [
      "¿Visa / work authorization?",
      "Peruano — solo remote desde Perú, LATAM contratación.",
      "work_auth",
    ],
    [
      "¿Equipo disponible?",
      "MacBook Pro M2, internet fiber 300Mbps, home office aislado.",
      "setup",
    ],
    [
      "¿Puedes hacer entrevistas en horario US?",
      "Sí, hasta las 8pm EST.",
      "interview_availability",
    ],
    ["¿Compromisos médicos/legales?", "Ninguno.", "constraints"],
    ["¿Has viajado a US/EU?", "US una vez (turismo, 2 semanas).", "travel"],
    ["¿Puedes viajar anualmente a offsite?", "Sí, flexible.", "travel_capability"],
    ["¿Alguna restricción que deba saber?", "Ninguna explícita.", "hidden"],
    [
      "¿Algo que quieras que sepamos?",
      "Llevo 6 meses postulando solo y me queman con 'no ready'. Quiero un diagnóstico honesto.",
      "context",
    ],
  ]),
];

const MARIA_INTAKE: readonly FixtureBatch[] = [
  mkBatch(1, "Background + motivación", [
    ["¿Qué estudias/estudiaste?", "Administración de Empresas, último ciclo.", "education"],
    [
      "¿Experiencia laboral formal?",
      "Solo prácticas universitarias (marketing, 3 meses).",
      "experience_gap",
    ],
    [
      "¿Por qué quieres un rol remoto USD?",
      "Necesito ingresos para mudarme e independizarme.",
      "motivation",
    ],
    [
      "¿Has hecho ventas informales?",
      "Freelance en redes sociales para una panadería.",
      "informal_sales",
    ],
    ["¿Tienes CRM experience?", "No, nunca toqué uno.", "tools_gap"],
    ["¿Qué te atrae de SDR?", "Conversar con personas y cerrar valor.", "role_fit"],
    [
      "¿Leaste algo sobre ventas B2B?",
      "Empecé con 'Fanatical Prospecting' hace 2 semanas.",
      "learning",
    ],
    ["¿Cuánto tiempo puedes dedicar a prep?", "20 horas/semana disponibles.", "bandwidth"],
    [
      "¿Has vendido algo tuyo?",
      "Artesanías en ferias; vendí 200 soles en un día.",
      "selling_experience",
    ],
    ["¿Qué buscas aprender primero?", "Cómo estructurar un discovery call.", "learning_priority"],
  ]),
  mkBatch(2, "Inglés + comunicación", [
    ["¿Nivel de inglés verificable?", "Aprendly B2 certificado hace 30 días.", "english"],
    ["¿Dónde usas inglés?", "Solo consumir contenido (podcasts, YouTube).", "exposure"],
    ["¿Puedes hablar inglés en vivo?", "Sí, pero me toma 2-3 segundos procesar.", "fluency"],
    ["¿Has grabado loom en inglés?", "No.", "artifact_gap"],
    [
      "¿Escribes inglés profesional?",
      "Emails simples sí; formal aún lo edito 2-3 veces.",
      "writing",
    ],
    ["¿Practicas activamente?", "1 clase semanal en Aprendly.", "practice"],
    ["¿Conoces jerga de ventas US?", "No — es lo que más me frena.", "weakness"],
    ["¿Puedes hacer role-play en inglés?", "Con prep y script, sí.", "capability"],
    ["¿Tu CV está en inglés?", "Una versión básica; sin impacto.", "cv_state"],
    ["¿Tu LinkedIn está en inglés?", "En español; no tengo foto profesional.", "linkedin_state"],
  ]),
  mkBatch(3, "Aspiraciones + disponibilidad", [
    ["¿Rol target a 12 meses?", "SDR junior en una SaaS LATAM con pipeline US.", "target_role"],
    ["¿Salario mínimo aceptable?", "1500 USD/mes local; más si es USD remote.", "salary_floor"],
    ["¿Salario soñado?", "2500 USD base cerrando año 1.", "salary_ideal"],
    ["¿Timezone preferido?", "Cualquiera LATAM-friendly.", "timezone"],
    ["¿Full-time o partial?", "Full-time preferible; part-time OK si es bueno.", "engagement"],
    ["¿Cuándo puedes empezar?", "Inmediato.", "availability"],
    ["¿Industria preferida?", "Cualquier B2B que me eduque.", "industry_pref"],
    ["¿Remote-only o híbrido?", "Remote-only.", "location_constraint"],
    ["¿Qué evitarías?", "Empresas tradicionales con cultura presencial.", "culture_filter"],
    ["¿Abierta a rol puente?", "Sí, totalmente.", "bridge_role"],
  ]),
  mkBatch(4, "Constraints + compromisos", [
    ["¿Familia / dependientes?", "Vivo con mis padres, sin dependientes.", "personal"],
    ["¿Compromisos fuera del trabajo?", "Tesis de pregrado; entrega en 3 meses.", "time_commit"],
    ["¿Work authorization?", "Peruana, solo LATAM / US-contractor.", "work_auth"],
    ["¿Equipo disponible?", "Laptop mediana, internet casa 100Mbps.", "setup"],
    ["¿Horario US-friendly disponible?", "Sí hasta 6pm EST.", "interview_availability"],
    ["¿Restricciones médicas/legales?", "Ninguna.", "constraints"],
    ["¿Has viajado fuera del país?", "No aún.", "travel"],
    [
      "¿Podrías viajar si el rol lo pide?",
      "Con visa sí; no tengo pasaporte listo.",
      "travel_capability",
    ],
    ["¿Algo oculto que debamos saber?", "Nada.", "hidden"],
    [
      "¿Qué te frustra del mercado laboral actual?",
      "Todos piden 3 años de experiencia para un junior.",
      "context",
    ],
  ]),
];

const FIXTURES: readonly Fixture[] = [
  {
    // user_id is a stable string so re-runs with --reset re-create the same
    // fixture without orphaned FKs pointing at a rotated id.
    user_id: "demo-presentation-0001",
    profile_id: "11111111-1111-4111-8111-111111111111",
    email: "enrique+demo-presentation@cruzarapp.com",
    name: "Fabián Álvarez",
    whatsapp: "+51987000111",
    slug: "fabian-alvarez",
    local_salary_usd: 9600,
    cert: {
      kind: "ielts",
      score: "6.5",
      level: "C1",
      r2_key: "attestations/demo/presentation/ielts-6.5.pdf",
    },
    verdict: "presentation_gap",
    gaps: [
      {
        category: "CV framing",
        severity: "medium",
        evidence:
          "Experiencia sólida como SDR por 2 años, pero el CV lista tareas en vez de resultados. Sin métricas de conversion o deals cerrados.",
      },
      {
        category: "Posicionamiento de rol",
        severity: "medium",
        evidence:
          "Se presenta como 'representante de ventas' genérico. Falta foco en el nicho remoto-USD al que queremos aplicar.",
      },
    ],
    plan_markdown: `## Plan de presentación — Fabián

Tu experiencia es válida; la presentación la está enterrando. Trabajemos 3 cambios concretos antes de la próxima evaluación.

### 1. Reescribir bullets del CV con métricas
Cada bullet debe abrir con un número.

- **Antes:** "Hice llamadas de prospección y califiqué leads."
- **Después:** "Ejecuté 180+ llamadas de prospección/semana, calificando 42 SQLs/mes (23% conversion) para el equipo de AE."

**Acción:** reescribir los 6 bullets actuales siguiendo ese patrón.

### 2. Ajustar el headline al rol objetivo
- **Antes:** "Representante de ventas"
- **Después:** "SDR remoto | B2B SaaS | 2 años en outbound de alto volumen"

### 3. Grabar un loom de 90 segundos
Introducción en inglés, pitch corto de un producto ficticio. Es el artefacto que abre puertas en aplicaciones USD.

---

**Próxima evaluación:** ${addDays(7).toISOString().slice(0, 10)}. Tráeme el CV re-escrito + el loom y pasamos a la pipeline de postulación.
`,
    profile_md: `# Fabián Álvarez
**2 años SDR outbound · B2B SaaS · IELTS 6.5 (C1)**

Background sólido en prospección B2B: 2 años ejecutando outbound para una SaaS local. Conoce el motion clásico (cold call + email + LinkedIn), maneja CRM (HubSpot), y ha sostenido cuotas consistentemente.

**Gap detectado:** presentación. El CV y LinkedIn no comunican el valor del track record. Con un ajuste de 3-5 días, entra a la pipeline.
`,
    intake: FABIAN_INTAKE,
  },
  {
    user_id: "demo-experience-0001",
    profile_id: "22222222-2222-4222-8222-222222222222",
    email: "enrique+demo-experience@cruzarapp.com",
    name: "María García",
    whatsapp: "+51987000222",
    slug: "maria-garcia",
    local_salary_usd: 7200,
    cert: {
      kind: "aprendly",
      score: "B2 — Aprendly verified",
      level: "B2",
      r2_key: "attestations/demo/experience/aprendly-b2.pdf",
    },
    verdict: "experience_gap",
    gaps: [
      {
        category: "Experiencia formal",
        severity: "high",
        evidence:
          "Cero experiencia laboral remunerada en roles de ventas o customer-facing. Sólo prácticas universitarias no relacionadas.",
      },
      {
        category: "Portfolio verificable",
        severity: "high",
        evidence:
          "Sin proyectos públicos, sin loom de demo, sin testimonios. Los empleadores USD quieren ver evidencia antes de la entrevista.",
      },
    ],
    plan_markdown: `## Plan de crecimiento — María

Tu inglés B2 y la motivación están. Lo que falta es evidencia de trabajo. Esto se construye en semanas, no días — pero es construible.

### Hitos (en orden)

1. **Proyecto 1 — Cold outreach challenge (2 semanas).**
   Elige 10 startups USD. Escríbeles un email + LinkedIn message personalizado cada una. Documenta templates, respuestas y aprendizajes en un repo público.

2. **Proyecto 2 — Loom SDR role-play (1 semana).**
   Graba una llamada de discovery en inglés con un amigo haciendo de prospect. Sube el video y un resumen de 1 página con hallazgos.

3. **Rol puente — 2-3 meses como SDR local.**
   Aplica a 5-10 startups latinoamericanas de B2B SaaS. El objetivo no es el sueldo; es tener 3 meses verificables + números concretos para el siguiente ciclo.

### Cuando termines los 3

**Próxima evaluación:** cuando completes los 3 hitos. No antes — sería desperdiciar el esfuerzo de postular sin evidencia.

Escríbeme a WhatsApp cuando tengas el link del repo del proyecto 1.
`,
    profile_md: `# María García
**Recién egresada · Aprendly B2 · Motivación alta, experiencia baja**

Estudiante de últimos ciclos de Administración. Inglés B2 verificado por Aprendly. Cero experiencia laboral remunerada en customer-facing.

**Gap detectado:** experiencia formal. Requiere 2-3 meses de construcción de portfolio + un puente laboral antes de entrar a pipeline USD.
`,
    intake: MARIA_INTAKE,
  },
] as const;

const FIXTURE_IDS = FIXTURES.map((f) => f.user_id);

function log(line: string): void {
  process.stdout.write(`${line}\n`);
}

async function resetFixtures(): Promise<void> {
  log("  Resetting fixtures (cascade delete via user.id FK)…");
  // `user` FKs from students + session + account + verification all cascade on
  // delete, and students cascades down to english_certs/intakes/profiles/etc.
  // A single user delete wipes the whole fixture tree.
  const deleted = await db
    .delete(user)
    .where(inArray(user.id, [...FIXTURE_IDS]))
    .returning({ id: user.id });
  log(`  Deleted ${deleted.length} fixture user(s).`);
}

async function fixtureExists(userId: string): Promise<boolean> {
  const rows = await db
    .select({ id: students.id })
    .from(students)
    .where(eq(students.id, userId))
    .limit(1);
  return rows.length > 0;
}

async function upsertFixture(f: Fixture): Promise<"created" | "exists"> {
  if (await fixtureExists(f.user_id)) return "exists";

  await db.transaction(async (tx) => {
    await tx
      .insert(user)
      .values({
        id: f.user_id,
        email: f.email,
        name: f.name,
        emailVerified: true,
      })
      .onConflictDoNothing({ target: user.id });

    await tx
      .insert(students)
      .values({
        id: f.user_id,
        email: f.email,
        name: f.name,
        whatsapp: f.whatsapp,
        local_salary_usd: f.local_salary_usd,
        // consent intentionally false — /p/<slug> must 404 for non-Ready
        // fixtures. Flip to true only on Ready students (produced live in
        // Part B of demo.md; not seeded here).
        consent_public_profile: false,
        public_slug: f.slug,
        onboarded_at: now,
      })
      .onConflictDoNothing({ target: students.id });

    await tx
      .insert(englishCerts)
      .values({
        student_id: f.user_id,
        kind: f.cert.kind,
        score: f.cert.score,
        level: f.cert.level,
        issued_at: addDays(-120),
        attestation_r2_key: f.cert.r2_key,
        verified: true,
      })
      .onConflictDoNothing();

    const intakeId = randomUUID();
    await tx
      .insert(intakes)
      .values({
        id: intakeId,
        student_id: f.user_id,
        started_at: addDays(-5),
        finalized_at: addDays(-1),
      })
      .onConflictDoNothing({ target: intakes.id });

    const batchRows = f.intake.map((b) => ({
      id: randomUUID(),
      intake_id: intakeId,
      batch_num: b.batch_num,
      prompt_text: `Batch ${b.batch_num} — ${b.theme} (10 preguntas adaptativas)`,
      questions_jsonb: b.questions.map((q) => ({
        question_key: q.question_key,
        question_text: q.question_text,
        rationale: q.rationale,
      })),
      sent_at: addDays(-5 + b.batch_num),
      raw_reply: b.questions.map((q) => `${q.question_text}\n${q.answer_text}`).join("\n\n"),
      reply_at: addDays(-4 + b.batch_num),
    }));

    await tx.insert(intakeBatches).values(batchRows).onConflictDoNothing();

    const answerRows = batchRows.flatMap((batch, batchIdx) => {
      const fixtureBatch = f.intake[batchIdx];
      if (!fixtureBatch) return [];
      return fixtureBatch.questions.map((q) => ({
        batch_id: batch.id,
        question_key: q.question_key,
        question_text: q.question_text,
        answer_text: q.answer_text,
        confidence: q.confidence,
      }));
    });

    await tx.insert(intakeBatchAnswers).values(answerRows).onConflictDoNothing();

    await tx
      .insert(profiles)
      .values({
        id: f.profile_id,
        student_id: f.user_id,
        readiness_verdict: f.verdict,
        gaps_jsonb: f.gaps,
        plan_markdown: f.plan_markdown,
        next_assessment_at: addDays(7),
        profile_md: f.profile_md,
        profile_md_version: 1,
        profile_md_generated_at: now,
        prompt_version: "demo-fixture-v1",
      })
      .onConflictDoNothing({ target: profiles.id });
  });

  return "created";
}

async function main(): Promise<void> {
  const started = Date.now();
  const reset = process.argv.includes("--reset");

  log(`Seeding ${FIXTURES.length} demo fixtures${reset ? " (with --reset)" : ""}…`);

  log("  Warming Neon (select 1)…");
  const warmed = Date.now();
  await db.execute(sql`select 1`);
  log(`  Neon warm in ${Date.now() - warmed}ms.`);

  if (reset) await resetFixtures();

  for (const f of FIXTURES) {
    const t0 = Date.now();
    const state = await upsertFixture(f);
    log(`  ${f.email}: ${state} (${Date.now() - t0}ms)`);
  }

  log(`Done in ${Math.round((Date.now() - started) / 1000)}s.`);
}

main()
  .then(() => process.exit(0))
  .catch((err: unknown) => {
    console.error("seed-demo-fixtures failed:", err);
    process.exit(1);
  });
