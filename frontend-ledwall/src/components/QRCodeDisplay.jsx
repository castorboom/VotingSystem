// frontend-ledwall/src/components/QRCodeDisplay.jsx
/**
 * Componente QR Code
 * Mostra QR code per accesso rapido al voto
 */
import React from 'react';
import QRCode from 'react-qr-code';

const QRCodeDisplay = ({ url, theme, sessionActive }) => {
  return (
    <div className="text-center">
      <h3 className="text-2xl font-bold mb-4" style={{ color: theme?.textColor || '#F3F4F6' }}>
        Scansiona per Votare
      </h3>
      
      <div className="bg-white p-4 rounded-xl inline-block">
        <QRCode 
          value={url} 
          size={200}
          level="H"
          fgColor={sessionActive ? '#000000' : '#9CA3AF'}
        />
      </div>
      
      <p className="mt-4 text-sm" style={{ color: theme?.textColor || '#9CA3AF' }}>
        {sessionActive ? '📱 Inquadra con la fotocamera' : '⏸️ Votazione non attiva'}
      </p>
      
      {/* URL per debug/test */}
      {process.env.NODE_ENV === 'development' && (
        <p className="mt-2 text-xs opacity-50 break-all" style={{ color: theme?.textColor || '#9CA3AF' }}>
          {url}
        </p>
      )}
    </div>
  );
};

export default App;