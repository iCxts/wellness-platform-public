import { eq, and, gte, lte, count, asc, gt } from "drizzle-orm";
import { db } from "../db/index.js";
import { users, sessions, bookings, zoneVisits } from "@wellness/db";
import type {
    DashboardResponse,
    DashboardScheduleItem,
    DashboardMyBooking,
    BookingStatus,
} from "@wellness/types";

function toDateStr(d: Date): string {
    return d.toISOString().slice(0, 10);
}

export async function getDashboard(userId: string): Promise<DashboardResponse> {
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const [
        userRow,
        upcomingBookingRows,
        scheduleSessionRows,
        myBookingRows,
        attendedCount,
        zoneVisitCount,
        allActiveDays,
        allZoneVisitDays,
    ] = await Promise.all([
        // 1. user profile
        db.select({ firstName: users.firstname, avatarUrl: users.avatarUrl })
            .from(users)
            .where(eq(users.id, userId))
            .then((r) => r[0] ?? null),

        // 2. next confirmed booking with session info
        db.select({
            bookingId: bookings.id,
            sessionId: sessions.id,
            title: sessions.title,
            imageUrl: sessions.imageUrl,
            startsAt: sessions.startsAt,
            endsAt: sessions.endsAt,
        })
            .from(bookings)
            .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
            .where(and(
                eq(bookings.userId, userId),
                eq(bookings.status, "confirmed"),
                gt(sessions.startsAt, now),
            ))
            .orderBy(asc(sessions.startsAt))
            .limit(1),

        // 3. sessions in next 7 days
        db.select()
            .from(sessions)
            .where(and(gte(sessions.startsAt, now), lte(sessions.startsAt, in7Days)))
            .orderBy(asc(sessions.startsAt)),

        // 4. user's upcoming bookings (confirmed/standby) with session info
        db.select({
            bookingId: bookings.id,
            sessionId: sessions.id,
            title: sessions.title,
            imageUrl: sessions.imageUrl,
            startsAt: sessions.startsAt,
            endsAt: sessions.endsAt,
            status: bookings.status,
            standbyPosition: bookings.standbyPosition,
        })
            .from(bookings)
            .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
            .where(and(
                eq(bookings.userId, userId),
                gt(sessions.startsAt, now),
            ))
            .orderBy(asc(sessions.startsAt)),

        // 5. attended session count
        db.select({ count: count() })
            .from(bookings)
            .where(and(eq(bookings.userId, userId), eq(bookings.status, "attended")))
            .then((r) => Number(r[0]?.count ?? 0)),

        // 6. total zone visits
        db.select({ count: count() })
            .from(zoneVisits)
            .where(eq(zoneVisits.userId, userId))
            .then((r) => Number(r[0]?.count ?? 0)),

        // 7. attended booking days for streak
        db.select({ startsAt: sessions.startsAt })
            .from(bookings)
            .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
            .where(and(eq(bookings.userId, userId), eq(bookings.status, "attended"))),

        // 8. zone visit days for streak
        db.select({ enteredAt: zoneVisits.enteredAt })
            .from(zoneVisits)
            .where(eq(zoneVisits.userId, userId)),
    ]);

    // streak calc
    const activeDays = new Set<string>();
    for (const b of allActiveDays) activeDays.add(toDateStr(b.startsAt));
    for (const v of allZoneVisitDays) activeDays.add(toDateStr(v.enteredAt));
    let currentStreak = 0;
    for (let i = 0; i < 365; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        if (activeDays.has(toDateStr(d))) {
            currentStreak++;
        } else {
            break;
        }
    }

    // spot counts for schedule
    const scheduleIds = scheduleSessionRows.map((s) => s.id);
    let spotCounts: Record<string, number> = {};
    if (scheduleIds.length > 0) {
        const rows = await db
            .select({ sessionId: bookings.sessionId, count: count() })
            .from(bookings)
            .where(and(eq(bookings.status, "confirmed")))
            .groupBy(bookings.sessionId);
        spotCounts = Object.fromEntries(rows.map((r) => [r.sessionId, Number(r.count)]));
    }

    // user's bookings map for schedule overlay
    const userBookingMap = new Map<string, { status: BookingStatus; bookingId: string }>();
    for (const b of myBookingRows) {
        userBookingMap.set(b.sessionId, {
            status: b.status as BookingStatus,
            bookingId: b.bookingId,
        });
    }

    const schedule: DashboardScheduleItem[] = scheduleSessionRows.map((s) => {
        const userBooking = userBookingMap.get(s.id) ?? null;
        return {
            id: s.id,
            title: s.title,
            type: s.type,
            imageUrl: s.imageUrl,
            startsAt: s.startsAt.toISOString(),
            endsAt: s.endsAt.toISOString(),
            spotsLeft: s.capacity - (spotCounts[s.id] ?? 0),
            bookingStatus: userBooking?.status ?? null,
            bookingId: userBooking?.bookingId ?? null,
        };
    });

    const myBookings: DashboardMyBooking[] = myBookingRows
        .filter((b) => b.status === "confirmed" || b.status === "standby")
        .map((b) => ({
            bookingId: b.bookingId,
            sessionId: b.sessionId,
            title: b.title,
            imageUrl: b.imageUrl,
            startsAt: b.startsAt.toISOString(),
            endsAt: b.endsAt.toISOString(),
            status: b.status as BookingStatus,
            standbyPosition: b.standbyPosition,
        }));

    const upcomingRaw = upcomingBookingRows[0] ?? null;
    const upcomingClass = upcomingRaw
        ? {
              bookingId: upcomingRaw.bookingId,
              sessionId: upcomingRaw.sessionId,
              title: upcomingRaw.title,
              imageUrl: upcomingRaw.imageUrl,
              startsAt: upcomingRaw.startsAt.toISOString(),
              endsAt: upcomingRaw.endsAt.toISOString(),
              startsInMs: upcomingRaw.startsAt.getTime() - now.getTime(),
          }
        : null;

    return {
        profile: {
            firstName: userRow?.firstName ?? "",
            avatarUrl: userRow?.avatarUrl ?? null,
        },
        upcomingClass,
        progress: {
            currentStreak,
            totalSessionsAttended: attendedCount,
            totalZoneVisits: zoneVisitCount,
        },
        schedule,
        myBookings,
    };
}
