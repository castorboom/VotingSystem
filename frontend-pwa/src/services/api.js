// frontend-pwa/src/services/api.js
/**
 * Servizio API per comunicazione REST con backend
 */
class ApiService {
  constructor() {
    this.baseURL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
    this.headers = {
      'Content-Type': 'application/json',
    };
  }
  
  /**
   * Metodo generico per richieste HTTP
   */
  async request(url, options = {}) {
    try {
      const response = await fetch(`${this.baseURL}${url}`, {
        headers: this.headers,
        ...options,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Errore nella richiesta');
      }
      
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
  
  /**
   * Recupera dettagli sessione
   */
  async getSession(sessionId) {
    return this.request(`/api/sessions/${sessionId}`);
  }
  
  /**
   * Registra voto
   */
  async vote(voteData) {
    return this.request('/api/votes', {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  }
  
  /**
   * Verifica se dispositivo ha già votato
   */
  async checkVote(sessionId, deviceFingerprint) {
    const params = new URLSearchParams({
      sessionId,
      deviceFingerprint,
    });
    return this.request(`/api/votes/check?${params}`);
  }
  
  /**
   * Recupera statistiche voti
   */
  async getVoteStats(sessionId) {
    return this.request(`/api/votes/stats/${sessionId}`);
  }
}

// Singleton
export const apiService = new ApiService();