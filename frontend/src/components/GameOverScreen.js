import React, { useEffect, useState } from 'react';
import mountain from './mountain.png'; // pastikan path ini sesuai dengan lokasi file kamu

function GameOverScreen({ finalScore, highestLevel, onRestart }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ ...styles.container, opacity: visible ? 1 : 0 }}>
      <div style={styles.overlay}>
        <h2 style={styles.heading}>🏁 Game Over!</h2>
        <p style={styles.text}>Your final score: <strong>{finalScore}</strong></p>
        <p style={styles.text}>Highest level reached: <strong>{highestLevel}</strong></p>
        <button style={styles.button} onClick={onRestart}>Play Again</button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    padding: '40px',
    height: '100vh',
    backgroundImage: `url(${mountain})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'opacity 1s ease-in-out',
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: '16px',
    padding: '40px',
    maxWidth: '500px',
    width: '90%',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
  },
  heading: {
    fontSize: '2rem',
    marginBottom: '20px',
    color: '#333',
  },
  text: {
    fontSize: '1.2rem',
    marginBottom: '12px',
    color: '#444',
  },
  button: {
    fontSize: '1.2rem',
    padding: '12px 24px',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s ease',
  },
};

export default GameOverScreen;
