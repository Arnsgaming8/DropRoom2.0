const API_BASE = 'http://localhost:4000/api';

// Demo mode for GitHub Pages (no backend required)
export const DEMO_MODE = true;

// Demo data for showcasing the UI
export const DEMO_FILES = [
  {
    id: 'demo-1',
    roomId: 'demo-room',
    uploaderUuid: 'demo-user-1',
    filename: 'document.pdf',
    mimeType: 'application/pdf',
    sizeBytes: 2456789,
    storageKey: 'demo/key1',
    publicUrl: '#',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-2',
    roomId: 'demo-room',
    uploaderUuid: 'demo-user-2',
    filename: 'image.png',
    mimeType: 'image/png',
    sizeBytes: 1234567,
    storageKey: 'demo/key2',
    publicUrl: '#',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'demo-3',
    roomId: 'demo-room',
    uploaderUuid: 'demo-user-1',
    filename: 'archive.zip',
    mimeType: 'application/zip',
    sizeBytes: 56789012,
    storageKey: 'demo/key3',
    publicUrl: '#',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export interface Room {
  id: string;
  slug: string;
  name: string | null;
  createdAt: string;
}

export interface FileItem {
  id: string;
  roomId: string;
  uploaderUuid: string | null;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  storageKey: string;
  publicUrl: string;
  createdAt: string;
  expiresAt: string;
}

export async function createRoom(name?: string): Promise<Room> {
  const response = await fetch(`${API_BASE}/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create room');
  }
  
  return response.json();
}

export async function getRoom(slug: string): Promise<Room> {
  const response = await fetch(`${API_BASE}/rooms/${slug}`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Room not found');
  }
  
  return response.json();
}

export async function listFiles(slug: string): Promise<FileItem[]> {
  const response = await fetch(`${API_BASE}/rooms/${slug}/files`);
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch files');
  }
  
  return response.json();
}

export async function uploadFileToRoom(
  slug: string,
  file: File,
  uploaderUuid: string
): Promise<FileItem> {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploaderUuid', uploaderUuid);
  
  const response = await fetch(`${API_BASE}/rooms/${slug}/files`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload file');
  }
  
  return response.json();
}

export async function deleteFileById(id: string, uploaderUuid: string): Promise<void> {
  if (DEMO_MODE) {
    // In demo mode, just return success (mock delete)
    console.log('Demo mode: File delete simulated');
    return;
  }
  
  const response = await fetch(`${API_BASE}/files/${id}`, {
    method: 'DELETE',
    headers: {
      'X-Uploader-Uuid': uploaderUuid,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete file');
  }
}

// Demo mode wrapper functions for GitHub Pages
export async function createRoomDemo(name?: string): Promise<Room> {
  if (DEMO_MODE) {
    return {
      id: 'demo-room-' + Date.now(),
      slug: 'demo-' + Math.random().toString(36).substring(7),
      name: name || null,
      createdAt: new Date().toISOString(),
    };
  }
  return createRoom(name);
}

export async function getRoomDemo(slug: string): Promise<Room> {
  if (DEMO_MODE) {
    return {
      id: 'demo-room',
      slug: slug,
      name: 'Demo Room',
      createdAt: new Date().toISOString(),
    };
  }
  return getRoom(slug);
}

export async function listFilesDemo(slug: string): Promise<FileItem[]> {
  if (DEMO_MODE) {
    return DEMO_FILES;
  }
  return listFiles(slug);
}

export async function uploadFileDemo(
  slug: string,
  file: File,
  uploaderUuid: string
): Promise<FileItem> {
  if (DEMO_MODE) {
    // Simulate upload by adding to demo files
    const newFile: FileItem = {
      id: 'demo-' + Date.now(),
      roomId: 'demo-room',
      uploaderUuid: uploaderUuid,
      filename: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
      storageKey: 'demo/' + file.name,
      publicUrl: '#',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    DEMO_FILES.push(newFile as typeof DEMO_FILES[0]);
    return newFile;
  }
  return uploadFileToRoom(slug, file, uploaderUuid);
}
