import { pgTable, uuid, text, boolean, timestamp, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { users } from "./users";
import { sessions } from "./sessions";

export const notificationTypeEnum = pgEnum("notification_type", [
    "standby_promoted",
    "no_show_tagged",
    "absence_warning",
    "feedback_request",
    "reminder",
    "spot_opened",
]);

export const notifications = pgTable("notifications", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    type: notificationTypeEnum("type").notNull(),
    title: text("title").notNull(),
    body: text("body").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    metadata: jsonb("metadata"),
    sessionId: uuid("session_id").references(() => sessions.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});