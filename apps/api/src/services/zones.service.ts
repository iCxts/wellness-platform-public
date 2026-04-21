import { db } from "../db/index.js";
import { eq, and, isNull } from "drizzle-orm";
import { zones, zoneVisits } from "@wellness/db";
import type { CreateZoneInput, ZoneResponse, ZoneVisitResponse } from "@wellness/types";

export async function listZones(): Promise<ZoneResponse[]> {
    const rows = await db
        .select()
        .from(zones);
    return rows.map((z) => ({
        id: z.id,
        name: z.name,
        description: z.description,
        capacity: z.capacity,
        isActive: z.isActive,
    }));
};

export async function createZone(input: CreateZoneInput): Promise<ZoneResponse> {
    const [z] = await db
        .insert(zones) 
        .values({
            name: input.name,
            description: input.description ?? null,
            capacity: input.capacity
        })
        .returning();
    return {
        id: z.id,
        name: z.name,
        description: z.description,
        capacity: z.capacity,
        isActive: z.isActive,
    };
};

export async function enterZone(zoneId: string, userId: string): Promise<ZoneVisitResponse> {
    const [zone] = await db 
        .select()
        .from(zones)
        .where(eq(zones.id, zoneId));
    if (!zone) throw new Error("Zone not found");

    const [visit] = await db 
        .insert(zoneVisits)
        .values({ userId, zoneId })
        .returning();

    return {
        id: visit.id,
        userId: visit.userId,
        zoneId: visit.zoneId,
        enteredAt: visit.enteredAt.toISOString(),
        exitedAt: null,
        createdAt: visit.createdAt.toISOString(),
    };
}

export async function exitZone(zoneId: string, userId: string): Promise<ZoneVisitResponse> {
    const [visit] = await db 
        .select()
        .from(zoneVisits)
        .where(and(
            eq(zoneVisits.userId, userId),
            eq(zoneVisits.zoneId, zoneId),
            isNull(zoneVisits.exitedAt)
        ));
    if (!visit) throw new Error("No active visit found");

    const [updated] = await db 
        .update(zoneVisits)
        .set({ exitedAt: new Date() })
        .where(eq(zoneVisits.id, visit.id))
        .returning();
    
    return {
        id: updated.id,
        userId: updated.userId,
        zoneId: updated.zoneId,
        enteredAt: updated.enteredAt.toISOString(),
        exitedAt: updated.exitedAt!.toISOString(),
        createdAt: updated.createdAt.toISOString()
    };
}

