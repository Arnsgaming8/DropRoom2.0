"use client";

import { useState, useEffect } from "react";
import { formatFileSize, getFileIcon } from "@/lib";
import { FileRecord as FileRecordServer } from "@/app/actions";

interface FileListProps {
  files: FileRecordServer[];
  currentUserId: string;
  onDelete: (file: FileRecordServer) => Promise<void>;
  deleting: string | null;
}

function FileViewer({ file, onClose }: { file: FileRecordServer; onClose: () => void }) {
  const isImage = file.fileType.startsWith("image/");
  const isVideo = file.fileType.startsWith("video/");
  const isAudio = file.fileType.startsWith("audio/");
  const isPdf = file.fileType.includes("pdf");

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-2xl font-bold transition-colors"
      >
        ×
      </button>

      <div 
        className="max-w-full max-h-full" 
        onClick={(e) => e.stopPropagation()}
      >
        {isImage && (
          <img 
            src={file.fileUrl} 
            alt={file.fileName}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        )}
        {isVideo && (
          <video 
            src={file.fileUrl} 
            controls
            className="max-w-full max-h-[90vh] rounded-lg"
          >
            Your browser does not support video playback.
          </video>
        )}
        {isAudio && (
          <div className="bg-white/10 rounded-lg p-8 text-center">
            <div className="text-6xl mb-4">{getFileIcon(file.fileType)}</div>
            <p className="text-white mb-4">{file.fileName}</p>
            <audio src={file.fileUrl} controls className="w-full max-w-md">
              Your browser does not support audio playback.
            </audio>
          </div>
        )}
        {isPdf && (
          <iframe 
            src={file.fileUrl} 
            className="w-[90vw] h-[90vh] rounded-lg bg-white"
            title={file.fileName}
          />
        )}
        {!isImage && !isVideo && !isAudio && !isPdf && (
          <div className="bg-white/10 rounded-lg p-12 text-center">
            <div className="text-8xl mb-4">{getFileIcon(file.fileType)}</div>
            <p className="text-white text-xl mb-2">{file.fileName}</p>
            <p className="text-white/60 mb-4">{formatFileSize(file.fileSize)}</p>
            <a 
              href={file.fileUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
            >
              Open in New Tab
            </a>
          </div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
        Press ESC or click outside to close
      </div>
    </div>
  );
}

export default function FileList({ files, currentUserId, onDelete, deleting }: FileListProps) {
  const [viewerFile, setViewerFile] = useState<FileRecordServer | null>(null);
  
  const handleOpen = (file: FileRecordServer) => {
    setViewerFile(file);
  };
  
  const handleDownload = (file: FileRecordServer) => {
    const link = document.createElement("a");
    link.href = file.fileUrl;
    link.download = file.fileName;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  if (files.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4 opacity-30">📭</div>
        <p className="text-[var(--color-text-muted)]">No files yet</p>
        <p className="text-[var(--color-text-muted)] text-sm mt-1 opacity-70">Upload some files to get started</p>
      </div>
    );
  }
  
  return (
    <>
      {viewerFile && (
        <FileViewer file={viewerFile} onClose={() => setViewerFile(null)} />
      )}
      
      <div className="space-y-2">
        <div className="flex items-center justify-between px-2 py-1">
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            Files ({files.length})
          </span>
        </div>
        
        <ul className="space-y-2">
          {files.map((file) => {
            const isOwner = file.uploaderId === currentUserId;
            const isDeleting = deleting === file.fileId;
            
            return (
              <li 
                key={file.fileId}
                className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg p-4 flex items-center gap-4 hover:border-[var(--color-primary)]/30 transition-all duration-150 animate-fadeIn"
              >
                <div className="text-3xl flex-shrink-0">
                  {getFileIcon(file.fileType)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-[var(--color-text-primary)] font-medium truncate" title={file.fileName}>
                    {file.fileName}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[var(--color-text-muted)]">
                    <span>{formatFileSize(file.fileSize)}</span>
                    <span>•</span>
                    <span>{new Date(file.createdAt).toLocaleString()}</span>
                    {isOwner && (
                      <>
                        <span>•</span>
                        <span className="text-[var(--color-accent)]">Your upload</span>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleOpen(file)}
                    className="px-3 py-1.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-all duration-150 text-sm font-medium"
                    title="View full screen"
                  >
                    ⛶
                  </button>
                  
                  <button
                    onClick={() => handleDownload(file)}
                    className="px-3 py-1.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-all duration-150 text-sm font-medium"
                    title="Download file"
                  >
                    ↓
                  </button>
                  
                  {isOwner && (
                    <button
                      onClick={() => onDelete(file)}
                      disabled={isDeleting}
                      className="px-3 py-1.5 rounded-md bg-[var(--color-danger)]/10 text-[var(--color-danger)] hover:bg-[var(--color-danger)]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm font-medium"
                      title="Delete file"
                    >
                      {isDeleting ? "..." : "×"}
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
