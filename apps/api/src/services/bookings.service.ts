import { db } from "../db/index.js";
import { bookings, sessions } from "@wellness/db";
import type { BookingResponse } from "@wellness/types";
import { eq, and, count, asc, lt, inArray } from "drizzle-orm";
import { enqueueStandbyPromotion } from "../jobs/standby-promotion.job.js";

function toResponse(b: typeof bookings.$inferSelect): BookingResponse {
    return {
        id: b.id,
        userId: b.userId,
        sessionId: b.sessionId,
        status: b.status,
        standbyPosition: b.standbyPosition,
        createdAt: b.createdAt.toISOString()
    };
};

export async function createBooking(userId: string, sessionId: string): Promise<BookingResponse> {
    const [session] = await db
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId));
    if (!session) throw new Error("Session not found");

    const [existing] = await db 
        .select()
        .from(bookings)
        .where(and(
            eq(bookings.sessionId, sessionId),
            eq(bookings.userId, userId)
        ));
    if (existing) throw new Error("Booking already exists");

    const [{ confirmed }] = await db 
        .select({ confirmed: count() })
        .from(bookings)
        .where(and(
            eq(bookings.sessionId, sessionId),
            eq(bookings.status, "confirmed")
        ));
    
    const spotLeft = session.capacity - Number(confirmed);

    if (spotLeft > 0) {
        const [booking] = await db 
            .insert(bookings)
            .values({
                userId, sessionId, status: "confirmed"
            })
            .returning();
        return toResponse(booking);
    };

    const [{ nextPosition }] = await db 
        .select({ nextPosition: count()})
        .from(bookings)
        .where(and(
            eq(bookings.status, "standby"),
            eq(bookings.sessionId, sessionId)
        ));
    
    const [booking] = await db 
        .insert(bookings)
        .values({userId, sessionId, status: "standby", standbyPosition: nextPosition + 1})
        .returning();
    return toResponse(booking);
};

export async function cancelBooking(userId: string, bookingId: string): Promise<void> {
    const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId))
    if (!booking) throw new Error("Booking not found");
    if (booking.userId !== userId) throw new Error("Unauthorized");
    if (booking.status === "cancelled") throw new Error("Booking already cancelled");

    await db
        .update(bookings)
        .set({status: "cancelled", standbyPosition: null})
        .where(eq(bookings.id, booking.id));

    if (booking.status === "confirmed") {
        const [next] = await db
            .select()
            .from(bookings)
            .where(and(
                eq(bookings.sessionId, booking.sessionId),
                eq(bookings.status, "standby")
            ))
            .orderBy(asc(bookings.standbyPosition))
            .limit(1);
        if (next) {
            await db 
                .update(bookings)
                .set({ status: "confirmed", standbyPosition: null})
                .where(eq(bookings.id, next.id));
        }
    }

    await enqueueStandbyPromotion(booking.sessionId);
};

export async function listMyBookings(
    userId: string,
    filters?: {status?: string, past?: boolean}
): Promise<BookingResponse[]> {
    const conditions = [eq(bookings.userId, userId)];

    if (filters?.status) {
        conditions.push(eq(bookings.status, filters.status as typeof bookings.status._.data));
    };

    if (filters?.past) {
        const now = new Date();
        const pastSessionIds = await db
            .select({ id: sessions.id })
            .from(sessions)
            .where(lt(sessions.startsAt, now));

        const ids = pastSessionIds.map((s) => s.id);
        if (ids.length === 0) return [];
        conditions.push(inArray(bookings.sessionId, ids));
    }

    const rows = await db
        .select()
        .from(bookings)
        .where(and(...conditions));

    return rows.map(toResponse);


    
}
