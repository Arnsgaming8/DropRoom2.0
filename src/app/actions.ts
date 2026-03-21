"use server";

import { db } from "@/db";
import { rooms, files } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cloudinary } from "@/lib/cloudinary";

export async function createRoom(roomId: string): Promise<void> {
  console.log("Creating room:", roomId);
  console.log("DB URL:", process.env.DATABASE_URL ? "set" : "NOT SET");
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

export interface FileRecord {
  fileId: string;
  roomId: string;
  uploaderId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  createdAt: Date;
}

function generateFileId(): string {
  return crypto.randomUUID();
}

export async function uploadFile(
  roomId: string,
  fileData: { name: string; type: string; size: number; data: ArrayBuffer },
  uploaderId: string
): Promise<FileRecord> {
  const fileId = generateFileId();
  const publicId = `droproom/${roomId}/${fileId}`;
  
  const base64 = Buffer.from(fileData.data).toString("base64");
  
  console.log("Uploading to Cloudinary, cloud:", cloudinary.config().cloud_name);
  
  const result = await cloudinary.uploader.upload(`data:${fileData.type};base64,${base64}`, {
    public_id: publicId,
    resource_type: "auto",
    folder: `droproom/${roomId}`,
  });

  const fileRecord: FileRecord = {
    fileId,
    roomId,
    uploaderId,
    fileName: fileData.name,
    fileSize: fileData.size,
    fileType: fileData.type,
    fileUrl: result.secure_url,
    createdAt: new Date(),
  };

  await db.insert(files).values({
    fileId: fileRecord.fileId,
    roomId: fileRecord.roomId,
    uploaderId: fileRecord.uploaderId,
    fileName: fileRecord.fileName,
    fileSize: fileRecord.fileSize,
    fileType: fileRecord.fileType,
    fileUrl: fileRecord.fileUrl,
    publicId: result.public_id,
  });

  return fileRecord;
}

export async function getFilesByRoom(roomId: string): Promise<FileRecord[]> {
  const result = await db.select().from(files).where(eq(files.roomId, roomId));
  return result.map(f => ({
    fileId: f.fileId,
    roomId: f.roomId,
    uploaderId: f.uploaderId,
    fileName: f.fileName,
    fileSize: f.fileSize,
    fileType: f.fileType,
    fileUrl: f.fileUrl,
    createdAt: f.createdAt || new Date(),
  }));
}

export async function deleteFile(fileId: string, uploaderId: string): Promise<void> {
  const result = await db.select().from(files).where(eq(files.fileId, fileId));
  if (result.length === 0) return;
  
  const file = result[0];
  if (file.uploaderId !== uploaderId) {
    throw new Error("Not authorized to delete this file");
  }

  await cloudinary.uploader.destroy(file.publicId);
  await db.delete(files).where(eq(files.fileId, fileId));
}
