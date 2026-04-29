ALTER TABLE "bookings" ADD COLUMN "no_show" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "bookings" ADD COLUMN "admin_notes" text;