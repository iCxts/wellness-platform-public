import { Queue, Worker } from "bullmq";
import { env } from "../env.js";

const connection = { url: env.REDIS_URL ?? "redis://localhost:6379" };

export const wellnessQueue = new Queue("wellness", { connection });

export function createWorker(
    processor: (job: import("bullmq").Job) => Promise<void>
) {
    return new Worker("wellness", processor, { connection });
}
