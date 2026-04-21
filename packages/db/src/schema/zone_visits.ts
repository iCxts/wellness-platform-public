
import { pgTable, uuid, timestamp } from "drizzle-orm/pg-core";
import { users } from "./users";
import { zones } from "./zones";

export const zoneVisits = pgTable("zone_visits", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    zoneId: uuid("zone_id").notNull().references(() => zones.id),
    enteredAt: timestamp("entered_at").notNull().defaultNow(),
    exitedAt: timestamp("exited_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});