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