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
      // Go to next question in current level
      setQuestionIndex(questionIndex + 1);
    } else {
      // Advance to next level
      setLevel(level + 1);
      setQuestionIndex(0);
    }
  };

  const handleGameOver = (finalScore, highestLevel) => {
    alert(`Game Over!\nFinal score: ${finalScore}\nHighest level reached: ${highestLevel}`);
    setStarted(false); // return to WelcomeScreen
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

// Determine number of questions per level
function getQuestionsPerLevel(level) {
  if (level <= 1) return 1;       // Pre-K, K, Grade 1
  if (level <= 4) return 2;       // Grades 2-4
  if (level <= 7) return 3;       // Grades 5-7
  if (level <= 10) return 4;      // Grades 8-10
  return 5;                       // Grades 11-12+
}

export default App;
