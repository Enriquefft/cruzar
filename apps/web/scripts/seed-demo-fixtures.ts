import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
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

interface Fixture {
  user_id: string;
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
}

const now = new Date();
const addDays = (n: number): Date => new Date(now.getTime() + n * 24 * 60 * 60 * 1000);

const FIXTURES: readonly Fixture[] = [
  {
    user_id: "demo-presentation-0001",
    email: "demo-presentation@cruzar.local",
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
  },
  {
    user_id: "demo-experience-0001",
    email: "demo-experience@cruzar.local",
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
  },
] as const;

function log(line: string): void {
  process.stdout.write(`${line}\n`);
}

async function upsertFixture(f: Fixture): Promise<"created" | "exists"> {
  return await db.transaction(async (tx) => {
    const userInserted = await tx
      .insert(user)
      .values({
        id: f.user_id,
        email: f.email,
        name: f.name,
        emailVerified: true,
      })
      .onConflictDoNothing({ target: user.id })
      .returning({ id: user.id });

    if (userInserted.length === 0) return "exists";

    await tx.insert(students).values({
      id: f.user_id,
      email: f.email,
      name: f.name,
      whatsapp: f.whatsapp,
      local_salary_usd: f.local_salary_usd,
      consent_public_profile: false,
      public_slug: f.slug,
      onboarded_at: now,
    });

    await tx.insert(englishCerts).values({
      student_id: f.user_id,
      kind: f.cert.kind,
      score: f.cert.score,
      level: f.cert.level,
      issued_at: addDays(-120),
      attestation_r2_key: f.cert.r2_key,
      verified: true,
    });

    const intakeId = randomUUID();
    await tx.insert(intakes).values({
      id: intakeId,
      student_id: f.user_id,
      started_at: addDays(-5),
      finalized_at: addDays(-1),
    });

    const batchRows = [1, 2, 3, 4].map((n) => ({
      id: randomUUID(),
      intake_id: intakeId,
      batch_num: n,
      prompt_text: `Batch ${n} — 10 preguntas adaptativas (fixture)`,
      questions_jsonb: [
        {
          question_key: `q_${n}_1`,
          question_text: "Pregunta fixture para demo",
          rationale: "fixture",
        },
      ],
      sent_at: addDays(-5 + n),
      raw_reply: "Respuesta de demo (fixture).",
      reply_at: addDays(-4 + n),
    }));

    await tx.insert(intakeBatches).values(batchRows);

    const answerRows = batchRows.map((b) => ({
      batch_id: b.id,
      question_key: `q_${b.batch_num}_1`,
      question_text: "Pregunta fixture para demo",
      answer_text: "Respuesta fixture para demo.",
      confidence: 0.9,
    }));

    await tx.insert(intakeBatchAnswers).values(answerRows);

    await tx.insert(profiles).values({
      student_id: f.user_id,
      readiness_verdict: f.verdict,
      gaps_jsonb: f.gaps,
      plan_markdown: f.plan_markdown,
      next_assessment_at: addDays(7),
      profile_md: f.profile_md,
      profile_md_version: 1,
      profile_md_generated_at: now,
      prompt_version: "demo-fixture-v1",
    });

    return "created";
  });
}

async function main(): Promise<void> {
  const started = Date.now();
  log(`Seeding ${FIXTURES.length} demo fixtures…`);

  log("  Warming Neon (select 1)…");
  const warmed = Date.now();
  await db.execute(sql`select 1`);
  log(`  Neon warm in ${Date.now() - warmed}ms.`);

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
