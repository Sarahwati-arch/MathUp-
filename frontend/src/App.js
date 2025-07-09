import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import GameOverScreen from './components/GameOverScreen';

const levelMap = {
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
  15: "college"
};

function App() {
  const [gameState, setGameState] = useState('welcome');  // 'welcome', 'playing', 'gameover', 'congrats'
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [highestLevel, setHighestLevel] = useState('');
  const [correctCount, setCorrectCount] = useState(0);

  const TOTAL_QUESTIONS = 45;

  const handleStart = () => {
    setGameState('playing');
    setLevel(1);
    setQuestionIndex(0);
    setCorrectCount(0);
    setFinalScore(0);
    setHighestLevel('');
  };

  const handleAnswer = () => {
    const newCorrectCount = correctCount + 1;
    setCorrectCount(newCorrectCount);

    const levelQuestionCount = getQuestionsPerLevel(level);
    const currentQuestionNumber = getTotalQuestionsUntil(level - 1) + questionIndex + 1;

    if (currentQuestionNumber >= TOTAL_QUESTIONS) {
      setFinalScore(parseFloat((newCorrectCount * 2.2).toFixed(1)));
      setHighestLevel(levelMap[level]);
      setGameState('congrats');
      return;
    }

    if (questionIndex + 1 < levelQuestionCount) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setLevel(level + 1);
      setQuestionIndex(0);
    }
  };

  const handleGameOver = (scoreFromBackend, levelReached) => {
    const calculatedScore = parseFloat((correctCount * 2.2).toFixed(1));
    setFinalScore(calculatedScore);
    setHighestLevel(levelMap[levelReached] || `Level ${levelReached}`);
    setGameState('gameover');
  };

  function getTotalQuestionsUntil(level) {
    let total = 0;
    for (let i = 1; i <= level; i++) {
      total += getQuestionsPerLevel(i);
    }
    return total;
  }

  function getQuestionsPerLevel(level) {
    if (level <= 3) return 1;       // pre-k, kg, grade-1
    if (level <= 6) return 2;       // grade-2 to grade-4
    if (level <= 9) return 3;       // grade-5 to grade-7
    if (level <= 12) return 4;      // grade-8 to grade-10
    return 5;                       // grade-11 to college
  }

  return (
    <div>
      {gameState === 'welcome' && <WelcomeScreen onStart={handleStart} />}
      
      {gameState === 'playing' && (
        <QuizScreen
          level={level}
          questionIndex={questionIndex}
          onAnswer={handleAnswer}
          onGameOver={handleGameOver}
        />
      )}
      
      {gameState === 'gameover' && (
        <GameOverScreen
          finalScore={finalScore}
          highestLevel={highestLevel}
          onRestart={() => setGameState('welcome')}
        />
      )}

      {gameState === 'congrats' && (
        <div style={{ textAlign: 'center', marginTop: '10%' }}>
          <h2>🎉 Congratulations! 🎉</h2>
          <p>You completed all questions!</p>
          <p>Final Score: <strong>{finalScore}</strong></p>
          <p>Highest Level: <strong>{highestLevel}</strong></p>
          <button onClick={handleStart}>Play Again</button>
        </div>
      )}
    </div>
  );
}

export default App;
