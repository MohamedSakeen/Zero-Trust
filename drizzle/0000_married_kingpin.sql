CREATE TYPE "public"."difficulty" AS ENUM('easy', 'medium', 'hard');--> statement-breakpoint
CREATE TYPE "public"."exam_status" AS ENUM('draft', 'scheduled', 'active', 'completed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."flag_action" AS ENUM('cleared', 'warning', 'invalidated');--> statement-breakpoint
CREATE TYPE "public"."proctoring_event_type" AS ENUM('tab-switch', 'window-blur', 'copy-attempt', 'right-click', 'multiple-faces', 'no-face');--> statement-breakpoint
CREATE TYPE "public"."proctoring_flag_type" AS ENUM('identity-mismatch', 'multiple-faces', 'no-face', 'suspicious-activity', 'tab-switching');--> statement-breakpoint
CREATE TYPE "public"."proctoring_status" AS ENUM('monitoring', 'flagged', 'reviewed', 'cleared');--> statement-breakpoint
CREATE TYPE "public"."question_status" AS ENUM('draft', 'active', 'archived');--> statement-breakpoint
CREATE TYPE "public"."question_type" AS ENUM('multiple-choice', 'true-false', 'short-answer');--> statement-breakpoint
CREATE TYPE "public"."session_status" AS ENUM('in-progress', 'submitted', 'auto-submitted', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."severity" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'faculty', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'suspended');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" varchar(255) NOT NULL,
	"performed_by" uuid NOT NULL,
	"target_user" uuid,
	"details" jsonb NOT NULL,
	"ip_address" varchar(45) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_answers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"answer" jsonb NOT NULL,
	"is_correct" boolean,
	"points_earned" integer,
	"answered_at" timestamp DEFAULT now() NOT NULL,
	"time_spent" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_assignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"assigned_at" timestamp DEFAULT now() NOT NULL,
	"assigned_by" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"question_id" uuid NOT NULL,
	"order" integer NOT NULL,
	"points" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exam_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"exam_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"submitted_at" timestamp,
	"time_remaining" integer NOT NULL,
	"current_question_index" integer DEFAULT 0 NOT NULL,
	"status" "session_status" DEFAULT 'in-progress' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "exams" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"subject" varchar(255) NOT NULL,
	"duration" integer NOT NULL,
	"total_points" integer NOT NULL,
	"passing_score" integer NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"settings" jsonb NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"status" "exam_status" DEFAULT 'draft' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proctoring_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proctoring_session_id" uuid NOT NULL,
	"type" "proctoring_event_type" NOT NULL,
	"details" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proctoring_flags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proctoring_session_id" uuid NOT NULL,
	"type" "proctoring_flag_type" NOT NULL,
	"severity" "severity" NOT NULL,
	"description" text NOT NULL,
	"reviewed" boolean DEFAULT false NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp,
	"action" "flag_action",
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proctoring_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"proctoring_session_id" uuid NOT NULL,
	"image_url" varchar(500) NOT NULL,
	"face_count" integer NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"captured_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "proctoring_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" uuid NOT NULL,
	"student_id" uuid NOT NULL,
	"exam_id" uuid NOT NULL,
	"risk_score" integer DEFAULT 0 NOT NULL,
	"status" "proctoring_status" DEFAULT 'monitoring' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"text" text NOT NULL,
	"type" "question_type" NOT NULL,
	"subject" varchar(255) NOT NULL,
	"topic" varchar(255) NOT NULL,
	"difficulty" "difficulty" NOT NULL,
	"points" integer NOT NULL,
	"options" jsonb,
	"correct_answer" jsonb NOT NULL,
	"explanation" text,
	"status" "question_status" DEFAULT 'draft' NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"version" integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" "user_role" NOT NULL,
	"department" varchar(255),
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_login" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_performed_by_users_id_fk" FOREIGN KEY ("performed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_target_user_users_id_fk" FOREIGN KEY ("target_user") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_session_id_exam_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."exam_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_answers" ADD CONSTRAINT "exam_answers_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_assignments" ADD CONSTRAINT "exam_assignments_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_assignments" ADD CONSTRAINT "exam_assignments_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_assignments" ADD CONSTRAINT "exam_assignments_assigned_by_users_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_questions" ADD CONSTRAINT "exam_questions_question_id_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."questions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_sessions" ADD CONSTRAINT "exam_sessions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exams" ADD CONSTRAINT "exams_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_events" ADD CONSTRAINT "proctoring_events_proctoring_session_id_proctoring_sessions_id_fk" FOREIGN KEY ("proctoring_session_id") REFERENCES "public"."proctoring_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_flags" ADD CONSTRAINT "proctoring_flags_proctoring_session_id_proctoring_sessions_id_fk" FOREIGN KEY ("proctoring_session_id") REFERENCES "public"."proctoring_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_flags" ADD CONSTRAINT "proctoring_flags_reviewed_by_users_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_photos" ADD CONSTRAINT "proctoring_photos_proctoring_session_id_proctoring_sessions_id_fk" FOREIGN KEY ("proctoring_session_id") REFERENCES "public"."proctoring_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_sessions" ADD CONSTRAINT "proctoring_sessions_session_id_exam_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."exam_sessions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_sessions" ADD CONSTRAINT "proctoring_sessions_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "proctoring_sessions" ADD CONSTRAINT "proctoring_sessions_exam_id_exams_id_fk" FOREIGN KEY ("exam_id") REFERENCES "public"."exams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "questions" ADD CONSTRAINT "questions_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;