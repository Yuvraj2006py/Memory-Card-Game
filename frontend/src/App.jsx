import React, { useState, useEffect } from 'react';
import Card from './components/Card';

function App() {
  // The deck of cards fetched from the backend
  const [deck, setDeck] = useState([]);
  // Currently flipped cards (max two at a time)
  const [flipped, setFlipped] = useState([]);
  // Set of matched card IDs
  const [matched, setMatched] = useState(new Set());
  // Number of moves taken by the player
  const [moves, setMoves] = useState(0);
  // Winning message when all pairs are matched
  const [message, setMessage] = useState('');
  // Disable interactions while checking a match
  const [disabled, setDisabled] = useState(false);

  // Fetch a new shuffled deck from the backend
  const fetchDeck = async () => {
    setMessage('');
    setMoves(0);
    setFlipped([]);
    setMatched(new Set());
    try {
      const response = await fetch('/game');
      const data = await response.json();
      setDeck(data.deck);
    } catch (err) {
      console.error('Failed to fetch deck', err);
    }
  };

  // Fetch the deck on initial render
  useEffect(() => {
    fetchDeck();
  }, []);

  // Handle when a card is clicked
  const handleCardClick = async (card) => {
    if (disabled) return;
    if (matched.has(card.id)) return;
    // Prevent flipping the same card twice
    if (flipped.length === 1 && flipped[0].id === card.id) return;
    if (flipped.length === 0) {
      setFlipped([card]);
    } else if (flipped.length === 1) {
      const newFlipped = [flipped[0], card];
      setFlipped(newFlipped);
      setDisabled(true);
      try {
        // Ask the backend whether the two selected cards match
        const response = await fetch(`/check?id1=${newFlipped[0].id}&id2=${newFlipped[1].id}`);
        const data = await response.json();
        if (data.match) {
          // Add both card IDs to the set of matched cards
          setMatched((prev) => new Set(prev).add(newFlipped[0].id).add(newFlipped[1].id));
          setFlipped([]);
          setDisabled(false);
        } else {
          // Wait briefly before flipping the cards back over
          setTimeout(() => {
            setFlipped([]);
            setDisabled(false);
          }, 800);
        }
        // Increment move counter
        setMoves((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to check match', err);
        // Reset flipped cards if an error occurs
        setFlipped([]);
        setDisabled(false);
      }
    }
  };

  // When all cards are matched, display a winning message
  useEffect(() => {
    if (deck.length > 0 && matched.size === deck.length) {
      setMessage(`Congratulations! You won in ${moves} moves.`);
    }
  }, [deck, matched, moves]);

  return (
    <div className="min-h-screen flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">Memory Flip Game</h1>
      <div
        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 mb-4"
        aria-label="Card grid"
      >
        {deck.map((card) => (
          <Card
            key={card.id}
            card={card}
            isFlipped={flipped.some((c) => c.id === card.id)}
            isMatched={matched.has(card.id)}
            onClick={handleCardClick}
          />
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <button
          onClick={fetchDeck}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md shadow-md"
        >
          Restart Game
        </button>
        <div className="text-lg text-gray-700">Moves: {moves}</div>
      </div>
      {message && (
        <div className="mt-4 text-xl font-semibold text-purple-700" role="alert">
          {message}
        </div>
      )}
    </div>
  );
}

export default App;