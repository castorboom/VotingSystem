// backend/server.js
/**
 * Server principale con supporto WebSocket
 * Gestisce connessioni HTTP e Socket.io
 */
const http = require('http');
const app = require('./src/app');
const socketService = require('./src/services/socket.service');
const { PORT } = process.env;

// Crea server HTTP
const server = http.createServer(app);

// Inizializza Socket.io
socketService.initialize(server);

// Avvia server
server.listen(PORT || 3001, () => {
  console.log(`🚀 Server avviato su porta ${PORT || 3001}`);
  console.log(`📡 WebSocket pronto per connessioni real-time`);
});

// Gestione graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM ricevuto, chiusura server...');
  server.close(() => {
    console.log('Server chiuso correttamente');
    process.exit(0);
  });
});

