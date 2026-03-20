"use client";

import Link from "next/link";

interface HeaderProps {
  onToggleSidebar: () => void;
  showBackButton?: boolean;
  roomId?: string;
}

export default function Header({ onToggleSidebar, showBackButton, roomId }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#12121a]/95 backdrop-blur-sm border-b border-[#2a2a3a]">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[#1a1a24] text-[#94a3b8] hover:text-[#f1f5f9] transition-all duration-150"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="text-xl font-bold text-[#f1f5f9]">DropRoom</span>
          </Link>
          
          {showBackButton && roomId && (
            <>
              <span className="text-[#2a2a3a]">/</span>
              <div className="flex items-center gap-2">
                <span className="text-[#64748b]">Room:</span>
                <span className="font-mono text-[#22d3ee] font-medium">{roomId}</span>
              </div>
            </>
          )}
        </div>
        

      </div>
    </header>
  );
}
