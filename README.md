# FastFood UNIMI Project

Applicazione full‑stack (Node.js + Express + MongoDB + Next.js) per la gestione di un marketplace di ristoranti / food delivery:
- Registrazione & login utenti
- Onboarding distinto per utente e ristorante
- Gestione ristoranti, menu, pasti, ordini, dashboard manager
- Ricerca, feed pubblico dei ristoranti / categorie
- Caricamento immagini (logo, banner, meal image) con `multer`
- Validazione input (Joi) e middleware di autenticazione / autorizzazione

## Architettura
```
root
├─ api/                # Backend REST (Express + Mongoose)
│  ├─ src/database     # Connessione MongoDB
│  ├─ src/models       # Schemi Mongoose (Utenti, Ristoranti, Menu, Ordini, Meals)
│  ├─ src/routes       # Route suddivise per dominio (auth, user, restaurant, feed, dashboard)
│  ├─ src/middleware   # Auth, validazione, error handler
│  ├─ src/utils        # Upload, enum, integrazioni OpenStreetMap, ecc.
│  └─ src/swagger      # Generazione documentazione
└─ frontend/           # Interfaccia (Next.js 15 + Tailwind + HeroUI)
   ├─ app/             # Routing App Router con segmenti (home, user, restaurant, onboarding, auth)
   ├─ components/      # Componenti UI riusabili
   ├─ contexts/        # Context (Auth, Cart, Manager)
   ├─ services/        # Chiamate API lato client
   └─ utils/           # Helpers vari
```

## Requisiti
- Node.js >= 18
- MongoDB (istanza locale o Atlas)

## Variabili d'Ambiente
Creare un file `.env` in `api/`
```
PORT=7777              # Porta backend (opzionale, default 5000)
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>/<db>
TOKEN_SECRET=una_stringa_lunga_random
```
Facoltativo per il frontend (se necessario per build / chiamate client):
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:7777/api
```

## Installazione
Clona il repository e installa le dipendenze dei due pacchetti.

Backend:
```
cd api
npm install
```
Frontend:
```
cd frontend
npm install
```

## Avviare il progetto
Apri due terminali.

Terminale 1 (backend):
```
cd api
npm start
npm run swagger
```
Il server partirà su `http://localhost:7777` (o porta configurata). Rotta base: `GET /api`.

Terminale 2 (frontend):
```
cd frontend
npm run build
npm start
```
Interfaccia su `http://localhost:3000`.

Swagger (documentazione API):
```
http://localhost:7777/api/swagger
```