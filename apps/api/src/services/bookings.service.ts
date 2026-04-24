import { db } from "../db/index.js";
import { bookings, sessions, users, zones } from "@wellness/db";
import type { BookingResponse, BookingWithSessionResponse, BookingDetailResponse, AdminBookingResponse } from "@wellness/types";
import { eq, and, count, asc, desc, lt, gte, gt, inArray } from "drizzle-orm";
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

export async function listMyBookingsWithSession(
    userId: string,
    tab: "upcoming" | "history" | "waitlist"
): Promise<BookingWithSessionResponse[]> {
    const now = new Date();

    const tabConditions: Record<string, Parameters<typeof and>> = {
        upcoming: [
            eq(bookings.userId, userId),
            eq(bookings.status, "confirmed"),
            gt(sessions.startsAt, now),
        ],
        history: [
            eq(bookings.userId, userId),
            lt(sessions.startsAt, now),
        ],
        waitlist: [
            eq(bookings.userId, userId),
            eq(bookings.status, "standby"),
        ],
    };

    const order = tab === "history" ? desc(sessions.startsAt) : asc(sessions.startsAt);

    const rows = await db
        .select({
            bookingId: bookings.id,
            sessionId: sessions.id,
            title: sessions.title,
            type: sessions.type,
            imageUrl: sessions.imageUrl,
            startsAt: sessions.startsAt,
            endsAt: sessions.endsAt,
            status: bookings.status,
            standbyPosition: bookings.standbyPosition,
            createdAt: bookings.createdAt,
        })
        .from(bookings)
        .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
        .where(and(...tabConditions[tab]))
        .orderBy(order);

    return rows.map((r) => ({
        bookingId: r.bookingId,
        sessionId: r.sessionId,
        title: r.title,
        type: r.type,
        imageUrl: r.imageUrl,
        startsAt: r.startsAt.toISOString(),
        endsAt: r.endsAt.toISOString(),
        status: r.status,
        standbyPosition: r.standbyPosition,
        createdAt: r.createdAt.toISOString(),
    }));
}

export async function confirmBooking(userId: string, bookingId: string): Promise<BookingResponse> {
    const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));
    if (!booking) throw new Error("Booking not found");
    if (booking.userId !== userId) throw new Error("Unauthorized");
    if (booking.status !== "pending_confirmation") throw new Error("Booking is not pending confirmation");

    const [updated] = await db
        .update(bookings)
        .set({ status: "confirmed" })
        .where(eq(bookings.id, bookingId))
        .returning();
    return toResponse(updated);
}

export async function getBookingDetail(
    userId: string,
    bookingId: string
): Promise<BookingDetailResponse> {
    const [booking] = await db
        .select()
        .from(bookings)
        .where(eq(bookings.id, bookingId));
    if (!booking) throw new Error("Booking not found");
    if (booking.userId !== userId) throw new Error("Unauthorized");

    const [sessionRow] = await db
        .select({
            id: sessions.id,
            title: sessions.title,
            type: sessions.type,
            level: sessions.level,
            focus: sessions.focus,
            description: sessions.description,
            imageUrl: sessions.imageUrl,
            roomName: sessions.roomName,
            trainerId: sessions.trainerId,
            startsAt: sessions.startsAt,
            endsAt: sessions.endsAt,
            capacity: sessions.capacity,
            zoneName: zones.name,
        })
        .from(sessions)
        .innerJoin(zones, eq(sessions.zoneId, zones.id))
        .where(eq(sessions.id, booking.sessionId));
    if (!sessionRow) throw new Error("Session not found");

    const [{ confirmed }] = await db
        .select({ confirmed: count() })
        .from(bookings)
        .where(and(
            eq(bookings.sessionId, booking.sessionId),
            eq(bookings.status, "confirmed")
        ));

    let instructor: BookingDetailResponse["instructor"] = null;
    if (sessionRow.trainerId) {
        const [trainerRow] = await db
            .select({
                id: users.id,
                firstName: users.firstname,
                lastName: users.lastname,
                avatarUrl: users.avatarUrl,
            })
            .from(users)
            .where(eq(users.id, sessionRow.trainerId));
        if (trainerRow) {
            instructor = {
                id: trainerRow.id,
                firstName: trainerRow.firstName,
                lastName: trainerRow.lastName,
                avatarUrl: trainerRow.avatarUrl,
            };
        }
    }

    return {
        bookingId: booking.id,
        status: booking.status,
        standbyPosition: booking.standbyPosition,
        createdAt: booking.createdAt.toISOString(),
        session: {
            id: sessionRow.id,
            title: sessionRow.title,
            type: sessionRow.type,
            level: sessionRow.level,
            focus: sessionRow.focus as BookingDetailResponse["session"]["focus"],
            description: sessionRow.description,
            imageUrl: sessionRow.imageUrl,
            roomName: sessionRow.roomName,
            startsAt: sessionRow.startsAt.toISOString(),
            endsAt: sessionRow.endsAt.toISOString(),
            capacity: sessionRow.capacity,
            spotsLeft: Math.max(0, sessionRow.capacity - Number(confirmed)),
            zoneName: sessionRow.zoneName,
        },
        instructor,
    };
}

export async function listAllBookings(filters?: {
    sessionId?: string;
    status?: string;
}): Promise<AdminBookingResponse[]> {
    const now = new Date();
    const conditions: ReturnType<typeof eq>[] = [gte(sessions.startsAt, now)];
    if (filters?.sessionId) conditions.push(eq(bookings.sessionId, filters.sessionId));
    if (filters?.status) conditions.push(eq(bookings.status, filters.status as typeof bookings.status._.data));

    const rows = await db
        .select({
            bookingId: bookings.id,
            status: bookings.status,
            standbyPosition: bookings.standbyPosition,
            createdAt: bookings.createdAt,
            sessionId: sessions.id,
            title: sessions.title,
            type: sessions.type,
            imageUrl: sessions.imageUrl,
            startsAt: sessions.startsAt,
            endsAt: sessions.endsAt,
            capacity: sessions.capacity,
            memberId: users.id,
            firstName: users.firstname,
            lastName: users.lastname,
            email: users.email,
            avatarUrl: users.avatarUrl,
        })
        .from(bookings)
        .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
        .innerJoin(users, eq(bookings.userId, users.id))
        .where(and(...conditions))
        .orderBy(asc(sessions.startsAt));

    const sessionIds = [...new Set(rows.map((r) => r.sessionId))];
    const spotCounts: Record<string, number> = {};
    if (sessionIds.length > 0) {
        const counts = await db
            .select({ sessionId: bookings.sessionId, confirmed: count() })
            .from(bookings)
            .where(and(inArray(bookings.sessionId, sessionIds), eq(bookings.status, "confirmed")))
            .groupBy(bookings.sessionId);
        for (const c of counts) spotCounts[c.sessionId] = Number(c.confirmed);
    }

    return rows.map((r) => ({
        bookingId: r.bookingId,
        status: r.status,
        standbyPosition: r.standbyPosition,
        createdAt: r.createdAt.toISOString(),
        session: {
            id: r.sessionId,
            title: r.title,
            type: r.type,
            imageUrl: r.imageUrl,
            startsAt: r.startsAt.toISOString(),
            endsAt: r.endsAt.toISOString(),
            capacity: r.capacity,
            spotsLeft: Math.max(0, r.capacity - (spotCounts[r.sessionId] ?? 0)),
        },
        member: {
            id: r.memberId,
            firstName: r.firstName,
            lastName: r.lastName,
            email: r.email,
            avatarUrl: r.avatarUrl,
        },
    }));
}

const ACTIVE_STATUSES = ["confirmed", "standby", "attended"] as const;

export async function hardDeleteBooking(bookingId: string): Promise<void> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, bookingId));
    if (!booking) throw new Error("Booking not found");
    if ((ACTIVE_STATUSES as readonly string[]).includes(booking.status)) {
        throw new Error("Cannot delete active booking");
    }
    await db.delete(bookings).where(eq(bookings.id, bookingId));
}

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
