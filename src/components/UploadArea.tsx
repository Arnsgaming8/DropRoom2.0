"use client";

import { useState, useRef } from "react";

interface UploadAreaProps {
  onUpload: (files: FileList) => Promise<void>;
  uploading: boolean;
  progress: number;
}

export default function UploadArea({ onUpload, uploading, progress }: UploadAreaProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files);
    }
  };
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer ${
        isDragOver 
          ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" 
          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-elevated)]"
      } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileSelect}
      />
      
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 ${
          isDragOver ? "bg-[var(--color-primary)]/20 text-[var(--color-primary-hover)]" : "bg-[var(--color-surface-elevated)] text-[var(--color-text-muted)]"
        }`}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div>
          <p className="text-[var(--color-text-primary)] font-medium">
            {uploading ? "Uploading..." : "Drag & drop files here"}
          </p>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            or click to browse
          </p>
        </div>
        
        {uploading && (
          <div className="w-full max-w-xs mt-2">
            <div className="h-2 bg-[var(--color-surface-elevated)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary-hover)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[var(--color-text-muted)] text-xs mt-1 text-center">
              {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
