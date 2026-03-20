"use client";

import { formatFileSize, getFileIcon } from "@/lib";
import { FileRecord as FileRecordServer } from "@/app/actions";

interface FileListProps {
  files: FileRecordServer[];
  currentUserId: string;
  onDelete: (file: FileRecordServer) => Promise<void>;
  deleting: string | null;
}

export default function FileList({ files, currentUserId, onDelete, deleting }: FileListProps) {
  const handleOpen = (url: string) => {
    window.open(url, "_blank");
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
                  onClick={() => handleOpen(file.fileUrl)}
                  className="px-3 py-1.5 rounded-md bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-border)] transition-all duration-150 text-sm font-medium"
                  title="Open in new tab"
                >
                  Open
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
  );
}
