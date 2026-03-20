import { db } from "@/db";
import { rooms } from "@/db/schema";
import { eq } from "drizzle-orm";

export interface Room {
  roomId: string;
  createdAt: Date;
}

export async function createRoom(roomId: string): Promise<void> {
  await db.insert(rooms).values({ roomId });
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const result = await db.select().from(rooms).where(eq(rooms.roomId, roomId));
  if (result.length === 0) return null;
  return {
    roomId: result[0].roomId,
    createdAt: result[0].createdAt || new Date(),
  };
}

export async function roomExists(roomId: string): Promise<boolean> {
  const room = await getRoom(roomId);
  return room !== null;
}

export async function getAllRooms(): Promise<Room[]> {
  const result = await db.select().from(rooms);
  return result.map(r => ({
    roomId: r.roomId,
    createdAt: r.createdAt || new Date(),
  }));
}