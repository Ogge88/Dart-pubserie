import React, { useState } from 'react';

// --- DATASTRUKTUR ---
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

// --- 1. ADMIN VY ---
function AdminView({ matchData, setMatchData }) {
  const handleTeamChange = (e) => {
    setMatchData({ ...matchData, [e.target.name]: e.target.value });
  };

  const handlePlayerChange = (id, field, value) => {
    const updated = matchData.subMatches.map(sm => 
      sm.id === id ? { ...sm, [field]: value } : sm
    );
    setMatchData({ ...matchData, subMatches: updated });
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-blue-400">Admin - Laguppställning</h1>
      <div className="grid grid-cols-2 gap-4 bg-slate-800 p-4 rounded-lg border border-slate-700">
        <div>
          <label className="block text-xs text-slate-400 uppercase font-bold">Hemmalag</label>
          <input name="homeTeam" value={matchData.homeTeam} onChange={handleTeamChange} className="w-full bg-slate-700 p-2 rounded text-lg font-bold mt-1 text-white border border-slate-600" />
        </div>
        <div>
          <label className="block text-xs text-slate-400 uppercase font-bold">Bortalag</label>
          <input name="awayTeam" value={matchData.awayTeam} onChange={handleTeamChange} className="w-full bg-slate-700 p-2 rounded text-lg font-bold mt-1 text-white border border-slate-600" />
        </div>
      </div>
      <div className="bg-slate-800 p-4 rounded-lg space-y-3 border border-slate-700">
        <h2 className="text-sm font-bold text-slate-300 uppercase">Spelare per match</h2>
        {matchData.subMatches.map((sm) => (
          <div key={sm.id} className="flex items-center gap-2 border-b border-slate-700 pb-2">
            <span className="w-10 font-bold text-yellow-500 text-center">{sm.id}</span>
            <input placeholder={`Spelare ${matchData.homeTeam}`} value={sm.homePlayer} onChange={(e) => handlePlayerChange(sm.id, 'homePlayer', e.target.value)} className="flex-1 bg-slate-700 p-2 rounded text-sm text-white border border-slate-600" />
            <span className="text-slate-500 text-xs">VS</span>
            <input placeholder={`Spelare ${matchData.awayTeam}`} value={sm.awayPlayer} onChange={(e) => handlePlayerChange(sm.id, 'awayPlayer', e.target.value)} className="flex-1 bg-slate-700 p-2 rounded text-sm text-white border border-slate-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 2. DOMAR VY (N01 EXACT DESIGN & FUNKTION) ---
function N01Scorer({ match, homeTeam, awayTeam, onBack, onSave }) {
  const [homeScore, setHomeScore] = useState(501);
  const [awayScore, setAwayScore] = useState(501);
  const [homeLegs, setHomeLegs] = useState(0);
  const [awayLegs, setAwayLegs] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [turn, setTurn] = useState('home'); 
  const [rounds, setRounds] = useState([]); // Historik över kast i leget [{ round: 1, home: 100, away: 60 }]
  const [performances, setPerformances] = useState([]);
  const [warningMsg, setWarningMsg] = useState('');

  // Bäst av 3 legs = först till 2 vinstlegs
  const isMatchFinished = homeLegs === 2 || awayLegs === 2;

  const currentRound = rounds.length + (turn === 'home' ? 1 : 0);
  const currentDarts = (currentRound - 1) * 3 + (turn === 'away' ? 3 : 0);

  const handleNumClick = (num) => {
    if (isMatchFinished) return;
    if (inputVal.length < 3) setInputVal(prev => prev + num);
  };

  const handleClear = () => setInputVal('');

  const handleEnterScore = () => {
    if (isMatchFinished) return;
    const score = parseInt(inputVal || '0', 10);
    if (isNaN(score) || score > 180) return;

    // Registrera 180:or
    if (score === 180) {
      const pName = turn === 'home' ? (match.homePlayer || homeTeam) : (match.awayPlayer || awayTeam);
      setPerformances(prev => [...prev, { team: turn, player: pName, text: '180' }]);
    }

    // Beräkna poäng & Bust
    if (turn === 'home') {
      let newScore = homeScore - score;
      let wonLeg = false;

      if (newScore === 0) {
        wonLeg = true;
      } else if (newScore < 2) {
        // Bust
        newScore = homeScore;
      }

      const updatedRounds = [...rounds, { round: rounds.length + 1, home: score, away: null }];
      setRounds(updatedRounds);

      if (wonLeg) {
        const newLegs = homeLegs + 1;
        setHomeLegs(newLegs);
        resetLeg();
        setInputVal('');
        return;
      }

      setHomeScore(newScore);
      setTurn('away');

    } else {
      let newScore = awayScore - score;
      let wonLeg = false;

      if (newScore === 0) {
        wonLeg = true;
      } else if (newScore < 2) {
        // Bust
        newScore = awayScore;
      }

      const updatedRounds = rounds.map((r, i) => i === rounds.length - 1 ? { ...r, away: score } : r);
      setRounds(updatedRounds);

      if (wonLeg) {
        const newLegs = awayLegs + 1;
        setAwayLegs(newLegs);
        resetLeg();
        setInputVal('');
        return;
      }

      setAwayScore(newScore);

      // Max 13 omgångar (39 pilar) regel
      if (updatedRounds.length >= 13) {
        setWarningMsg('Maximalt antal omgångar (13 omgångar / 39 pilar) nått!');
        setTimeout(() => {
          resetLeg();
          setWarningMsg('');
        }, 3000);
        setInputVal('');
        return;
      }

      setTurn('home');
    }

    setInputVal('');
  };

  const resetLeg = () => {
    setHomeScore(501);
    setAwayScore(501);
    setRounds([]);
    setTurn('home');
  };

  return (
    <div className="max-w-2xl mx-auto bg-black text-white p-2 font-mono select-none border-2 border-gray-800 shadow-2xl rounded">
      
      {/* Top Header */}
      <div className="flex justify-between items-center bg-gray-900 p-2 border-b border-gray-700 text-xs">
        <button onClick={onBack} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1 rounded font-sans">
          ← Tillbaka
        </button>
        <div className="text-yellow-400 font-bold">501 FIRST TO 2 LEGS (MAX 13 ROUNDS)</div>
        <div className="text-gray-400">DARTS: {currentDarts}/39</div>
      </div>

      {warningMsg && (
        <div className="bg-red-600 text-white font-bold text-center py-2 text-sm animate-pulse">
          {warningMsg}
        </div>
      )}

      {/* Main N01 Scoreboard Display */}
      <div className="grid grid-cols-2 gap-1 my-2 text-center">
        
        {/* Left Player / Home */}
        <div className={`p-2 border-2 ${turn === 'home' && !isMatchFinished ? 'border-yellow-400 bg-gray-900' : 'border-gray-800 bg-black'}`}>
          <div className="text-emerald-400 font-bold truncate text-sm">{match.homePlayer || homeTeam}</div>
          <div className="text-amber-300 text-6xl font-black my-1 font-mono tracking-tighter">
            {homeScore}
          </div>
          <div className="text-xs text-gray-400 flex justify-between px-2">
            <span>LEGS: <strong className="text-white text-base">{homeLegs}</strong></span>
            <span>R: {rounds.length}</span>
          </div>
        </div>

        {/* Right Player / Away */}
        <div className={`p-2 border-2 ${turn === 'away' && !isMatchFinished ? 'border-yellow-400 bg-gray-900' : 'border-gray-800 bg-black'}`}>
          <div className="text-emerald-400 font-bold truncate text-sm">{match.awayPlayer || awayTeam}</div>
          <div className="text-amber-300 text-6xl font-black my-1 font-mono tracking-tighter">
            {awayScore}
          </div>
          <div className="text-xs text-gray-400 flex justify-between px-2">
            <span>LEGS: <strong className="text-white text-base">{awayLegs}</strong></span>
            <span>R: {rounds.length}</span>
          </div>
        </div>

      </div>

      {/* N01 Input display & Keypad Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
        
        {/* Keypad & Input Box */}
        <div className="space-y-2">
          <div className="bg-gray-900 border-2 border-gray-700 p-2 text-right text-4xl font-mono text-yellow-400 h-14 flex items-center justify-end rounded">
            {inputVal || '0'}
          </div>

          <div className="grid grid-cols-3 gap-1">
            {[7, 8, 9, 4, 5, 6, 1, 2, 3].map(n => (
              <button 
                key={n} 
                onClick={() => handleNumClick(n.toString())}
                disabled={isMatchFinished}
                className="bg-gray-800 hover:bg-gray-700 active:bg-gray-600 text-white font-black text-2xl py-3 rounded border border-gray-700">
                {n}
              </button>
            ))}
            <button onClick={handleClear} disabled={isMatchFinished} className="bg-red-900 hover:bg-red-800 text-white font-bold text-xl py-3 rounded border border-red-700">
              C
            </button>
            <button onClick={() => handleNumClick('0')} disabled={isMatchFinished} className="bg-gray-800 hover:bg-gray-700 text-white font-black text-2xl py-3 rounded border border-gray-700">
              0
            </button>
            <button onClick={handleEnterScore} disabled={isMatchFinished} className="bg-blue-700 hover:bg-blue-600 text-white font-black text-xl py-3 rounded border border-blue-500">
              OK
            </button>
          </div>
        </div>

        {/* Turns History Table (N01 Style) */}
        <div className="bg-gray-900 border border-gray-800 rounded p-2 h-60 overflow-y-auto text-xs font-mono">
          <table className="w-full text-center">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400">
                <th className="py-1">H</th>
                <th className="py-1 text-gray-600">#</th>
                <th className="py-1">A</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {rounds.map((r, i) => (
                <tr key={i} className="hover:bg-gray-800">
                  <td className="py-1 text-amber-300 font-bold">{r.home !== null ? r.home : ''}</td>
                  <td className="py-1 text-gray-600">{r.round}</td>
                  <td className="py-1 text-amber-300 font-bold">{r.away !== null ? r.away : ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

      {/* Skicka Resultat Knapp (Visas när en spelare vunnit 2 legs) */}
      {isMatchFinished ? (
        <button 
          onClick={() => {
            onSave({ ...match, homeScore: homeLegs, awayScore: awayLegs, status: 'completed' }, performances);
            onBack();
          }} 
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 text-xl rounded-lg shadow-lg border-2 border-emerald-400 mt-2 animate-bounce">
          ✓ SKICKA RESULTAT ({homeLegs} - {awayLegs})
        </button>
      ) : (
        <div className="text-center text-xs text-gray-500 py-1">
          Först till 2 vunna legs lanserar skicka-knappen.
        </div>
      )}

    </div>
  );
}

function RefereeView({ matchData, activeSubMatchId, setActiveSubMatchId, onSaveMatch }) {
  const activeMatch = matchData.subMatches.find(m => m.id === activeSubMatchId);
  if (!activeMatch) {
    return (
      <div className="max-w-xl mx-auto space-y-3">
        <h1 className="text-xl font-bold text-green-400 mb-4">Välj delmatch att döma</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matchData.subMatches.map((sm) => (
            <button key={sm.id} onClick={() => setActiveSubMatchId(sm.id)} className="bg-slate-800 hover:bg-slate-700 p-4 rounded-lg text-left flex justify-between items-center border border-slate-700 shadow">
              <div>
                <span className="font-bold text-yellow-500 mr-2">{sm.id}</span>
                <span className="text-sm font-medium">{sm.homePlayer || 'Hemmalag'} vs {sm.awayPlayer || 'Bortalag'}</span>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${sm.status === 'completed' ? 'bg-green-900 text-green-300' : 'bg-slate-700 text-slate-300'}`}>
                {sm.status === 'completed' ? `${sm.homeScore} - ${sm.awayScore}` : 'Välj'}
              </span>
            </button>
          ))}
        </div>
      </div>
    );
  }
  return <N01Scorer match={activeMatch} homeTeam={matchData.homeTeam} awayTeam={matchData.awayTeam} onBack={() => setActiveSubMatchId(null)} onSave={onSaveMatch} />;
}

// --- 3. PUBLIK VY (EFTELIKNAR MATCHPROTOKOLLET) ---
function PublicView({ matchData }) {
  const totalHomeScore = matchData.subMatches.reduce((acc, sm) => acc + (sm.homeScore > sm.awayScore ? 1 : 0), 0);
  const totalAwayScore = matchData.subMatches.reduce((acc, sm) => acc + (sm.awayScore > sm.homeScore ? 1 : 0), 0);

  const homePerf = matchData.performances.filter(p => p.team === 'home');
  const awayPerf = matchData.performances.filter(p => p.team === 'away');

  return (
    <div className="max-w-4xl mx-auto bg-amber-50 text-slate-900 p-4 md:p-8 rounded-lg shadow-2xl border-2 border-amber-200 font-sans">
      
      {/* Protokoll Header */}
      <div className="border-4 border-slate-900 p-4 mb-4 text-center bg-white">
        <h1 className="text-3xl font-black tracking-widest text-slate-900">PUBSERIEN</h1>
        <p className="text-xs font-bold tracking-wider text-slate-600 uppercase">Matchprotokoll Dart</p>
      </div>

      {/* Lag-rubriker & Totalresultat */}
      <div className="grid grid-cols-12 gap-2 border-2 border-slate-900 bg-white mb-4 p-2 text-center items-center">
        <div className="col-span-5 border-r-2 border-slate-900 pr-2">
          <div className="text-xs font-bold text-slate-500 uppercase">Hemmalag</div>
          <div className="text-xl md:text-2xl font-black truncate">{matchData.homeTeam || 'HEMMALAG'}</div>
        </div>
        <div className="col-span-2 px-1">
          <div className="text-xs font-bold text-slate-500 uppercase">Resultat</div>
          <div className="text-2xl md:text-3xl font-black text-red-600">{totalHomeScore} - {totalAwayScore}</div>
        </div>
        <div className="col-span-5 border-l-2 border-slate-900 pl-2">
          <div className="text-xs font-bold text-slate-500 uppercase">Bortalag</div>
          <div className="text-xl md:text-2xl font-black truncate">{matchData.awayTeam || 'BORTALAG'}</div>
        </div>
      </div>

      {/* Delmatcher Tabell (S1 till AD) */}
      <div className="border-2 border-slate-900 bg-white mb-4 overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="border-b-2 border-slate-900 bg-slate-100 text-xs font-bold text-slate-800 text-center uppercase">
              <th className="p-2 border-r border-slate-400 w-1/3">{matchData.homeTeam || 'Hemmalag'}</th>
              <th className="p-2 border-r border-slate-400 w-16">SET</th>
              <th className="p-2 border-r border-slate-400 w-16">MATCH</th>
              <th className="p-2 border-r border-slate-400 w-16">SET</th>
              <th className="p-2 w-1/3">{matchData.awayTeam || 'Bortalag'}</th>
            </tr>
          </thead>
          <tbody className="divide-y border-slate-300">
            {matchData.subMatches.map((sm) => (
              <tr key={sm.id} className={`text-center font-semibold ${sm.id === 'AD' ? 'bg-amber-100/60 font-bold' : ''}`}>
                <td className="p-2 border-r border-slate-300 text-left px-3">
                  {sm.homePlayer || <span className="text-slate-300 italic">Ej angiven</span>}
                </td>
                <td className="p-2 border-r border-slate-300 font-mono text-base bg-slate-50">
                  {sm.status === 'completed' ? sm.homeScore : ''}
                </td>
                <td className="p-2 border-r border-slate-900 font-black bg-slate-200 text-slate-800">
                  {sm.id}
                </td>
                <td className="p-2 border-r border-slate-300 font-mono text-base bg-slate-50">
                  {sm.status === 'completed' ? sm.awayScore : ''}
                </td>
                <td className="p-2 text-left px-3">
                  {sm.awayPlayer || <span className="text-slate-300 italic">Ej angiven</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center text-xs font-bold border border-slate-900 bg-white p-1 mb-4">
        Avgörande Dubbel = Middling[cite: 1]
      </div>

      {/* Prestationer & Underskrifter */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="border-2 border-slate-900 bg-white p-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-2">
              PRESTATIONER: HEMMALAG[cite: 1]
            </div>
            <div className="min-h-[60px] text-xs space-y-1">
              {homePerf.length > 0 ? (
                homePerf.map((p, idx) => (
                  <div key={idx} className="font-bold text-slate-800">🎯 {p.player}: {p.text}</div>
                ))
              ) : (
                <span className="text-slate-400 italic">Inga registrerade</span>
              )}
            </div>
          </div>
          <div className="border-t border-slate-400 pt-2 mt-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase">UNDERSKRIFT: HEMMALAG[cite: 1]</div>
            <div className="h-6 border-b border-dashed border-slate-400"></div>
          </div>
        </div>

        <div className="border-2 border-slate-900 bg-white p-3 flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 uppercase border-b border-slate-300 pb-1 mb-2">
              PRESTATIONER: BORTALAG[cite: 1]
            </div>
            <div className="min-h-[60px] text-xs space-y-1">
              {awayPerf.length > 0 ? (
                awayPerf.map((p, idx) => (
                  <div key={idx} className="font-bold text-slate-800">🎯 {p.player}: {p.text}</div>
                ))
              ) : (
                <span className="text-slate-400 italic">Inga registrerade</span>
              )}
            </div>
          </div>
          <div className="border-t border-slate-400 pt-2 mt-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase">UNDERSKRIFT: BORTALAG[cite: 1]</div>
            <div className="h-6 border-b border-dashed border-slate-400"></div>
          </div>
        </div>
      </div>

      <div className="border-2 border-slate-900 bg-white p-3 text-xs space-y-2">
        <div className="flex justify-between font-bold border-b border-slate-200 pb-1">
          <span>DATUM: {new Date().toISOString().split('T')[0]}[cite: 1]</span>
          <span>MATCH NR: ______[cite: 1]</span>
        </div>
        <div className="text-[11px] text-slate-600 leading-tight pt-1">
          <p><strong>Herrar:</strong> Korta set 9-20 pilar / Höga utgångar 100 och uppåt / 180:or[cite: 1]</p>
          <p><strong>Damer:</strong> Korta set 9-25 pilar / Höga utgångar 70 och uppåt / 180:or[cite: 1]</p>
        </div>
      </div>

    </div>
  );
}

// --- HUVUDAPPLIKATION ---
export default function Home() {
  const [currentView, setCurrentView] = useState('public');
  const [activeSubMatchId, setActiveSubMatchId] = useState(null);
  const [matchData, setMatchData] = useState({
    homeTeam: 'HEMMALAG',
    awayTeam: 'BORTALAG',
    subMatches: INITIAL_SUB_MATCHES,
    performances: []
  });

  const handleUpdateSubMatch = (updatedSubMatch, newPerformances = []) => {
    setMatchData(prev => ({
      ...prev,
      subMatches: prev.subMatches.map(m => m.id === updatedSubMatch.id ? updatedSubMatch : m),
      performances: [...prev.performances, ...newPerformances]
    }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans pb-12">
      <nav className="bg-slate-800 p-3 flex justify-center gap-4 border-b border-slate-700 sticky top-0 z-50 shadow-md">
        <button onClick={() => setCurrentView('admin')} className={`px-4 py-2 rounded font-bold text-sm transition ${currentView === 'admin' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300'}`}>1. Admin</button>
        <button onClick={() => setCurrentView('referee')} className={`px-4 py-2 rounded font-bold text-sm transition ${currentView === 'referee' ? 'bg-green-600 text-white' : 'bg-slate-700 text-slate-300'}`}>2. Domare</button>
        <button onClick={() => setCurrentView('public')} className={`px-4 py-2 rounded font-bold text-sm transition ${currentView === 'public' ? 'bg-purple-600 text-white' : 'bg-slate-700 text-slate-300'}`}>3. Publik (Matchprotokoll)</button>
      </nav>
      <main className="p-4 max-w-5xl mx-auto mt-4">
        {currentView === 'admin' && <AdminView matchData={matchData} setMatchData={setMatchData} />}
        {currentView === 'referee' && <RefereeView matchData={matchData} activeSubMatchId={activeSubMatchId} setActiveSubMatchId={setActiveSubMatchId} onSaveMatch={handleUpdateSubMatch} />}
        {currentView === 'public' && <PublicView matchData={matchData} />}
      </main>
    </div>
  );
}
