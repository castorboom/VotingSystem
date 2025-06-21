

// frontend-ledwall/src/components/Timer.jsx
/**
 * Componente Timer Countdown
 * Mostra tempo rimanente con animazioni
 */
import React from 'react';

const Timer = ({ remainingSeconds, theme }) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  // Calcola percentuale per progress ring
  const totalSeconds = 5 * 60; // assumiamo 5 minuti default
  const percentage = (remainingSeconds / totalSeconds) * 100;
  
  // Colore dinamico basato su tempo rimanente
  const getTimerColor = () => {
    if (remainingSeconds <= 30) return '#EF4444'; // rosso
    if (remainingSeconds <= 60) return '#F59E0B'; // arancione
    return theme?.primaryColor || '#10B981'; // verde
  };
  
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.textColor || '#F3F4F6' }}>
        Tempo Rimanente
      </h3>
      
      <div className="relative w-48 h-48 mx-auto">
        {/* Progress ring */}
        <svg className="transform -rotate-90 w-48 h-48">
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke={theme?.secondaryColor || '#374151'}
            strokeWidth="12"
            fill="none"
            opacity="0.3"
          />
          <circle
            cx="96"
            cy="96"
            r="88"
            stroke={getTimerColor()}
            strokeWidth="12"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 88}`}
            strokeDashoffset={`${2 * Math.PI * 88 * (1 - percentage / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        
        {/* Timer text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span 
            className="text-5xl font-mono font-bold tabular-nums"
            style={{ color: getTimerColor() }}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </span>
        </div>
      </div>
      
      {remainingSeconds <= 30 && remainingSeconds > 0 && (
        <p className="mt-4 text-lg animate-pulse" style={{ color: '#EF4444' }}>
          ⚠️ Ultimi secondi per votare!
        </p>
      )}
    </div>
  );
};
