import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomDemo, listFilesDemo, uploadFileDemo, deleteFileById, Room, FileItem, DEMO_MODE } from '../lib/api';
import { getOrCreateClientId } from '../lib/identity';
import { Dropzone } from '../components/Dropzone';
import { FileList } from '../components/FileList';

export function RoomPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const [room, setRoom] = useState<Room | null>(null);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const clientUuid = getOrCreateClientId();
  
  const loadFiles = useCallback(async () => {
    if (!slug) return;
    
    try {
      const fileList = await listFilesDemo(slug);
      setFiles(fileList);
    } catch (err) {
      console.error('Failed to load files:', err);
    }
  }, [slug]);

  useEffect(() => {
    async function loadRoom() {
      if (!slug) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const roomData = await getRoomDemo(slug);
        setRoom(roomData);
        await loadFiles();
      } catch (err) {
        setError('Room not found');
      } finally {
        setLoading(false);
      }
    }
    
    loadRoom();
  }, [slug, loadFiles]);

  const handleFilesSelected = async (selectedFiles: File[]) => {
    if (!slug) return;
    
    setUploading(true);
    
    try {
      for (const file of selectedFiles) {
        await uploadFileDemo(slug, file, clientUuid);
      }
      await loadFiles();
    } catch (err) {
      console.error('Failed to upload files:', err);
      alert('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFileById(id, clientUuid);
      await loadFiles();
    } catch (err) {
      console.error('Failed to delete file:', err);
      alert('Failed to delete file');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center py-8">Loading...</div>
      </div>
    );
  }
  
  if (error || !room) {
    return (
      <div className="container">
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Room not found</p>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {room.name || `Room ${room.slug}`}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Share files anonymously. Files expire after 7 days.
          {DEMO_MODE && <span className="ml-2 text-amber-600">(Demo Mode)</span>}
        </p>
      </div>
      
      <div className="mb-8">
        <Dropzone
          onFilesSelected={handleFilesSelected}
          uploading={uploading}
        />
      </div>
      
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Files ({files.length})
        </h2>
        <FileList
          files={files}
          clientUuid={clientUuid}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
