CREATE TYPE "public"."marketplace_role" AS ENUM('consumer', 'provider', 'admin');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text,
	"website" text,
	"avatar_url" text,
	"full_name" text,
	"role" "marketplace_role" DEFAULT 'consumer' NOT NULL,
	"phone" varchar(256),
	"created_at" timestamp,
	"updated_at" timestamp
);
