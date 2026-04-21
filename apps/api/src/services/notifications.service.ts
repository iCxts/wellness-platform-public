import { eq, desc, and } from "drizzle-orm";
import { db } from "../db/index.js";
import { notifications } from "@wellness/db";
import type { NotificationResponse, NotificationType, NotificationMetadata } from "@wellness/types";

function toResponse(n: typeof notifications.$inferSelect): NotificationResponse {
    return {
        id: n.id,
        userId: n.userId,
        type: n.type as NotificationType,
        title: n.title,
        body: n.body,
        isRead: n.isRead,
        metadata: (n.metadata as NotificationMetadata) ?? null,
        createdAt: n.createdAt.toISOString()
    };
}

export async function createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    metadata?: NotificationMetadata
): Promise<void> {
    await db
        .insert(notifications)
        .values({ userId, type, title, body, metadata: metadata ?? null });
}

export async function listNotifications(userId: string, unreadOnly = false): Promise<NotificationResponse[]> {
    const condition = unreadOnly
        ? and(eq(notifications.userId, userId), eq(notifications.isRead, false))
        : eq(notifications.userId, userId);
    const rows = await db
        .select()
        .from(notifications)
        .where(condition)
        .orderBy(desc(notifications.createdAt));
    return rows.map(toResponse);
}

export async function markRead(userId: string, notificationId: string): Promise<void> {
    const [n] = await db 
        .select()
        .from(notifications)
        .where(eq(notifications.id, notificationId));
    if (!n) throw new Error("Notification not found");
    if (n.userId !== userId) throw new Error("Unauthorized");
    await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, n.id))
}

export async function markAllRead(userId: string): Promise<void> {
    await db
        .update(notifications)
        .set({ isRead: true})
        .where(eq(notifications.userId, userId));
}