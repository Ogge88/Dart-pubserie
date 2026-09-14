import React, { useState, useEffect } from 'react';
import AdminView from './AdminView';
import RefereeView from './RefereeView';
import PublicView from './PublicView';

// Struktur för de 10 delmatcherna + AD (Avgörande dubbel)
const INITIAL_SUB_MATCHES = [
  { id: 'S1', name: 'Singel 1', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'S2', name: 'Singel 2', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'D1', name: 'Dubbel 1', type: 'double', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'S3', name: 'Singel 3', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'S4', name: 'Singel 4', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'S5', name: 'Singel 5', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'S6', name: 'Singel 6', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'D2', name: 'Dubbel 2', type: 'double', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'S7', name: 'Singel 7', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'S8', name: 'Singel 8', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' },
  { id: 'AD', name: 'Avgörande Dubbel', type: 'double', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, status: 'pending' }
];

export default function Home() {
  const [currentView, setCurrentView] = useState('public'); // 'admin', 'referee', 'public'
  const [matchData, setMatchData] = useState({
    homeTeam: 'Hemmalag FC',
    awayTeam: 'Bortalag BK',
    date: new Date().toISOString().split('T')[0],
    subMatches: INITIAL_SUB_MATCHES,
    performances: [] // Spelarprestationer (180s, Utgångar etc.)
  });

  const [activeSubMatchId, setActiveSubMatchId] = useState(null);

  // Uppdatera resultat från domaren
  const handleUpdateSubMatch = (updatedSubMatch, newPerformances = []) => {
    setMatchData(prev => ({
      ...prev,
      subMatches: prev.subMatches.map(m => m.id === updatedSubMatch.id ? updatedSubMatch : m),
      performances: [...prev.performances, ...newPerformances]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Navigation för demo/testning */}
      <nav className="bg-slate-800 p-3 flex justify-center gap-4 border-b border-slate-700">
        <button 
          onClick={() => setCurrentView('admin')}
          className={`px-4 py-2 rounded font-bold ${currentView === 'admin' ? 'bg-blue-600' : 'bg-slate-700'}`}>
          1. Admin Vy
        </button>
        <button 
          onClick={() => setCurrentView('referee')}
          className={`px-4 py-2 rounded font-bold ${currentView === 'referee' ? 'bg-green-600' : 'bg-slate-700'}`}>
          2. Domar Vy
        </button>
        <button 
          onClick={() => setCurrentView('public')}
          className={`px-4 py-2 rounded font-bold ${currentView === 'public' ? 'bg-purple-600' : 'bg-slate-700'}`}>
          3. Publik / Live Vy
        </button>
      </nav>

      {/* Vyer */}
      <main className="p-4 max-w-5xl mx-auto">
        {currentView === 'admin' && (
          <AdminView matchData={matchData} setMatchData={setMatchData} />
        )}

        {currentView === 'referee' && (
          <RefereeView 
            matchData={matchData} 
            activeSubMatchId={activeSubMatchId}
            setActiveSubMatchId={setActiveSubMatchId}
            onSaveMatch={handleUpdateSubMatch}
          />
        )}

        {currentView === 'public' && (
          <PublicView matchData={matchData} />
        )}
      </main>
    </div>
  );
}
