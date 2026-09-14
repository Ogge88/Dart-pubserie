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

// --- 1. ADMIN VY (MED MANUELL RESULTATREDIGERING) ---
function AdminView({ matchData, setMatchData }) {
  const handleTeamChange = (e) => setMatchData({ ...matchData, [e.target.name]: e.target.value });
  
  const handleSubMatchChange = (id, field, value) => {
    const updated = matchData.subMatches.map(sm => {
      if (sm.id === id) {
        const updatedMatch = { ...sm, [field]: value };
        // Om man ändrar poäng eller status manuellt
        if (field === 'homeScore' || field === 'awayScore') {
          updatedMatch[field] = parseInt(value, 10) || 0;
        }
        return updatedMatch;
      }
      return sm;
    });
    setMatchData({ ...matchData, subMatches: updated });
  };

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Admin - Lag & Resultatredigering</h1>
      
      {/* Lag-namn */}
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

      {/* Delmatcher & Manuell Resultatjustering */}
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

            {/* Manuell Resultat-kontroll */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#94a3b8' }}>
              <span>Manúellt resultat (legs):</span>
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

// --- 2. DOMAR VY (N01 SCORER) ---
function N01Scorer({ match, homeTeam, awayTeam, onBack, onSave }) {
  const [homeScore, setHomeScore] = useState(501);
  const [awayScore, setAwayScore] = useState(501);
  const [homeLegs, setHomeLegs] = useState(match.homeScore || 0);
  const [awayLegs, setAwayLegs] = useState(match.awayScore || 0);
  const [inputVal, setInputVal] = useState('');
  const [turn, setTurn] = useState('home');
  const [rounds, setRounds] = useState([]);
  const [performances, setPerformances] = useState([]);
  const [warningMsg, setWarningMsg] = useState('');

  const isMatchFinished = homeLegs === 3 || awayLegs === 3;
  const currentRound = rounds.length + (turn === 'home' ? 1 : 0);
  const currentDarts = (currentRound - 1) * 3 + (turn === 'away' ? 3 : 0);

  const handleNumClick = (num) => {
    if (isMatchFinished) return;
    if (inputVal.length < 3) setInputVal(prev => prev + num);
  };

  const handleClear = () => setInputVal('');
  const handleQuickScore = (score) => {
    if (isMatchFinished) return;
    setInputVal(score.toString());
  };

  const handleEnterScore = () => {
    if (isMatchFinished) return;
    const score = parseInt(inputVal || '0', 10);
    if (isNaN(score) || score > 180) return;

    if (score === 180) {
      const pName = turn === 'home' ? (match.homePlayer || homeTeam) : (match.awayPlayer || awayTeam);
      setPerformances(prev => [...prev, { team: turn, player: pName, text: '180' }]);
    }

    if (turn === 'home') {
      let newScore = homeScore - score;
      let wonLeg = false;
      if (newScore === 0) wonLeg = true;
      else if (newScore < 2) newScore = homeScore;

      const updatedRounds = [...rounds, { round: rounds.length + 1, home: score, away: null }];
      setRounds(updatedRounds);

      if (wonLeg) {
        setHomeLegs(l => l + 1);
        resetLeg();
        setInputVal('');
        return;
      }
      setHomeScore(newScore);
      setTurn('away');
    } else {
      let newScore = awayScore - score;
      let wonLeg = false;
      if (newScore === 0) wonLeg = true;
      else if (newScore < 2) newScore = awayScore;

      const updatedRounds = rounds.map((r, i) => i === rounds.length - 1 ? { ...r, away: score } : r);
      setRounds(updatedRounds);

      if (wonLeg) {
        setAwayLegs(l => l + 1);
        resetLeg();
        setInputVal('');
        return;
      }
      setAwayScore(newScore);

      if (updatedRounds.length >= 13) {
        setWarningMsg('Maximalt antal omgångar (13 omgångar / 39 pilar) nått!');
        setTimeout(() => { resetLeg(); setWarningMsg(''); }, 3000);
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
    <div style={{ maxWidth: '650px', margin: '0 auto', backgroundColor: '#020617', color: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #1e293b', fontFamily: 'monospace' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0f172a', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
        <button onClick={onBack} style={{ backgroundColor: '#334155', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'sans-serif' }}>← Avbryt</button>
        <div style={{ color: '#eab308', fontWeight: 'bold', fontSize: '13px' }}>501 - BÄST AV 5 (FÖRST TILL 3)</div>
        <div style={{ color: '#94a3b8', fontSize: '12px' }}>PILAR: <span style={{ color: '#10b981' }}>{currentDarts}/39</span></div>
      </div>

      {warningMsg && <div style={{ backgroundColor: '#dc2626', color: '#fff', textAlign: 'center', padding: '8px', fontSize: '12px', fontWeight: 'bold', marginBottom: '10px' }}>{warningMsg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px', textAlign: 'center' }}>
        <div style={{ padding: '10px', borderRadius: '8px', border: turn === 'home' && !isMatchFinished ? '2px solid #10b981' : '1px solid #1e293b', backgroundColor: turn === 'home' && !isMatchFinished ? '#064e3b22' : '#0f172a' }}>
          <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '14px' }}>{match.homePlayer || homeTeam}</div>
          <div style={{ color: '#fcd34d', fontSize: '48px', fontWeight: '900', margin: '4px 0' }}>{homeScore}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', borderTop: '1px solid #1e293b', paddingTop: '4px' }}>
            <span>LEGS: <strong style={{ color: '#fff' }}>{homeLegs}</strong></span>
            <span>OMG: {rounds.length}</span>
          </div>
        </div>
        <div style={{ padding: '10px', borderRadius: '8px', border: turn === 'away' && !isMatchFinished ? '2px solid #10b981' : '1px solid #1e293b', backgroundColor: turn === 'away' && !isMatchFinished ? '#064e3b22' : '#0f172a' }}>
          <div style={{ color: '#34d399', fontWeight: 'bold', fontSize: '14px' }}>{match.awayPlayer || awayTeam}</div>
          <div style={{ color: '#fcd34d', fontSize: '48px', fontWeight: '900', margin: '4px 0' }}>{awayScore}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8', fontSize: '12px', borderTop: '1px solid #1e293b', paddingTop: '4px' }}>
            <span>LEGS: <strong style={{ color: '#fff' }}>{awayLegs}</strong></span>
            <span>OMG: {rounds.length}</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
        <div>
          <div style={{ backgroundColor: '#0f172a', border: '1px solid #334155', padding: '10px', textAlign: 'right', fontSize: '32px', color: '#fcd34d', borderRadius: '6px', marginBottom: '8px', minHeight: '52px' }}>
            {inputVal || '0'}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
            {['7','8','9','26','4','5','6','41','1','2','3','60'].map((val, idx) => (
              <button key={idx} onClick={() => ['26','41','60'].includes(val) ? handleQuickScore(parseInt(val)) : handleNumClick(val)} disabled={isMatchFinished} style={{ backgroundColor: ['26','41','60'].includes(val) ? '#0f172a' : '#1e293b', color: ['26','41','60'].includes(val) ? '#94a3b8' : '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '12px 0', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                {val}
              </button>
            ))}
            <button onClick={handleClear} disabled={isMatchFinished} style={{ backgroundColor: '#7f1d1d', color: '#fff', border: '1px solid #991b1b', borderRadius: '6px', padding: '12px 0', fontWeight: 'bold', cursor: 'pointer' }}>C</button>
            <button onClick={() => handleNumClick('0')} disabled={isMatchFinished} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', borderRadius: '6px', padding: '12px 0', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>0</button>
            <button onClick={handleEnterScore} disabled={isMatchFinished} style={{ backgroundColor: '#2563eb', color: '#fff', border: '1px solid #3b82f6', borderRadius: '6px', padding: '12px 0', fontWeight: 'bold', cursor: 'pointer' }}>OK</button>
            <button onClick={() => handleQuickScore(100)} disabled={isMatchFinished} style={{ backgroundColor: '#0f172a', color: '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '12px 0', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>100</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginTop: '4px' }}>
            {[45, 85, 140, 180].map((sc) => (
              <button key={sc} onClick={() => handleQuickScore(sc)} disabled={isMatchFinished} style={{ backgroundColor: sc === 180 ? '#713f12' : '#0f172a', color: sc === 180 ? '#fde047' : '#94a3b8', border: '1px solid #334155', borderRadius: '6px', padding: '8px 0', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                {sc}
              </button>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '6px', padding: '6px', maxHeight: '290px', overflowY: 'auto', fontSize: '11px' }}>
          <table style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', color: '#64748b' }}>
                <th>H</th>
                <th>#</th>
                <th>B</th>
              </tr>
            </thead>
            <tbody>
              {rounds.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #1e293b' }}>
                  <td style={{ color: '#fcd34d', padding: '4px 0' }}>{r.home}</td>
                  <td style={{ color: '#475569' }}>{r.round}</td>
                  <td style={{ color: '#fcd34d', padding: '4px 0' }}>{r.away}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isMatchFinished ? (
        <button onClick={() => { onSave({ ...match, homeScore: homeLegs, awayScore: awayLegs, status: 'completed' }, performances); onBack(); }} style={{ width: '100%', backgroundColor: '#059669', color: '#fff', border: '2px solid #34d399', padding: '14px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', marginTop: '10px', cursor: 'pointer' }}>
          ✓ SKICKA RESULTAT ({homeLegs} - {awayLegs})
        </button>
      ) : (
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#64748b', marginTop: '8px' }}>Först till 3 vunna legs låser upp skicka-knappen.</div>
      )}
    </div>
  );
}

function RefereeView({ matchData, activeSubMatchId, setActiveSubMatchId, onSaveMatch }) {
  const activeMatch = matchData.subMatches.find(m => m.id === activeSubMatchId);
  if (!activeMatch) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#4ade80', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>Välj delmatch att döma</h1>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {matchData.subMatches.map((sm) => (
            <button key={sm.id} onClick={() => setActiveSubMatchId(sm.id)} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '12px', borderRadius: '8px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <span style={{ color: '#eab308', fontWeight: 'bold', marginRight: '6px' }}>{sm.id}</span>
                <span style={{ fontSize: '13px' }}>{sm.homePlayer || 'Hemmalag'} vs {sm.awayPlayer || 'Bortalag'}</span>
              </div>
              <span style={{ backgroundColor: sm.status === 'completed' ? '#064e3b' : '#334155', color: sm.status === 'completed' ? '#6ee7b7' : '#cbd5e1', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
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

// --- 3. PUBLIK VY (RENSAT OCH APPASSAT FÖR ONLINE) ---
function PublicView({ matchData }) {
  const totalHomeScore = matchData.subMatches.reduce((acc, sm) => acc + (sm.homeScore > sm.awayScore ? 1 : 0), 0);
  const totalAwayScore = matchData.subMatches.reduce((acc, sm) => acc + (sm.awayScore > sm.homeScore ? 1 : 0), 0);
  const homePerf = matchData.performances.filter(p => p.team === 'home');
  const awayPerf = matchData.performances.filter(p => p.team === 'away');
  
  const completedCount = matchData.subMatches.filter(sm => sm.status === 'completed').length;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', backgroundColor: '#fffbeb', color: '#0f172a', padding: '20px', borderRadius: '8px', border: '2px solid #fde68a', fontFamily: 'sans-serif' }}>
      
      {/* Protokoll Header */}
      <div style={{ border: '3px solid #0f172a', padding: '10px', textAlign: 'center', backgroundColor: '#fff', marginBottom: '15px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '900', letterSpacing: '2px', margin: 0 }}>PUBSERIEN</h1>
        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#475569', margin: 0 }}>Matchprotokoll Dart Online</p>
      </div>

      {/* Lag-rubriker & Totalresultat */}
      <div style={{ display: 'grid', gridTemplateColumns: '5fr 2fr 5fr', border: '2px solid #0f172a', backgroundColor: '#fff', marginBottom: '15px', padding: '10px', textAlign: 'center', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>HEMMALAG</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>{matchData.homeTeam || 'HEMMALAG'}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>RESULTAT</div>
          <div style={{ fontSize: '24px', fontWeight: '900', color: '#dc2626' }}>{totalHomeScore} - {totalAwayScore}</div>
        </div>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 'bold', color: '#64748b' }}>BORTALAG</div>
          <div style={{ fontSize: '18px', fontWeight: '900' }}>{matchData.awayTeam || 'BORTALAG'}</div>
        </div>
      </div>

      {/* Delmatcher Tabell */}
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
            {matchData.subMatches.map((sm) => (
              <tr key={sm.id} style={{ borderBottom: '1px solid #cbd5e1', backgroundColor: sm.id === 'AD' ? '#fef3c7' : '#fff' }}>
                <td style={{ padding: '6px', textAlign: 'left' }}>{sm.homePlayer || '-'}</td>
                <td style={{ fontWeight: 'bold' }}>{sm.status === 'completed' ? sm.homeScore : ''}</td>
                <td style={{ fontWeight: '900', backgroundColor: '#e2e8f0' }}>{sm.id}</td>
                <td style={{ fontWeight: 'bold' }}>{sm.status === 'completed' ? sm.awayScore : ''}</td>
                <td style={{ padding: '6px', textAlign: 'left' }}>{sm.awayPlayer || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prestationer per lag */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '15px' }}>
        <div style={{ border: '2px solid #0f172a', backgroundColor: '#fff', padding: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>PRESTATIONER: HEMMALAG</div>
          <div style={{ minHeight: '50px', fontSize: '11px' }}>
            {homePerf.length > 0 ? (
              homePerf.map((p, i) => <div key={i}>🎯 {p.player}: {p.text}</div>)
            ) : (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Inga registrerade</span>
            )}
          </div>
        </div>

        <div style={{ border: '2px solid #0f172a', backgroundColor: '#fff', padding: '10px' }}>
          <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '6px' }}>PRESTATIONER: BORTALAG</div>
          <div style={{ minHeight: '50px', fontSize: '11px' }}>
            {awayPerf.length > 0 ? (
              awayPerf.map((p, i) => <div key={i}>🎯 {p.player}: {p.text}</div>)
            ) : (
              <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>Inga registrerade</span>
            )}
          </div>
        </div>
      </div>

      {/* Ny Online-sektion: Lagsammanställning (ersätter underskrifterna) */}
      <div style={{ border: '2px solid #0f172a', backgroundColor: '#fff', padding: '10px', marginBottom: '15px' }}>
        <div style={{ fontSize: '11px', fontWeight: 'bold', borderBottom: '1px solid #cbd5e1', paddingBottom: '4px', marginBottom: '8px', textAlign: 'center' }}>LAGSAMMANSTÄLLNING & STATUS</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', textAlign: 'center', fontSize: '12px' }}>
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>SPELADE MATCHER</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{completedCount} / 11</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>TOTALT 180:OR</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px', color: '#eab308' }}>🎯 {matchData.performances.filter(p => p.text === '180').length} st</div>
          </div>
          <div>
            <div style={{ color: '#64748b', fontSize: '10px', fontWeight: 'bold' }}>MATCHER KVAR</div>
            <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{11 - completedCount} st</div>
          </div>
        </div>
      </div>

      {/* Regler för Prestationer (Snygg och tydlig ruta) */}
      <div style={{ border: '2px solid #0f172a', backgroundColor: '#f8fafc', padding: '10px', fontSize: '11px', borderRadius: '4px' }}>
        <div style={{ fontWeight: 'bold', borderBottom: '1px solid #e2e8f0', paddingBottom: '4px', marginBottom: '6px', color: '#334155' }}>REGLER FÖR PRESTATIONER:</div>
        <div style={{ color: '#475569', lineHeight: '1.5' }}>
          <div>• <strong>Prestation för herrar:</strong> Korta set (9-20 pilar) / Höga utgångar (100+) / 180:or</div>
          <div>• <strong>Prestation för damer:</strong> Korta set (9-25 pilar) / Höga utgångar (70+) / 180:or</div>
        </div>
      </div>

    </div>
  );
}

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
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', paddingBottom: '30px', fontFamily: 'sans-serif' }}>
      <nav style={{ backgroundColor: '#1e293b', padding: '10px', display: 'flex', justifyContent: 'center', gap: '10px', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 50 }}>
        <button onClick={() => setCurrentView('admin')} style={{ backgroundColor: currentView === 'admin' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>1. Admin</button>
        <button onClick={() => setCurrentView('referee')} style={{ backgroundColor: currentView === 'referee' ? '#16a34a' : '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>2. Domare</button>
        <button onClick={() => setCurrentView('public')} style={{ backgroundColor: currentView === 'public' ? '#9333ea' : '#334155', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>3. Publik (Matchprotokoll)</button>
      </nav>
      <main style={{ padding: '15px' }}>
        {currentView === 'admin' && <AdminView matchData={matchData} setMatchData={setMatchData} />}
        {currentView === 'referee' && <RefereeView matchData={matchData} activeSubMatchId={activeSubMatchId} setActiveSubMatchId={setActiveSubMatchId} onSaveMatch={handleUpdateSubMatch} />}
        {currentView === 'public' && <PublicView matchData={matchData} />}
      </main>
    </div>
  );
}
