import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc,
  query, 
  where,
  serverTimestamp 
} from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage } from "./firebase";

export interface FileRecord {
  fileId: string;
  roomId: string;
  uploaderId: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  fileUrl: string;
  createdAt: string;
}

export function generateFileId(): string {
  return crypto.randomUUID();
}

export async function uploadFile(
  roomId: string,
  file: File,
  uploaderId: string,
  onProgress?: (progress: number) => void
): Promise<FileRecord> {
  const fileId = generateFileId();
  const storageRef = ref(storage, `files/${roomId}/${fileId}/${file.name}`);
  
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress?.(progress);
      },
      (error) => {
        reject(error);
      },
      async () => {
        const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
        
        const fileRecord: FileRecord = {
          fileId,
          roomId,
          uploaderId,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
          fileUrl,
          createdAt: new Date().toISOString(),
        };
        
        const fileDocRef = doc(db, "files", fileId);
        await setDoc(fileDocRef, {
          ...fileRecord,
          createdAt: serverTimestamp(),
        });
        
        resolve(fileRecord);
      }
    );
  });
}

export async function getFilesByRoom(roomId: string): Promise<FileRecord[]> {
  const filesRef = collection(db, "files");
  const q = query(filesRef, where("roomId", "==", roomId));
  const querySnapshot = await getDocs(q);
  
  const files: FileRecord[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    files.push({
      fileId: data.fileId,
      roomId: data.roomId,
      uploaderId: data.uploaderId,
      fileName: data.fileName,
      fileSize: data.fileSize,
      fileType: data.fileType,
      fileUrl: data.fileUrl,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    });
  });
  
  return files;
}

export async function deleteFile(fileRecord: FileRecord): Promise<void> {
  const fileDocRef = doc(db, "files", fileRecord.fileId);
  await deleteDoc(fileDocRef);
  
  const storageRef = ref(storage, `files/${fileRecord.roomId}/${fileRecord.fileId}/${fileRecord.fileName}`);
  await deleteObject(storageRef);
}
