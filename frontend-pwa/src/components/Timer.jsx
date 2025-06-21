// frontend-pwa/src/components/Timer.jsx (versione mobile compatta)
import React from 'react';

const Timer = ({ remainingSeconds, compact = false }) => {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  const getTimerColor = () => {
    if (remainingSeconds <= 30) return 'text-red-600';
    if (remainingSeconds <= 60) return 'text-orange-600';
    return 'text-blue-600';
  };
  
  if (compact) {
    return (
      <div className="flex items-center justify-center py-2">
        <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className={`font-mono font-bold text-lg ${getTimerColor()}`}>
          {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
        </span>
        {remainingSeconds <= 30 && (
          <span className="ml-2 text-sm text-red-600 animate-pulse">
            Affrettati!
          </span>
        )}
      </div>
    );
  }
  
  return (
    <div className="text-center py-4">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Tempo Rimanente
      </h3>
      <div className={`text-4xl font-mono font-bold ${getTimerColor()}`}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
    </div>
  );
};

export default App;