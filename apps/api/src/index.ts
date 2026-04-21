import { Hono } from "hono";
import { env } from "./env.js";
import { db } from "./db/index.js";
import { sql } from "drizzle-orm";
import { serve } from "@hono/node-server";
import authRoutes from "./routes/auth.js";
import sessionRoutes from "./routes/sessions.js";
import zoneRoutes from "./routes/zones.js";
import bookingRoutes from "./routes/bookings.js";
import checkinRoutes from "./routes/checkin.js";
import checkoutRoutes from "./routes/checkout.js";
import notificationRoutes from "./routes/notifications.js";
import progressRoutes from "./routes/progress.js";
import { startWorker } from "./jobs/worker.js";
import { enqueueAbsenceChecker } from "./jobs/absence-checker.job.js";

const app = new Hono();

app.route("/auth", authRoutes);
app.route("/sessions", sessionRoutes);
app.route("/zones", zoneRoutes);
app.route("/bookings", bookingRoutes);
app.route("/checkin", checkinRoutes);
app.route("/checkout", checkoutRoutes);
app.route("/notifications", notificationRoutes);
app.route("/progress", progressRoutes);

//HEALTH CHECK
app.get("/health", async (c) => {
  try {
    await db.execute(sql`SELECT 1`);
    return c.json({ status: "ok", db: "connected" });
  } catch {
    return c.json({ status: "error", db: "unreachable" }, 401);
  }
});

export default {
  port: env.PORT,
  fetch: app.fetch,
};

serve({ fetch: app.fetch, port: env.PORT }, () => {
  console.log(`API RUNNING ON : http://localhost:${env.PORT}`);
  startWorker();
  enqueueAbsenceChecker();
});
