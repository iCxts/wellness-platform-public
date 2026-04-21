import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { JwtPayload } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { checkOut } from "../services/checkout.service.js";

const checkout = new Hono<{ Variables: { user: JwtPayload } }>();

const checkOutSchema = z.object({
    sessionId: z.string().uuid(),
});

checkout.use("/*", authMiddleware);

checkout.post("/", zValidator("json", checkOutSchema), async (c) => {
    try {
        const booking = await checkOut(c.get("user").sub, c.req.valid("json").sessionId);
        return c.json(booking);
    } catch (err) {
        const msg = (err as Error).message;
        if (msg === "Booking not found") return c.json({ error: msg }, 404);
        return c.json({ error: msg }, 400);
    }
});

export default checkout;
