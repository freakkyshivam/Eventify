CREATE TYPE "public"."user_role" AS ENUM('student', 'coordinator', 'club_admin', 'super_admin');--> statement-breakpoint
CREATE TYPE "public"."event_category" AS ENUM('conference', 'webinar', 'workshop', 'competition', 'technology', 'coding', 'other');--> statement-breakpoint
CREATE TYPE "public"."event_mode" AS ENUM('online', 'offline');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('upcoming', 'ongoing', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('solo', 'team');--> statement-breakpoint
CREATE TYPE "public"."payment_type" AS ENUM('free', 'paid');--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"username" varchar(50) NOT NULL,
	"email" varchar(250) NOT NULL,
	"password" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'student' NOT NULL,
	"roll_number" varchar(50) NOT NULL,
	"branch" varchar(50) NOT NULL,
	"year" integer NOT NULL,
	"phone" varchar(15) NOT NULL,
	"profile_image_url" text,
	"verify_otp" varchar(10),
	"verify_otp_expired_at" timestamp with time zone,
	"reset_otp" varchar(10),
	"reset_otp_expired_at" timestamp with time zone,
	"is_account_verified" boolean DEFAULT false NOT NULL,
	"is_profile_complete" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_roll_number_unique" UNIQUE("roll_number")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(200) NOT NULL,
	"description" text NOT NULL,
	"banner_urls" text[] DEFAULT '{}' NOT NULL,
	"start_time" timestamp with time zone NOT NULL,
	"end_time" timestamp with time zone NOT NULL,
	"registration_deadline" timestamp with time zone NOT NULL,
	"location" varchar(200) NOT NULL,
	"event_mode" "event_mode" DEFAULT 'online' NOT NULL,
	"capacity" integer DEFAULT 100 NOT NULL,
	"event_category" "event_category" DEFAULT 'other' NOT NULL,
	"payment_type" "payment_type" DEFAULT 'free' NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"event_status" "event_status" DEFAULT 'upcoming' NOT NULL,
	"event_type" "event_type" DEFAULT 'solo' NOT NULL,
	"min_team_size" integer DEFAULT 1 NOT NULL,
	"max_team_size" integer DEFAULT 1 NOT NULL,
	"organizing_club" varchar(100) NOT NULL,
	"allowed_branches" text[] DEFAULT '{}' NOT NULL,
	"allowed_years" integer[] DEFAULT '{}' NOT NULL,
	"author_id" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;