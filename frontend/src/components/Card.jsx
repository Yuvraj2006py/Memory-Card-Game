import React from 'react';

/**
 * Card component responsible for rendering individual cards in the memory game.
 *
 * Props:
 * - card: { id: number, value: string }
 * - isFlipped: boolean indicating whether the card is currently face up
 * - isMatched: boolean indicating whether the card has been matched already
 * - onClick: function to call when the card is clicked
 */
function Card({ card, isFlipped, isMatched, onClick }) {
  const handleClick = () => {
    if (!isFlipped && !isMatched) {
      onClick(card);
    }
  };

  // Apply different Tailwind classes based on whether the card is flipped/matched
  const bgClass = isFlipped || isMatched ? 'bg-white' : 'bg-blue-500';
  const textClass = isFlipped || isMatched ? 'text-gray-800' : 'text-transparent';

  return (
    <button
      onClick={handleClick}
      className={`w-16 h-20 sm:w-20 sm:h-24 m-1 sm:m-2 flex items-center justify-center text-3xl sm:text-4xl rounded-lg shadow-md transform transition-transform duration-500 ${bgClass} ${
        isFlipped || isMatched ? '' : 'hover:scale-105'
      }`}
      aria-label={isFlipped || isMatched ? `Card showing ${card.value}` : 'Face down card'}
    >
      <span className={`${textClass}`}>{card.value}</span>
    </button>
  );
}

export default Card;