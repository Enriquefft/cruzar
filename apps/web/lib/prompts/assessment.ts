import { z } from "zod";
import { gapSeverityValues, readinessVerdictValues } from "@/schemas/_shared";
import type { LlmMessage } from "@/lib/llm";

export const PROMPT_VERSION = "assessment-v1" as const;

// ---------------------------------------------------------------------------
// LLM output schemas
// ---------------------------------------------------------------------------

export const readinessGapSchema = z.object({
  category: z.string().min(1),
  severity: z.enum(gapSeverityValues),
  evidence: z.string().min(1),
});
export type ReadinessGap = z.infer<typeof readinessGapSchema>;

export const readinessSchema = z.object({
  verdict: z.enum(readinessVerdictValues),
  confidence: z.number().min(0).max(1),
  gaps: z.array(readinessGapSchema),
});
export type ReadinessResult = z.infer<typeof readinessSchema>;

export const planMilestoneSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  due_in_days: z.number().int().positive().optional(),
});
export type PlanMilestone = z.infer<typeof planMilestoneSchema>;

export const planSchema = z.object({
  plan_markdown: z.string(),
  milestones: z.array(planMilestoneSchema),
  next_assessment_in_days: z.number().int().positive(),
});
export type PlanResult = z.infer<typeof planSchema>;

export const roleMatchEntrySchema = z.object({
  role_id: z.string().uuid(),
  rank: z.number().int().min(1).max(3),
  rationale: z.string().min(1),
});
export type RoleMatchEntry = z.infer<typeof roleMatchEntrySchema>;

export const roleMatchSchema = z.object({
  matches: z.array(roleMatchEntrySchema).length(3),
});
export type RoleMatchResult = z.infer<typeof roleMatchSchema>;

const PROFILE_MD_REQUIRED_SECTIONS = [
  "identity",
  "background",
  "skills",
  "stories",
  "context",
  "evaluations",
] as const;

export const profileMdSchema = z.object({
  profile_md: z.string().min(100),
  sections_present: z
    .array(z.string())
    .refine(
      (sections) =>
        PROFILE_MD_REQUIRED_SECTIONS.every((required) =>
          sections.some((s) => s.toLowerCase() === required),
        ),
      {
        message: `profile_md must include all required sections: ${PROFILE_MD_REQUIRED_SECTIONS.join(", ")}`,
      },
    ),
});
export type ProfileMdResult = z.infer<typeof profileMdSchema>;

// ---------------------------------------------------------------------------
// Input types for prompt renderers
// ---------------------------------------------------------------------------

export interface AnswerEntry {
  question_key: string;
  question_text: string;
  answer_text: string;
  confidence: number;
}

export interface CertSummary {
  kind: string;
  score: string;
  level: string;
}

export interface RoleCatalogEntry {
  id: string;
  title: string;
  comp_min_usd: number;
  comp_max_usd: number;
  english_level: string;
  skills_jsonb: string[];
  employer_type: string;
  entry_level: boolean;
}

export interface RoleMatchSummary {
  role_title: string;
  rank: number;
  rationale: string;
  comp_min_usd: number;
  comp_max_usd: number;
}

// ---------------------------------------------------------------------------
// Prompt renderers
// ---------------------------------------------------------------------------

const readinessSystem = `You are the Cruzar readiness classifier. Given a student's full intake Q&A (up to 40 answers across 4 batches) and their English certification, classify them into one of three verdicts:

- "ready" — the student has sufficient experience, communication skills, and positioning to be matched with remote roles and have competitive applications submitted on their behalf. They may have minor gaps but nothing that blocks immediate placement.
- "presentation_gap" — the student has real experience and skills but their self-presentation (storytelling, framing accomplishments, articulating value) needs work before applications would be competitive. Fixable in days/weeks with coaching.
- "experience_gap" — the student lacks sufficient professional experience, domain knowledge, or English fluency for the target role catalog. Needs real growth milestones (projects, certifications, practice) over weeks/months.

Classification rules:
- B2+ English cert is a prerequisite (already validated upstream). Weight their actual demonstration of English in answers, not just the cert level.
- Look for concrete work stories with outcomes. Vague answers like "I helped the team" without specifics suggest presentation_gap. Zero work stories suggest experience_gap.
- Voice-first remote roles (SDR, CS, AM) demand spoken confidence and sales/service instincts. Evaluate if their answers reveal these.
- Students may answer in Spanish or English. Spanish answers are valid. Evaluate content quality regardless of language.
- Confidence should reflect your certainty in the verdict (0.7+ for clear cases, 0.4-0.7 for borderline).
- Every gap must cite specific evidence from their answers or cert.

Output strict JSON:
{
  "verdict": "ready" | "presentation_gap" | "experience_gap",
  "confidence": <number 0-1>,
  "gaps": [{ "category": "<string>", "severity": "low" | "medium" | "high", "evidence": "<string>" }]
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

interface RenderReadinessInput {
  answers: readonly AnswerEntry[];
  cert: CertSummary;
}

export function renderReadinessPrompt({ answers, cert }: RenderReadinessInput): LlmMessage[] {
  const answersJson = JSON.stringify(answers, null, 2);
  const user = `English certification:
- Kind: ${cert.kind}, Score: ${cert.score}, Level: ${cert.level}

All intake answers (${answers.length} total):
${answersJson}

Classify this student's readiness now as strict JSON.`;
  return [
    { role: "system", content: readinessSystem },
    { role: "user", content: user },
  ];
}

// ---------------------------------------------------------------------------

const planSystemPresentation = `You are the Cruzar plan generator for students with a "presentation_gap" verdict. The student has real experience but needs to improve how they present themselves for remote roles.

Generate an actionable plan with:
- plan_markdown: A markdown document with specific, concrete steps. Focus on CV/LinkedIn positioning fixes, storytelling practice, and framing accomplishments with metrics. Written in Spanish (the operator will share it with the student). If the student is ready (no plan needed), set this to an empty string.
- milestones: Measurable checkpoints the operator can verify.
- next_assessment_in_days: When to re-assess (typically 7-14 days for presentation gaps).

The plan must reference the specific gaps identified. Generic advice is useless.

Output strict JSON:
{
  "plan_markdown": "<markdown string>",
  "milestones": [{ "title": "<string>", "description": "<string>", "due_in_days": <int, optional> }],
  "next_assessment_in_days": <int>
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

const planSystemExperience = `You are the Cruzar plan generator for students with an "experience_gap" verdict. The student lacks sufficient professional experience for the target remote role catalog.

Generate a growth plan with:
- plan_markdown: A markdown document with realistic growth milestones. May include suggested projects, certifications, volunteer work, or practice activities. Written in Spanish. If the student is ready (no plan needed), set this to an empty string.
- milestones: Concrete, verifiable achievements that would close the gap.
- next_assessment_in_days: When to re-assess (typically 30-90 days for experience gaps).

The plan must reference the specific gaps identified. Do not suggest anything the student cannot realistically do from Peru with an internet connection.

Output strict JSON:
{
  "plan_markdown": "<markdown string>",
  "milestones": [{ "title": "<string>", "description": "<string>", "due_in_days": <int, optional> }],
  "next_assessment_in_days": <int>
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

interface RenderPlanInput {
  verdict: "presentation_gap" | "experience_gap";
  gaps: readonly ReadinessGap[];
  answers: readonly AnswerEntry[];
  cert: CertSummary;
}

export function renderPlanPrompt({ verdict, gaps, answers, cert }: RenderPlanInput): LlmMessage[] {
  const system = verdict === "presentation_gap" ? planSystemPresentation : planSystemExperience;
  const gapsJson = JSON.stringify(gaps, null, 2);
  const answersJson = JSON.stringify(answers, null, 2);
  const user = `Verdict: ${verdict}

English certification:
- Kind: ${cert.kind}, Score: ${cert.score}, Level: ${cert.level}

Identified gaps:
${gapsJson}

All intake answers (${answers.length} total):
${answersJson}

Generate the plan now as strict JSON.`;
  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

// ---------------------------------------------------------------------------

const roleMatchSystem = `You are the Cruzar role matcher. Given a student's intake answers, English certification, and identified gaps, select the top 3 best-fit roles from the provided catalog.

Matching criteria:
- English level must meet the role's requirement. A B2 student qualifies for B2 roles. C1 qualifies for C1 and below.
- Skills alignment: weight demonstrated skills from answers over self-reported skills.
- Entry-level roles are preferred for students with <2 years of experience. Non-entry-level roles need evidence of relevant tenure.
- Rank 1 = best fit, rank 3 = third best. All three must be distinct roles.
- Rationale must cite specific evidence from the student's answers that supports the match.

Output strict JSON:
{
  "matches": [
    { "role_id": "<uuid>", "rank": 1, "rationale": "<string>" },
    { "role_id": "<uuid>", "rank": 2, "rationale": "<string>" },
    { "role_id": "<uuid>", "rank": 3, "rationale": "<string>" }
  ]
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

interface RenderRoleMatchInput {
  answers: readonly AnswerEntry[];
  cert: CertSummary;
  gaps: readonly ReadinessGap[];
  rolesCatalog: readonly RoleCatalogEntry[];
}

export function renderRoleMatchPrompt({
  answers,
  cert,
  gaps,
  rolesCatalog,
}: RenderRoleMatchInput): LlmMessage[] {
  const answersJson = JSON.stringify(answers, null, 2);
  const gapsJson = JSON.stringify(gaps, null, 2);
  const catalogJson = JSON.stringify(rolesCatalog, null, 2);
  const user = `English certification:
- Kind: ${cert.kind}, Score: ${cert.score}, Level: ${cert.level}

Identified gaps (minor, since student is verdict=ready):
${gapsJson}

Roles catalog:
${catalogJson}

All intake answers (${answers.length} total):
${answersJson}

Select the top 3 roles now as strict JSON.`;
  return [
    { role: "system", content: roleMatchSystem },
    { role: "user", content: user },
  ];
}

// ---------------------------------------------------------------------------

const profileMdSystem = `You are the Cruzar profile synthesizer. You produce the single authoritative narrative document for a student — their profile_md. This is the SSOT that all downstream artifacts (CVs, public profiles, role applications) derive from.

Input: all intake Q&A (up to 40 answers), English certification, assessment gaps, and role matches.

The profile_md must be a structured markdown document with these required sections:
1. **Identity** — who they are, where they're based, career stage, what they're looking for. First person is fine.
2. **Background** — education, work history timeline, key roles and tenures.
3. **Skills** — technical skills, tools, languages, domain knowledge. Organized by category.
4. **Stories** — concrete accomplishments with context, action, and results. Use the STAR framework implicitly (don't label it). These are the raw material for CV tailoring.
5. **Context** — salary expectations, availability, timezone, remote work setup, preferences, deal-breakers.
6. **Evaluations** — assessment findings: English level, identified gaps, matched roles with compensation ranges, salary delta if applicable.

Writing rules:
- Dense and factual. No filler, no motivational fluff, no "passionate about" language.
- Preserve the student's own words and stories faithfully. Enhance structure, not content.
- Spanish or English sections are both fine — match the language of the underlying answers where it strengthens fidelity.
- Include the salary delta computation in the Evaluations section if a local salary was provided: delta = role_comp_midpoint - local_salary_usd.
- Quantify everything that can be quantified. Dates, durations, metrics, team sizes.
- No PII beyond what is already in the intake answers (no phone numbers, no home addresses).
- No placeholder text ("TBD", "to be filled", "[insert here]").

Output strict JSON:
{
  "profile_md": "<full markdown string>",
  "sections_present": ["identity", "background", "skills", "stories", "context", "evaluations"]
}

PROMPT_VERSION: ${PROMPT_VERSION}`;

interface RenderProfileMdInput {
  answers: readonly AnswerEntry[];
  cert: CertSummary;
  gaps: readonly ReadinessGap[];
  roleMatches: readonly RoleMatchSummary[];
  localSalaryUsd: number | null;
}

export function renderProfileMdPrompt({
  answers,
  cert,
  gaps,
  roleMatches,
  localSalaryUsd,
}: RenderProfileMdInput): LlmMessage[] {
  const answersJson = JSON.stringify(answers, null, 2);
  const gapsJson = JSON.stringify(gaps, null, 2);
  const matchesJson = JSON.stringify(roleMatches, null, 2);
  const salaryLine =
    localSalaryUsd !== null
      ? `Local salary: $${localSalaryUsd} USD/year. Compute the delta against each matched role's midpoint in the Evaluations section.`
      : "No local salary provided. Omit salary delta from Evaluations.";

  const user = `English certification:
- Kind: ${cert.kind}, Score: ${cert.score}, Level: ${cert.level}

Assessment gaps:
${gapsJson}

Role matches:
${matchesJson}

${salaryLine}

All intake answers (${answers.length} total):
${answersJson}

Synthesize the profile_md now as strict JSON.`;
  return [
    { role: "system", content: profileMdSystem },
    { role: "user", content: user },
  ];
}
