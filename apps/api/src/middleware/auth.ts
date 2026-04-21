import { createMiddleware } from "hono/factory";
import { jwtVerify } from "jose";
import { env } from "../env.js";
import type { UserRole } from "@wellness/types";

export type JwtPayload = {
  sub: string;
  role: UserRole;
};

export const authMiddleware = createMiddleware<{
  Variables: { user: JwtPayload };
}>(async (c, next) => {
  const authHeader = c.req.header("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.slice(7);
  try {
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    c.set("user", payload as JwtPayload);
    await next();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
});
