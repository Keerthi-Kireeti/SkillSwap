import { useState, useEffect, useRef } from 'react';
import { RotateCcw } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };

export default function SnakeGame({ onClose, onScoreUpdate }) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [nextDirection, setNextDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef(null);
  const highScoreRef = useRef(parseInt(localStorage.getItem('snakegame-highscore') || '0'));

  // Generate random food position
  const generateFood = () => {
    let newFood;
    let isOnSnake = true;
    while (isOnSnake) {
      newFood = { x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) };
      isOnSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood;
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'arrowup' || key === 'w') {
        e.preventDefault();
        if (direction.y === 0) setNextDirection({ x: 0, y: -1 });
      }
      if (key === 'arrowdown' || key === 's') {
        e.preventDefault();
        if (direction.y === 0) setNextDirection({ x: 0, y: 1 });
      }
      if (key === 'arrowleft' || key === 'a') {
        e.preventDefault();
        if (direction.x === 0) setNextDirection({ x: -1, y: 0 });
      }
      if (key === 'arrowright' || key === 'd') {
        e.preventDefault();
        if (direction.x === 0) setNextDirection({ x: 1, y: 0 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  // Game loop
  useEffect(() => {
    if (gameOver) return;

    gameLoopRef.current = setInterval(() => {
      setSnake((prevSnake) => {
        setDirection(nextDirection);
        
        const head = prevSnake[0];
        const newHead = {
          x: (head.x + nextDirection.x + GRID_SIZE) % GRID_SIZE,
          y: (head.y + nextDirection.y + GRID_SIZE) % GRID_SIZE,
        };

        // Check collision with self
        if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
          setGameOver(true);
          if (score > highScoreRef.current) {
            highScoreRef.current = score;
            localStorage.setItem('snakegame-highscore', score);
            if (onScoreUpdate) onScoreUpdate('snake', score);
          }
          return prevSnake;
        }

        let newSnake = [newHead, ...prevSnake];

        // Check if food eaten
        if (newHead.x === food.x && newHead.y === food.y) {
          const newScore = score + 10;
          setScore(newScore);
          setFood(generateFood());
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    }, 100);

    return () => clearInterval(gameLoopRef.current);
  }, [gameOver, nextDirection, food, score, onScoreUpdate]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood({ x: 15, y: 15 });
    setDirection(INITIAL_DIRECTION);
    setNextDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-5xl font-bold mb-2">
            <span className="text-white">🐍 </span>
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Snake Master</span>
          </h1>
          <p className="text-gray-300 mb-4 text-lg font-semibold">Use Arrow Keys or WASD to Move</p>
          <div className="inline-block bg-emerald-500/20 border border-emerald-500/40 rounded-lg px-4 py-2 mb-4">
            <p className="text-emerald-300 text-sm">🎮 Eat food to grow • Don't hit walls or yourself!</p>
          </div>
        </div>

        {/* Game Canvas */}
        <div className="bg-slate-950 border-4 border-emerald-500/60 rounded-xl p-4 mb-6 shadow-2xl hover:border-emerald-400 transition-colors">
          <div
            className="grid gap-0 bg-slate-900 rounded-lg overflow-hidden"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              aspectRatio: '1',
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
              const x = i % GRID_SIZE;
              const y = Math.floor(i / GRID_SIZE);
              const isSnakeHead = snake[0].x === x && snake[0].y === y;
              const isSnakeBody = snake.slice(1).some(segment => segment.x === x && segment.y === y);
              const isFood = food.x === x && food.y === y;

              return (
                <div
                  key={i}
                  className={`w-full aspect-square transition-all ${
                    isSnakeHead
                      ? 'bg-emerald-300 shadow-lg shadow-emerald-500/80 scale-110'
                      : isSnakeBody
                      ? 'bg-emerald-600'
                      : isFood
                      ? 'bg-rose-500 rounded-full shadow-lg shadow-rose-500/60 animate-pulse'
                      : 'bg-slate-800'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-br from-emerald-900/40 to-emerald-800/20 border border-emerald-500/50 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-sm font-semibold mb-1">SCORE</p>
            <p className="text-white text-3xl font-bold text-emerald-400 font-mono">{score}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-800/20 border border-amber-500/50 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-sm font-semibold mb-1">LENGTH</p>
            <p className="text-white text-3xl font-bold text-amber-400 font-mono">{snake.length}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-800/20 border border-purple-500/50 rounded-lg p-4 text-center">
            <p className="text-gray-300 text-sm font-semibold mb-1">HIGH SCORE</p>
            <p className="text-white text-3xl font-bold text-purple-400 font-mono">{highScoreRef.current}</p>
          </div>
        </div>

        {/* Game Over Screen */}
        {gameOver && (
          <div className="bg-gradient-to-br from-rose-950/80 to-red-950/80 border-2 border-rose-500 rounded-xl p-6 mb-6 text-center shadow-2xl animate-pulse">
            <p className="text-4xl mb-3">💀 GAME OVER!</p>
            <p className="text-gray-200 mb-2 text-lg">Final Score: <span className="text-rose-400 font-bold text-3xl font-mono">{score}</span></p>
            <p className="text-gray-400 text-sm mb-4">
              {score > highScoreRef.current ? (
                <span className="text-amber-300 font-bold">🎉 NEW HIGH SCORE! 🎉</span>
              ) : (
                `High Score: ${highScoreRef.current}`
              )}
            </p>
          </div>
        )}

        {/* Controls */}
        <div className="space-y-3">
          <button
            onClick={resetGame}
            className="w-full px-6 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg text-lg"
          >
            <RotateCcw size={20} /> 
            {gameOver ? 'Play Again' : 'Reset Game'}
          </button>
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-700/70 hover:bg-slate-600/70 text-white font-semibold rounded-lg transition-all border border-slate-600"
          >
            ← Back to Games
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-slate-900/50 border border-slate-700 rounded-lg p-4">
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-emerald-400">📋 HOW TO PLAY:</strong> Navigate the snake 🐍 to eat the red food 🍎. Each food gives 10 points. 
            <strong className="block mt-2 text-rose-400">⚠️ Danger:</strong> Don't hit the walls or yourself!
            <strong className="block mt-2 text-cyan-400">💡 Tip:</strong> Plan ahead to avoid getting trapped!
          </p>
        </div>
      </div>
    </div>
  );
}
