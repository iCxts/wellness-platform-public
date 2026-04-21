import { eq, and, asc } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookings } from "@wellness/db";
import { createNotification } from "../services/notifications.service.js";
import { wellnessQueue } from "./queue.js";

export const STANDBY_PROMOTION = "standby-promotion";

export async function enqueueStandbyPromotion(sessionId: string) {
    await wellnessQueue.add(STANDBY_PROMOTION, { sessionId });
}

export async function processStandbyPromotion(sessionId: string) {
    const [next] = await db 
        .select()
        .from(bookings)
        .where(and(
            eq(bookings.sessionId, sessionId),
            eq(bookings.status, "standby")
        ))
        .orderBy(asc(bookings.standbyPosition))
        .limit(1);
    
    if (!next) return;

    await db
        .update(bookings)
        .set({ status: "pending_confirmation", standbyPosition: null })
        .where(eq(bookings.id, next.id));

    await createNotification(
        next.userId,
        "standby_promoted",
        "You got a spot!",
        "Your standby booking has been confirmed",
        { sessionId, bookingId: next.id }
    );
}