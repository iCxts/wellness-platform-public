import { eq, and, desc } from "drizzle-orm";
import { SignJWT } from "jose";
import { db } from "../db/index.js";
import { users, bookings, sessions } from "@wellness/db";
import { env } from "../env.js";
import type {
    UserProfileResponse,
    UpdateProfileInput,
    QrTokenResponse,
    LatestCheckInResponse,
} from "@wellness/types";

function mapToProfile(row: typeof users.$inferSelect): UserProfileResponse {
    return {
        id: row.id,
        email: row.email,
        firstName: row.firstname,
        lastName: row.lastname,
        phone: row.phone,
        role: row.role,
        avatarUrl: row.avatarUrl,
        parqCleared: row.parqCleared,
        fitnessInterests: row.fitnessInterests,
        createdAt: row.createdAt.toISOString(),
    };
}

export async function getMyProfile(userId: string): Promise<UserProfileResponse | null> {
    const [row] = await db.select().from(users).where(eq(users.id, userId));
    if (!row) return null;
    return mapToProfile(row);
}

export async function updateProfile(userId: string, input: UpdateProfileInput): Promise<UserProfileResponse | null> {
    const updates: Partial<typeof users.$inferInsert> = {};
    if (input.firstName !== undefined) updates.firstname = input.firstName;
    if (input.lastName !== undefined) updates.lastname = input.lastName;
    if (input.phone !== undefined) updates.phone = input.phone;
    if (Object.keys(updates).length > 0) {
        updates.updatedAt = new Date();
        await db.update(users).set(updates).where(eq(users.id, userId));
    }
    return getMyProfile(userId);
}

export async function updateAvatar(userId: string, avatarUrl: string): Promise<UserProfileResponse | null> {
    await db.update(users).set({ avatarUrl, updatedAt: new Date() }).where(eq(users.id, userId));
    return getMyProfile(userId);
}

export async function generateQrToken(userId: string): Promise<QrTokenResponse> {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    const token = await new SignJWT({ type: "qr_checkin" })
        .setProtectedHeader({ alg: "HS256" })
        .setSubject(userId)
        .setIssuedAt()
        .setExpirationTime("5m")
        .sign(secret);
    return { token, expiresAt: expiresAt.toISOString() };
}

export async function getLatestCheckIn(userId: string): Promise<LatestCheckInResponse | null> {
    const rows = await db
        .select({
            id: bookings.id,
            sessionId: bookings.sessionId,
            className: sessions.title,
            checkInTime: bookings.updatedAt,
        })
        .from(bookings)
        .innerJoin(sessions, eq(bookings.sessionId, sessions.id))
        .where(and(eq(bookings.userId, userId), eq(bookings.status, "attended")))
        .orderBy(desc(bookings.updatedAt))
        .limit(1);

    if (rows.length === 0) return null;
    const row = rows[0];
    return {
        id: row.id,
        sessionId: row.sessionId,
        className: row.className,
        checkInTime: row.checkInTime.toISOString(),
    };
}
