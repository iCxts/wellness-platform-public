import { eq, gte, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, bookings, sessions, zoneVisits } from "@wellness/db";
import { createNotification } from "../services/notifications.service.js";
import { wellnessQueue } from "./queue.js";

export const ABSENCE_CHECKER = "absence-checker";

export async function enqueueAbsenceChecker() {
    await wellnessQueue.add(ABSENCE_CHECKER, {}, { repeat: { pattern: "0 0 * * *" } });
}

export async function processAbsenceChecker() {
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const members = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.role, "member"));

    for (const member of members) {
        const [recentBooking] = await db
            .select()
            .from(bookings)
            .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
            .where(and(
                eq(bookings.userId, member.id),
                eq(bookings.status, "attended"),
                gte(sessions.startsAt, twoDaysAgo)
            ))
            .limit(1);

        const [recentVisit] = await db
            .select()
            .from(zoneVisits)
            .where(and(
                eq(zoneVisits.userId, member.id),
                gte(zoneVisits.enteredAt, twoDaysAgo)
            ))
            .limit(1);

        if (!recentBooking && !recentVisit) {
            await createNotification(
                member.id,
                "absence_warning",
                "We miss you!",
                "You have not been active in the last 2 days. Come back and keep your streak going!"
            );
        }
    }
}
