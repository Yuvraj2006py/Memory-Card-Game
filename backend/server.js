const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS so the React frontend can make requests to this server
app.use(cors());

// Parse JSON bodies (not strictly needed here but useful for extension)
app.use(express.json());

// In‑memory mapping from card ID to its emoji value.  This gets reset every
// time a new deck is generated via the `/game` endpoint.
let cardMap = {};

/**
 * Generate a new shuffled deck of cards.  Each emoji appears exactly twice.
 * The returned deck is an array of objects of the form { id, value }.
 */
function generateDeck() {
  const emojis = ['🐱', '🐶', '🐼', '🦊', '🦁', '🐸'];
  let deck = [];
  let id = 0;
  emojis.forEach((emoji) => {
    deck.push({ id: id++, value: emoji });
    deck.push({ id: id++, value: emoji });
  });
  // Shuffle the deck using Fisher‑Yates algorithm
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  // Update the cardMap
  cardMap = {};
  deck.forEach((card) => {
    cardMap[card.id] = card.value;
  });
  return deck;
}

/**
 * GET /game
 *
 * Returns a freshly shuffled deck of cards.  Each call generates a new deck
 * and resets the cardMap used by the `/check` endpoint.  The response has
 * the shape `{ deck: [...] }`.
 */
app.get('/game', (req, res) => {
  const deck = generateDeck();
  res.json({ deck });
});

/**
 * GET /check
 *
 * Checks whether two card IDs correspond to a matching pair.  The client
 * supplies `id1` and `id2` via query parameters.  The endpoint returns
 * `{ match: true }` if the two cards match and `{ match: false }` otherwise.
 */
app.get('/check', (req, res) => {
  const { id1, id2 } = req.query;
  if (typeof id1 === 'undefined' || typeof id2 === 'undefined') {
    return res.status(400).json({ error: 'Missing id1 or id2 query parameters' });
  }
  // Convert to integers just in case
  const idA = parseInt(id1, 10);
  const idB = parseInt(id2, 10);
  const valueA = cardMap[idA];
  const valueB = cardMap[idB];
  const match = Boolean(valueA && valueB && valueA === valueB);
  return res.json({ match });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Memory Flip Game backend listening on port ${PORT}`);
});