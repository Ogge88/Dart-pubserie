import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const INITIAL_SUB_MATCHES = [
  { id: 'S1', name: 'Singel 1', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'S2', name: 'Singel 2', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'D1', name: 'Dubbel 1', type: 'double', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'S3', name: 'Singel 3', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'S4', name: 'Singel 4', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'S5', name: 'Singel 5', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'S6', name: 'Singel 6', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'D2', name: 'Dubbel 2', type: 'double', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'S7', name: 'Singel 7', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'S8', name: 'Singel 8', type: 'single', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' },
  { id: 'AD', name: 'Avgörande Dubbel', type: 'double', homePlayer: '', awayPlayer: '', homeScore: 0, awayScore: 0, currentHomePoints: 501, currentAwayPoints: 501, status: 'pending' }
];

const HOME_STARTS_MATCHES = ['S1', 'D1', 'S4', 'S6', 'S7'];
const IMPOSSIBLE_SCORES = [163, 166, 169, 172, 173, 175, 176, 178, 179];
const IMPOSSIBLE_CHECKOUTS = [159, 162, 163, 165, 166, 168, 169];

// --- 1. DOMARVY (LIVE-PROTOKOLL) ---
function RefereeView({ matchData, setMatchData }) {
  const [selectedMatchId, setSelectedMatchId] = useState(matchData.subMatches[0]?.id || 'S1');
  const [inputScore, setInputScore] = useState('');
  const [currentTurn, setCurrentTurn] = useState('home');

  const currentMatch = matchData.subMatches.find(m => m.id === selectedMatchId) || matchData.subMatches[0];

  const handleScoreSubmit = (e) => {
    e.preventDefault();
    const score = parseInt(inputScore, 10);
    if (isNaN(score) || score < 0 || score > 180 || IMPOSSIBLE_SCORES.includes(score)) {
      alert('Ogiltig poäng!');
      return;
    }

    const isHome = currentTurn === 'home';
    const currentPoints = isHome ? currentMatch.currentHomePoints : currentMatch.currentAwayPoints;
    const newPoints = currentPoints - score;

    if (newPoints < 0 || newPoints === 1) {
      alert('Bust! Poängen räknas ej.');
      setInputScore('');
      setCurrentTurn(isHome ? 'away' : 'home');
      return;
    }

    let updatedMatch = { ...currentMatch };

    if (newPoints === 0) {
      // Leg vunnet
      if (isHome) {
        updatedMatch.homeScore += 1;
        if (score >= 100) {
          matchData.performances.push({ id: Date.now(), team: 'home', player: currentMatch.homePlayer || 'Hemma', text: `${score} ut` });
        }
      } else {
        updatedMatch.awayScore += 1;
        if (score >= 100) {
          matchData.performances.push({ id: Date.now(), team: 'away', player: currentMatch.awayPlayer || 'Borta', text: `${score} ut` });
        }
      }

      if (updatedMatch.homeScore === 3 || updatedMatch.awayScore === 3) {
        updatedMatch.status = 'completed';
      }

      // Återställ leg-poäng till 501
      updatedMatch.currentHomePoints = 501;
      updatedMatch.currentAwayPoints = 501;
    } else {
      if (score === 180) {
        matchData.performances.push({
          id: Date.now(),
          team: isHome ? 'home' : 'away',
          player: isHome ? (currentMatch.homePlayer || 'Hemma') : (currentMatch.awayPlayer || 'Borta'),
          text: '180'
        });
      }
      if (isHome) updatedMatch.currentHomePoints = newPoints;
      else updatedMatch.currentAwayPoints = newPoints;
      setCurrentTurn(isHome ? 'away' : 'home');
    }

    const updatedSubMatches = matchData.subMatches.map(sm => sm.id === selectedMatchId ? updatedMatch : sm);
    setMatchData({ ...matchData, subMatches: updatedSubMatches });
    setInputScore('');
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', border: '1px solid #334155' }}>
      <h2 style={{ color: '#38bdf8', fontSize: '20px', marginBottom: '15px', textAlign: 'center' }}>🎯 Domarvy (Räkna Leg)</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <label style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>VÄLJ MATCH:</label>
        <select value={selectedMatchId} onChange={(e) => setSelectedMatchId(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '6px', backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569' }}>
          {matchData.subMatches.map(m => (
            <option key={m.id} value={m.id}>
              {m.id} - {m.homePlayer || 'Hemma'} vs {m.awayPlayer || 'Borta'} ({m.homeScore}-{m.awayScore})
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px', textAlign: 'center' }}>
        <div style={{ backgroundColor: currentTurn === 'home' ? '#1e3a8a' : '#0f172a', padding: '15px', borderRadius: '8px', border: currentTurn === 'home' ? '2px solid #3b82f6' : '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>{matchData.homeTeam}</div>
          <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{currentMatch.homePlayer || 'Spelare Hemma'}</div>
          <div style={{ fontSize: '36px', color: '#fcd34d', fontWeight: 'bold', margin: '10px 0' }}>{currentMatch.currentHomePoints}</div>
          <div style={{ color: '#94a3b8' }}>Legs: {currentMatch.homeScore}</div>
        </div>

        <div style={{ backgroundColor: currentTurn === 'away' ? '#881337' : '#0f172a', padding: '15px', borderRadius: '8px', border: currentTurn === 'away' ? '2px solid #f43f5e' : '1px solid #334155' }}>
          <div style={{ color: '#94a3b8', fontSize: '12px' }}>{matchData.awayTeam}</div>
          <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>{currentMatch.awayPlayer || 'Spelare Borta'}</div>
          <div style={{ fontSize: '36px', color: '#fcd34d', fontWeight: 'bold', margin: '10px 0' }}>{currentMatch.currentAwayPoints}</div>
          <div style={{ color: '#94a3b8' }}>Legs: {currentMatch.awayScore}</div>
        </div>
      </div>

      <form onSubmit={handleScoreSubmit} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="number"
          placeholder="Ange poäng (t.ex. 60, 100, 180)"
          value={inputScore}
          onChange={(e) => setInputScore(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '18px' }}
        />
        <button type="submit" style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px' }}>
          Mata in
        </button>
      </form>
    </div>
  );
}

// --- 2. ADMIN VY ---
function AdminView({ matchData, setMatchData, isAdminAuthenticated, setIsAdminAuthenticated }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const [newPerfTeam, setNewPerfTeam] = useState('home');
  const [newPerfPlayer, setNewPerfPlayer] = useState('');
  const [manualCheckoutScore, setManualCheckoutScore] = useState('');
  const [newPerfTextType, setNewPerfTextType] = useState('180');
  const [customPerfText, setCustomPerfText] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === 'admin') {
      setIsAdminAuthenticated(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Fel lösenord! Försök igen.');
    }
  };

  const handleTeamChange = (e) => setMatchData({ ...matchData, [e.target.name]: e.target.value });

  const handleSubMatchChange = (id, field, value) => {
    const updated = matchData.subMatches.map(sm => {
      if (sm.id === id) {
        const updatedMatch = { ...sm, [field]: value };
        if (field === 'homeScore' || field === 'awayScore') {
          updatedMatch[field] = parseInt(value, 10) || 0;
        }
        return updatedMatch;
      }
      return sm;
    });
    setMatchData({ ...matchData, subMatches: updated });
  };

  const handleAddManualPerformance = () => {
    if (!newPerfPlayer.trim()) {
      alert('Ange spelarens namn.');
      return;
    }

    let textToSave = '';
    if (newPerfTextType === '180') textToSave = '180';
    else if (newPerfTextType === 'utgang') {
      if (!manualCheckoutScore || isNaN(manualCheckoutScore) || manualCheckoutScore < 100 || manualCheckoutScore > 170 || IMPOSSIBLE_CHECKOUTS.includes(parseInt(manualCheckoutScore))) {
        alert('Ange en giltig utgångspoäng (100-170).');
        return;
      }
      textToSave = `${manualCheckoutScore} ut`;
    }
    else if (newPerfTextType === 'custom') textToSave = customPerfText.trim();

    if (!textToSave) {
      alert('Ange prestationsbeskrivning.');
      return;
    }

    const newPerf = {
      id: Date.now(),
      team: newPerfTeam,
      player: newPerfPlayer.trim(),
      text: textToSave
    };

    setMatchData(prev => ({
      ...prev,
      performances: [...prev.performances, newPerf]
    }));

    setNewPerfPlayer('');
    setCustomPerfText('');
    setManualCheckoutScore('');
  };

  const handleRemovePerformance = (indexToRemove) => {
    setMatchData(prev => ({
      ...prev,
      performances: prev.performances.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  if (!isAdminAuthenticated) {
    return (
      <div style={{ maxWidth: '400px', margin: '40px auto', backgroundColor: '#1e293b', padding: '24px', borderRadius: '12px', border: '1px solid #334155', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '10px' }}>🔒</div>
        <h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '15px' }}>Admin Inloggning</h2>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Ange lösenord"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
          />
          {errorMessage && <div style={{ color: '#f43f5e', fontSize: '14px', marginBottom: '12px' }}>{errorMessage}</div>}
          <button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
            Lås upp
          </button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h1 style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Admin - Redigering av resultat & prestationer</h1>
        <button onClick={() => setIsAdminAuthenticated(false)} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
          🔒 Lås Admin
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>HEMMALAG</label>
          <input name="homeTeam" value={matchData.homeTeam} onChange={handleTeamChange} style={{ width: '100%', backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569', marginTop: '4px', boxSizing: 'border-box' }} />
        </div>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>BORTALAG</label>
          <input name="awayTeam" value={matchData.awayTeam} onChange={handleTeamChange} style={{ width: '100%', backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569', marginTop: '4px', boxSizing: 'border-box' }} />
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>SPELARE OCH RESULTAT PER MATCH</h2>

        {matchData.subMatches.map((sm) => (
          <div key={sm.id} style={{ borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ width: '30px', color: '#eab308', fontWeight: 'bold', textAlign: 'center' }}>{sm.id}</span>
              <input placeholder={`Spelare ${matchData.homeTeam}`} value={sm.homePlayer} onChange={(e) => handleSubMatchChange(sm.id, 'homePlayer', e.target.value)} style={{ flex: 1, backgroundColor: '#334155', color: '#fff', padding: '6px', borderRadius: '4px', border: '1px solid #475569' }} />
              <span style={{ color: '#64748b', fontSize: '12px' }}>VS</span>
              <input placeholder={`Spelare ${matchData.awayTeam}`} value={sm.awayPlayer} onChange={(e) => handleSubMatchChange(sm.id, 'awayPlayer', e.target.value)} style={{ flex: 1, backgroundColor: '#334155', color: '#fff', padding: '6px', borderRadius: '4px', border: '1px solid #475569' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
              <span>Legs:</span>
              <input type="number" min="0" max="3" value={sm.homeScore} onChange={(e) => handleSubMatchChange(sm.id, 'homeScore', e.target.value)} style={{ width: '45px', backgroundColor: '#0f172a', color: '#fcd34d', border: '1px solid #475569', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', padding: '2px' }} />
              <span>-</span>
              <input type="number" min="0" max="3" value={sm.awayScore} onChange={(e) => handleSubMatchChange(sm.id, 'awayScore', e.target.value)} style={{ width: '45px', backgroundColor: '#0f172a', color: '#fcd34d', border: '1px solid #475569', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', padding: '2px' }} />

              <select value={sm.status} onChange={(e) => handleSubMatchChange(sm.id, 'status', e.target.value)} style={{ backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px', padding: '3px 6px' }}>
                <option value="pending">Ej påbörjad</option>
                <option value="live">Pågår (LIVE)</option>
                <option value="completed">Klar (Spelad)</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
        <h2 style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: 'bold', marginBottom: '12px' }}>MANUELLA PRESTATIONER</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr 1.5fr auto', gap: '8px', marginBottom: '15px', alignItems: 'center' }}>
          <select value={newPerfTeam} onChange={(e) => setNewPerfTeam(e.target.value)} style={{ backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569' }}>
            <option value="home">{matchData.homeTeam || 'Hemmalag'}</option>
            <option value="away">{matchData.awayTeam || 'Bortalag'}</option>
          </select>

          <input
            placeholder="Spelarnamn"
            value={newPerfPlayer}
            onChange={(e) => setNewPerfPlayer(e.target.value)}
            style={{ backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569' }}
          />

          <select value={newPerfTextType} onChange={(e) => setNewPerfTextType(e.target.value)} style={{ backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569' }}>
            <option value="180">180</option>
            <option value="utgang">Hög utgång (100+)</option>
            <option value="custom">Annan text...</option>
          </select>

          <button onClick={handleAddManualPerformance} style={{ backgroundColor: '#16a34a', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
            + Lägg till
          </button>
        </div>

        {newPerfTextType === 'utgang' && (
          <div style={{ marginBottom: '15px' }}>
            <input
              type="number"
              placeholder="Ange utgångspoäng (t.ex. 143)"
              value={manualCheckoutScore}
              onChange={(e) => setManualCheckoutScore(e.target.value)}
              style={{ width: '100%', backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569', boxSizing: 'border-box' }}
            />
          </div>
        )}

        {newPerfTextType === 'custom' && (
          <div style={{ marginBottom: '15px' }}>
            <input
              placeholder="Skriv t.ex: 15 pilars leg"
              value={customPerfText}
              onChange={(e) => setCustomPerfText(e.target.value)}
              style={{ width: '100%', backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569', boxSizing: 'border-box' }}
            />
          </div>
        )}

        <div style={{ backgroundColor: '#0f172a', padding: '10px', borderRadius: '6px', border: '1px solid #334155' }}>
          <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 'bold', marginBottom: '8px' }}>BEFINTLIGA PRESTATIONER ({matchData.performances.length}):</div>
          {matchData.performances.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic' }}>Inga prestationer registrerade ännu.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {matchData.performances.map((p, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1e293b', padding: '6px 10px', borderRadius: '4px', fontSize: '13px' }}>
                  <span>
                    <strong style={{ color: p.team === 'home' ? '#60a5fa' : '#f43f5e' }}>
                      [{p.team === 'home' ? matchData.homeTeam : matchData.awayTeam}]
                    </strong>{' '}
                    {p.player} – <span style={{ color: '#fcd34d' }}>{p.text}</span>
                  </span>
                  <button onClick={() => handleRemovePerformance(idx)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>
                    Ta bort
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- 3. HUVUDAPPEN MELLAN VYER ---
function App() {
  const [activeTab, setActiveTab] = useState('public');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [matchData, setMatchData] = useState({
    homeTeam: 'Pubserien Hemma',
    awayTeam: 'Pubserien Borta',
    subMatches: INITIAL_SUB_MATCHES,
    performances: []
  });

  const totalHomePoints = matchData.subMatches.reduce((acc, m) => acc + (m.homeScore > m.awayScore ? 1 : 0), 0);
  const totalAwayPoints = matchData.subMatches.reduce((acc, m) => acc + (m.awayScore > m.homeScore ? 1 : 0), 0);

  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: '#fff', padding: '20px', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setActiveTab('public')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'public' ? '#2563eb' : '#1e293b', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          Publik Vy
        </button>
        <button onClick={() => setActiveTab('referee')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'referee' ? '#2563eb' : '#1e293b', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          Domarvy
        </button>
        <button onClick={() => setActiveTab('admin')} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', backgroundColor: activeTab === 'admin' ? '#2563eb' : '#1e293b', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
          Admin
        </button>
      </nav>

      {activeTab === 'public' && (
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ backgroundColor: '#1e293b', padding: '20px', borderRadius: '12px', marginBottom: '20px', border: '1px solid #334155' }}>
            <h1 style={{ fontSize: '28px', margin: '0 0 10px 0', color: '#f8fafc' }}>
              {matchData.homeTeam} vs {matchData.awayTeam}
            </h1>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#fcd34d' }}>
              {totalHomePoints} - {totalAwayPoints}
            </div>
          </div>

          <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '20px' }}>
            <h3 style={{ color: '#94a3b8', margin: '0 0 10px 0' }}>Matcher</h3>
            {matchData.subMatches.map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #334155' }}>
                <span>{m.name}: {m.homePlayer || 'TBD'} vs {m.awayPlayer || 'TBD'}</span>
                <span style={{ fontWeight: 'bold', color: '#38bdf8' }}>{m.homeScore} - {m.awayScore}</span>
              </div>
            ))}
          </div>

          {matchData.performances.length > 0 && (
            <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '12px', border: '1px solid #334155' }}>
              <h3 style={{ color: '#fcd34d', margin: '0 0 10px 0' }}>🌟 Prestationer</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {matchData.performances.map((p, i) => (
                  <div key={i} style={{ color: '#e2e8f0', fontSize: '14px' }}>
                    <strong>{p.team === 'home' ? matchData.homeTeam : matchData.awayTeam}:</strong> {p.player} – <span style={{ color: '#fcd34d', fontWeight: 'bold' }}>{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'referee' && (
        <RefereeView matchData={matchData} setMatchData={setMatchData} />
      )}

      {activeTab === 'admin' && (
        <AdminView
          matchData={matchData}
          setMatchData={setMatchData}
          isAdminAuthenticated={isAdminAuthenticated}
          setIsAdminAuthenticated={setIsAdminAuthenticated}
        />
      )}
    </div>
  );
}

// Koppla till HTML
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
