import { useEffect, useState } from 'react';
import { FileItem } from '../lib/api';

interface FileListProps {
  files: FileItem[];
  clientUuid: string;
  onDelete: (id: string) => void;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function formatTimeRemaining(expiresAt: Date): string {
  const now = new Date();
  const diff = expiresAt.getTime() - now.getTime();
  
  if (diff <= 0) {
    return 'Expired';
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `Expires in: ${days}d ${hours}h ${minutes}m ${seconds}s`;
}

function FileCard({ file, clientUuid, onDelete }: { 
  file: FileItem; 
  clientUuid: string;
  onDelete: (id: string) => void;
}) {
  const [timeRemaining, setTimeRemaining] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  
  const isOwner = file.uploaderUuid === clientUuid;
  
  useEffect(() => {
    const expiresAt = new Date(file.expiresAt);
    
    const updateTimer = () => {
      setTimeRemaining(formatTimeRemaining(expiresAt));
    };
    
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [file.expiresAt]);
  
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this file?')) return;
    
    setIsDeleting(true);
    try {
      await onDelete(file.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {file.filename}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
            <span>{formatBytes(file.sizeBytes)}</span>
            <span>•</span>
            <span className="truncate">{file.mimeType}</span>
          </div>
          <div className="mt-2 text-xs">
            <span className={timeRemaining === 'Expired' ? 'text-red-600 font-medium' : 'text-gray-600'}>
              {timeRemaining}
            </span>
          </div>
        </div>
        
        <div className="ml-4 flex items-center gap-2">
          <a
            href={file.publicUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Download
          </a>
          
          {isOwner && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-sm text-red-600 hover:text-red-800 disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function FileList({ files, clientUuid, onDelete }: FileListProps) {
  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No files yet. Drop some files above to get started.
      </div>
    );
  }
  
  return (
    <div className="space-y-3">
      {files.map((file) => (
        <FileCard
          key={file.id}
          file={file}
          clientUuid={clientUuid}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
