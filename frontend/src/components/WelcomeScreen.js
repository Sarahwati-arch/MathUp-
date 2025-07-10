import React, { useEffect, useState } from 'react';
import mountainBackground from './mountain.png'; // ✅ pastikan path sesuai

const WelcomeScreen = ({ onStart }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 100); // ⏳ delay agar animasi smooth
  }, []);

  return (
    <div style={styles.container}>
      {/* Blur background image layer */}
      <div
        style={{
          ...styles.background,
          backgroundImage: `url(${mountainBackground})`,
        }}
      />

      {/* Overlay content */}
      <div style={{ 
        ...styles.overlay,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <h1 style={styles.title}>
          Welcome to <span style={styles.highlight}>MathClimber</span>!
        </h1>
        <p style={styles.subtitle}>Test your math skills and climb the levels!</p>
        <button
          style={styles.button}
          onClick={onStart}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#246b46'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#2E8B57'}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontFamily: '"Segoe UI", sans-serif',
  },
  background: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(5px) brightness(0.9)', // ✅ blur & darken
    zIndex: 1,
  },
  overlay: {
    position: 'relative',
    zIndex: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
    maxWidth: '600px',
    width: '90%',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '10px',
    fontWeight: 'bold',
    color: '#333',
  },
  highlight: {
    color: '#2E8B57',
  },
  subtitle: {
    fontSize: '1.3rem',
    marginBottom: '30px',
    color: '#555',
  },
  button: {
    fontSize: '1.2rem',
    padding: '12px 24px',
    cursor: 'pointer',
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    transition: 'background-color 0.3s',
  },
};

export default WelcomeScreen;
