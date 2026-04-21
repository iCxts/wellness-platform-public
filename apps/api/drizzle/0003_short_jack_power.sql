CREATE TYPE "public"."session_level" AS ENUM('beginner', 'pre_intermediate', 'intermediate', 'advanced');--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "level" "session_level";--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "focus" text[];--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "description" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "sessions" ADD COLUMN "room_name" text;