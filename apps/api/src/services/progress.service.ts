import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { bookings, sessions, zoneVisits } from "@wellness/db";
import type { ProgressResponse } from "@wellness/types";

function toDateStr(d: Date): string {
    return d.toISOString().slice(0, 10);
}

export async function getProgress(userId: string): Promise<ProgressResponse> {
    const attendedBookings = await db
        .select({ startsAt: sessions.startsAt })
        .from(bookings)
        .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
        .where(eq(bookings.userId, userId));

    const visits = await db
        .select({ enteredAt: zoneVisits.enteredAt })
        .from(zoneVisits)
        .where(eq(zoneVisits.userId, userId));

    const totalSessions = attendedBookings.length;

    const activeDays = new Set<string>();
    for (const b of attendedBookings) activeDays.add(toDateStr(b.startsAt));
    for (const v of visits) activeDays.add(toDateStr(v.enteredAt));

    const totalDays = activeDays.size;

    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        if (activeDays.has(toDateStr(d))) {
            currentStreak++;
        } else {
            break;
        }
    }

    return { totalSessions, totalDays, currentStreak };
}
