/**
 * Servizio Socket.io Client
 * Gestisce connessione real-time con backend
 */
import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }
  
  /**
   * Connetti al server Socket.io
   */
  connect() {
    if (this.socket?.connected) return;
    
    const serverUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    
    this.socket = io(serverUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
    
    // Gestione eventi connessione
    this.socket.on('connect', () => {
      console.log('✅ Socket connesso:', this.socket.id);
      this.connected = true;
    });
    
    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnesso:', reason);
      this.connected = false;
    });
    
    this.socket.on('connect_error', (error) => {
      console.error('Errore connessione:', error.message);
    });
  }
  
  /**
   * Disconnetti
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }
  
  /**
   * Join sessione
   */
  joinSession(sessionId) {
    if (!this.socket) {
      console.error('Socket non connesso');
      return;
    }
    this.socket.emit('join-session', sessionId);
  }
  
  /**
   * Leave sessione
   */
  leaveSession(sessionId) {
    if (!this.socket) return;
    this.socket.emit('leave-session', sessionId);
  }
  
  /**
   * Listener eventi
   */
  on(event, callback) {
    if (!this.socket) {
      console.error('Socket non connesso');
      return;
    }
    this.socket.on(event, callback);
  }
  
  /**
   * Rimuovi listener
   */
  off(event, callback) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }
  
  /**
   * Emit evento
   */
  emit(event, data) {
    if (!this.socket) {
      console.error('Socket non connesso');
      return;
    }
    this.socket.emit(event, data);
  }
}

// Singleton
export const socketService = new SocketService();