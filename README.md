# 🗳️ Voting Platform MVP

Piattaforma di voto real-time per elezione MVP con visualizzazione su LED Wall e votazione via mobile PWA.

## 🚀 Caratteristiche

- **LED Wall Display**: Visualizzazione real-time dei risultati con grafici animati
- **PWA Mobile**: App di voto ottimizzata per smartphone con device fingerprinting
- **Real-time Updates**: Aggiornamenti istantanei tramite WebSocket
- **Anti-frode**: Sistema di prevenzione voti multipli per dispositivo
- **Admin Dashboard**: Gestione completa sessioni di voto
- **Temi Personalizzabili**: Colori e stili configurabili per ogni sessione

## 🛠️ Tech Stack

- **Frontend**: React (LED Wall), Next.js (PWA)
- **Backend**: Node.js, Express, Socket.io
- **Database**: Firebase Firestore / MariaDB
- **Real-time**: Socket.io
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Auth**: JWT

## 📋 Prerequisiti

- Node.js 18+
- npm o yarn
- Account Firebase (per Firestore) o MariaDB
- (Opzionale) Docker e Docker Compose

## 🔧 Installazione

### 1. Clona il repository
\`\`\`bash
git clone https://github.com/tuousername/voting-platform.git
cd voting-platform
\`\`\`

### 2. Configura variabili ambiente

Backend:
\`\`\`bash
cd backend
cp .env.example .env
# Modifica .env con le tue credenziali
\`\`\`

### 3. Installa dipendenze

\`\`\`bash
# Backend
cd backend
npm install

# Frontend LED Wall
cd ../frontend-ledwall
npm install

# Frontend PWA
cd ../frontend-pwa
npm install
\`\`\`

### 4. Setup Database

#### Opzione A: Firebase Firestore
1. Crea progetto Firebase
2. Genera service account key
3. Copia credenziali in .env

#### Opzione B: MariaDB
1. Installa MariaDB
2. Crea database: \`CREATE DATABASE voting_platform;\`
3. Esegui migrations (se usi Prisma)

### 5. Seed Admin iniziale

\`\`\`bash
cd backend
npm run seed
\`\`\`

## 🚀 Avvio Sviluppo

### Manuale (3 terminali)
\`\`\`bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - LED Wall
cd frontend-ledwall
npm start

# Terminal 3 - PWA
cd frontend-pwa
npm run dev
\`\`\`

### Con Docker Compose
\`\`\`bash
docker-compose up -d
\`\`\`

## 📱 Utilizzo

### Admin
1. Accedi a http://localhost:3001/admin
2. Login con credenziali admin
3. Crea nuova sessione di voto
4. Avvia sessione quando pronto

### LED Wall
1. Apri http://localhost:3000?session=ID_SESSIONE
2. Proietta su schermo grande
3. I risultati si aggiornano in real-time

### Mobile (Votanti)
1. Scansiona QR code dal LED Wall
2. O vai a http://localhost:3002/vote/ID_SESSIONE
3. Seleziona opzione e vota
4. Un solo voto per dispositivo

## 🧪 Testing

\`\`\`bash
# Backend
cd backend
npm test

# Frontend
cd frontend-ledwall
npm test
\`\`\`

## 📦 Deploy Produzione

### Vercel (Frontend)
\`\`\`bash
# LED Wall
cd frontend-ledwall
vercel

# PWA
cd frontend-pwa
vercel
\`\`\`

### VPS (Backend)
\`\`\`bash
# Build e upload
npm run build
scp -r ./backend user@server:/path/to/app

# Su server
pm2 start server.js --name voting-backend
\`\`\`

## 🔒 Sicurezza

- JWT per autenticazione admin
- Rate limiting su API
- Device fingerprinting anti-frode
- HTTPS in produzione obbligatorio
- Validazione input rigorosa
- CORS configurato

## 📊 Performance

- Supporta fino a 350 connessioni simultanee
- Ottimizzazione immagini automatica
- Lazy loading componenti
- WebSocket per ridurre latenza
- Caching strategico

## 🐛 Troubleshooting

### "Cannot connect to Socket.io"
- Verifica URL backend in variabili ambiente
- Controlla CORS settings
- Firewall potrebbe bloccare WebSocket

### "Voto già registrato"
- Device fingerprint salvato in localStorage
- Pulisci localStorage per reset

### "Sessione non trovata"
- Verifica ID sessione nell'URL
- Controlla che sessione sia attiva

## 📝 API Endpoints

### Auth
- POST `/api/auth/login` - Login admin
- GET `/api/auth/verify` - Verifica token

### Sessions
- GET `/api/sessions` - Lista sessioni
- POST `/api/sessions` - Crea sessione
- GET `/api/sessions/:id` - Dettaglio sessione
- POST `/api/sessions/:id/start` - Avvia votazione
- POST `/api/sessions/:id/stop` - Ferma votazione

### Votes
- POST `/api/votes` - Registra voto
- GET `/api/votes/check` - Verifica se ha votato
- GET `/api/votes/stats/:sessionId` - Statistiche

## 🤝 Contributi

1. Fork il progetto
2. Crea feature branch (\`git checkout -b feature/AmazingFeature\`)
3. Commit modifiche (\`git commit -m 'Add AmazingFeature'\`)
4. Push al branch (\`git push origin feature/AmazingFeature\`)
5. Apri Pull Request

## 📄 Licenza

Distribuito sotto licenza MIT. Vedi \`LICENSE\` per info.

## 👥 Contatti

Email: team@esempio.com
Progetto: https://github.com/tuousername/voting-platform
\`\`\`

## Script di Seed Admin (backend/scripts/seed.js)
```javascript
/**
 * Script per creare admin iniziale
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

// Inizializza Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  })
});

const db = admin.firestore();

async function seedAdmin() {
  try {
    const email = process.env.ADMIN_EMAIL || 'admin@esempio.com';
    const password = process.env.ADMIN_PASSWORD || 'changeme123';
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crea admin
    await db.collection('admins').doc('default-admin').set({
      email,
      password: hashedPassword,
      name: 'Admin',
      role: 'admin',
      createdAt: new Date()
    });
    
    console.log('✅ Admin creato con successo');
    console.log(`📧 Email: ${email}`);
    console.log(`🔑 Password: ${password}`);
    console.log('⚠️  IMPORTANTE: Cambia la password al primo accesso!');
    
  } catch (error) {
    console.error('❌ Errore creazione admin:', error);
  } finally {
    process.exit(0);
  }
}

seedAdmin();