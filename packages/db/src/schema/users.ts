import { pgTable, uuid, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ['member', 'instructor', 'admin']);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    firstname: text("firstname").notNull(),
    lastname: text("lastname").notNull(),
    phone: text("phone"),
    role: userRoleEnum("role").notNull().default("member"),
    parqCleared: boolean("parq_cleared").notNull().default(false),
    fitnessInterests: text("fitness_interests").array(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

