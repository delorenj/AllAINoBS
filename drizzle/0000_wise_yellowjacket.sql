CREATE TYPE "public"."availability_exception_type" AS ENUM('blackout', 'override');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'paid', 'canceled');--> statement-breakpoint
CREATE TABLE "availability_exceptions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" text,
	"date_iso" date NOT NULL,
	"type" "availability_exception_type" NOT NULL,
	"start_minutes" integer,
	"end_minutes" integer,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" text,
	"weekday" integer NOT NULL,
	"start_minutes" integer NOT NULL,
	"end_minutes" integer NOT NULL,
	"interval_minutes" integer DEFAULT 30 NOT NULL,
	"tz" text DEFAULT 'America/New_York' NOT NULL,
	"active_from" date,
	"active_until" date,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meeting_id" text NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"slot_iso" timestamp with time zone NOT NULL,
	"slot_label" text NOT NULL,
	"duration_minutes" integer NOT NULL,
	"intake_json" jsonb NOT NULL,
	"payment_intent_id" text,
	"amount_cents" integer DEFAULT 0 NOT NULL,
	"confirmation_id" text NOT NULL,
	"google_event_id" text,
	"google_meet_url" text,
	"n8n_email_run_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "stripe_events" (
	"id" text PRIMARY KEY NOT NULL,
	"type" text NOT NULL,
	"payload_json" jsonb NOT NULL,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "todos" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX "availability_exceptions_date_idx" ON "availability_exceptions" USING btree ("date_iso","meeting_id");--> statement-breakpoint
CREATE INDEX "availability_rules_meeting_weekday_idx" ON "availability_rules" USING btree ("meeting_id","weekday");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_confirmation_id_uniq" ON "bookings" USING btree ("confirmation_id");--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_meeting_slot_committed_uniq" ON "bookings" USING btree ("meeting_id","slot_iso") WHERE status in ('confirmed', 'paid');--> statement-breakpoint
CREATE INDEX "bookings_slot_iso_idx" ON "bookings" USING btree ("slot_iso");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");