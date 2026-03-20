"use client";

import Link from "next/link";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
  onToggleSidebar: () => void;
  showBackButton?: boolean;
  roomId?: string;
}

export default function Header({ onToggleSidebar, showBackButton, roomId }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[var(--color-surface)]/95 backdrop-blur-sm border-b border-[var(--color-border)]">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-150"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">DropRoom</span>
          </Link>
          
          {showBackButton && roomId && (
            <>
              <span className="text-[var(--color-border)]">/</span>
              <div className="flex items-center gap-2">
                <span className="text-[var(--color-text-muted)]">Room:</span>
                <span className="font-mono text-[var(--color-accent)] font-medium">{roomId}</span>
              </div>
            </>
          )}
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-[var(--color-surface-elevated)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-all duration-150"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>
      </div>
    </header>
  );
}
