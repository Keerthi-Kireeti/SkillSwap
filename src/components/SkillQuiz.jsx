import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Volume2, VolumeX } from 'lucide-react';

// Simple Skill Quiz Game - Works Offline
export default function SkillQuiz({ onScoreUpdate, onClose } = {}) {
  const [gameState, setGameState] = useState('menu'); // menu, playing, gameOver
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('skillquiz-highscore') || '0');
  });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRef = useRef(null);

  const questions = [
    {
      question: 'What does CSS stand for?',
      answers: ['Cascading Style Sheets', 'Computer Style Syntax', 'Creative Style System', 'Cascaded System Styles'],
      correct: 0,
    },
    {
      question: 'Which language is used for web development?',
      answers: ['Python', 'JavaScript', 'Java', 'C++'],
      correct: 1,
    },
    {
      question: 'What is React?',
      answers: ['A database', 'A JavaScript library', 'A programming language', 'A web server'],
      correct: 1,
    },
    {
      question: 'What does API stand for?',
      answers: ['Apple Program Interface', 'Application Programming Interface', 'Advanced Programming Index', 'Application Process Integration'],
      correct: 1,
    },
    {
      question: 'Which tool is used for version control?',
      answers: ['GitHub', 'Git', 'Both A and B', 'Docker'],
      correct: 2,
    },
    {
      question: 'What is a DOM?',
      answers: ['Database Object Model', 'Document Object Model', 'Data Organization Method', 'Digital Object Module'],
      correct: 1,
    },
    {
      question: 'What does JSON stand for?',
      answers: ['Java Standard Object Notation', 'JavaScript Object Notation', 'Java Serialization Object Notation', 'JavaScript Open Network'],
      correct: 1,
    },
    {
      question: 'Which is a NoSQL database?',
      answers: ['PostgreSQL', 'MySQL', 'MongoDB', 'Oracle'],
      correct: 2,
    },
    {
      question: 'What is a state in React?',
      answers: ['A permanent variable', 'Data that changes over time', 'A function', 'A CSS property'],
      correct: 1,
    },
    {
      question: 'What does REST API stand for?',
      answers: ['Rapid Extension Standard Technology', 'Representational State Transfer', 'Remote Execution Service Tool', 'Responsive Element Server Technology'],
      correct: 1,
    },
  ];

  const playSound = () => {
    if (!soundEnabled) return;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscil = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscil.connect(gain);
    gain.connect(audioCtx.destination);
    oscil.frequency.value = 800;
    oscil.type = 'sine';
    gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    oscil.start(audioCtx.currentTime);
    oscil.stop(audioCtx.currentTime + 0.1);
  };

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
  };

  const handleAnswer = (index) => {
    if (answered) return;
    setSelectedAnswer(index);
    setAnswered(true);
    playSound();

    if (index === questions[currentQuestion].correct) {
      setScore(prev => prev + 10);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswered(false);
      } else {
        endGame();
      }
    }, 800);
  };

  const endGame = () => {
    const newHighScore = Math.max(score + (selectedAnswer === questions[currentQuestion].correct ? 10 : 0), highScore);
    setHighScore(newHighScore);
    localStorage.setItem('skillquiz-highscore', newHighScore);
    setGameState('gameOver');
    
    // Call the score update callback
    if (onScoreUpdate) {
      onScoreUpdate(newHighScore);
    }
  };

  if (gameState === 'menu') {
    return (
      <div className="min-h-full w-full flex flex-col items-center justify-center gap-6 px-4 py-8">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            SkillQuiz
          </h1>
          <p className="text-gray-400 mb-8">Test your tech knowledge & earn credits!</p>
        </div>

        <motion.div
          className="bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-indigo-500/30 rounded-lg p-8 max-w-md backdrop-blur-xl w-full"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Your High Score:</span>
              <span className="text-2xl font-bold text-yellow-400">{highScore}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Questions:</span>
              <span className="text-lg font-semibold text-cyan-400">{questions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Points per Question:</span>
              <span className="text-lg font-semibold text-emerald-400">10 pts</span>
            </div>
          </div>

          <button
            onClick={startGame}
            className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            Start Game
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-gray-700/50 hover:bg-gray-600/50 text-white py-2 rounded-lg transition-all"
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            {soundEnabled ? 'Sound On' : 'Sound Off'}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 w-full bg-slate-700/50 hover:bg-slate-600/50 text-white font-semibold py-2 rounded-lg transition-all"
            >
              Back to Game Selection
            </button>
          )}
        </motion.div>

        <p className="text-sm text-gray-500 max-w-md text-center mt-4">
          🎮 This game works offline! Play anytime, anywhere. Beat your high score to earn Skill Credits!
        </p>
      </div>
    );
  }

  if (gameState === 'playing') {
    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
      <motion.div
        className="min-h-full w-full flex flex-col items-center justify-center gap-8 px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-full max-w-2xl space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white font-semibold">Question {currentQuestion + 1} of {questions.length}</span>
              <span className="text-2xl font-bold text-yellow-400">{score} pts</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Question */}
          <motion.div
            className="bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-indigo-500/30 rounded-lg p-8 backdrop-blur-xl w-full"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-2xl font-bold text-white mb-8 text-center">{question.question}</h2>

            {/* Answers */}
            <div className="space-y-3">
              {question.answers.map((answer, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={answered}
                  className={`w-full p-4 rounded-lg font-semibold text-lg transition-all duration-300 ${
                    selectedAnswer === idx
                      ? idx === question.correct
                        ? 'bg-emerald-500/80 text-white scale-105'
                        : 'bg-red-500/80 text-white scale-105'
                      : answered && idx === question.correct
                      ? 'bg-emerald-500/30 text-emerald-200 scale-105'
                      : 'bg-gray-700/50 hover:bg-gray-600/50 text-gray-100'
                  }`}
                  whileHover={!answered ? { scale: 1.02 } : {}}
                  whileTap={!answered ? { scale: 0.98 } : {}}
                >
                  {answer}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  if (gameState === 'gameOver') {
    const finalScore = score + (selectedAnswer === questions[currentQuestion].correct ? 10 : 0);
    const isNewHighScore = finalScore > highScore;

    return (
      <motion.div
        className="min-h-full w-full flex flex-col items-center justify-center gap-8 px-4 py-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.h1
            className="text-6xl font-bold mb-4 text-white"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6 }}
          >
            Game Over!
          </motion.h1>
          {isNewHighScore && (
            <motion.p
              className="text-2xl font-bold text-yellow-400 mb-4"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6 }}
            >
              🎉 New High Score! 🎉
            </motion.p>
          )}
        </div>

        <motion.div
          className="bg-gradient-to-br from-indigo-500/20 to-pink-500/20 border border-indigo-500/30 rounded-lg p-12 max-w-md backdrop-blur-xl w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-6 text-center mb-8">
            <div>
              <p className="text-gray-300 mb-2">Your Final Score</p>
              <p className="text-5xl font-bold text-yellow-400">{finalScore}</p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">High Score</p>
              <p className="text-3xl font-bold text-cyan-400">{Math.max(finalScore, highScore)}</p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">Accuracy</p>
              <p className="text-2xl font-bold text-emerald-400">{Math.round((finalScore / (questions.length * 10)) * 100)}%</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={startGame}
              className="w-full bg-gradient-to-r from-indigo-500 to-pink-500 hover:from-indigo-600 hover:to-pink-600 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
            >
              <RotateCcw size={18} /> Play Again
            </button>
            <button
              onClick={() => setGameState('menu')}
              className="w-full bg-gray-700/50 hover:bg-gray-600/50 text-white font-semibold py-3 rounded-lg transition-all"
            >
              Back to Menu
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-full bg-slate-700/70 hover:bg-slate-600/70 text-white font-semibold py-3 rounded-lg transition-all border border-slate-600"
              >
                Exit Game
              </button>
            )}
          </div>
        </motion.div>

        <p className="text-sm text-gray-500 max-w-md text-center">
          Beat your high score to earn more Skill Credits! Higher accuracy = more rewards 🏆
        </p>
      </motion.div>
    );
  }
}
