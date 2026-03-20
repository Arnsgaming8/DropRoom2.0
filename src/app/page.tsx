"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header, Sidebar } from "@/components";
import { createRoom, generateRoomId } from "@/lib";

export default function HomePage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [creating, setCreating] = useState(false);
  
  const handleCreateRoom = async () => {
    setCreating(true);
    try {
      const roomId = generateRoomId(8);
      await createRoom(roomId);
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.error("Failed to create room:", error);
      setCreating(false);
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header 
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
      />
      <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <main 
        className={`pt-16 transition-all duration-300 ${
          sidebarOpen ? "ml-72" : "ml-0"
        }`}
      >
        <div className="min-h-screen flex flex-col">
          <section className="flex-1 flex flex-col items-center justify-center px-4 py-20">
            <div className="max-w-2xl w-full text-center">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#818cf8] mb-6 shadow-lg shadow-[#6366f1]/20">
                  <span className="text-5xl">📦</span>
                </div>
                
                <h1 className="text-5xl font-bold text-[#f1f5f9] mb-4">
                  DropRoom
                </h1>
                
                <p className="text-xl text-[#94a3b8] max-w-md mx-auto">
                  Anonymous room-based file sharing. No accounts. No limits.
                </p>
              </div>
              
              <button
                onClick={handleCreateRoom}
                disabled={creating}
                className="px-8 py-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#818cf8] text-white font-semibold text-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-lg shadow-[#6366f1]/25 hover:shadow-[#6366f1]/40"
              >
                {creating ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating Room...
                  </span>
                ) : (
                  "Create Room"
                )}
              </button>
            </div>
          </section>
          
          <section className="px-4 py-16 bg-[#12121a] border-t border-[#2a2a3a]">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-semibold text-center text-[#f1f5f9] mb-12">
                How It Works
              </h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#1a1a24] mb-4">
                    <span className="text-2xl">1</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">
                    Create a Room
                  </h3>
                  <p className="text-[#64748b] text-sm">
                    Click &quot;Create Room&quot; to generate a unique room link
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#1a1a24] mb-4">
                    <span className="text-2xl">2</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">
                    Share Files
                  </h3>
                  <p className="text-[#64748b] text-sm">
                    Drag & drop or select files to upload instantly
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-[#1a1a24] mb-4">
                    <span className="text-2xl">3</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#f1f5f9] mb-2">
                    Share & Download
                  </h3>
                  <p className="text-[#64748b] text-sm">
                    Share the room link with anyone to access files
                  </p>
                </div>
              </div>
            </div>
          </section>
          
          <footer className="px-4 py-6 border-t border-[#2a2a3a]">
            <div className="max-w-4xl mx-auto text-center text-[#64748b] text-sm">
              <p>DropRoom - Anonymous file sharing, forever.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
