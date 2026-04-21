import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookings, sessions, users } from "@wellness/db";
import type { CheckInResponse } from "@wellness/types";

export async function checkIn(userId: string, sessionId: string): Promise<CheckInResponse> {
    const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId));
    if (!session) throw new Error("Session not found");

    const today = new Date();
    const isToday =
        session.startsAt.getFullYear() === today.getFullYear() &&
        session.startsAt.getMonth() === today.getMonth() &&
        session.startsAt.getDate() === today.getDate();
    if (!isToday) throw new Error("Session is not scheduled for today");

    const [booking] = await db
        .select()
        .from(bookings)
        .where(and(
            eq(bookings.userId, userId),
            eq(bookings.sessionId, sessionId)
        ));
    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "confirmed") throw new Error(`Cannot check in a booking with status ${booking.status}`);

    const checkInTime = new Date();
    await db
        .update(bookings)
        .set({ status: "attended", updatedAt: checkInTime })
        .where(eq(bookings.id, booking.id));

    const [userRow] = await db.select().from(users).where(eq(users.id, userId));

    return {
        checkInTime: checkInTime.toISOString(),
        className: session.title,
        memberName: `${userRow.firstname} ${userRow.lastname}`,
    };
}
