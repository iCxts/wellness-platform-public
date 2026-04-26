import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { jwtVerify } from "jose";
import type { JwtPayload } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { checkIn } from "../services/checkin.service.js";
import { env } from "../env.js";
import { sendPush } from "../services/push.service.js";

const checkin = new Hono<{ Variables: { user: JwtPayload } }>();

const checkInSchema = z.object({
    sessionId: z.string().uuid(),
    memberToken: z.string(),
});

checkin.use("/*", authMiddleware);

checkin.post("/", zValidator("json", checkInSchema), async (c) => {
    const { role } = c.get("user");
    if (role !== "instructor" && role !== "admin")
        return c.json({ error: "Unauthorized" }, 403);

    const { sessionId, memberToken } = c.req.valid("json");
    try {
        const secret = new TextEncoder().encode(env.JWT_SECRET);
        const { payload } = await jwtVerify(memberToken, secret);
        if (payload["type"] !== "qr_checkin")
            return c.json({ error: "Invalid QR token" }, 401);

        const memberId = payload.sub as string;
        const result = await checkIn(memberId, sessionId);
        sendPush(memberId, "", "", {
            type: "checked_in",
            sessionId: sessionId,
            className: result.className
        }).catch(() => {});

        return c.json(result);
    } catch (err) {
        const msg = (err as Error).message;
        if (msg === "Session not found" || msg === "Booking not found")
            return c.json({ error: msg }, 404);
        if ((err as Error).name.startsWith("JW"))
            return c.json({ error: "Invalid or expired QR token" }, 401);
        return c.json({ error: msg }, 400);
    }
});

export default checkin;
