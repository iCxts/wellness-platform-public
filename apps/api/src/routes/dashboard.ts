import { Hono } from "hono";
import { authMiddleware, type JwtPayload } from "../middleware/auth.js";
import { getDashboard, getAdminStats } from "../services/dashboard.service.js";

const dashboardRouter = new Hono<{ Variables: { user: JwtPayload } }>();

dashboardRouter.use("/*", authMiddleware);

dashboardRouter.get("/me", async (c) => {
    const data = await getDashboard(c.get("user").sub);
    return c.json(data);
});

dashboardRouter.get("/admin/stats", async (c) => {
    if (c.get("user").role !== "admin") return c.json({ error: "Unauthorized" }, 403);
    const data = await getAdminStats();
    return c.json(data);
});

export default dashboardRouter;
