import * as admin from "firebase-admin";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { deviceTokens } from "@wellness/db";
import { env } from "../env.js";

const serviceAccount = JSON.parse(env.FIREBASE_SERVICE_ACCOUNT_JSON);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

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
    userId: string,
    title: string,
    body: string,
    data?: Record<string, string>
): Promise<void> {
    const [row] = await db 
        .select()
        .from(deviceTokens)
        .where(eq(deviceTokens.userId, userId));

    if (!row) return;
    
    try {
        await admin.messaging().send({
            token: row.token,
            notification: title ? { title, body } : undefined,
            data
        });
    } catch (err: unknown) {
        const code = (err as {errInfo?: { code?: string }}).errInfo?.code;
        if (code ==="messaging/registeration-token-not-registered") {
            await db.delete(deviceTokens).where(eq(deviceTokens.userId, userId));
            return;
        }
        throw err;
    }
}