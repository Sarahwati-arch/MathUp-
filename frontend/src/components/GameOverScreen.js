import React from 'react';

function GameOverScreen({ finalScore, highestLevel, onRestart }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h2>Game Over!</h2>
      <p>Your final score: <strong>{finalScore}</strong></p>
      <p>Highest level reached: <strong>{highestLevel}</strong></p>
      <button onClick={onRestart}>Play Again</button>
    </div>
  );
}

export default GameOverScreen;
