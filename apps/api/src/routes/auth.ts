import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { registerUser, loginUser} from "../services/auth.service.js";

const auth = new Hono();

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    phone: z.string().optional()
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1)
});

auth.post("/register", zValidator("json", registerSchema), async (c) => {
    const body = c.req.valid("json");
    try {
        const user = await registerUser(body);
        return c.json({ user }, 201,);
    } catch (err) {
        return c.json({ error: (err as Error).message }, 400);
    }
});

auth.post("/login", zValidator("json", loginSchema), async (c) => {
    const body = c.req.valid("json");
    try {
        const result = await loginUser(body);
        return c.json(result);
    } catch (err) {
        return c.json( {error: (err as Error).message}, 401);
    }
});

export default auth;