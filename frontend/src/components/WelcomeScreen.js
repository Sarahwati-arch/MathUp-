import React from 'react';

const WelcomeScreen = ({ onStart }) => {
  return (
    <div style={styles.container}>
      <h1>Welcome to MathClimber!</h1>
      <p>Test your math skills and climb the levels!</p>
      <button style={styles.button} onClick={onStart}>
        Start Quiz
      </button>
    </div>
  );
};

const styles = {
  container: { textAlign: 'center', marginTop: '20%' },
  button: { fontSize: '1.2rem', padding: '12px 24px', cursor: 'pointer' },
};

export default WelcomeScreen;
