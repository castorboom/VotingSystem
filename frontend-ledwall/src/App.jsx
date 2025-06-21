// frontend-ledwall/src/App.jsx
/**
 * LED Wall App - Visualizzazione risultati voting in tempo reale
 * Mostra grafico a barre animato, timer countdown e QR code
 */
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import BarChart from './components/BarChart';
import Timer from './components/Timer';
import QRCodeDisplay from './components/QRCodeDisplay';
import { socketService } from './services/socket';
import './App.css';

function App() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session');
  
  // Stati principali
  const [session, setSession] = useState(null);
  const [votes, setVotes] = useState({});
  const [totalVotes, setTotalVotes] = useState(0);
  const [timer, setTimer] = useState({ remainingSeconds: 0, endTime: null });
  const [theme, setTheme] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!sessionId) {
      setError('ID sessione mancante. Aggiungi ?session=ID_SESSIONE all\'URL');
      return;
    }
    
    // Connetti a Socket.io
    socketService.connect();
    
    // Join sessione
    socketService.joinSession(sessionId);
    
    // Listeners Socket.io
    socketService.on('connect', () => {
      setIsConnected(true);
      setError(null);
    });
    
    socketService.on('disconnect', () => {
      setIsConnected(false);
    });
    
    socketService.on('session-state', (data) => {
      setSession(data.session);
      setVotes(data.votes);
      setTotalVotes(data.totalVotes);
      setTheme(data.session.theme);
    });
    
    socketService.on('votes-updated', (data) => {
      setVotes(data.votes);
      setTotalVotes(data.totalVotes);
    });
    
    socketService.on('timer-update', (data) => {
      setTimer(data);
    });
    
    socketService.on('session-started', (data) => {
      setSession(prev => ({ ...prev, status: 'active' }));
    });
    
    socketService.on('session-stopped', (data) => {
      setSession(prev => ({ ...prev, status: 'completed' }));
      setTimer({ remainingSeconds: 0, endTime: null });
    });
    
    socketService.on('theme-updated', (newTheme) => {
      setTheme(newTheme);
    });
    
    socketService.on('error', (data) => {
      setError(data.message);
    });
    
    // Cleanup
    return () => {
      socketService.leaveSession(sessionId);
      socketService.disconnect();
    };
  }, [sessionId]);
  
  // Applica tema dinamico
  useEffect(() => {
    if (theme) {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', theme.primaryColor);
      root.style.setProperty('--secondary-color', theme.secondaryColor);
      root.style.setProperty('--background-color', theme.backgroundColor);
      root.style.setProperty('--text-color', theme.textColor);
    }
  }, [theme]);
  
  // Prepara dati per grafico
  const chartData = session?.options?.map(option => ({
    id: option.id,
    name: option.name,
    votes: votes[option.id] || 0,
    percentage: totalVotes > 0 ? ((votes[option.id] || 0) / totalVotes * 100).toFixed(1) : 0
  })) || [];
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center p-8 bg-red-900/20 rounded-lg border border-red-500">
          <h1 className="text-3xl font-bold text-red-500 mb-4">Errore</h1>
          <p className="text-white text-xl">{error}</p>
        </div>
      </div>
    );
  }
  
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl">Caricamento sessione...</p>
          {!isConnected && (
            <p className="text-yellow-500 mt-2">Connessione in corso...</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="led-wall-container min-h-screen p-8" style={{ backgroundColor: theme?.backgroundColor || '#1F2937' }}>
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-4" style={{ color: theme?.primaryColor || '#DC2626' }}>
          {session.title}
        </h1>
        <h2 className="text-3xl" style={{ color: theme?.textColor || '#F3F4F6' }}>
          {session.question}
        </h2>
        
        {/* Stato connessione */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
          <span className="text-sm" style={{ color: theme?.textColor || '#F3F4F6' }}>
            {isConnected ? 'Connesso' : 'Disconnesso'} • {totalVotes} voti totali
          </span>
        </div>
      </header>
      
      {/* Layout principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Grafico a barre - 2/3 dello spazio */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <BarChart 
              data={chartData} 
              theme={theme}
              isActive={session.status === 'active'}
            />
          </div>
        </div>
        
        {/* Sidebar - 1/3 dello spazio */}
        <div className="space-y-6">
          {/* Timer */}
          {session.status === 'active' && (
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
              <Timer 
                remainingSeconds={timer.remainingSeconds}
                theme={theme}
              />
            </div>
          )}
          
          {/* QR Code */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl">
            <QRCodeDisplay 
              url={session.votingUrl}
              theme={theme}
              sessionActive={session.status === 'active'}
            />
          </div>
          
          {/* Stato sessione */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 shadow-2xl text-center">
            <h3 className="text-xl font-bold mb-2" style={{ color: theme?.textColor || '#F3F4F6' }}>
              Stato Sessione
            </h3>
            <div className={`inline-flex items-center px-4 py-2 rounded-full text-lg font-semibold
              ${session.status === 'active' ? 'bg-green-500 text-white' : 
                session.status === 'completed' ? 'bg-gray-500 text-white' : 
                'bg-yellow-500 text-gray-900'}`}>
              {session.status === 'active' ? '🟢 In Corso' :
               session.status === 'completed' ? '⏹️ Terminata' :
               '⏸️ In Attesa'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


