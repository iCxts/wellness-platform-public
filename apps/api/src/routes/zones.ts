import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { JwtPayload } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { listZones, createZone, enterZone, exitZone } from "../services/zones.service.js";

const zones = new Hono<{ Variables: { user: JwtPayload } }>();

const zoneSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    capacity: z.number().int().positive(),
});

zones.use("/*", authMiddleware);

zones.get("/", async (c) => {
    const data = await listZones();
    return c.json(data);
});

zones.post("/", zValidator("json", zoneSchema), async (c) => {
    if (c.get("user").role !== "admin") return c.json({ error: "Unauthorized" }, 403);
    const zone = await createZone(c.req.valid("json"));
    return c.json(zone, 201);
});

zones.post("/:id/enter", async (c) => {
    try {
        const visit = await enterZone(c.req.param("id"), c.get("user").sub);
        return c.json(visit, 201);
    } catch (err) {
        const msg = (err as Error).message;
        if (msg === "Zone not found") return c.json({ error: msg }, 404);
        return c.json({ error: msg }, 400);
    }
});

zones.post("/:id/exit", async (c) => {
    try {
        const visit = await exitZone(c.req.param("id"), c.get("user").sub);
        return c.json(visit);
    } catch (err) {
        const msg = (err as Error).message;
        if (msg === "No active visit found") return c.json({ error: msg }, 404);
        return c.json({ error: msg }, 400);
    }
});

export default zones;
