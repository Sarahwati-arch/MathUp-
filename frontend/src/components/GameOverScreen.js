import React from 'react';

function GameOverScreen({ finalScore, highestLevel, onRestart }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <h1>Game Over!</h1>
      <p>Final Score: {finalScore}</p>
      <p>Highest Level Reached: {highestLevel}</p>
      <button onClick={onRestart}>Play Again</button>
    </div>
  );
}

export default GameOverScreen;
