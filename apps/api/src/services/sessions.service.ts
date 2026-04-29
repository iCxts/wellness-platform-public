import { eq, gte, lte, count, inArray, and, sql } from "drizzle-orm";
import { db } from "../db/index.js";
import { sessions, bookings, users } from "@wellness/db";
import type { BookingWithUserResponse, CreateSessionInput, SessionFocus, SessionLevel, SessionResponse } from "@wellness/types";
import { enqueueNoShowTagger } from "../jobs/no-show-tagger.job.js";
import { enqueueReminders } from "../jobs/reminder.job.js";

/**
 * Snap schedule times onto the local calendar day of `anchorDay` while preserving clock times from `inputStartsAt` / `inputEndsAt`.
 * Uses the session's intended start date (create: from payload; update: existing row) so listing/check-in see a consistent calendar day.
 */
function alignSessionScheduleToAnchorDay(anchor: Date, inputStartsAt: Date, inputEndsAt: Date): { startsAt: Date; endsAt: Date } {
    const y = anchor.getFullYear();
    const m = anchor.getMonth();
    const d = anchor.getDate();
    const startsAt = new Date(
        y,
        m,
        d,
        inputStartsAt.getHours(),
        inputStartsAt.getMinutes(),
        inputStartsAt.getSeconds(),
        inputStartsAt.getMilliseconds(),
    );
    let endsAt = new Date(
        y,
        m,
        d,
        inputEndsAt.getHours(),
        inputEndsAt.getMinutes(),
        inputEndsAt.getSeconds(),
        inputEndsAt.getMilliseconds(),
    );
    if (endsAt.getTime() <= startsAt.getTime()) {
        endsAt = new Date(endsAt.getTime() + 24 * 60 * 60 * 1000);
    }
    return { startsAt, endsAt };
}

async function getSpotCounts(sessionIds: string[]): Promise<Record<string, number>> {
    if (sessionIds.length === 0) return {};
    const rows = await db
        .select({ sessionId: bookings.sessionId, count: count() })
        .from(bookings)
        .where(eq(bookings.status, "confirmed"))
        .groupBy(bookings.sessionId);

    return Object.fromEntries(rows.map((r) => [r.sessionId, Number(r.count)]));
}

export async function listSessions(filters?: {
    focus?: string;
    day?: string;
}): Promise<SessionResponse[]> {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const conditions = [gte(sessions.startsAt, startOfToday)];

    if (filters?.focus) {
        conditions.push(sql`${sessions.focus} @> ARRAY[${filters.focus}]::text[]`);
    }

    if (filters?.day) {
        const start = new Date(`${filters.day}T00:00:00.000Z`);
        const end = new Date(`${filters.day}T23:59:59.999Z`);
        conditions.push(gte(sessions.startsAt, start), lte(sessions.startsAt, end));
    }

    const rows = await db
        .select()
        .from(sessions)
        .where(and(...conditions));
    const counts = await getSpotCounts(rows.map((r) => r.id));

    return rows.map((s) => ({
        id: s.id,
        title: s.title,
        type: s.type,
        level: s.level,
        focus: s.focus as SessionFocus[] | null,
        description: s.description,
        imageUrl: s.imageUrl,
        roomName: s.roomName,
        placeDescription: s.placeDescription,
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
        level: s.level,
        focus: s.focus as SessionFocus[] | null,
        description: s.description,
        imageUrl: s.imageUrl,
        roomName: s.roomName,
        placeDescription: s.placeDescription,
        trainerId: s.trainerId,
        zoneId: s.zoneId,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
        capacity: s.capacity,
        spotsLeft: s.capacity - confirmed,
    };
}

export async function createSession(input: CreateSessionInput): Promise<SessionResponse> {
    const rawStart = new Date(input.startsAt);
    const rawEnd = new Date(input.endsAt);
    const { startsAt, endsAt } = alignSessionScheduleToAnchorDay(rawStart, rawStart, rawEnd);

    const [s] = await db
        .insert(sessions)
        .values({
            title: input.title,
            type: input.type,
            level: input.level ?? null,
            focus: input.focus ?? null,
            description: input.description ?? null,
            roomName: input.roomName ?? null,
            placeDescription: input.placeDescription ?? null,
            trainerId: input.trainerId ?? null,
            zoneId: input.zoneId,
            startsAt,
            endsAt,
            capacity: input.capacity,
        })
        .returning();

    await enqueueNoShowTagger(s.id, endsAt);
    await enqueueReminders(s.id, input.title, startsAt);

    return {
        id: s.id,
        title: s.title,
        type: s.type,
        level: s.level,
        focus: s.focus as SessionFocus[] | null,
        description: s.description,
        imageUrl: s.imageUrl,
        roomName: s.roomName,
        placeDescription: s.placeDescription,
        trainerId: s.trainerId,
        zoneId: s.zoneId,
        startsAt: s.startsAt.toISOString(),
        endsAt: s.endsAt.toISOString(),
        capacity: s.capacity,
        spotsLeft: s.capacity,
    };
}

export async function updateSession(id: string, input: Partial<CreateSessionInput>): Promise<SessionResponse | null> {
    const [existing] = await db.select().from(sessions).where(eq(sessions.id, id));
    if (!existing) return null;

    const values: Record<string, unknown> = {};
    if (input.title !== undefined) values.title = input.title;
    if (input.type !== undefined) values.type = input.type;
    if (input.level !== undefined) values.level = input.level;
    if (input.focus !== undefined) values.focus = input.focus;
    if (input.description !== undefined) values.description = input.description;
    if (input.roomName !== undefined) values.roomName = input.roomName;
    if (input.placeDescription !== undefined) values.placeDescription = input.placeDescription;
    if (input.trainerId !== undefined) values.trainerId = input.trainerId;
    if (input.zoneId !== undefined) values.zoneId = input.zoneId;
    if (input.capacity !== undefined) values.capacity = input.capacity;

    if (input.startsAt !== undefined || input.endsAt !== undefined) {
        const anchor = existing.startsAt;
        const startSrc = input.startsAt !== undefined ? new Date(input.startsAt) : existing.startsAt;
        const endSrc = input.endsAt !== undefined ? new Date(input.endsAt) : existing.endsAt;
        const aligned = alignSessionScheduleToAnchorDay(anchor, startSrc, endSrc);
        values.startsAt = aligned.startsAt;
        values.endsAt = aligned.endsAt;
    }

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

    await db.delete(bookings).where(eq(bookings.sessionId, id));
    await db.delete(sessions).where(eq(sessions.id, id));
}

export async function updateSessionImage(sessionId: string, imageUrl: string): Promise<SessionResponse | null> {
    await db.update(sessions).set({ imageUrl }).where(eq(sessions.id, sessionId));
    return getSession(sessionId);
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