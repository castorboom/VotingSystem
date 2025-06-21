// frontend-pwa/src/services/deviceFingerprint.js
/**
 * Servizio Device Fingerprinting
 * Genera identificativo univoco per dispositivo
 */
import FingerprintJS from '@fingerprintjs/fingerprintjs';

/**
 * Genera fingerprint dispositivo
 * Combina vari parametri per identificare univocamente il device
 */
export async function getDeviceFingerprint() {
  try {
    // Usa FingerprintJS per fingerprint avanzato
    const fp = await FingerprintJS.load();
    const result = await fp.get();
    
    // Combina con dati aggiuntivi per maggiore unicità
    const additionalData = {
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      colorDepth: window.screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack,
      // Canvas fingerprint è già incluso in FingerprintJS
    };
    
    // Genera hash combinato
    const combinedString = result.visitorId + JSON.stringify(additionalData);
    const fingerprint = await hashString(combinedString);
    
    // Salva in localStorage per consistenza
    localStorage.setItem('deviceFingerprint', fingerprint);
    
    return fingerprint;
  } catch (error) {
    console.error('Errore generazione fingerprint:', error);
    
    // Fallback: usa metodo semplice
    return generateSimpleFingerprint();
  }
}

/**
 * Genera fingerprint semplice come fallback
 */
function generateSimpleFingerprint() {
  // Controlla se esiste già
  const existing = localStorage.getItem('deviceFingerprint');
  if (existing) return existing;
  
  // Genera nuovo fingerprint basico
  const fingerprint = [
    navigator.userAgent,
    navigator.language,
    window.screen.width,
    window.screen.height,
    window.screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform,
  ].join('|');
  
  // Hash del fingerprint
  const hashed = btoa(fingerprint).replace(/[^a-zA-Z0-9]/g, '').substring(0, 32);
  
  // Salva per usi futuri
  localStorage.setItem('deviceFingerprint', hashed);
  
  return hashed;
}

/**
 * Hash string usando Web Crypto API
 */
async function hashString(str) {
  const msgUint8 = new TextEncoder().encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex.substring(0, 32); // Usa primi 32 caratteri
}
