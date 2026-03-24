import { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { createRoomDemo, createRoom, Room, DEMO_MODE } from './lib/api';
import { RoomPage } from './pages/RoomPage';

function HomePage() {
  const navigate = useNavigate();
  const [creating, setCreating] = useState(false);
  
  const handleCreateRoom = async () => {
    setCreating(true);
    try {
      const room: Room = DEMO_MODE ? await createRoomDemo() : await createRoom();
      navigate(`/r/${room.slug}`);
    } catch (err) {
      console.error('Failed to create room:', err);
      alert('Failed to create room');
    } finally {
      setCreating(false);
    }
  };
  
  return (
    <div className="container">
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          DropRoom
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          Anonymous, room-based file sharing. No accounts. No hassle.
        </p>
        <button
          onClick={handleCreateRoom}
          disabled={creating}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {creating ? 'Creating...' : 'Create Room'}
        </button>
        {DEMO_MODE && (
          <p className="mt-4 text-sm text-amber-600">
            Demo Mode - Connect backend for full functionality
          </p>
        )}
      </div>
      
      <div className="mt-16 max-w-lg mx-auto">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          How it works
        </h2>
        <ul className="space-y-3 text-gray-600">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">1.</span>
            Create a room to get a shareable link
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">2.</span>
            Drop or select files to upload
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">3.</span>
            Files automatically expire after 7 days
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">4.</span>
            No accounts required - fully anonymous
          </li>
        </ul>
      </div>
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/r/:slug" element={<RoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}
