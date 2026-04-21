import { Hono } from "hono";
import type { JwtPayload } from "../middleware/auth.js";
import { authMiddleware } from "../middleware/auth.js";
import { getProgress } from "../services/progress.service.js";

const progress = new Hono<{ Variables: { user: JwtPayload } }>();

progress.use("/*", authMiddleware);

progress.get("/me", async (c) => {
    const data = await getProgress(c.get("user").sub);
    return c.json(data);
});

export default progress;
