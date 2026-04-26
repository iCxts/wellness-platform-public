import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users.js";

export const deviceTokens = pgTable("device_tokens", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").unique().notNull().references(() => users.id),
    token: text("token").notNull(),
    updatedAt: timestamp("updated_at").notNull().defaultNow()
});