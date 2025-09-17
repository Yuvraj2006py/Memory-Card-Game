# Memory Flip Game

## Overview

This project is a simple memory card matching game built to demonstrate full‑stack skills using a **Node.js + Express** backend and a **React (Vite) + TailwindCSS** frontend.  The backend serves a shuffled deck of emoji cards and provides an endpoint to check whether two cards match.  The frontend consumes these endpoints, renders an interactive card‑flipping game, and keeps track of the player's moves.

## Project structure

```
memory-game/
├── backend/        # Express server
│   ├── package.json
│   └── server.js
├── frontend/       # React app (Vite + Tailwind)
│   ├── package.json
│   ├── index.html
│   ├── postcss.config.cjs
│   ├── tailwind.config.cjs
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       └── components/
│           └── Card.jsx
└── README.md       # Project documentation (this file)
```

### API routes

- `GET /game` – Generates a shuffled deck of 12 cards (six emoji pairs) and returns it as JSON.  Each emoji appears exactly twice in the deck.
- `GET /check` – Accepts two query parameters (`id1` and `id2`) and returns whether those card identifiers represent a matching pair.  The backend does not maintain persistent game state beyond the latest generated deck.

### Frontend

The React application fetches the deck from `/game` on load and renders the cards face down.  When a user flips two cards, it calls `/check` with the selected card identifiers.  If the cards match, they remain face up; otherwise they flip back after a short delay.  The app tracks the number of moves, displays a congratulatory message when all pairs are matched, and provides a "Restart Game" button to reset the state.

## Prerequisites

- [Node.js](https://nodejs.org/) (version 16 or higher recommended)
- npm (comes bundled with Node.js)

## Setup and run

### Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

   By default, the server listens on port `3001`.  Feel free to adjust the port by setting the `PORT` environment variable.

### Frontend

1. Open a new terminal and navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Run the development server:

   ```bash
   npm run dev
   ```

   The Vite development server will start on port `5173` by default.  API requests beginning with `/game` or `/check` are automatically proxied to the backend server via the configuration in `vite.config.js`.

## How it works

1. When the React app loads, it sends a request to the backend's `/game` endpoint to receive a fresh shuffled deck.  Each card object contains a unique `id` and an `emoji` value.  The backend also stores a mapping of these identifiers to their emoji values so it can validate matches.
2. The cards are displayed face down in a grid.  When a player clicks two cards, the frontend calls the backend's `/check` endpoint with the two card identifiers.  The backend responds with a boolean indicating whether the two cards form a matching pair.
3. If the cards match, they remain face up; otherwise they flip back after a short delay.  The game counts moves and displays a winning message once all pairs have been matched.  A "Restart Game" button allows players to fetch a new deck and play again.

Enjoy the game!