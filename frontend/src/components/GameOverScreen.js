import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [gameState, setGameState] = useState('welcome'); // 'welcome', 'playing', 'gameover'
  const [level, setLevel] = useState(1);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [finalScore, setFinalScore] = useState(0);
  const [highestLevel, setHighestLevel] = useState('');

  const handleStart = () => {
    setGameState('playing');
    setLevel(1);
    setQuestionIndex(0);
    setFinalScore(0);
    setHighestLevel('');
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

  const handleGameOver = (score, levelReached) => {
    setFinalScore(score);
    setHighestLevel(levelReached);
    setGameState('gameover');
  };

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
    </div>
  );
}

function getQuestionsPerLevel(level) {
  if (level <= 1) return 1;       // Pre-K, K, Grade 1
  if (level <= 4) return 2;       // Grades 2-4
  if (level <= 7) return 3;       // Grades 5-7
  if (level <= 10) return 4;      // Grades 8-10
  return 5;                       // Grades 11-12+
}

export default App;
