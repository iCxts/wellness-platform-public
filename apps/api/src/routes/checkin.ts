import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { JwtPayload } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { checkIn } from "../services/checkin.service.js";

const checkin = new Hono<{ Variables: { user: JwtPayload } }>();

const checkInSchema = z.object({
    sessionId: z.string().uuid(),
});

checkin.use("/*", authMiddleware);

checkin.post("/", zValidator("json", checkInSchema), async (c) => {
    try {
        await checkIn(c.get("user").sub, c.req.valid("json").sessionId);
        return c.json({ success: true });
    } catch (err) {
        const msg = (err as Error).message;
        if (msg === "Session not found" || msg === "Booking not found") return c.json({ error: msg }, 404);
        return c.json({ error: msg }, 400);
    }
});

export default checkin;
