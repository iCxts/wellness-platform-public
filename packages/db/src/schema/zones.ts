import { pgTable, uuid, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const zones = pgTable("zones", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    description: text("description"),
    capacity: integer("capacity").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
})