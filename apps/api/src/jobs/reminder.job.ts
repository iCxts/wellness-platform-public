import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookings } from "@wellness/db";
import { wellnessQueue } from "./queue.js";
import { createNotification } from "../services/notifications.service.js";

export const REMINDER = "reminder";

export async function enqueueReminders(sessionId: string, sessionTitle: string, startsAt: Date) {
    const oneHour = startsAt.getTime() - Date.now() - 60 * 60 * 1000;
    const twentyFourHours = startsAt.getTime() - Date.now() - 24 * 60 * 60 * 1000;

    if (twentyFourHours > 0) {
        await wellnessQueue.add(REMINDER, { sessionId, sessionTitle, window: "24h" }, { delay: twentyFourHours });
    }

    if (oneHour > 0) {
        await wellnessQueue.add(REMINDER, { sessionId, sessionTitle, window: "1h" }, { delay: oneHour });
    }
}

export async function processReminder(sessionId: string, sessionTitle: string, window: string) {
    const confirmed = await db 
        .select()
        .from(bookings)
        .where(and(
            eq(bookings.sessionId, sessionId),
            eq(bookings.status, "confirmed")
        ));

    for (const booking of confirmed) {
        await createNotification(
            booking.userId,
            "reminder",
            `Reminder: ${sessionTitle}`,
            `Your class starts in ${window}.`
        );
    }
}