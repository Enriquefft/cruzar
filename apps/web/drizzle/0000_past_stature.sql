CREATE TYPE "public"."application_status" AS ENUM('evaluated', 'applied', 'responded', 'interview', 'offer', 'rejected', 'discarded', 'skip');--> statement-breakpoint
CREATE TYPE "public"."employer_type" AS ENUM('startup', 'smb', 'enterprise', 'agency', 'other');--> statement-breakpoint
CREATE TYPE "public"."english_cert_kind" AS ENUM('ielts', 'toefl', 'cambridge', 'aprendly', 'other');--> statement-breakpoint
CREATE TYPE "public"."english_level" AS ENUM('A2', 'B1', 'B2', 'C1', 'C2');--> statement-breakpoint
CREATE TYPE "public"."fill_form_draft_state" AS ENUM('drafted', 'submitted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."gap_severity" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."platform" AS ENUM('greenhouse', 'lever', 'ashby', 'workable', 'other');--> statement-breakpoint
CREATE TYPE "public"."readiness_verdict" AS ENUM('ready', 'presentation_gap', 'experience_gap');--> statement-breakpoint
CREATE TYPE "public"."status_event_kind" AS ENUM('evaluated', 'applied', 'responded', 'interview', 'offer', 'rejected', 'discarded', 'skip', 'viewed', 'interview_invited');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"accountId" text NOT NULL,
	"providerId" text NOT NULL,
	"accessToken" text,
	"refreshToken" text,
	"accessTokenExpiresAt" timestamp with time zone,
	"refreshTokenExpiresAt" timestamp with time zone,
	"scope" text,
	"idToken" text,
	"password" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"role_id" uuid,
	"company_name" text NOT NULL,
	"company_normalized" text NOT NULL,
	"role_normalized" text NOT NULL,
	"job_url" text NOT NULL,
	"platform" "platform" NOT NULL,
	"status" "application_status" NOT NULL,
	"applied_at" timestamp with time zone,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"career_ops_report_r2_key" text
);
--> statement-breakpoint
CREATE TABLE "english_certs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"kind" "english_cert_kind" NOT NULL,
	"score" text NOT NULL,
	"level" "english_level" NOT NULL,
	"issued_at" timestamp with time zone NOT NULL,
	"attestation_r2_key" text NOT NULL,
	"verified" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fill_form_drafts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"screenshot_r2_keys_jsonb" jsonb NOT NULL,
	"missed_fields_jsonb" jsonb NOT NULL,
	"needs_human_jsonb" jsonb NOT NULL,
	"state" "fill_form_draft_state" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "generated_cvs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"application_id" uuid NOT NULL,
	"cv_markdown" text NOT NULL,
	"cv_r2_key" text NOT NULL,
	"version" integer NOT NULL,
	"changes_summary" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intake_batch_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"batch_id" uuid NOT NULL,
	"question_key" text NOT NULL,
	"question_text" text NOT NULL,
	"answer_text" text NOT NULL,
	"confidence" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intake_batches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"intake_id" uuid NOT NULL,
	"batch_num" integer NOT NULL,
	"prompt_text" text NOT NULL,
	"sent_at" timestamp with time zone,
	"raw_reply" text,
	"reply_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "intakes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"finalized_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"readiness_verdict" "readiness_verdict" NOT NULL,
	"gaps_jsonb" jsonb NOT NULL,
	"plan_markdown" text NOT NULL,
	"next_assessment_at" timestamp with time zone,
	"profile_md" text NOT NULL,
	"profile_md_version" integer DEFAULT 1 NOT NULL,
	"profile_md_generated_at" timestamp with time zone,
	"showcase_cv_r2_key" text,
	"prompt_version" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "role_matches" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"profile_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"rank" integer NOT NULL,
	"rationale" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "roles" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"comp_min_usd" integer NOT NULL,
	"comp_max_usd" integer NOT NULL,
	"english_level" "english_level" NOT NULL,
	"skills_jsonb" jsonb NOT NULL,
	"employer_type" "employer_type" NOT NULL,
	"entry_level" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"token" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"ipAddress" text,
	"userAgent" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "status_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" text NOT NULL,
	"application_id" uuid,
	"kind" "status_event_kind" NOT NULL,
	"note" text,
	"interview_time" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "students" (
	"id" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"local_salary_usd" integer,
	"consent_public_profile" boolean DEFAULT false NOT NULL,
	"public_slug" text NOT NULL,
	"onboarded_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "students_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"emailVerified" boolean DEFAULT false NOT NULL,
	"image" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expiresAt" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "english_certs" ADD CONSTRAINT "english_certs_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "fill_form_drafts" ADD CONSTRAINT "fill_form_drafts_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_cvs" ADD CONSTRAINT "generated_cvs_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "generated_cvs" ADD CONSTRAINT "generated_cvs_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_batch_answers" ADD CONSTRAINT "intake_batch_answers_batch_id_intake_batches_id_fk" FOREIGN KEY ("batch_id") REFERENCES "public"."intake_batches"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intake_batches" ADD CONSTRAINT "intake_batches_intake_id_intakes_id_fk" FOREIGN KEY ("intake_id") REFERENCES "public"."intakes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "intakes" ADD CONSTRAINT "intakes_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_matches" ADD CONSTRAINT "role_matches_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_matches" ADD CONSTRAINT "role_matches_role_id_roles_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_events" ADD CONSTRAINT "status_events_student_id_students_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."students"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "status_events" ADD CONSTRAINT "status_events_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "students" ADD CONSTRAINT "students_id_user_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "applications_idem_idx" ON "applications" USING btree ("student_id","company_normalized","role_normalized","job_url");--> statement-breakpoint
CREATE INDEX "applications_student_created_idx" ON "applications" USING btree ("student_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "generated_cvs_unique" ON "generated_cvs" USING btree ("application_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "intake_batches_unique" ON "intake_batches" USING btree ("intake_id","batch_num");--> statement-breakpoint
CREATE INDEX "role_matches_profile_id_idx" ON "role_matches" USING btree ("profile_id");--> statement-breakpoint
CREATE UNIQUE INDEX "roles_title_unique" ON "roles" USING btree ("title");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "status_events_student_created_idx" ON "status_events" USING btree ("student_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE UNIQUE INDEX "students_public_slug_unique" ON "students" USING btree ("public_slug");