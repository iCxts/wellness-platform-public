import { Hono } from "hono";
import type { JwtPayload } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { listNotifications, markRead, markAllRead } from "../services/notifications.service.js";

const notification = new Hono<{ Variables: { user: JwtPayload } }>();

notification.use("/*", authMiddleware);

notification.get("/me", async(c) => {
    const unreadOnly = c.req.query("unread") === "true";
    const data = await listNotifications(c.get("user").sub, unreadOnly);
    return c.json(data);
});

notification.patch("/read-all", async(c) => {
    await markAllRead(c.get("user").sub);
    return c.json({ success: true });
});

notification.patch("/:id/read", async(c) => {
    try {
        await markRead(c.get("user").sub, c.req.param("id"));
        return c.json({ success: true });
    } catch(err) {
        const msg = (err as Error).message;
        if (msg === "Notification not found") return c.json({ error: msg }, 404);
        if (msg === "Unauthorized") return c.json({ error: msg }, 403);
        return c.json({ error: msg }, 400);
    }
});

export default notification;
