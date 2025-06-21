
// frontend-pwa/src/components/VoteConfirmation.jsx
/**
 * Schermata conferma voto
 * Mostra successo e previene voti multipli
 */
import React from 'react';

const VoteConfirmation = ({ option, session }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-green-100 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Animazione successo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <svg className="w-12 h-12 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Voto Registrato!
          </h2>
          
          <p className="text-gray-600 mb-6">
            Grazie per aver partecipato alla votazione
          </p>
          
          {/* Riepilogo voto */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-500 mb-1">Hai votato per:</p>
            <p className="text-xl font-semibold text-gray-800">{option?.name}</p>
          </div>
          
          {/* Info sessione */}
          <div className="text-sm text-gray-500">
            <p>{session.title}</p>
            <p className="mt-1">ID Sessione: {session.id.slice(0, 8)}</p>
          </div>
        </div>
        
        {/* Nota anti-frode */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-400 text-center">
            🔒 Il tuo voto è stato registrato in modo sicuro. 
            Non è possibile votare nuovamente da questo dispositivo.
          </p>
        </div>
      </div>
    </div>
  );
};
