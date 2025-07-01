import React, { useEffect, useState } from 'react';

const QuizScreen = ({ level, questionIndex, onAnswer, onGameOver }) => {
  const [questionData, setQuestionData] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    // Fetch question from Flask backend
    fetch(`http://localhost:5000/question?level=${level}&index=${questionIndex}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          onGameOver(); // no more questions in this level
        } else {
          setQuestionData(data);
          setUserAnswer('');
        }
      })
      .catch((err) => console.error('Error fetching question:', err));
  }, [level, questionIndex, onGameOver]);

  const handleSubmit = () => {
    fetch('http://localhost:5000/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, index: questionIndex, answer: userAnswer }),
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
      <h2>Level: {level}</h2>
      <h3>Question {questionData.questionNumber}:</h3>
      <p>{questionData.question}</p>
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
  container: { textAlign: 'center', marginTop: '10%' },
  input: { fontSize: '1rem', padding: '8px', width: '200px', marginRight: '10px' },
  button: { fontSize: '1rem', padding: '8px 16px', cursor: 'pointer' },
  loading: { textAlign: 'center', marginTop: '20%', fontSize: '1.5rem' },
};

export default QuizScreen;
