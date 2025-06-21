// frontend-pwa/src/App.jsx
/**
 * PWA Mobile per votazione MVP
 * Interfaccia ottimizzata per mobile con device fingerprinting
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PlayerList from './components/PlayerList';
import VoteConfirmation from './components/VoteConfirmation';
import Timer from './components/Timer';
import { apiService } from './services/api';
import { socketService } from './services/socket';
import { getDeviceFingerprint } from './services/deviceFingerprint';
import './App.css';

function App() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  
  // Stati principali
  const [session, setSession] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [timer, setTimer] = useState({ remainingSeconds: 0 });
  const [error, setError] = useState(null);
  const [deviceFingerprint, setDeviceFingerprint] = useState(null);
  
  // Inizializzazione
  useEffect(() => {
    initializeApp();
  }, [sessionId]);
  
  const initializeApp = async () => {
    try {
      // Genera device fingerprint
      const fingerprint = await getDeviceFingerprint();
      setDeviceFingerprint(fingerprint);
      
      // Carica sessione
      const sessionData = await apiService.getSession(sessionId);
      setSession(sessionData.session);
      
      // Verifica se ha già votato
      const voteCheck = await apiService.checkVote(sessionId, fingerprint);
      if (voteCheck.hasVoted) {
        setHasVoted(true);
        setSelectedOption(voteCheck.vote.optionId);
      }
      
      // Connetti Socket.io per timer real-time
      socketService.connect();
      socketService.joinSession(sessionId);
      
      // Listeners
      socketService.on('timer-update', (data) => {
        setTimer(data);
      });
      
      socketService.on('session-stopped', () => {
        setSession(prev => ({ ...prev, status: 'completed' }));
      });
      
    } catch (err) {
      console.error('Errore inizializzazione:', err);
      setError('Impossibile caricare la sessione di voto');
    }
  };
  
  // Gestione voto
  const handleVote = async () => {
    if (!selectedOption || hasVoted || isVoting) return;
    
    setIsVoting(true);
    setError(null);
    
    try {
      await apiService.vote({
        sessionId,
        optionId: selectedOption,
        deviceFingerprint
      });
      
      setHasVoted(true);
      
      // Salva in localStorage per persistenza
      localStorage.setItem(`vote_${sessionId}`, JSON.stringify({
        optionId: selectedOption,
        timestamp: new Date().toISOString()
      }));
      
      // Vibrazione di conferma (se supportata)
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }
      
    } catch (err) {
      console.error('Errore durante il voto:', err);
      if (err.response?.status === 409) {
        setError('Hai già votato per questa sessione');
        setHasVoted(true);
      } else {
        setError('Errore durante il voto. Riprova.');
      }
    } finally {
      setIsVoting(false);
    }
  };
  
  // Cleanup
  useEffect(() => {
    return () => {
      socketService.leaveSession(sessionId);
      socketService.disconnect();
    };
  }, [sessionId]);
  
  // Loading
  if (!session || !deviceFingerprint) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento...</p>
        </div>
      </div>
    );
  }
  
  // Errore
  if (error && !hasVoted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Errore</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
            >
              Riprova
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Voto completato
  if (hasVoted) {
    const votedOption = session.options.find(opt => opt.id === selectedOption);
    return <VoteConfirmation option={votedOption} session={session} />;
  }
  
  // Sessione non attiva
  if (session.status !== 'active') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">
            {session.status === 'completed' ? '🏁' : '⏸️'}
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {session.status === 'completed' ? 'Votazione Terminata' : 'Votazione Non Attiva'}
          </h2>
          <p className="text-gray-600">
            {session.status === 'completed' 
              ? 'La sessione di voto è terminata.'
              : 'La sessione di voto non è ancora iniziata.'}
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-800">{session.title}</h1>
          <p className="text-sm text-gray-600">{session.question}</p>
        </div>
      </header>
      
      {/* Timer */}
      {timer.remainingSeconds > 0 && (
        <div className="bg-blue-50 border-b border-blue-200">
          <Timer remainingSeconds={timer.remainingSeconds} compact />
        </div>
      )}
      
      {/* Lista giocatori */}
      <main className="container mx-auto px-4 py-6 pb-24">
        <PlayerList 
          options={session.options}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          disabled={isVoting}
        />
      </main>
      
      {/* Pulsante vota fisso */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
        <button
          onClick={handleVote}
          disabled={!selectedOption || isVoting}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all
            ${selectedOption && !isVoting
              ? 'bg-blue-600 text-white shadow-lg transform hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {isVoting ? (
            <span className="flex items-center justify-center">
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></span>
              Invio voto...
            </span>
          ) : (
            selectedOption ? 'Conferma Voto' : 'Seleziona un\'opzione'
          )}
        </button>
      </div>
    </div>
  );
}

