import { createClient } from "@wellness/db";
import { env } from "../env.js";

export const db = createClient(env.DATABASE_URL);
