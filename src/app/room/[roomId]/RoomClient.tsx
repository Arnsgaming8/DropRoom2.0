"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Header, Sidebar, UploadArea, FileList } from "@/components";
import { 
  getUserId, 
  saveRoom, 
  removeRoom, 
  isRoomSaved,
  roomExists 
} from "@/lib";
import { 
  uploadFile as uploadFileAction, 
  getFilesByRoom as getFilesByRoomAction, 
  deleteFile as deleteFileAction,
  FileRecord as FileRecordServer
} from "@/app/actions";

interface RoomClientProps {
  params: Promise<{ roomId: string }>;
}

export function RoomClient({ params }: RoomClientProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const roomId = resolvedParams.roomId;
  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const [files, setFiles] = useState<FileRecordServer[]>([]);
  const [loading, setLoading] = useState(true);
  const [roomValid, setRoomValid] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    const userId = getUserId();
    setCurrentUserId(userId);
    setIsSaved(isRoomSaved(roomId));
    
    async function checkRoom() {
      const exists = await roomExists(roomId);
      if (!exists) {
        setRoomValid(false);
      } else {
        const roomFiles = await getFilesByRoomAction(roomId);
        setFiles(roomFiles);
      }
      setLoading(false);
    }
    
    checkRoom();
  }, [roomId]);
  
  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    setUploadProgress(0);
    
    try {
      const fileArray = Array.from(fileList);
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const progressPerFile = 100 / fileArray.length;
        const baseProgress = i * progressPerFile;
        
        const arrayBuffer = await file.arrayBuffer();
        
        await uploadFileAction(
          roomId,
          { name: file.name, type: file.type, size: file.size, data: arrayBuffer },
          currentUserId
        );
        
        setUploadProgress(baseProgress + progressPerFile);
      }
      
      const updatedFiles = await getFilesByRoomAction(roomId);
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };
  
  const handleDelete = async (file: FileRecordServer) => {
    if (file.uploaderId !== currentUserId) return;
    
    setDeleting(file.fileId);
    try {
      await deleteFileAction(file.fileId, currentUserId);
      const updatedFiles = await getFilesByRoomAction(roomId);
      setFiles(updatedFiles);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setDeleting(null);
    }
  };
  
  const handleToggleSave = () => {
    if (isSaved) {
      removeRoom(roomId);
    } else {
      saveRoom(roomId);
    }
    setIsSaved(!isSaved);
  };
  
  const handleShareRoom = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert("Room link copied to clipboard!");
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (!roomValid) {
    return (
      <div className="min-h-screen">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center px-4">
            <div className="text-6xl mb-4">🔍</div>
            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">
              Room Not Found
            </h1>
            <p className="text-[var(--color-text-muted)] mb-6">
              This room doesn&apos;t exist or may have been deleted.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2.5 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:bg-[var(--color-primary-hover)] transition-all duration-150"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        showBackButton
        roomId={roomId}
      />
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        currentRoomId={roomId}
      />
      
      <main 
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
                Room: <span className="font-mono text-[var(--color-accent)]">{roomId}</span>
              </h1>
              <p className="text-[var(--color-text-muted)] text-sm mt-1">
                Share this link to let others access the files
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleShareRoom}
                className="px-4 py-2 rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-all duration-150 text-sm font-medium flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Share
              </button>
              
              <button
                onClick={handleToggleSave}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 flex items-center gap-2 ${
                  isSaved 
                    ? "bg-[var(--color-success)]/20 text-[var(--color-success)] hover:bg-[var(--color-success)]/30"
                    : "bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)]"
                }`}
              >
                {isSaved ? (
                  <>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Saved
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    Save
                  </>
                )}
              </button>
            </div>
          </div>
          
          <div className="mb-8">
            <UploadArea 
              onUpload={handleUpload}
              uploading={uploading}
              progress={uploadProgress}
            />
          </div>
          
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-6">
            <FileList 
              files={files}
              currentUserId={currentUserId}
              onDelete={handleDelete}
              deleting={deleting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
