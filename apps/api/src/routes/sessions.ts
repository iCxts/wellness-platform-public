import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { authMiddleware } from "../middleware/auth.js";
import {
  listSessions,
  getSession,
  createSession,
  updateSession,
  deleteSession,
  getSessionBookings
} from "../services/sessions.service.js";
import type { JwtPayload } from "../middleware/auth.js";

const sessions = new Hono<{ Variables: { user: JwtPayload } }>();

const sessionSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["group_class", "personal_training", "medical_consult", "open_facility"]),
  trainerId: z.string().uuid().optional(),
  zoneId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  capacity: z.number().int().positive(),
});

sessions.use("/*", authMiddleware);

sessions.get("/", async(c) => {
  const data = await listSessions();
  return c.json(data);
});

sessions.get("/:id", async(c) => {
  const session = await getSession(c.req.param("id"));
  if (!session) return c.json({ error: "Session not found" }, 404);
  return c.json(session);
});

sessions.post("/",  zValidator("json", sessionSchema), async(c) => {
   const { role, sub } = c.get("user");
   const body = c.req.valid("json");
   if (role !== "admin") {
    if (role !== "instructor") {
      return c.json({ error: "Unauthorized"}, 403);
    }
    body.trainerId = sub;
   }
   const session = await createSession(body);
   return c.json(session, 201);
});


sessions.patch("/:id", zValidator("json", sessionSchema.partial()), async(c) => {
  const { role, sub } = c.get("user");
  if (role !== "admin") {
    const existing = await getSession(c.req.param("id"));
    if (!existing) return c.json({ error: "Session not found"}, 404);
    if (role !== "instructor" || existing.trainerId !== sub) {
      return c.json({ error: "Unauthorized" }, 403)
    } 
  }
  const updated = await updateSession(c.req.param("id"), c.req.valid("json"));
  if (!updated) return c.json({ error: "Session not found" }, 404);
  return c.json(updated);
});


sessions.delete("/:id", async(c) => {
  if (c.get("user").role !== "admin") return c.json({ error: "Unauthorized" }, 403);
  try {
    await deleteSession(c.req.param("id"));
    return c.body(null, 204);
  } catch (error) {
    return c.json({ error: "Failed to delete session" }, 409);
  }
});


sessions.get("/:id/bookings", async(c) => {
  const { role, sub } = c.get("user");
  if (role !== "admin" && role !== "instructor") {
    return c.json({ error: "Unauthorized" }, 403);
  }
  try {
    const data = await getSessionBookings(c.req.param("id"), sub, role);
    return c.json(data)
  } catch (err) {
    const msg = (err as Error).message
    if (msg === "Session not found") return c.json({ error: msg }, 404);
    if (msg === "Unauthorized") return c.json({ error: msg }, 403);
    return c.json({ error: msg }, 400);
  }

});
export default sessions;