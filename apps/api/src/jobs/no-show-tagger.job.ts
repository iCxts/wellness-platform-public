import { eq, and } from "drizzle-orm"; 
import { db } from "../db/index.js";
import { bookings } from "@wellness/db";
import { createNotification } from "../services/notifications.service.js";
import { wellnessQueue } from "./queue.js";

export const NO_SHOW_TAGGER = "no-show-tagger";

export async function enqueueNoShowTagger(sessionId: string, runAt: Date) {
    const delay = runAt.getTime() - Date.now();
    await wellnessQueue.add(NO_SHOW_TAGGER, { sessionId }, { delay: Math.max(delay, 0) });
}

export async function processNoShowTagger(sessionId: string) {
    const confirmed = await db 
        .select()
        .from(bookings)
        .where(and(
            eq(bookings.sessionId, sessionId),
            eq(bookings.status, "confirmed")
        ));
    for (const booking of confirmed) {
        await db 
            .update(bookings)
            .set({ status: "no_show" })
            .where(eq(bookings.id, booking.id));
        await createNotification(
            booking.userId,
            "no_show_tagged",
            "You have a no-show",
            "Your booking has been marked as no-show"
        );
    }
}