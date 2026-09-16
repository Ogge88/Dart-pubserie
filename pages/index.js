import React, { useState } from 'react';

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

const HOME_STARTS_MATCHES = ['S1', 'D1', 'S4', 'S6', 'S7'];

// Poäng som det ÄR OMÖJLIGT att gå ut på i dart
const IMPOSSIBLE_CHECKOUTS = [179, 178, 177, 176, 175, 174, 173, 172, 171, 169, 168, 166, 165, 163, 162, 159];

// --- 1. ADMIN VY (MED LÖSENORDSSKYDD) ---
function AdminView({ matchData, setMatchData, isAdminAuthenticated, setIsAdminAuthenticated }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

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
    <div style={{ maxWidth: '750px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        <h1 style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Admin - Lag & Resultatredigering</h1>
        <button onClick={() => setIsAdminAuthenticated(false)} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
          🔒 Lås Admin
        </button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>HEMMALAG</label>
          <input name="homeTeam" value={matchData.homeTeam} onChange={handleTeamChange} style={{ width: '100%', backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569', marginTop: '4px' }} />
        </div>
        <div>
          <label style={{ display: 'block', color: '#94a3b8', fontSize: '11px', fontWeight: 'bold' }}>BORTALAG</label>
          <input name="awayTeam" value={matchData.awayTeam} onChange={handleTeamChange} style={{ width: '100%', backgroundColor: '#334155', color: '#fff', padding: '8px', borderRadius: '4px', border: '1px solid #475569', marginTop: '4px' }} />
        </div>
      </div>

      <div style={{ backgroundColor: '#1e293b', padding: '15px', borderRadius: '8px' }}>
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
              <span>Manuellt resultat (legs):</span>
              <input type="number" min="0" max="3" value={sm.homeScore} onChange={(e) => handleSubMatchChange(sm.id, 'homeScore', e.target.value)} style={{ width: '45px', backgroundColor: '#0f172a', color: '#fcd34d', border: '1px solid #475569', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', padding: '2px' }} />
              <span>-</span>
              <input type="number" min="0" max="3" value={sm.awayScore} onChange={(e) => handleSubMatchChange(sm.id, 'awayScore', e.target.value)} style={{ width: '45px', backgroundColor: '#0f172a', color: '#fcd34d', border: '1px solid #475569', borderRadius: '4px', textAlign: 'center', fontWeight: 'bold', padding: '2px' }} />
              
              <select value={sm.status} onChange={(e) => handleSubMatchChange(sm.id, 'status', e.target.value)} style={{ backgroundColor: '#0f172a', color: '#fff', border: '1px solid #475569', borderRadius: '4px', padding: '3px 6px' }}>
                <option value="pending">Ej klar</option>
                <option value="completed">Klar (Spelad)</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- 2. DOMAR VY (FÖRSLAG 2: STOR POÄNG, STOR LOGG, OPTIMERAD MOBIL) ---
function N01Scorer({ match, homeTeam, awayTeam, onBack, onSave }) {
  const [homeScore, setHomeScore] = useState(501);
  const [awayScore, setAwayScore] = useState(501);
  const [homeLegs, setHomeLegs] = useState(match.homeScore || 0);
  const [awayLegs, setAwayLegs] = useState(match.awayScore || 0);
  const [inputVal, setInputVal] = useState('');
  
  const getInitialStarter = () => {
    if (match.id === 'AD') return null;
    return HOME_STARTS_MATCHES.includes(match.id) ? 'home' : 'away';
  };

  const [legStarter, setLegStarter] = useState(getInitialStarter);
  const [turn, setTurn] = useState(getInitialStarter);
  const [historyStack, setHistoryStack] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [confirmCheckout, setConfirmCheckout] = useState(null);

  const homeName = match.homePlayer || homeTeam;
  const awayName = match.awayPlayer || awayTeam;

  const isMatchFinished = homeLegs === 3 || awayLegs === 3;
  const activePlayerName = turn === 'home' ? homeName : awayName;

  const handleNumClick = (num) => {
    if (isMatchFinished || !turn) return;
    if (inputVal.length < 3) setInputVal(prev => prev + num);
  };

  const handleClear = () => setInputVal('');

  const saveStateToHistory = () => {
    setHistoryStack(prev => [...prev, {
      homeScore, awayScore, homeLegs, awayLegs, turn, legStarter, rounds, performances
    }]);
  };

  const handleUndo = () => {
    if (historyStack.length === 0) return;
    const lastState = historyStack[historyStack.length - 1];
    setHomeScore(lastState.homeScore);
    setAwayScore(lastState.awayScore);
    setHomeLegs(lastState.homeLegs);
    setAwayLegs(lastState.awayLegs);
    setTurn(lastState.turn);
    setLegStarter(lastState.legStarter);
    setRounds(lastState.rounds);
    setPerformances(lastState.performances);
    setHistoryStack(prev => prev.slice(0, -1));
    setInputVal('');
  };

  const handleEnterScore = () => {
    if (isMatchFinished || !turn) return;
    const score = parseInt(inputVal || '0', 10);
    if (isNaN(score) || score > 180) return;

    const currentScore = turn === 'home' ? homeScore : awayScore;
    const remaining = currentScore - score;

    if (remaining === 0) {
      if (IMPOSSIBLE_CHECKOUTS.includes(score) || score > 170) {
        processScore(score);
        return;
      }
      setConfirmCheckout({ score, player: activePlayerName, team: turn });
      return;
    }

    processScore(score);
  };

  const processScore = (score, confirmedCheckout = false) => {
    saveStateToHistory();
    const currentScore = turn === 'home' ? homeScore : awayScore;
    let newScore = currentScore - score;
    let isBust = false;
    let displayScore = score;

    if (newScore < 0 || newScore === 1 || (newScore === 0 && (IMPOSSIBLE_CHECKOUTS.includes(score) || score > 170))) {
      isBust = true;
      newScore = currentScore;
      displayScore = 'BUST';
    }

    if (score === 180 && !isBust) {
      setPerformances(prev => [...prev, { team: turn, player: activePlayerName, text: '180' }]);
    }

    if (turn === 'home') {
      const updatedRounds = [...rounds, { round: (rounds.length + 1) * 3, home: displayScore, away: null }];
      setRounds(updatedRounds);

      if (confirmedCheckout) {
        setHomeLegs(l => l + 1);
        startNextLeg();
        setInputVal('');
        return;
      }

      setHomeScore(newScore);
      setTurn('away');
    } else {
      const updatedRounds = rounds.map((r, i) => i === rounds.length - 1 ? { ...r, away: displayScore } : r);
      setRounds(updatedRounds);

      if (confirmedCheckout) {
        setAwayLegs(l => l + 1);
        startNextLeg();
        setInputVal('');
        return;
      }

      setAwayScore(newScore);
      setTurn('home');
    }

    setInputVal('');
  };

  const startNextLeg = () => {
    const nextStarter = legStarter === 'home' ? 'away' : 'home';
    setHomeScore(501);
    setAwayScore(501);
    setRounds([]);
    setLegStarter(nextStarter);
    setTurn(nextStarter);
  };

  const handleEditRound = (index, team) => {
    const targetRound = rounds[index];
    const currentVal = team === 'home' ? targetRound.home : targetRound.away;
    if (currentVal === null) return;

    const newValStr = prompt(`Ändra poäng för omgång ${index + 1}:`, currentVal === 'BUST' ? '0' : currentVal);
    if (newValStr === null) return;

    const newVal = parseInt(newValStr, 10);
    if (isNaN(newVal) || newVal < 0 || newVal > 180) return;

    saveStateToHistory();
    setRounds(prev => prev.map((r, i) => i === index ? { ...r, [team]: newVal } : r));
  };

  if (!turn && match.id === 'AD') {
    return (
      <div style={{ maxWidth: '500px', margin: '20px auto', backgroundColor: '#020617', padding: '25px', borderRadius: '16px', textAlign: 'center', border: '2px solid #eab308' }}>
        <h2 style={{ color: '#eab308', fontSize: '22px', marginBottom: '10px' }}>AVGÖRANDE DUBBEL (AD)</h2>
        <p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '20px' }}>Vem vann slantkastningen / omkastet och ska börja?</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={() => { setLegStarter('home'); setTurn('home'); }} style={{ backgroundColor: '#1e293b', color: '#60a5fa', border: '2px solid #3b82f6', padding: '20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            {homeName}
          </button>
          <button onClick={() => { setLegStarter('away'); setTurn('away'); }} style={{ backgroundColor: '#1e293b', color: '#f43f5e', border: '2px solid #f43f5e', padding: '20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
            {awayName}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '550px', margin: '0 auto', backgroundColor: '#020617', color: '#fff', padding: '12px', borderRadius: '16px', border: '1px solid #1e293b', fontFamily: 'sans-serif', userSelect: 'none' }}>
      
      {/* Modal / Popup vid utgång */}
      {confirmCheckout && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '20px' }}>
          <div style={{ backgroundColor: '#0f172a', border: '2px solid #10b981', borderRadius: '16px', padding: '24px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>🎯</div>
            <h3 style={{ color: '#fff', fontSize: '22px', margin: '0 0 10px 0' }}>Gick spelaren ut?</h3>
            <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '20px' }}>
              <strong style={{ color: '#34d399' }}>{confirmCheckout.player}</strong> har knappat in <strong>{confirmCheckout.score}</strong>.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => { const { score } = confirmCheckout; setConfirmCheckout(null); processScore(score, true); }} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                JA (Vann leg)
              </button>
              <button onClick={() => setConfirmCheckout(null)} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                NEJ (Fel)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '8px 12px', borderRadius: '10px', marginBottom: '10px' }}>
        <button onClick={onBack} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }}>← Tillbaka</button>
        <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '14px' }}>MATCH {match.id} ({homeLegs} - {awayLegs})</div>
        <button onClick={handleUndo} disabled={historyStack.length === 0} style={{ backgroundColor: historyStack.length > 0 ? '#d97706' : '#1e293b', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: historyStack.length > 0 ? 'pointer' : 'default', fontWeight: 'bold', fontSize: '12px', opacity: historyStack.length > 0 ? 1 : 0.4 }}>
          ↩ Ångra
        </button>
      </div>

      {/* GIGANTISKA POÄNGSIFFROR (FÖRSLAG 2 STIL) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <div style={{ backgroundColor: turn === 'home' && !isMatchFinished ? '#064e3b' : '#0f172a', border: turn === 'home' && !isMatchFinished ? '4px solid #10b981' : '2px solid #1e293b', borderRadius: '14px', padding: '12px 6px', textAlign: 'center' }}>
          <div style={{ color: turn === 'home' ? '#34d399' : '#94a3b8', fontSize: '15px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {homeName} {legStarter === 'home' && '🟢'}
          </div>
          <div style={{ fontSize: '64px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', lineHeight: 1, margin: '6px 0' }}>{homeScore}</div>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>LEGS: {homeLegs}</div>
        </div>

        <div style={{ backgroundColor: turn === 'away' && !isMatchFinished ? '#064e3b' : '#0f172a', border: turn === 'away' && !isMatchFinished ? '4px solid #10b981' : '2px solid #1e293b', borderRadius: '14px', padding: '12px 6px', textAlign: 'center' }}>
          <div style={{ color: turn === 'away' ? '#34d399' : '#94a3b8', fontSize: '15px', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {awayName} {legStarter === 'away' && '🟢'}
          </div>
          <div style={{ fontSize: '64px', fontWeight: '900', color: '#fff', fontFamily: 'monospace', lineHeight: 1, margin: '6px 0' }}>{awayScore}</div>
          <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 'bold' }}>LEGS: {awayLegs}</div>
        </div>
      </div>

      {/* LOGG TABELL MED MYCKET STÖRRE TEXT */}
      <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '10px', height: '160px', overflowY: 'auto', marginBottom: '10px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #334155', color: '#94a3b8', fontSize: '12px' }}>
              <th style={{ width: '40%', paddingBottom: '4px' }}>{homeName}</th>
              <th style={{ width: '20%', paddingBottom: '4px' }}>PILAR</th>
              <th style={{ width: '40%', paddingBottom: '4px' }}>{awayName}</th>
            </tr>
          </thead>
          <tbody>
            {rounds.map((r, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #1e293b', fontSize: '22px', fontWeight: 'bold' }}>
                <td onClick={() => handleEditRound(i, 'home')} style={{ color: r.home === 'BUST' ? '#f43f5e' : '#fcd34d', padding: '6px 0', cursor: 'pointer' }}>
                  {r.home !== null ? r.home : ''}
                </td>
                <td style={{ color: '#475569', fontSize: '15px' }}>{r.round}</td>
                <td onClick={() => handleEditRound(i, 'away')} style={{ color: r.away === 'BUST' ? '#f43f5e' : '#fcd34d', padding: '6px 0', cursor: 'pointer' }}>
                  {r.away !== null ? r.away : ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* INMATNINGSRUTA & KNAPPSATS */}
      <div style={{ backgroundColor: '#0f172a', border: '2px solid #334155', padding: '8px', textAlign: 'center', fontSize: '32px', color: '#fcd34d', borderRadius: '12px', marginBottom: '10px', height: '50px', fontFamily: 'monospace', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {inputVal || '0'}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
        {['7','8','9','4','5','6','1','2','3'].map((num) => (
          <button key={num} onClick={() => handleNumClick(num)} disabled={isMatchFinished} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '12px', padding: '16px 0', fontSize: '26px', fontWeight: 'bold', cursor: 'pointer', touchAction: 'manipulation' }}>
            {num}
          </button>
        ))}
        <button onClick={handleClear} disabled={isMatchFinished} style={{ backgroundColor: '#7f1d1d', color: '#fff', border: '1px solid #991b1b', borderRadius: '12px', padding: '16px 0', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>C</button>
        <button onClick={() => handleNumClick('0')} disabled={isMatchFinished} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '12px', padding: '16px 0', fontSize: '26px', fontWeight: 'bold', cursor: 'pointer' }}>0</button>
        <button onClick={handleEnterScore} disabled={isMatchFinished} style={{ backgroundColor: '#2563eb', color: '#fff', border: '1px solid #3b82f6', borderRadius: '12px', padding: '16px 0', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
      </div>

      {isMatchFinished && (
        <button onClick={() => { onSave({ ...match, homeScore: homeLegs, awayScore: awayLegs, status: 'completed' }, performances); onBack(); }} style={{ width: '100%', backgroundColor: '#059669', color: '#fff', border: '2px solid #34d399', padding: '16px', borderRadius: '12px', fontSize: '18px', fontWeight: 'bold', marginTop: '12px', cursor: 'pointer' }}>
          ✓ SKICKA RESULTAT ({homeLegs} - {awayLegs})
        </button>
      )}
    </div>
  );
}

function RefereeView({ matchData, activeSubMatchId, setActiveSubMatchId, onSaveMatch }) {
  const activeMatch = matchData.subMatches.find(m => m.id === activeSubMatchId);
  if (!activeMatch) {
    return (
      <div style={{ maxWidth: '650px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Välj delmatch att döma</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {matchData.subMatches.map((sm) => (
            <button key={sm.id} onClick={() => setActiveSubMatchId(sm.id)} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '16px 12px', borderRadius: '10px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <span style={{ color: '#eab308', fontWeight: 'bold', marginRight: '8px', fontSize: '16px' }}>{sm.id}</span>
                <span style={{ fontSize: '14px' }}>{sm.homePlayer || 'Hemmalag'} vs {sm.awayPlayer || 'Bortalag'}</span>
              </div>
              <span style={{ backgroundColor: sm.status === 'completed' ? '#064e3b' : '#334155', color: sm.status === 'completed' ? '#6ee7b7' : '#cbd5e1', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
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

// --- 3. PUBLIK VY ---
function PublicView({ matchData }) {
  const totalHomeMatches = matchData.subMatches.reduce((acc, sm) => acc + (sm.homeScore > sm.awayScore ? 1 : 0), 0);
  const totalAwayMatches = matchData.subMatches.reduce((acc, sm) => acc + (sm.awayScore > sm.homeScore ? 1 : 0), 0);

  const totalHomeLegs = matchData.subMatches.reduce((acc, sm) => acc + (sm.homeScore || 0), 0);
  const totalAwayLegs = matchData.subMatches.reduce((acc, sm) => acc + (sm.awayScore || 0), 0);

  const homePerf = matchData.performances.filter(p => p.team === 'home');
  const awayPerf = matchData.performances.filter(p => p.team === 'away');

  const regularMatches = matchData.subMatches.filter(sm => sm.id !== 'AD');
  const completedRegularCount = regularMatches.filter(sm => sm.status === 'completed').length;
  const isADCompleted = matchData.subMatches.find(sm => sm.id === 'AD')?.status === 'completed';

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fffbeb', color: '#0f172a', padding: '20px', borderRadius: '8px', border: '2px solid #fde68a', fontFamily: 'sans-serif' }}>
      
      <div style={{ border: '3px solid #0f172a', padding: '10px', textAlign: 'center', backgroundColor: '#fff', marginBottom: '15px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px', margin: 0 }}>PUBSERIEN</h1>
        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', margin: 0 }}>Matchprotokoll Dart Online</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr 5fr', border: '2px solid #0f172a', backgroundColor: '#fff', marginBottom: '15px', padding: '10px', textAlign: 'center', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>HEMMALAG</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>{matchData.homeTeam || 'HEMMALAG'}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>RESULTAT</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#dc2626' }}>{totalHomeMatches} - {totalAwayMatches}</div>
          <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#475569', marginTop: '2px' }}>
            ({totalHomeLegs} - {totalAwayLegs})
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>BORTALAG</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>{matchData.awayTeam || 'BORTALAG'}</div>
        </div>
      </div>

      <div style={{ border: '2px solid #0f172a', backgroundColor: '#fff', marginBottom: '15px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #0f172a', fontSize: '11px', fontWeight: 'bold' }}>
              <th style={{ padding: '6px', textAlign: 'left', width: '35%' }}>{matchData.homeTeam || 'Hemmalag'}</th>
              <th style={{ width: '10%' }}>SET</th>
              <th style={{ width: '10%' }}>MATCH</th>
              <th style={{ width: '10%' }}>SET</th>
              <th style={{ padding: '6px', textAlign: 'left', width: '35%' }}>{matchData.awayTeam || 'Bortalag'}</th>
            </tr>
          </thead>
          <tbody>
            {matchData.subMatches.map((sm) => {
              const isBlockEnd = sm.id === 'S3' || sm.id === 'D2';
              const isAD = sm.id === 'AD';

              let borderBottomStyle = '1px solid #cbd5e1';
              if (isBlockEnd) {
                borderBottomStyle = '3px solid #dc2626';
              } else if (isAD) {
                borderBottomStyle = 'none';
              }

              return (
                <tr key={sm.id} style={{ borderBottom: borderBottomStyle, backgroundColor: isAD ? '#fef3c7' : '#fff' }}>
                  <td style={{ padding: '6px', textAlign: 'left' }}>{sm.homePlayer || '-'}</td>
                  <td style={{ fontWeight: 'bold' }}>{sm.status === 'completed' ? sm.homeScore : ''}</td>
                  <td style={{ fontWeight: '900', backgroundColor: '#e2e8f0' }}>{sm.id}</td>
                  <td style={{ fontWeight: 'bold' }}>{sm.status === 'completed' ? sm.awayScore : ''}</td>
                  <td style={{ padding: '6px', textAlign: 'left' }}>{sm.awayPlayer || '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div style={{ border: '2px solid #0f172a', backgroundColor: '#fff', padding: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>PRESTATIONER: HEMMALAG</div>
          <div style={{ minHeight: '40px', fontSize: '11px' }}>
            {homePerf.length > 0 ? (
              homePerf.map((p, i) => <div key={i}>🎯 {p.player}: {p.text}</div>)
            ) : (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Inga registrerade</span>
            )}
          </div>
        </div>

        <div style={{ border: '2px solid #0f172a', backgroundColor: '#fff', padding: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>PRESTATIONER: BORTALAG</div>
          <div style={{ minHeight: '40px', fontSize: '11px' }}>
            {awayPerf.length > 0 ? (
              awayPerf.map((p, i) => <div key={i}>🎯 {p.player}: {p.text}</div>)
            ) : (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Inga registrerade</span>
            )}
          </div>
        </div>
      </div>

      <div style={{ border: '2px solid #0f172a', backgroundColor: '#fff', padding: '10px', marginBottom: '15px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px', textAlign: 'center' }}>LAGSAMMANSTÄLLNING & STATUS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', fontSize: '12px' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>SPELADE MATCHER</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
              {completedRegularCount} / 10 {isADCompleted ? '(11)' : ''}
            </div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>TOTALT 180:OR</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#eab308' }}>🎯 {matchData.performances.filter(p => p.text === '180').length} st</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>ORD. MATCHER KVAR</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{10 - completedRegularCount} st</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default function Home() {
  const [currentView, setCurrentView] = useState('public');
  const [activeSubMatchId, setActiveSubMatchId] = useState(null);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
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
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      <nav style={{ backgroundColor: '#1e293b', padding: '10px', display: 'flex', justifyContent: 'center', gap: '10px', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => setCurrentView('admin')} style={{ backgroundColor: currentView === 'admin' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>1. Admin</button>
        <button onClick={() => setCurrentView('referee')} style={{ backgroundColor: currentView === 'referee' ? '#16a34a' : '#334155', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>2. Domare</button>
        <button onClick={() => setCurrentView('public')} style={{ backgroundColor: currentView === 'public' ? '#9333ea' : '#334155', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>3. Publik (Matchprotokoll)</button>
      </nav>
      <main style={{ padding: '12px' }}>
        {currentView === 'admin' && <AdminView matchData={matchData} setMatchData={setMatchData} isAdminAuthenticated={isAdminAuthenticated} setIsAdminAuthenticated={setIsAdminAuthenticated} />}
        {currentView === 'referee' && <RefereeView matchData={matchData} activeSubMatchId={activeSubMatchId} setActiveSubMatchId={setActiveSubMatchId} onSaveMatch={handleUpdateSubMatch} />}
        {currentView === 'public' && <PublicView matchData={matchData} />}
      </main>
    </div>
  );
}
