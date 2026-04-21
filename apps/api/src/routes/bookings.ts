import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import type { JwtPayload } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { createBooking, cancelBooking, listMyBookings } from "../services/bookings.service.js";

const bookings = new Hono<{ Variables: { user: JwtPayload}}>();

const createBookingSchema = z.object({
    sessionId: z.string().uuid()
});

bookings.use("/*", authMiddleware);

bookings.get("/me", async(c) => {
    const status = c.req.query("status");
    const past = c.req.query("past") === "true";
    const data = await listMyBookings(c.get("user").sub, {
        status: status ?? undefined,
        past: past || undefined,
    });
    return c.json(data);
});

bookings.post("/", zValidator("json", createBookingSchema), async(c) => {
    try {
        const booking = await createBooking(c.get("user").sub, c.req.valid("json").sessionId);
        return c.json(booking, 201);
    } catch (err) {
        return c.json({ error: (err as Error).message}, 400);
    }
});

bookings.delete("/:id", async(c) => {
    try {
        await cancelBooking(c.get("user").sub, c.req.param("id"));
        return c.body(null, 204);
    } catch (err) {
        const msg = (err as Error).message;
        if (msg === "Unauthorized") return c.json({ error: msg }, 403);
        if (msg === "Booking not found") return c.json ({ error: msg }, 404);
        return c.json({ error: msg }, 400);
    }
});

export default bookings;