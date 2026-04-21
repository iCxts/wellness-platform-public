import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookings, sessions } from "@wellness/db";

export async function checkIn(userId: string, sessionId: string): Promise<void> {
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

    await db
        .update(bookings)
        .set({ status: "attended" })
        .where(eq(bookings.id, booking.id));
}
