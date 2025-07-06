import React, { useEffect, useState } from 'react';

const QuizScreen = ({ level, questionIndex, onAnswer, onGameOver, initialQuestion }) => {
  const [questionData, setQuestionData] = useState(initialQuestion || null);  // ✅ use initialQuestion if available
  const [userAnswer, setUserAnswer] = useState('');

  useEffect(() => {
    // only fetch if initialQuestion wasn't provided or level/index has changed
    if (!initialQuestion || questionData === initialQuestion) {
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
    } else {
      setQuestionData(initialQuestion);
    }
  }, [level, questionIndex, onGameOver, initialQuestion, questionData]); // ✅ depend on initialQuestion too

  const handleSubmit = () => {
    const numericAnswer = parseFloat(userAnswer);
    if (isNaN(numericAnswer)) {
      alert('Please enter a valid number.');
      return;
    }

    fetch('http://localhost:5000/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        level,
        index: questionIndex,
        answer: numericAnswer,
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
