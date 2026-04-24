import { pgTable, uuid, text, integer, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { users } from "./users";
import { zones } from "./zones";

export const sessionTypeEnum = pgEnum("session_type", ['group_class', 'personal_training', 'medical_consult', 'open_facility']);
export const sessionLevelEnum = pgEnum("session_level", ['beginner', 'pre_intermediate', 'intermediate', 'advanced']);

export const sessions = pgTable("sessions", {
    id: uuid("id").primaryKey().defaultRandom(),
    title: text("title").notNull(),
    type: sessionTypeEnum("type").notNull(),
    level: sessionLevelEnum("level"),
    focus: text("focus").array(),
    description: text("description"),
    imageUrl: text("image_url"),
    roomName: text("room_name"),
    placeDescription: text("place_description"),
    trainerId: uuid("trainer_id").references(() => users.id),
    zoneId: uuid("zone_id").notNull().references(() => zones.id),
    startsAt: timestamp("starts_at").notNull(),
    endsAt: timestamp("ends_at").notNull(),
    capacity: integer("capacity").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
});