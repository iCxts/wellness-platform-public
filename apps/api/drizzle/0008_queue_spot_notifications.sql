ALTER TYPE "notification_type" ADD VALUE 'spot_opened';
--> statement-breakpoint
ALTER TABLE "notifications" ADD COLUMN "session_id" uuid;
--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
