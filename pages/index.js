/* STREAMING_CHUNK:Initializing main constants and initial state... */
import React, { useState, useRef, useEffect } from 'react';

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

// Omöjliga kast med 3 pilar
const IMPOSSIBLE_SCORES = [163, 166, 169, 172, 173, 175, 176, 178, 179];

// Omöjliga utgångar under/på 170
const IMPOSSIBLE_CHECKOUTS = [159, 162, 163, 165, 166, 168, 169];

/* STREAMING_CHUNK:Defining AdminView component... */
// --- 1. ADMIN VY ---
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
<div style={{ fontSize: '40px', marginBottom: '10px' }}>🔒
<h2 style={{ color: '#fff', fontSize: '20px', marginBottom: '15px' }}>Admin Inloggning

<input
type="password"
placeholder="Ange lösenord"
value={passwordInput}
onChange={(e) => setPasswordInput(e.target.value)}
style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', fontSize: '16px', marginBottom: '12px', boxSizing: 'border-box' }}
/>
{errorMessage && <div style={{ color: '#f43f5e', fontSize: '14px', marginBottom: '12px' }}>{errorMessage}}
<button type="submit" style={{ width: '100%', backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '12px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}>
Lås upp



);
}

return (
<div style={{ maxWidth: '750px', margin: '0 auto', fontFamily: 'sans-serif' }}>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
<h1 style={{ color: '#60a5fa', fontSize: '20px', fontWeight: 'bold', margin: 0 }}>Admin - Lag & Resultatredigering
<button onClick={() => setIsAdminAuthenticated(false)} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
🔒 Lås Admin



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

/* STREAMING_CHUNK:Defining Referee View / N01Scorer logic... */
// --- 2. DOMAR VY ---
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

const [confirmRemaining, setConfirmRemaining] = useState(null);

const [scoringActive, setScoringActive] = useState(false);
const [scoringHomeInput, setScoringHomeInput] = useState('');
const [scoringAwayInput, setScoringAwayInput] = useState('');
const [scoringConfirm, setScoringConfirm] = useState(null);

const logContainerRef = useRef(null);

useEffect(() => {
if (logContainerRef.current) {
logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
}
}, [rounds, turn]);

const homeName = match.homePlayer || homeTeam;
const awayName = match.awayPlayer || awayTeam;

const isMatchFinished = homeLegs === 3 || awayLegs === 3;
const activePlayerName = turn === 'home' ? homeName : awayName;

const recalculateRoundsAndScores = (currentRounds) => {
let currentHome = 501;
let currentAway = 501;

const updatedRounds = currentRounds.map((r) => {
  let newHomeEntry = r.home;
  let newAwayEntry = r.away;

  if (r.home) {
    const score = r.home.rawScore;
    let rem = currentHome - score;
    let isBust = rem < 0 || rem === 1 || (rem === 0 && (IMPOSSIBLE_CHECKOUTS.includes(score) || score > 170));
    
    if (isBust) {
      rem = currentHome;
    } else {
      currentHome = rem;
    }

    newHomeEntry = {
      rawScore: score,
      score: isBust ? 'BUST' : score,
      remaining: rem
    };
  }

  if (r.away) {
    const score = r.away.rawScore;
    let rem = currentAway - score;
    let isBust = rem < 0 || rem === 1 || (rem === 0 && (IMPOSSIBLE_CHECKOUTS.includes(score) || score > 170));
    
    if (isBust) {
      rem = currentAway;
    } else {
      currentAway = rem;
    }

    newAwayEntry = {
      rawScore: score,
      score: isBust ? 'BUST' : score,
      remaining: rem
    };
  }

  return {
    ...r,
    home: newHomeEntry,
    away: newAwayEntry
  };
});

return {
  updatedRounds,
  newHomeScore: currentHome,
  newAwayScore: currentAway
};


};

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
setInputVal('');
setScoringActive(false);
setScoringConfirm(null);
setConfirmRemaining(null);
};

const handleEnterScore = () => {
if (isMatchFinished || !turn) return;
const score = parseInt(inputVal || '0', 10);

if (isNaN(score) || score > 180) {
  alert('Ange en giltig poäng mellan 0 och 180.');
  return;
}

if (IMPOSSIBLE_SCORES.includes(score)) {
  alert(`Det går inte att få ${score} poäng på 3 pilar!`);
  setInputVal('');
  return;
}

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

const handleOpenRemainingModal = () => {
if (isMatchFinished || !turn || !inputVal) return;

const targetRemaining = parseInt(inputVal, 10);
const currentScore = turn === 'home' ? homeScore : awayScore;

if (isNaN(targetRemaining) || targetRemaining < 0 || targetRemaining >= currentScore) {
  alert(`Återstående poäng måste vara mindre än nuvarande poäng (${currentScore}).`);
  return;
}

const calculatedScored = currentScore - targetRemaining;

if (calculatedScored > 180) {
  alert(`Detta innebär att spelaren kastat ${calculatedScored} poäng, vilket är över max 180.`);
  return;
}

if (IMPOSSIBLE_SCORES.includes(calculatedScored)) {
  alert(`Detta innebär att spelaren kastat ${calculatedScored} poäng, vilket är ett omöjligt kast.`);
  return;
}

setConfirmRemaining({ targetRemaining, calculatedScored, player: activePlayerName });


};

const processRemainingScore = () => {
if (!confirmRemaining) return;
const { calculatedScored } = confirmRemaining;
setConfirmRemaining(null);

const currentScore = turn === 'home' ? homeScore : awayScore;
const remaining = currentScore - calculatedScored;

if (remaining === 0) {
  if (IMPOSSIBLE_CHECKOUTS.includes(calculatedScored) || calculatedScored > 170) {
    processScore(calculatedScored);
    return;
  }
  setConfirmCheckout({ score: calculatedScored, player: activePlayerName, team: turn });
  return;
}

processScore(calculatedScored);


};

const processScore = (score, confirmedCheckout = false) => {
saveStateToHistory();
const currentScore = turn === 'home' ? homeScore : awayScore;
let newScore = currentScore - score;
let isBust = false;

if (newScore < 0 || newScore === 1 || (newScore === 0 && (IMPOSSIBLE_CHECKOUTS.includes(score) || score > 170))) {
  isBust = true;
  newScore = currentScore;
}

// Prestation: 180
if (score === 180 && !isBust) {
  setPerformances(prev => [...prev, { team: turn, player: activePlayerName, text: '180' }]);
}

const entryData = {
  rawScore: score,
  score: isBust ? 'BUST' : score,
  remaining: newScore
};

if (turn === 'home') {
  const updatedRounds = [...rounds, { round: (rounds.length + 1) * 3, home: entryData, away: null }];
  setRounds(updatedRounds);

  if (confirmedCheckout) {
    checkAndAddCheckoutPerformances('home', activePlayerName, score, updatedRounds.length);

    setHomeLegs(l => l + 1);
    startNextLeg();
    setInputVal('');
    return;
  }

  setHomeScore(newScore);
  setTurn('away');
} else {
  const updatedRounds = rounds.map((r, i) => i === rounds.length - 1 ? { ...r, away: entryData } : r);
  setRounds(updatedRounds);

  if (confirmedCheckout) {
    checkAndAddCheckoutPerformances('away', activePlayerName, score, updatedRounds.length);

    setAwayLegs(l => l + 1);
    startNextLeg();
    setInputVal('');
    return;
  }

  setAwayScore(newScore);

  if (updatedRounds.length === 13) {
    setScoringActive(true);
    setInputVal('');
    return;
  }

  setTurn('home');
}

setInputVal('');


};

const checkAndAddCheckoutPerformances = (team, player, checkoutScore, roundsCount) => {
const totalDarts = roundsCount * 3;
const newPerfs = [];

if (checkoutScore >= 100) {
  newPerfs.push({ team, player, text: '100+ut' });
}

if (totalDarts < 20) {
  newPerfs.push({ team, player, text: `${totalDarts} pil` });
}

if (newPerfs.length > 0) {
  setPerformances(prev => [...prev, ...newPerfs]);
}


};

const handleScoringSubmit = () => {
const hVal = parseInt(scoringHomeInput, 10);
const aVal = parseInt(scoringAwayInput, 10);

if (isNaN(hVal) || hVal < 0 || hVal > 180 || IMPOSSIBLE_SCORES.includes(hVal)) {
  alert(`Ogiltig poäng för ${homeName}.`);
  return;
}
if (isNaN(aVal) || aVal < 0 || aVal > 180 || IMPOSSIBLE_SCORES.includes(aVal)) {
  alert(`Ogiltig poäng för ${awayName}.`);
  return;
}
if (hVal === aVal) {
  alert('Det blev oavgjort! Scoring måste ge en vinnare (kasta igen vid oavgjort).');
  return;
}

const winner = hVal > aVal ? 'home' : 'away';
const winnerName = winner === 'home' ? homeName : awayName;

setScoringConfirm({ winner, winnerName, homeVal: hVal, awayVal: aVal });


};

const confirmScoringWinner = () => {
if (!scoringConfirm) return;

if (scoringConfirm.winner === 'home') {
  setHomeLegs(l => l + 1);
} else {
  setAwayLegs(l => l + 1);
}

setScoringActive(false);
setScoringConfirm(null);
setScoringHomeInput('');
setScoringAwayInput('');

startNextLeg();


};

const cancelScoringConfirm = () => {
setScoringConfirm(null);
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
const currentEntry = team === 'home' ? targetRound.home : targetRound.away;
if (!currentEntry) return;

const currentVal = currentEntry.rawScore;
const newValStr = prompt(`Ändra kastad poäng för omgång ${index + 1}:`, currentVal);
if (newValStr === null) return;

const newVal = parseInt(newValStr, 10);
if (isNaN(newVal) || newVal < 0 || newVal > 180 || IMPOSSIBLE_SCORES.includes(newVal)) {
  alert('Ogiltig poäng.');
  return;
}

saveStateToHistory();

const rawRounds = rounds.map((r, i) => {
  if (i === index) {
    return {
      ...r,
      [team]: {
        ...r[team],
        rawScore: newVal
      }
    };
  }
  return r;
});

const { updatedRounds, newHomeScore, newAwayScore } = recalculateRoundsAndScores(rawRounds);

setRounds(updatedRounds);
setHomeScore(newHomeScore);
setAwayScore(newAwayScore);


};

const renderCellContent = (entry) => {
if (!entry) return '';
if (entry.score === 'BUST') {
return (

<span style={{ color: '#f43f5e' }}>BUST
<span style={{ fontSize: '13px', color: '#94a3b8', marginLeft: '6px' }}>({entry.remaining})

);
}
return (

<span style={{ color: '#fcd34d' }}>{entry.score}
<span style={{ fontSize: '14px', color: '#38bdf8', marginLeft: '6px', fontWeight: 'normal' }}>({entry.remaining})

);
};

if (!turn && match.id === 'AD') {
return (
<div style={{ maxWidth: '500px', margin: '20px auto', backgroundColor: '#020617', padding: '25px', borderRadius: '16px', textAlign: 'center', border: '2px solid #eab308' }}>
<h2 style={{ color: '#eab308', fontSize: '22px', marginBottom: '10px' }}>AVGÖRANDE DUBBEL (AD)
<p style={{ color: '#94a3b8', fontSize: '15px', marginBottom: '20px' }}>Vem vann slantkastningen / omkastet och ska börja?
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
<button onClick={() => { setLegStarter('home'); setTurn('home'); }} style={{ backgroundColor: '#1e293b', color: '#60a5fa', border: '2px solid #3b82f6', padding: '20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
{homeName}

<button onClick={() => { setLegStarter('away'); setTurn('away'); }} style={{ backgroundColor: '#1e293b', color: '#f43f5e', border: '2px solid #f43f5e', padding: '20px', borderRadius: '12px', fontWeight: 'bold', fontSize: '18px', cursor: 'pointer' }}>
{awayName}



);
}

return (
<div style={{ maxWidth: '550px', margin: '0 auto', backgroundColor: '#020617', color: '#fff', padding: '12px', borderRadius: '16px', border: '1px solid #1e293b', fontFamily: 'sans-serif', userSelect: 'none' }}>

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

  {confirmRemaining && (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 105, padding: '20px' }}>
      <div style={{ backgroundColor: '#0f172a', border: '2px solid #3b82f6', borderRadius: '16px', padding: '24px', textAlign: 'center', maxWidth: '400px', width: '100%' }}>
        <div style={{ fontSize: '36px', marginBottom: '8px' }}>✏️</div>
        <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 10px 0' }}>Sätt kvarvarande poäng?</h3>
        <p style={{ color: '#cbd5e1', fontSize: '16px', marginBottom: '15px' }}>
          Sätt <strong style={{ color: '#60a5fa' }}>{confirmRemaining.player}s</strong> kvarvarande poäng till <strong style={{ color: '#fcd34d', fontSize: '20px' }}>{confirmRemaining.targetRemaining}</strong>?
        </p>
        <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px', backgroundColor: '#1e293b', padding: '8px', borderRadius: '6px' }}>
          (Detta innebär en registrering av <strong>{confirmRemaining.calculatedScored}</strong> poäng)
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button onClick={processRemainingScore} style={{ backgroundColor: '#2563eb', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            JA (Registrera)
          </button>
          <button onClick={() => setConfirmRemaining(null)} style={{ backgroundColor: '#475569', color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
            NEJ (Avbryt)
          </button>
        </div>
      </div>
    </div>
  )}

  {scoringActive && (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 110, padding: '20px' }}>
      <div style={{ backgroundColor: '#0f172a', border: '2px solid #eab308', borderRadius: '16px', padding: '24px', textAlign: 'center', maxWidth: '420px', width: '100%' }}>
        
        {!scoringConfirm ? (
          <>
            <div style={{ fontSize: '36px', marginBottom: '8px' }}>⏱️</div>
            <h2 style={{ color: '#eab308', fontSize: '24px', margin: '0 0 6px 0', fontWeight: '900' }}>39 PILAR UPPNÅD!</h2>
            <p style={{ color: '#cbd5e1', fontSize: '14px', marginBottom: '20px' }}>
              Ingen spelare gick ut. Leget avgörs med <strong>Scoring (1 omgång, max 180 poäng)</strong>.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px', textAlign: 'left' }}>
              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  POÄNG {homeName.toUpperCase()}
                </label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  placeholder="0 - 180"
                  value={scoringHomeInput}
                  onChange={(e) => setScoringHomeInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', fontSize: '20px', fontWeight: 'bold', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fcd34d', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#94a3b8', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px' }}>
                  POÄNG {awayName.toUpperCase()}
                </label>
                <input
                  type="number"
                  min="0"
                  max="180"
                  placeholder="0 - 180"
                  value={scoringAwayInput}
                  onChange={(e) => setScoringAwayInput(e.target.value)}
                  style={{ width: '100%', padding: '12px', fontSize: '20px', fontWeight: 'bold', borderRadius: '8px', border: '1px solid #475569', backgroundColor: '#1e293b', color: '#fcd34d', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            <button onClick={handleScoringSubmit} style={{ width: '100%', backgroundColor: '#eab308', color: '#0f172a', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
              Registrera Scoring
            </button>
          </>
        ) : (
          <>
            <div style={{ fontSize: '40px', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 10px 0' }}>Bekräfta vinnare av scoring</h3>
            <p style={{ color: '#cbd5e1', fontSize: '18px', marginBottom: '20px' }}>
              Vann <strong style={{ color: '#34d399' }}>{scoringConfirm.winnerName}</strong> scoringen?
              <br />
              <span style={{ fontSize: '14px', color: '#94a3b8' }}>
                ({homeName}: {scoringConfirm.homeVal} vs {awayName}: {scoringConfirm.awayVal})
              </span>
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={confirmScoringWinner} style={{ backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                JA
              </button>
              <button onClick={cancelScoringConfirm} style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '16px', borderRadius: '10px', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}>
                NEJ (Gör om)
              </button>
            </div>
          </>
        )}

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

  <div 
    ref={logContainerRef} 
    style={{ 
      backgroundColor: '#0f172a', 
      border: '1px solid #1e293b', 
      borderRadius: '12px', 
      padding: '10px', 
      height: '160px', 
      overflowY: 'auto', 
      marginBottom: '10px',
      scrollBehavior: 'smooth'
    }}
  >
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
          <tr key={i} style={{ borderBottom: '1px solid #1e293b', fontSize: '18px', fontWeight: 'bold' }}>
            <td onClick={() => handleEditRound(i, 'home')} style={{ padding: '6px 0', cursor: 'pointer' }}>
              {renderCellContent(r.home)}
            </td>
            <td style={{ color: '#475569', fontSize: '14px' }}>{r.round}</td>
            <td onClick={() => handleEditRound(i, 'away')} style={{ padding: '6px 0', cursor: 'pointer' }}>
              {renderCellContent(r.away)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>

  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
    <div style={{ flex: 1, backgroundColor: '#0f172a', border: '2px solid #334155', padding: '8px', textAlign: 'center', fontSize: '32px', color: '#fcd34d', borderRadius: '12px', height: '50px', fontFamily: 'monospace', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', boxSizing: 'border-box' }}>
      {inputVal || '0'}
    </div>
    
    <button 
      onClick={handleOpenRemainingModal}
      disabled={isMatchFinished || !inputVal}
      title="Ange som återstående poäng"
      style={{ 
        backgroundColor: inputVal ? '#1e293b' : '#0f172a', 
        color: inputVal ? '#60a5fa' : '#475569', 
        border: '2px solid #334155', 
        borderRadius: '12px', 
        width: '50px', 
        height: '50px', 
        fontSize: '22px', 
        fontWeight: 'bold', 
        cursor: inputVal ? 'pointer' : 'default',
        display: 'flex',
        alignItems: 'center',
        justify: 'center'
      }}
    >
      •••
    </button>
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
<h1 style={{ color: '#4ade80', fontSize: '20px', fontWeight: 'bold', marginBottom: '15px' }}>Välj delmatch att döma
<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
{matchData.subMatches.map((sm) => (
<button key={sm.id} onClick={() => setActiveSubMatchId(sm.id)} style={{ backgroundColor: '#1e293b', color: '#fff', border: '1px solid #334155', padding: '16px 12px', borderRadius: '10px', textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>

<span style={{ color: '#eab308', fontWeight: 'bold', marginRight: '8px', fontSize: '16px' }}>{sm.id}
<span style={{ fontSize: '14px' }}>{sm.homePlayer || 'Hemmalag'} vs {sm.awayPlayer || 'Bortalag'}

<span style={{ backgroundColor: sm.status === 'completed' ? '#064e3b' : '#334155', color: sm.status === 'completed' ? '#6ee7b7' : '#cbd5e1', padding: '6px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold' }}>
{sm.status === 'completed' ? ${sm.homeScore} - ${sm.awayScore} : 'Välj'}


))}


);
}
return <N01Scorer match={activeMatch} homeTeam={matchData.homeTeam} awayTeam={matchData.awayTeam} onBack={() => setActiveSubMatchId(null)} onSave={onSaveMatch} />;
}

/* STREAMING_CHUNK:Building modern PublicView component... */
// --- 3. PUBLIK VY (NY PROFFSIG & MODERN DESIGN) ---
function PublicView({ matchData }) {
// Beräkna totalställning
const totalHomeMatches = matchData.subMatches.reduce((acc, sm) => acc + (sm.homeScore > sm.awayScore ? 1 : 0), 0);
const totalAwayMatches = matchData.subMatches.reduce((acc, sm) => acc + (sm.awayScore > sm.homeScore ? 1 : 0), 0);

const totalHomeLegs = matchData.subMatches.reduce((acc, sm) => acc + (sm.homeScore || 0), 0);
const totalAwayLegs = matchData.subMatches.reduce((acc, sm) => acc + (sm.awayScore || 0), 0);

// Framsteg och status
const completedMatchesCount = matchData.subMatches.filter(sm => sm.status === 'completed').length;
const totalMatchesToPlay = matchData.subMatches.find(sm => sm.id === 'AD')?.status === 'completed' ? 11 : 10;
const progressPercent = Math.min(Math.round((completedMatchesCount / 10) * 100), 100);

let matchStatusText = 'PÅGÅENDE';
let matchStatusColor = '#3b82f6'; // Blå
if (completedMatchesCount === 0) {
matchStatusText = 'EJ STARTAD';
matchStatusColor = '#64748b'; // Grå
} else if (completedMatchesCount >= 10 || totalHomeMatches >= 6 || totalAwayMatches >= 6) {
matchStatusText = 'AVSLUTAD';
matchStatusColor = '#10b981'; // Grön
}

// Gruppera prestationer per spelare
const groupPerformancesByPlayer = (perfs) => {
const map = {};
perfs.forEach(p => {
const name = p.player || 'Okänd spelare';
if (!map[name]) {
map[name] = [];
}
map[name].push(p.text);
});

return Object.keys(map).map(player => ({
  player,
  items: map[player]
}));


};

const homePerfGrouped = groupPerformancesByPlayer(matchData.performances.filter(p => p.team === 'home'));
const awayPerfGrouped = groupPerformancesByPlayer(matchData.performances.filter(p => p.team === 'away'));

// Statistik-beräkningar
const total180s = matchData.performances.filter(p => p.text === '180').length;

// Hitta snabbaste leg (minst antal pilar)
const dartPerformances = matchData.performances.filter(p => p.text.endsWith('pil'));
let fastestLeg = '-';
if (dartPerformances.length > 0) {
const minDarts = Math.min(...dartPerformances.map(p => parseInt(p.text, 10)));
fastestLeg = ${minDarts} pilar;
}

// Hjälpfunktion för färger på prestations-badges
const getBadgeStyle = (text) => {
if (text === '180') {
return { backgroundColor: '#f59e0b', color: '#0f172a', border: '1px solid #fbbf24' }; // Guld
}
if (text === '100+ut') {
return { backgroundColor: '#10b981', color: '#ffffff', border: '1px solid #34d399' }; // Grön
}
if (text.endsWith('pil')) {
return { backgroundColor: '#8b5cf6', color: '#ffffff', border: '1px solid #a78bfa' }; // Lila/Blå
}
return { backgroundColor: '#334155', color: '#fff', border: '1px solid #475569' };
};

/* STREAMING_CHUNK:Rendering PublicView layout... */
return (
<div style={{ maxWidth: '850px', margin: '0 auto', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>

  {/* 1. LIVESCORE HEADER KORT */}
  <div style={{
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    border: '1px solid #334155',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)',
    padding: '24px 20px',
    marginBottom: '20px',
    position: 'relative',
    overflow: 'hidden'
  }}>
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #3b82f6 0%, #10b981 50%, #f59e0b 100%)'
    }} />

    {/* Status bar */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
      <div style={{ fontSize: '12px', fontWeight: '800', letterSpacing: '1.5px', color: '#94a3b8', textTransform: 'uppercase' }}>
        PUBSERIEN DART PROTOKOLL
      </div>
      <span style={{
        backgroundColor: `${matchStatusColor}20`,
        color: matchStatusColor,
        border: `1px solid ${matchStatusColor}60`,
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '11px',
        fontWeight: '800',
        letterSpacing: '1px'
      }}>
        ● {matchStatusText}
      </span>
    </div>

    {/* Resultat tavla */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: '15px', textAlign: 'center' }}>
      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
          {matchData.homeTeam || 'HEMMALAG'}
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Hemmalag</span>
      </div>

      <div style={{ padding: '0 10px' }}>
        <div style={{
          fontSize: '44px',
          fontWeight: '900',
          color: '#f8fafc',
          fontFamily: 'monospace',
          lineHeight: '1',
          letterSpacing: '2px',
          textShadow: '0 2px 10px rgba(0,0,0,0.5)'
        }}>
          {totalHomeMatches} - {totalAwayMatches}
        </div>
        <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px', fontWeight: '600' }}>
          Legs: <span style={{ color: '#cbd5e1' }}>{totalHomeLegs} - {totalAwayLegs}</span>
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '22px', fontWeight: '800', margin: '0 0 6px 0', color: '#fff' }}>
          {matchData.awayTeam || 'BORTALAG'}
        </h2>
        <span style={{ fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Bortalag</span>
      </div>
    </div>

    {/* Progress bar */}
    <div style={{ marginTop: '20px', backgroundColor: '#0f172a', padding: '12px 16px', borderRadius: '12px', border: '1px solid #334155' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '6px', fontWeight: '600' }}>
        <span>Matchförlopp</span>
        <span>{completedMatchesCount} av 10 spelsatser genomförda</span>
      </div>
      <div style={{ height: '8px', backgroundColor: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{ width: `${progressPercent}%`, height: '100%', backgroundColor: '#3b82f6', borderRadius: '4px', transition: 'width 0.4s ease' }} />
      </div>
    </div>
  </div>

  {/* 2. MATCHTABELL (DELMATCHER) */}
  <div style={{
    backgroundColor: '#1e293b',
    borderRadius: '16px',
    border: '1px solid #334155',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    marginBottom: '20px'
  }}>
    <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155', backgroundColor: '#0f172a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#e2e8f0' }}>MATCHÖVERSIKT</h3>
      <span style={{ fontSize: '12px', color: '#64748b' }}>Bäst av 5 legs per delmatch</span>
    </div>

    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
        <thead>
          <tr style={{ color: '#64748b', borderBottom: '1px solid #334155', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
            <th style={{ padding: '12px 16px', width: '38%' }}>{matchData.homeTeam}</th>
            <th style={{ padding: '12px 6px', textAlign: 'center', width: '8%' }}>SET</th>
            <th style={{ padding: '12px 6px', textAlign: 'center', width: '8%' }}>TYP</th>
            <th style={{ padding: '12px 6px', textAlign: 'center', width: '8%' }}>SET</th>
            <th style={{ padding: '12px 16px', textAlign: 'right', width: '38%' }}>{matchData.awayTeam}</th>
          </tr>
        </thead>
        <tbody>
          {matchData.subMatches.map((sm, index) => {
            const isHomeWinner = sm.status === 'completed' && sm.homeScore > sm.awayScore;
            const isAwayWinner = sm.status === 'completed' && sm.awayScore > sm.homeScore;
            const isAD = sm.id === 'AD';
            const isSectionHeader = sm.id === 'S1' || sm.id === 'S4' || sm.id === 'S7';

            let sectionTitle = '';
            if (sm.id === 'S1') sectionTitle = 'BLOCK 1 (Singlar & Dubbel)';
            if (sm.id === 'S4') sectionTitle = 'BLOCK 2 (Singlar & Dubbel)';
            if (sm.id === 'S7') sectionTitle = 'BLOCK 3 (Avgörande matcher)';

            return (
              <React.Fragment key={sm.id}>
                {/* Sektionsavskiljare */}
                {isSectionHeader && (
                  <tr style={{ backgroundColor: '#0f172a' }}>
                    <td colSpan="5" style={{ padding: '8px 16px', fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '0.5px' }}>
                      {sectionTitle}
                    </td>
                  </tr>
                )}

                <tr style={{
                  borderBottom: index === matchData.subMatches.length - 1 ? 'none' : '1px solid #334155',
                  backgroundColor: isAD ? 'rgba(234, 179, 8, 0.05)' : (index % 2 === 0 ? '#1e293b' : '#182232'),
                  borderLeft: isAD ? '4px solid #eab308' : 'none'
                }}>
                  
                  {/* Hemmaspelare */}
                  <td style={{ padding: '12px 16px', fontWeight: isHomeWinner ? '700' : '400', color: isHomeWinner ? '#34d399' : '#cbd5e1' }}>
                    {sm.homePlayer || '-'}
                    {isHomeWinner && <span style={{ marginLeft: '8px', color: '#10b981', fontSize: '12px' }}>✓</span>}
                  </td>

                  {/* Hemma legs */}
                  <td style={{ padding: '12px 6px', textAlign: 'center', fontWeight: '700', fontSize: '15px', color: isHomeWinner ? '#34d399' : '#94a3b8' }}>
                    {sm.status === 'completed' ? sm.homeScore : '-'}
                  </td>

                  {/* Match-ID Badge */}
                  <td style={{ padding: '12px 6px', textAlign: 'center' }}>
                    <span style={{
                      backgroundColor: isAD ? '#eab30820' : '#0f172a',
                      color: isAD ? '#eab308' : '#94a3b8',
                      border: isAD ? '1px solid #eab30860' : '1px solid #334155',
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      {sm.id}
                    </span>
                  </td>

                  {/* Borta legs */}
                  <td style={{ padding: '12px 6px', textAlign: 'center', fontWeight: '700', fontSize: '15px', color: isAwayWinner ? '#34d399' : '#94a3b8' }}>
                    {sm.status === 'completed' ? sm.awayScore : '-'}
                  </td>

                  {/* Bortaspelare */}
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: isAwayWinner ? '700' : '400', color: isAwayWinner ? '#34d399' : '#cbd5e1' }}>
                    {isAwayWinner && <span style={{ marginRight: '8px', color: '#10b981', fontSize: '12px' }}>✓</span>}
                    {sm.awayPlayer || '-'}
                  </td>

                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  </div>

  {/* 3. PRESTATIONER (BADGES / TAGS) */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
    
    {/* Hemma Prestationer */}
    <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '18px' }}>🎯</span>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#60a5fa' }}>
          PRESTATIONER: {matchData.homeTeam}
        </h4>
      </div>

      <div>
        {homePerfGrouped.length > 0 ? (
          homePerfGrouped.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '10px', backgroundColor: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                {item.player}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.items.map((badgeText, bIdx) => {
                  const style = getBadgeStyle(badgeText);
                  return (
                    <span key={bIdx} style={{
                      ...style,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      {badgeText}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic', padding: '10px 0' }}>
            Inga prestationer ännu.
          </div>
        )}
      </div>
    </div>

    {/* Borta Prestationer */}
    <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '16px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #334155', paddingBottom: '10px', marginBottom: '12px' }}>
        <span style={{ fontSize: '18px' }}>🔥</span>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#f43f5e' }}>
          PRESTATIONER: {matchData.awayTeam}
        </h4>
      </div>

      <div>
        {awayPerfGrouped.length > 0 ? (
          awayPerfGrouped.map((item, idx) => (
            <div key={idx} style={{ marginBottom: '10px', backgroundColor: '#0f172a', padding: '10px', borderRadius: '10px', border: '1px solid #334155' }}>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#e2e8f0', marginBottom: '6px' }}>
                {item.player}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {item.items.map((badgeText, bIdx) => {
                  const style = getBadgeStyle(badgeText);
                  return (
                    <span key={bIdx} style={{
                      ...style,
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '800'
                    }}>
                      {badgeText}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <div style={{ color: '#64748b', fontSize: '13px', fontStyle: 'italic', padding: '10px 0' }}>
            Inga prestationer ännu.
          </div>
        )}
      </div>
    </div>

  </div>

  {/* 4. MATCHSTATISTIK KORT */}
  <div style={{ backgroundColor: '#1e293b', borderRadius: '16px', border: '1px solid #334155', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', textAlign: 'center' }}>
    <div>
      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>TOTALT 180:OR</div>
      <div style={{ fontSize: '22px', fontWeight: '900', color: '#f59e0b' }}>🎯 {total180s} st</div>
    </div>
    <div>
      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>SNABBASTE LEG</div>
      <div style={{ fontSize: '22px', fontWeight: '900', color: '#8b5cf6' }}>⚡ {fastestLeg}</div>
    </div>
    <div>
      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', marginBottom: '4px' }}>ORD. MATCHER KVAR</div>
      <div style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8' }}>{Math.max(0, 10 - completedMatchesCount)} st</div>
    </div>
  </div>

</div>


);
}

/* STREAMING_CHUNK:Setting up App main view wrapper... */
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
<div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', paddingBottom: '40px', fontFamily: 'sans-serif' }}>
<nav style={{ backgroundColor: '#1e293b', padding: '12px', display: 'flex', justifyContent: 'center', gap: '12px', borderBottom: '1px solid #334155', position: 'sticky', top: 0, zIndex: 50 }}>
<button onClick={() => setCurrentView('admin')} style={{ backgroundColor: currentView === 'admin' ? '#2563eb' : '#334155', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>1. Admin
<button onClick={() => setCurrentView('referee')} style={{ backgroundColor: currentView === 'referee' ? '#16a34a' : '#334155', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>2. Domare
<button onClick={() => setCurrentView('public')} style={{ backgroundColor: currentView === 'public' ? '#9333ea' : '#334155', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>3. Publik (Livescore & Protokoll)

<main style={{ padding: '16px' }}>
{currentView === 'admin' && }
{currentView === 'referee' && }
{currentView === 'public' && }


);
}
