import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';

function App() {
  const [started, setStarted] = useState(false);
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);

  const handleStart = () => {
    setStarted(true);
    setLevel(1);
    setQuestionIndex(0);
  };

  const handleAnswer = () => {
    const levelQuestionCount = getQuestionsPerLevel(level);
    if (questionIndex + 1 < levelQuestionCount) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setLevel(level + 1);
      setQuestionIndex(0);
    }
  };

  const handleGameOver = (finalScore, highestLevel) => {
    alert(`Game Over!\nFinal score: ${finalScore}\nHighest level reached: ${highestLevel}`);
    setStarted(false);
  };

  return (
    <div>
      {!started && <WelcomeScreen onStart={handleStart} />}
      {started && (
        <QuizScreen
          level={level}
          questionIndex={questionIndex}
          onAnswer={handleAnswer}
          onGameOver={handleGameOver}
        />
      )}
    </div>
  );
}

function getQuestionsPerLevel(level) {
  if (level <= 1) return 1;
  if (level <= 4) return 2;
  if (level <= 7) return 3;
  if (level <= 10) return 4;
  return 5;
}

export default App;
