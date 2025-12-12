ALTER TABLE "events" ALTER COLUMN "event_mode" SET DATA TYPE "public"."eventMode";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_mode" SET DEFAULT 'online';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_category" SET DATA TYPE "public"."eventCategory";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_category" SET DEFAULT 'other';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "payment_type" SET DATA TYPE "public"."paymentType";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "payment_type" SET DEFAULT 'free';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_status" SET DATA TYPE "public"."eventStatus";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_status" SET DEFAULT 'upcoming';--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_type" SET DATA TYPE "public"."eventType";--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "event_type" SET DEFAULT 'solo';--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_role" "user_role" DEFAULT 'student' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "role";