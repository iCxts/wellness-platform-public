import { eq, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookings } from "@wellness/db";
import type { BookingResponse } from "@wellness/types";

export async function checkOut(userId: string, sessionId: string): Promise<BookingResponse> {
    const [booking] = await db
        .select()
        .from(bookings)
        .where(and(
            eq(bookings.userId, userId),
            eq(bookings.sessionId, sessionId)
        ));

    if (!booking) throw new Error("Booking not found");
    if (booking.status !== "attended") throw new Error("Booking is not attended");

    const [updated] = await db
        .update(bookings)
        .set({ checkedOutAt: new Date() })
        .where(eq(bookings.id, booking.id))
        .returning();

    return {
        id: updated.id,
        userId: updated.userId,
        sessionId: updated.sessionId,
        status: updated.status,
        standbyPosition: updated.standbyPosition,
        createdAt: updated.createdAt.toISOString(),
    };
}
