
// frontend-pwa/src/components/PlayerList.jsx
/**
 * Lista giocatori/opzioni votabili
 * Con immagini e selezione singola
 */
import React from 'react';

const PlayerList = ({ options, selectedOption, onSelect, disabled }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => !disabled && onSelect(option.id)}
          disabled={disabled}
          className={`relative bg-white rounded-2xl shadow-md overflow-hidden transition-all
            ${selectedOption === option.id 
              ? 'ring-4 ring-blue-500 transform scale-105' 
              : 'hover:shadow-lg hover:scale-102'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {/* Immagine */}
          {option.image && (
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img 
                src={option.image} 
                alt={option.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          )}
          
          {/* Nome */}
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {option.name}
            </h3>
          </div>
          
          {/* Indicatore selezione */}
          {selectedOption === option.id && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
