"use server";

import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function createRoom(roomId: string): Promise<void> {
  await db.insert(rooms).values({ roomId });
}

export async function roomExists(roomId: string): Promise<boolean> {
  const result = await db.select().from(rooms).where(eq(rooms.roomId, roomId));
  return result.length > 0;
}

export async function getRoom(roomId: string): Promise<{ roomId: string; createdAt: Date } | null> {
  const result = await db.select().from(rooms).where(eq(rooms.roomId, roomId));
  if (result.length === 0) return null;
  return {
    roomId: result[0].roomId,
    createdAt: result[0].createdAt || new Date(),
  };
}

export async function getAllRooms(): Promise<{ roomId: string; createdAt: Date }[]> {
  const result = await db.select().from(rooms);
  return result.map(r => ({
    roomId: r.roomId,
    createdAt: r.createdAt || new Date(),
  }));
}
