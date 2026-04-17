import { sql } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  applicationStatusValues,
  employerTypeValues,
  englishCertKindValues,
  englishLevelValues,
  fillFormDraftStateValues,
  gapSeverityValues,
  platformValues,
  readinessVerdictValues,
  statusEventKindValues,
} from "@/schemas/_shared";
import type { FillFormMissedField, FillFormNeedsHuman } from "@/schemas/fill-form-draft";
import type { ProfileGap } from "@/schemas/profile";

// ---------------------------------------------------------------------------
// Better Auth tables. Column names mirror the canonical shape from
// `@better-auth/core/db/get-tables` (camelCase fieldNames). Changing a name
// here breaks the Better Auth drizzle adapter.
// ---------------------------------------------------------------------------

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable(
  "session",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("session_userId_idx").on(t.userId)],
);

export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt", { withTimezone: true }),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt", { withTimezone: true }),
    scope: text("scope"),
    idToken: text("idToken"),
    password: text("password"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("account_userId_idx").on(t.userId)],
);

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// App enums — mirrored from `schemas/_shared.ts`.
// ---------------------------------------------------------------------------

export const readinessVerdictDbEnum = pgEnum("readiness_verdict", readinessVerdictValues);
export const englishCertKindDbEnum = pgEnum("english_cert_kind", englishCertKindValues);
export const englishLevelDbEnum = pgEnum("english_level", englishLevelValues);
export const applicationStatusDbEnum = pgEnum("application_status", applicationStatusValues);
export const fillFormDraftStateDbEnum = pgEnum("fill_form_draft_state", fillFormDraftStateValues);
export const statusEventKindDbEnum = pgEnum("status_event_kind", statusEventKindValues);
export const platformDbEnum = pgEnum("platform", platformValues);
export const gapSeverityDbEnum = pgEnum("gap_severity", gapSeverityValues);
export const employerTypeDbEnum = pgEnum("employer_type", employerTypeValues);

// ---------------------------------------------------------------------------
// App tables.
// `students.id` FKs to Better Auth `user.id` (text). All other FKs to
// `students.id` use `text`; FKs to internal UUID tables use `uuid`.
// Column names snake_case to match Zod schemas under `apps/web/schemas/`.
// ---------------------------------------------------------------------------

export const students = pgTable(
  "students",
  {
    id: text("id")
      .primaryKey()
      .references(() => user.id, { onDelete: "cascade" }),
    email: text("email").notNull().unique(),
    name: text("name").notNull(),
    whatsapp: text("whatsapp").notNull(),
    local_salary_usd: integer("local_salary_usd"),
    consent_public_profile: boolean("consent_public_profile").notNull().default(false),
    public_slug: text("public_slug").notNull(),
    onboarded_at: timestamp("onboarded_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("students_public_slug_unique").on(t.public_slug)],
);

export const englishCerts = pgTable("english_certs", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  kind: englishCertKindDbEnum("kind").notNull(),
  score: text("score").notNull(),
  level: englishLevelDbEnum("level").notNull(),
  issued_at: timestamp("issued_at", { withTimezone: true }).notNull(),
  attestation_r2_key: text("attestation_r2_key").notNull(),
  verified: boolean("verified").notNull().default(false),
});

export const intakes = pgTable("intakes", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  started_at: timestamp("started_at", { withTimezone: true }).notNull().defaultNow(),
  finalized_at: timestamp("finalized_at", { withTimezone: true }),
});

export const intakeBatches = pgTable(
  "intake_batches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    intake_id: uuid("intake_id")
      .notNull()
      .references(() => intakes.id, { onDelete: "cascade" }),
    batch_num: integer("batch_num").notNull(),
    prompt_text: text("prompt_text").notNull(),
    questions_jsonb: jsonb("questions_jsonb")
      .$type<Array<{ question_key: string; question_text: string; rationale: string }>>()
      .notNull(),
    sent_at: timestamp("sent_at", { withTimezone: true }),
    raw_reply: text("raw_reply"),
    reply_at: timestamp("reply_at", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("intake_batches_unique").on(t.intake_id, t.batch_num)],
);

export const intakeBatchAnswers = pgTable(
  "intake_batch_answers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    batch_id: uuid("batch_id")
      .notNull()
      .references(() => intakeBatches.id, { onDelete: "cascade" }),
    question_key: text("question_key").notNull(),
    question_text: text("question_text").notNull(),
    answer_text: text("answer_text").notNull(),
    confidence: real("confidence").notNull(),
  },
  (t) => [uniqueIndex("intake_batch_answers_unique").on(t.batch_id, t.question_key)],
);

export const roles = pgTable(
  "roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    comp_min_usd: integer("comp_min_usd").notNull(),
    comp_max_usd: integer("comp_max_usd").notNull(),
    english_level: englishLevelDbEnum("english_level").notNull(),
    skills_jsonb: jsonb("skills_jsonb").$type<string[]>().notNull(),
    employer_type: employerTypeDbEnum("employer_type").notNull(),
    entry_level: boolean("entry_level").notNull(),
  },
  (t) => [uniqueIndex("roles_title_unique").on(t.title)],
);

export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  student_id: text("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  readiness_verdict: readinessVerdictDbEnum("readiness_verdict").notNull(),
  gaps_jsonb: jsonb("gaps_jsonb").$type<ProfileGap[]>().notNull(),
  plan_markdown: text("plan_markdown").notNull(),
  next_assessment_at: timestamp("next_assessment_at", { withTimezone: true }),
  profile_md: text("profile_md").notNull(),
  profile_md_version: integer("profile_md_version").notNull().default(1),
  profile_md_generated_at: timestamp("profile_md_generated_at", { withTimezone: true }),
  showcase_cv_r2_key: text("showcase_cv_r2_key"),
  prompt_version: text("prompt_version").notNull(),
});

export const roleMatches = pgTable(
  "role_matches",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    profile_id: uuid("profile_id")
      .notNull()
      .references(() => profiles.id, { onDelete: "cascade" }),
    role_id: uuid("role_id")
      .notNull()
      .references(() => roles.id, { onDelete: "restrict" }),
    rank: integer("rank").notNull(),
    rationale: text("rationale").notNull(),
  },
  (t) => [index("role_matches_profile_id_idx").on(t.profile_id)],
);

export const applications = pgTable(
  "applications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    student_id: text("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    role_id: uuid("role_id").references(() => roles.id, { onDelete: "set null" }),
    company_name: text("company_name").notNull(),
    company_normalized: text("company_normalized").notNull(),
    role_normalized: text("role_normalized").notNull(),
    job_url: text("job_url").notNull(),
    platform: platformDbEnum("platform").notNull(),
    status: applicationStatusDbEnum("status").notNull(),
    applied_at: timestamp("applied_at", { withTimezone: true }),
    updated_at: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    career_ops_report_r2_key: text("career_ops_report_r2_key"),
  },
  (t) => [
    uniqueIndex("applications_idem_idx").on(
      t.student_id,
      t.company_normalized,
      t.role_normalized,
      t.job_url,
    ),
    index("applications_student_created_idx").on(t.student_id, t.created_at.desc()),
  ],
);

export const generatedCvs = pgTable(
  "generated_cvs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    student_id: text("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    application_id: uuid("application_id")
      .notNull()
      .references(() => applications.id, { onDelete: "cascade" }),
    cv_markdown: text("cv_markdown").notNull(),
    cv_r2_key: text("cv_r2_key").notNull(),
    version: integer("version").notNull(),
    changes_summary: text("changes_summary").notNull(),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("generated_cvs_unique").on(t.application_id, t.version)],
);

export const fillFormDrafts = pgTable("fill_form_drafts", {
  id: uuid("id").primaryKey().defaultRandom(),
  application_id: uuid("application_id")
    .notNull()
    .references(() => applications.id, { onDelete: "cascade" }),
  screenshot_r2_keys_jsonb: jsonb("screenshot_r2_keys_jsonb").$type<string[]>().notNull(),
  missed_fields_jsonb: jsonb("missed_fields_jsonb").$type<FillFormMissedField[]>().notNull(),
  needs_human_jsonb: jsonb("needs_human_jsonb").$type<FillFormNeedsHuman[]>().notNull(),
  state: fillFormDraftStateDbEnum("state").notNull(),
  created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const statusEvents = pgTable(
  "status_events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    student_id: text("student_id")
      .notNull()
      .references(() => students.id, { onDelete: "cascade" }),
    application_id: uuid("application_id").references(() => applications.id, {
      onDelete: "cascade",
    }),
    kind: statusEventKindDbEnum("kind").notNull(),
    note: text("note"),
    interview_time: timestamp("interview_time", { withTimezone: true }),
    created_at: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    // Per-day idempotency on (application_id, kind) is enforced at the script
    // boundary (apps/web/scripts/operator/_shared/status-events.ts), not at the DB
    // level — Postgres rejects `timestamptz::date` in a unique index expression
    // because the cast is not IMMUTABLE (session-timezone dependent).
    index("status_events_student_created_idx").on(t.student_id, t.created_at.desc()),
  ],
);
