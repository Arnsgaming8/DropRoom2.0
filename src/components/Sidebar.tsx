"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SavedRoom, getSavedRooms, removeRoom } from "@/lib";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentRoomId?: string;
}

export default function Sidebar({ isOpen, onToggle, currentRoomId }: SidebarProps) {
  const router = useRouter();
  const [savedRooms, setSavedRooms] = useState<SavedRoom[]>(() => getSavedRooms());
  const [refreshKey, setRefreshKey] = useState(0);
  
  const handleRemoveRoom = (roomId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeRoom(roomId);
    setSavedRooms(getSavedRooms());
    setRefreshKey(k => k + 1);
  };
  
  const handleNavigate = (roomId: string) => {
    router.push(`/room/${roomId}`);
  };
  
  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#12121a] border-r border-[#2a2a3a] transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full pt-16">
          <div className="px-4 py-3 border-b border-[#2a2a3a]">
            <h2 className="text-sm font-semibold text-[#f1f5f9] uppercase tracking-wider">
              Saved Rooms
            </h2>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2">
            {savedRooms.length === 0 ? (
              <div className="px-4 py-8 text-center text-[#64748b] text-sm">
                No saved rooms yet
              </div>
            ) : (
              <ul className="space-y-1 px-2">
                {savedRooms.map((room) => (
                  <li key={room.roomId}>
                    <button
                      onClick={() => handleNavigate(room.roomId)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all duration-150 group ${
                        currentRoomId === room.roomId
                          ? "bg-[#6366f1]/20 text-[#818cf8]"
                          : "text-[#94a3b8] hover:bg-[#1a1a24] hover:text-[#f1f5f9]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="text-lg opacity-60">📁</span>
                        <div className="min-w-0">
                          <div className="font-mono text-sm font-medium truncate">
                            {room.roomId}
                          </div>
                          <div className="text-xs text-[#64748b] truncate">
                            {new Date(room.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={(e) => handleRemoveRoom(room.roomId, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[#ef4444]/20 hover:text-[#ef4444] transition-all duration-150"
                        title="Remove room"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}
    </>
  );
}
