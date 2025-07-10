import React, { useEffect, useState } from 'react';
import mountainBackground from './mountain.png'; // pastikan path benar

const levelNames = {
  1: "pre-k", 2: "kg", 3: "grade-1", 4: "grade-2", 5: "grade-3",
  6: "grade-4", 7: "grade-5", 8: "grade-6", 9: "grade-7",
  10: "grade-8", 11: "grade-9", 12: "grade-10", 13: "grade-11",
  14: "grade-12", 15: "college",
};

const QuizScreen = ({ level, questionIndex, onAnswer, onGameOver, initialQuestion }) => {
  const [questionData, setQuestionData] = useState(initialQuestion || null);
  const [userAnswer, setUserAnswer] = useState('');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(false); // Reset dulu agar animasi berlaku ulang

    fetch(`http://localhost:5000/question?level=${level}&index=${questionIndex}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => { 
            // eslint-disable-next-line no-throw-literal
            throw { status: res.status, data }; });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched question data:", data);
        setQuestionData(data);
        setUserAnswer('');
        setTimeout(() => setVisible(true), 50); // ✅ animasi muncul dengan smooth
      })
      .catch((err) => {
        console.error('Error fetching question:', err);
        if (err.data && err.data.finalScore !== undefined && err.data.highestLevel !== undefined) {
          onGameOver(err.data.finalScore, err.data.highestLevel);
        } else {
          onGameOver(0, level);
        }
      });
  }, [level, questionIndex, onGameOver]);

  
  const handleSubmit = () => {
    if (userAnswer.trim() === '') return alert('Please enter your answer.');

    const trimmed = userAnswer.trim();
    if (trimmed.includes('/')) {
      const [num, denom] = trimmed.split('/');
      if (isNaN(num) || isNaN(denom) || denom === '0') return alert('Invalid fraction.');
    }

    fetch('http://localhost:5000/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, index: questionIndex, answer: trimmed }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.result === 'correct') onAnswer();
        else onGameOver(data.finalScore, data.highestLevel);
      })
      .catch((err) => console.error('Error submitting answer:', err));
  };

  if (!questionData) return <div style={styles.loading}>Loading question...</div>;

  return (
    <div style={styles.wrapper}>
      <div style={{
        ...styles.background,
        backgroundImage: `url(${mountainBackground})`
      }} />

      <div style={{
        ...styles.container,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <h2 style={styles.level}>Level: {levelNames[level]}</h2>
        <h3 style={styles.questionNumber}>Question {questionData.questionNumber}:</h3>
        <p style={styles.questionText}>{questionData.question}</p>

        {questionData.image && (
          <img
            src={`http://localhost:5000${questionData.image}`}
            alt="Question"
            style={styles.image}
          />
        )}

        <div style={styles.inputGroup}>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            style={styles.input}
            placeholder="Your answer..."
          />
          <button style={styles.button} onClick={handleSubmit}>Submit</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  wrapper: {
    position: 'relative',
    height: '100vh',
    overflow: 'hidden',
    fontFamily: '"Segoe UI", sans-serif',
  },
  background: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(4px) brightness(0.9)',
    zIndex: 1,
  },
  container: {
    position: 'relative',
    zIndex: 2,
    textAlign: 'center',
    margin: '5% auto 0',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    padding: '40px',
    borderRadius: '15px',
    maxWidth: '600px',
    width: '90%',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  },
  level: {
    fontSize: '2rem',
    color: '#2E8B57',
    marginBottom: '10px',
  },
  questionNumber: {
    fontSize: '1.3rem',
    color: '#444',
  },
  questionText: {
    fontSize: '1.2rem',
    color: '#333',
    margin: '15px 0',
  },
  image: {
    maxWidth: '300px',
    margin: '20px auto',
    display: 'block',
  },
  inputGroup: {
    marginTop: '20px',
  },
  input: {
    fontSize: '1rem',
    padding: '10px',
    width: '200px',
    marginRight: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    fontSize: '1rem',
    padding: '10px 20px',
    cursor: 'pointer',
    backgroundColor: '#2E8B57',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    transition: 'background-color 0.3s',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20%',
    fontSize: '1.5rem',
  },
};

export default QuizScreen;
