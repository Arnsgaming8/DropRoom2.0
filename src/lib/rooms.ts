import { createRoom as createRoomAction, roomExists as roomExistsAction, getRoom as getRoomAction, getAllRooms as getAllRoomsAction } from "@/app/actions";

export interface Room {
  roomId: string;
  createdAt: Date;
}

export async function createRoom(roomId: string): Promise<void> {
  await createRoomAction(roomId);
}

export async function getRoom(roomId: string): Promise<Room | null> {
  return getRoomAction(roomId);
}

export async function roomExists(roomId: string): Promise<boolean> {
  return roomExistsAction(roomId);
}

export async function getAllRooms(): Promise<Room[]> {
  return getAllRoomsAction();
}
