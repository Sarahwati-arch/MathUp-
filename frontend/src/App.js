import React, { useState } from 'react';
import WelcomeScreen from './components/WelcomeScreen';
import QuizScreen from './components/QuizScreen';
import GameOverScreen from './components/GameOverScreen';

function App() {
  const [gameState, setGameState] = useState('welcome');  // 'welcome', 'playing', 'gameover'
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
      setQuestionIndex(questionIndex + 1);  // move to next question in same level
    } else {
      setLevel(level + 1);                  // next level
      setQuestionIndex(0);                  // start from first question in new level
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
  if (level <= 3) return 1;        // Levels 1-3 → 1 question each
  if (level <= 6) return 2;        // Levels 4-6 → 2 questions each
  if (level <= 9) return 3;        // Levels 7-9 → 3 questions each
  if (level <= 12) return 4;       // Levels 10-12 → 4 questions each
  return 5;                        // Levels 13+ → 5 questions each
}


export default App;
