import React, { useEffect, useState } from 'react';

const levelNames = {
  1: "pre-k",
  2: "kg",
  3: "grade-1",
  4: "grade-2",
  5: "grade-3",
  6: "grade-4",
  7: "grade-5",
  8: "grade-6",
  9: "grade-7",
  10: "grade-8",
  11: "grade-9",
  12: "grade-10",
  13: "grade-11",
  14: "grade-12",
  15: "college",
};

const QuizScreen = ({ level, questionIndex, onAnswer, onGameOver, initialQuestion }) => {
  const [questionData, setQuestionData] = useState(initialQuestion || null);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    fetch(`http://localhost:5000/question?level=${level}&index=${questionIndex}`)
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            // eslint-disable-next-line no-throw-literal
            throw { status: res.status, data };
          });
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched question data:", data); 
        setQuestionData(data);
        setUserAnswer('');
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
    if (userAnswer === '') {
      alert('Please enter your answer.');
      return;
    }

    const trimmed = userAnswer.trim();

    if (!trimmed) {
      alert('Please enter your answer.');
      return;
    }

    // Optional: validasi fraction
    if (trimmed.includes('/')) {
      const [num, denom] = trimmed.split('/');
      if (isNaN(num) || isNaN(denom) || denom === '0') {
        alert('Invalid fraction.');
        return;
      }
    }

    fetch('http://localhost:5000/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        index: questionIndex,
        answer: trimmed, // ✅ kirim mentah sebagai string (contoh: "16/35")
      }),
    })

      .then((res) => res.json())
      .then((data) => {
        if (data.result === 'correct') {
          onAnswer();
        } else {
          onGameOver(data.finalScore, data.highestLevel);
        }
      })
      .catch((err) => console.error('Error submitting answer:', err));
  };

  if (!questionData) return <div style={styles.loading}>Loading question...</div>;

  return (
    <div style={styles.container}>
      <h2>Level: {levelNames[level]}</h2>
      <h3>Question {questionData.questionNumber}:</h3>
      <p>{questionData.question}</p>

      {questionData.image && (
        <img
          src={`http://localhost:5000${questionData.image}`}
          alt="Question"
          style={styles.image}
        />
      )}

      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        style={styles.input}
        placeholder="Your answer..."
      />
      <button style={styles.button} onClick={handleSubmit}>Submit</button>
    </div>
  );
};

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '10%',
  },
  input: {
    fontSize: '1rem',
    padding: '8px',
    width: '200px',
    marginRight: '10px',
  },
  button: {
    fontSize: '1rem',
    padding: '8px 16px',
    cursor: 'pointer',
  },
  loading: {
    textAlign: 'center',
    marginTop: '20%',
    fontSize: '1.5rem',
  },
  image: {
    maxWidth: '300px',
    margin: '20px auto',
    display: 'block',
  },
};

export default QuizScreen;
