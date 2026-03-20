import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "droproom_userId";
const SAVED_ROOMS_KEY = "droproom_savedRooms";

export interface SavedRoom {
  roomId: string;
  createdAt: string;
}

export function getUserId(): string {
  if (typeof window === "undefined") return "";
  
  let userId = localStorage.getItem(USER_ID_KEY);
  if (!userId) {
    userId = uuidv4();
    localStorage.setItem(USER_ID_KEY, userId);
  }
  return userId;
}

export function getSavedRooms(): SavedRoom[] {
  if (typeof window === "undefined") return [];
  
  const roomsJson = localStorage.getItem(SAVED_ROOMS_KEY);
  if (!roomsJson) return [];
  
  try {
    return JSON.parse(roomsJson);
  } catch {
    return [];
  }
}

export function saveRoom(roomId: string): void {
  const rooms = getSavedRooms();
  
  if (rooms.some(r => r.roomId === roomId)) {
    return;
  }
  
  rooms.push({
    roomId,
    createdAt: new Date().toISOString(),
  });
  
  localStorage.setItem(SAVED_ROOMS_KEY, JSON.stringify(rooms));
}

export function removeRoom(roomId: string): void {
  const rooms = getSavedRooms();
  const filtered = rooms.filter(r => r.roomId !== roomId);
  localStorage.setItem(SAVED_ROOMS_KEY, JSON.stringify(filtered));
}

export function isRoomSaved(roomId: string): boolean {
  const rooms = getSavedRooms();
  return rooms.some(r => r.roomId === roomId);
}
