import { eq, gte, count, inArray, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { sessions, bookings, users } from "@wellness/db";
import type { BookingWithUserResponse, CreateSessionInput, SessionResponse } from "@wellness/types";
import { enqueueNoShowTagger } from "../jobs/no-show-tagger.job.js";
import { enqueueReminders } from "../jobs/reminder.job.js";

async function getSpotCounts(sessionIds: string[]): Promise<Record<string, number>> {
    if (sessionIds.length === 0) return {};
    const rows = await db
        .select({ sessionId: bookings.sessionId, count: count() })
        .from(bookings)
        .where(eq(bookings.status, "confirmed"))
        .groupBy(bookings.sessionId);

    return Object.fromEntries(rows.map((r) => [r.sessionId, Number(r.count)]));
}

export async function listSessions(): Promise<SessionResponse[]> {
    const now = new Date();
    const rows = await db
        .select()
        .from(sessions)
        .where(gte(sessions.startsAt, now));
    const counts = await getSpotCounts(rows.map((r) => r.id));

    return rows.map((s) => ({
        id: s.id,
        title: s.title,
        type: s.type,
        trainerId: s.trainerId,
        zoneId: s.zoneId,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
        capacity: s.capacity,
        spotsLeft: s.capacity - (counts[s.id] ?? 0),
    }));
}

export async function getSession(id: string): Promise<SessionResponse | null> {
    const [s] = await db.select().from(sessions).where(eq(sessions.id, id));
    if (!s) return null;

    const [row] = await db
        .select({ count: count() })
        .from(bookings)
        .where(eq(bookings.sessionId, id));

    const confirmed = Number(row?.count ?? 0);

    return {
        id: s.id,
        title: s.title,
        type: s.type,
        trainerId: s.trainerId,
        zoneId: s.zoneId,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
        capacity: s.capacity,
        spotsLeft: s.capacity - confirmed,
    };
}

export async function createSession(input: CreateSessionInput): Promise<SessionResponse> {
    const [s] = await db
        .insert(sessions)
        .values({
            title: input.title,
            type: input.type,
            trainerId: input.trainerId ?? null,
            zoneId: input.zoneId,
            startsAt: new Date(input.startsAt),
            endsAt: new Date(input.endsAt),
            capacity: input.capacity,
        }).returning();

    await enqueueNoShowTagger(s.id, new Date(input.endsAt));
    await enqueueReminders(s.id, input.title, new Date(input.startsAt));

    return {
        id: s.id,
        title: s.title,
        type: s.type,
        trainerId: s.trainerId,
        zoneId: s.zoneId,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
        capacity: s.capacity,
        spotsLeft: s.capacity,
    };
}

export async function updateSession(id: string, input: Partial<CreateSessionInput>): Promise<SessionResponse | null> {
    const values: Record<string, unknown> = {};
    if (input.title !== undefined) values.title = input.title;
    if (input.type !== undefined) values.type = input.type;
    if (input.trainerId !== undefined) values.trainerId = input.trainerId;
    if (input.zoneId !== undefined) values.zoneId = input.zoneId;
    if (input.startsAt !== undefined) values.startsAt = new Date(input.startsAt);
    if (input.endsAt !== undefined) values.endsAt = new Date(input.endsAt);
    if (input.capacity !== undefined) values.capacity = input.capacity;

    const [s] = await db
        .update(sessions)
        .set(values)
        .where(eq(sessions.id, id))
        .returning();

    if (!s) return null;

    return getSession(s.id);
}

export async function deleteSession(id: string): Promise<void> {
    const [row] = await db
        .select({ count: count() })
        .from(bookings)
        .where(
            and(
                eq(bookings.sessionId, id),
                inArray(bookings.status, ["confirmed", "standby"])
            )
        );

    if (Number(row?.count ?? 0) > 0) {
        throw new Error("Cannot delete a session with existing bookings");
    }

    await db.delete(sessions).where(eq(sessions.id, id));
}

export async function getSessionBookings(
    sessionId: string,
    requesterId: string,
    requesterRole: string
): Promise<BookingWithUserResponse[]> {
    const [session] = await db 
        .select()
        .from(sessions)
        .where(eq(sessions.id, sessionId));
    if (!session) throw new Error("Session not found");

    if (requesterRole === "instructor" && session.trainerId !== requesterId) {
        throw new Error("Unauthorized");
    };

    const rows = await db 
        .select({
            id: bookings.id,
            sessionId: bookings.sessionId,
            userId: bookings.userId,
            status: bookings.status,
            standbyPosition: bookings.standbyPosition,
            createdAt: bookings.createdAt,
            userFirstname: users.firstname,
            userLastname: users.lastname,
            userEmail: users.email,
        })
        .from(bookings)
        .innerJoin(users, eq(bookings.userId, users.id))
        .where(eq(bookings.sessionId, sessionId))
    return rows.map((r) => ({
        id: r.id,
        sessionId: r.sessionId,
        userId: r.userId,
        status: r.status,
        standbyPosition: r.standbyPosition,
        createdAt: r.createdAt.toISOString(),
        user: {
            id: r.userId,
            firstName: r.userFirstname,
            lastName: r.userLastname,
            email: r.userEmail,
        }
    }))

}