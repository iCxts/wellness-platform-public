import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { authMiddleware } from "../middleware/auth.js";
import {
  listSessions,
  getSession,
  createSession,
  updateSession,
  updateSessionImage,
  deleteSession,
  getSessionBookings
} from "../services/sessions.service.js";
import type { JwtPayload } from "../middleware/auth.js";
import { env } from "../env.js";

const sessions = new Hono<{ Variables: { user: JwtPayload } }>();

const SESSION_LEVELS = ["beginner", "pre_intermediate", "intermediate", "advanced"] as const;
const SESSION_FOCUSES = [
  "neck_shoulders", "hips_opener", "breathing_flow", "lower_back_care",
  "core_strength", "posture_reset", "stress_release", "brain_refresh",
] as const;

const sessionSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["group_class", "personal_training", "medical_consult", "open_facility"]),
  level: z.enum(SESSION_LEVELS).optional(),
  focus: z.array(z.enum(SESSION_FOCUSES)).optional(),
  description: z.string().optional(),
  roomName: z.string().optional(),
  placeDescription: z.string().optional(),
  trainerId: z.string().uuid().optional(),
  zoneId: z.string().uuid(),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  capacity: z.number().int().positive(),
});

sessions.use("/*", authMiddleware);

sessions.get("/", async(c) => {
  const focus = c.req.query("focus");
  const day = c.req.query("day");
  const data = await listSessions({ focus, day });
  return c.json(data);
});

sessions.get("/:id", async(c) => {
  const session = await getSession(c.req.param("id"));
  if (!session) return c.json({ error: "Session not found" }, 404);
  return c.json(session);
});

sessions.post("/", zValidator("json", sessionSchema), async(c) => {
  if (c.get("user").role !== "admin") return c.json({ error: "Unauthorized" }, 403);
  const session = await createSession(c.req.valid("json"));
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


sessions.post("/:id/image", async (c) => {
  const { role, sub } = c.get("user");
  if (role !== "admin" && role !== "instructor") return c.json({ error: "Unauthorized" }, 403);

  const existing = await getSession(c.req.param("id"));
  if (!existing) return c.json({ error: "Session not found" }, 404);
  if (role === "instructor" && existing.trainerId !== sub)
    return c.json({ error: "Unauthorized" }, 403);

  const body = await c.req.parseBody();
  const file = body["file"];
  if (!(file instanceof File)) return c.json({ error: "file field required" }, 400);

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) return c.json({ error: "Invalid file type. Use jpeg, png, or webp" }, 400);
  if (file.size > 10 * 1024 * 1024) return c.json({ error: "File exceeds 10MB limit" }, 400);

  const ext = file.type.split("/")[1].replace("jpeg", "jpg");
  const filename = `session-${c.req.param("id")}-${Date.now()}.${ext}`;
  const uploadDir = path.join(process.cwd(), "uploads", "sessions");
  fs.mkdirSync(uploadDir, { recursive: true });
  fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  const relativePath = `/sessions/${filename}`;
  const updated = await updateSessionImage(c.req.param("id"), relativePath);
  return c.json({ ...updated, imageUrl: env.BASE_URL + relativePath });
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