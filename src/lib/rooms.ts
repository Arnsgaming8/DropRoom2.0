import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs,
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";

export interface Room {
  roomId: string;
  createdAt: string;
}

export async function createRoom(roomId: string): Promise<void> {
  const roomRef = doc(db, "rooms", roomId);
  await setDoc(roomRef, {
    roomId,
    createdAt: serverTimestamp(),
  });
}

export async function getRoom(roomId: string): Promise<Room | null> {
  const roomRef = doc(db, "rooms", roomId);
  const roomSnap = await getDoc(roomRef);
  
  if (!roomSnap.exists()) {
    return null;
  }
  
  const data = roomSnap.data();
  return {
    roomId: data.roomId,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

export async function roomExists(roomId: string): Promise<boolean> {
  const room = await getRoom(roomId);
  return room !== null;
}
