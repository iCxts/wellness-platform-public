import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { users } from "@wellness/db";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { env }  from "../env.js";
import { RegisterInput, LoginResponse} from "@wellness/types";
import { UserRole } from "@wellness/types";

export type JwtPayload = {
    sub: string;
    role: UserRole;
};

export async function registerUser(input: RegisterInput) {
    const existing = await db.select().from(users).where(eq(users.email, input.email));
    if (existing.length > 0) throw new Error("Email already exists");

    const passwordHash = await bcrypt.hash(input.password, 12);

    const [user] = await db.insert(users).values({
        email: input.email,
        passwordHash,
        firstname: input.firstName,
        lastname: input.lastName,
        phone: input.phone
    }).returning({ id: users.id, email: users.email, role: users.role});

    return user;
}

export async function loginUser(input: { email: string, password: string}): Promise<LoginResponse> {
    const [user] = await db.select().from(users).where(eq(users.email, input.email));
    if (!user) throw new Error("Invalid email or password");

    const valid = await bcrypt.compare(input.password, user.passwordHash);
    if (!valid) throw new Error("Invalid email or password");

    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new SignJWT({ sub: user.id, role: user.role}) 
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d")
        .sign(secret);

    return { token, user: { id: user.id, email: user.email, role: user.role}};
}
