import { pgTable, uuid, timestamp, integer, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { sessions } from "./sessions"; 

export const bookingStatusEnum = pgEnum("booking_status", ['confirmed', 'standby', 'cancelled', 'attended', 'no_show']);

export const bookings = pgTable("bookings", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull().references(() => users.id),
    sessionId: uuid("session_id").notNull().references(() => sessions.id),
    status: bookingStatusEnum("status").notNull().default("confirmed"),
    standbyPosition: integer("standby_position"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    checkedOutAt: timestamp("checked_out_at"),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});