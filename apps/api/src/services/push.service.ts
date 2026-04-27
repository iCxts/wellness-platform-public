import { db } from "../db/index.js";
import { deviceTokens } from "@wellness/db";

export async function registerDeviceToken(userId: string, token: string) {
    await db
        .insert(deviceTokens)
        .values({ userId, token })
        .onConflictDoUpdate({
            target: deviceTokens.token,
            set: ({ token, updatedAt: new Date()})
        });
}

export async function sendPush(
    _userId: string,
    _title: string,
    _body: string,
    _data?: Record<string, string>
): Promise<void> {
    // push notifications disabled (no firebase)
}