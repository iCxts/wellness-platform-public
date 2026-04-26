import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import * as fs from "fs";
import * as path from "path";
import { authMiddleware, type JwtPayload } from "../middleware/auth.js";
import { env } from "../env.js";
import {
    getMyProfile,
    updateProfile,
    updateAvatar,
    generateQrToken,
    getLatestCheckIn,
} from "../services/users.service.js";
import { getProgress } from "../services/progress.service.js";
import { registerDeviceToken } from "../services/push.service.js";

const usersRouter = new Hono<{ Variables: { user: JwtPayload } }>();

usersRouter.use("/*", authMiddleware);

const updateProfileSchema = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().optional(),
});

usersRouter.get("/me", async (c) => {
    const profile = await getMyProfile(c.get("user").sub);
    if (!profile) return c.json({ error: "User not found" }, 404);
    return c.json(profile);
});

usersRouter.patch("/me", zValidator("json", updateProfileSchema), async (c) => {
    const updated = await updateProfile(c.get("user").sub, c.req.valid("json"));
    return c.json(updated);
});

usersRouter.post("/me/avatar", async (c) => {
    const body = await c.req.parseBody();
    const file = body["file"];
    if (!(file instanceof File)) return c.json({ error: "file field required" }, 400);

    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(file.type)) return c.json({ error: "Invalid file type. Use jpeg, png, or webp" }, 400);
    if (file.size > 5 * 1024 * 1024) return c.json({ error: "File exceeds 5MB limit" }, 400);

    const ext = file.type.split("/")[1].replace("jpeg", "jpg");
    const filename = `${c.get("user").sub}-${Date.now()}.${ext}`;
    const uploadDir = path.join(process.cwd(), "uploads", "avatars");
    fs.mkdirSync(uploadDir, { recursive: true });
    fs.writeFileSync(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

    const relativePath = `/avatars/${filename}`;
    const updated = await updateAvatar(c.get("user").sub, relativePath);
    return c.json({ ...updated, avatarUrl: env.BASE_URL + relativePath });
});

usersRouter.get("/me/qr", async (c) => {
    if (c.get("user").role !== "member") return c.json({ error: "Forbidden" }, 403);
    const result = await generateQrToken(c.get("user").sub);
    return c.json(result);
});

usersRouter.get("/me/checkin/latest", async (c) => {
    if (c.get("user").role !== "member") return c.json({ error: "Forbidden" }, 403);
    const result = await getLatestCheckIn(c.get("user").sub);
    if (!result) return c.json({ error: "No check-in found" }, 404);
    return c.json(result);
});

usersRouter.get("/:memberId", async (c) => {
    const { role } = c.get("user");
    if (role !== "instructor" && role !== "admin") return c.json({ error: "Forbidden" }, 403);
    const profile = await getMyProfile(c.req.param("memberId"));
    if (!profile) return c.json({ error: "User not found" }, 404);
    return c.json(profile);
});

usersRouter.get("/:memberId/progress", async (c) => {
    const { role } = c.get("user");
    if (role !== "instructor" && role !== "admin") return c.json({ error: "Forbidden" }, 403);
    const profile = await getMyProfile(c.req.param("memberId"));
    if (!profile) return c.json({ error: "User not found" }, 404);
    const progress = await getProgress(c.req.param("memberId"));
    return c.json(progress);
});

usersRouter.post(
    "/me/device-token",
    zValidator("json", z.object({ token: z.string().min(1) })),
    async (c) => {
        if (c.get("user").role !== "member") return c.json({ error: "Forbidden"}, 403);
        const { token } = c.req.valid("json");
        await registerDeviceToken(c.get("user").sub, token);
        return c.json({ success: true });
    }
);

export default usersRouter;
