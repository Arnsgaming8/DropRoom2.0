"use client";

import { FileRecord, formatFileSize, getFileIcon } from "@/lib";

interface FileListProps {
  files: FileRecord[];
  currentUserId: string;
  onDelete: (file: FileRecord) => Promise<void>;
  deleting: string | null;
}

export default function FileList({ files, currentUserId, onDelete, deleting }: FileListProps) {
  const handleOpen = (url: string) => {
    window.open(url, "_blank");
  };
  
  const handleDownload = (file: FileRecord) => {
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
        <p className="text-[#64748b]">No files yet</p>
        <p className="text-[#475569] text-sm mt-1">Upload some files to get started</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-sm font-medium text-[#94a3b8]">
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
              className="bg-[#12121a] border border-[#2a2a3a] rounded-lg p-4 flex items-center gap-4 hover:border-[#6366f1]/30 transition-all duration-150 animate-fadeIn"
            >
              <div className="text-3xl flex-shrink-0">
                {getFileIcon(file.fileType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-[#f1f5f9] font-medium truncate" title={file.fileName}>
                  {file.fileName}
                </p>
                <div className="flex items-center gap-2 text-sm text-[#64748b]">
                  <span>{formatFileSize(file.fileSize)}</span>
                  <span>•</span>
                  <span>{new Date(file.createdAt).toLocaleString()}</span>
                  {isOwner && (
                    <>
                      <span>•</span>
                      <span className="text-[#22d3ee]">Your upload</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => handleOpen(file.fileUrl)}
                  className="px-3 py-1.5 rounded-md bg-[#1a1a24] text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#2a2a3a] transition-all duration-150 text-sm font-medium"
                  title="Open in new tab"
                >
                  Open
                </button>
                
                <button
                  onClick={() => handleDownload(file)}
                  className="px-3 py-1.5 rounded-md bg-[#1a1a24] text-[#94a3b8] hover:text-[#f1f5f9] hover:bg-[#2a2a3a] transition-all duration-150 text-sm font-medium"
                  title="Download file"
                >
                  ↓
                </button>
                
                {isOwner && (
                  <button
                    onClick={() => onDelete(file)}
                    disabled={isDeleting}
                    className="px-3 py-1.5 rounded-md bg-[#ef4444]/10 text-[#ef4444] hover:bg-[#ef4444]/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 text-sm font-medium"
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
