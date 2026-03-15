import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { ArrowLeft, Award, GamepadIcon } from 'lucide-react';
import SkillQuiz from '../components/SkillQuiz';
import SnakeGame from '../components/SnakeGame';
import { getLeaderboard } from '../data/store';
import './SkillGame.css';

export default function SkillGame() {
  const { user, updateUser } = useAuth();
  const [selectedGame, setSelectedGame] = useState(null);
  const leaderboard = getLeaderboard();

  const handleScoreUpdate = (gameType, score) => {
    if (user && score > 0) {
      const credits = gameType === 'quiz' ? Math.floor(score / 20) : Math.floor(score / 50);
      const badgeName = gameType === 'quiz' ? 'Quiz Champion' : 'Snake Master';
      
      const updatedUser = {
        ...user,
        credits: (user.credits || 0) + credits,
        creditsEarned: (user.creditsEarned || 0) + credits,
        badges: [...new Set([...(user.badges || []), badgeName])]
      };
      updateUser(updatedUser);
    }
  };

  // QUIZ GAME VIEW
  if (selectedGame === 'quiz') {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-slate-900 to-slate-800 z-50 overflow-auto">
        <SkillQuiz 
          onScoreUpdate={(score) => handleScoreUpdate('quiz', score)}
          onClose={() => setSelectedGame(null)}
        />
      </div>
    );
  }

  // SNAKE GAME VIEW
  if (selectedGame === 'snake') {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-gradient-to-br from-slate-900 to-slate-800 z-50 flex items-center justify-center">
        <SnakeGame
          onClose={() => setSelectedGame(null)}
          onScoreUpdate={(gameType, score) => handleScoreUpdate(gameType, score)}
        />
      </div>
    );
  }

  // GAME SELECTION SCREEN
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 mb-6 transition-colors">
            <ArrowLeft size={20} /> Back to Home
          </Link>
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            🎮 Skill Games
          </h1>
          <p className="text-xl text-gray-300">Pick a game and earn credits!</p>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-gradient-to-br from-indigo-900/40 to-indigo-900/20 border border-indigo-500/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-semibold mb-2">YOUR CREDITS</p>
            <p className="text-4xl font-bold text-indigo-400">{user?.credits || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-amber-900/40 to-amber-900/20 border border-amber-500/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-semibold mb-2">CREDITS EARNED</p>
            <p className="text-4xl font-bold text-amber-400">{user?.creditsEarned || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-900/40 to-purple-900/20 border border-purple-500/50 rounded-xl p-6">
            <p className="text-gray-400 text-sm font-semibold mb-2">BADGES UNLOCKED</p>
            <p className="text-4xl font-bold text-purple-400">{user?.badges?.length || 0}</p>
          </div>
        </div>

        {/* GAME CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* QUIZ CARD */}
          <div className="bg-gradient-to-br from-indigo-900/30 to-slate-800 border-2 border-indigo-500/40 rounded-2xl p-8 hover:border-indigo-500/80 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            onClick={() => setSelectedGame('quiz')}>
            <div className="text-7xl mb-6">🧠</div>
            <h2 className="text-3xl font-bold text-white mb-2">SkillQuiz</h2>
            <p className="text-indigo-300 text-lg font-semibold mb-6">Test Your Tech Knowledge</p>
            
            <div className="bg-slate-900/60 rounded-lg p-4 mb-6 border border-indigo-500/30">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-indigo-400 text-xl">✓</span>
                  <span>10 Technology Questions</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-indigo-400 text-xl">✓</span>
                  <span>1 Credit per 20 Points</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-indigo-400 text-xl">✓</span>
                  <span>~5 Minutes per Round</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-indigo-400 text-xl">✓</span>
                  <span>Works Offline</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-400 text-xs font-semibold mb-2">YOUR BEST SCORE</p>
              <p className="text-4xl font-bold text-indigo-300">{parseInt(localStorage.getItem('skillquiz-highscore') || '0')}</p>
            </div>

            <button className="w-full py-3 px-6 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-700 hover:to-indigo-600 text-white font-bold rounded-lg transition-all text-lg flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/50">
              <GamepadIcon size={22} /> PLAY QUIZ
            </button>
          </div>

          {/* SNAKE CARD */}
          <div className="bg-gradient-to-br from-emerald-900/30 to-slate-800 border-2 border-emerald-500/40 rounded-2xl p-8 hover:border-emerald-500/80 hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group"
            onClick={() => setSelectedGame('snake')}>
            <div className="text-7xl mb-6">🐍</div>
            <h2 className="text-3xl font-bold text-white mb-2">Snake Master</h2>
            <p className="text-emerald-300 text-lg font-semibold mb-6">Classic Arcade Action</p>
            
            <div className="bg-slate-900/60 rounded-lg p-4 mb-6 border border-emerald-500/30">
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <span>Classic Snake Gameplay</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <span>1 Credit per 50 Points</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <span>Unlimited Rounds</span>
                </li>
                <li className="flex items-center gap-3 text-gray-200">
                  <span className="text-emerald-400 text-xl">✓</span>
                  <span>Real-time Leaderboard</span>
                </li>
              </ul>
            </div>

            <div className="mb-6">
              <p className="text-gray-400 text-xs font-semibold mb-2">YOUR BEST SCORE</p>
              <p className="text-4xl font-bold text-emerald-300">{parseInt(localStorage.getItem('snakegame-highscore') || '0')}</p>
            </div>

            <button className="w-full py-3 px-6 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white font-bold rounded-lg transition-all text-lg flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-emerald-500/50">
              <GamepadIcon size={22} /> PLAY SNAKE
            </button>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-8 mb-12">
          <h3 className="text-2xl font-bold text-white mb-8">How to Earn Credits</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-5xl mb-4">1️⃣</div>
              <p className="font-bold text-white mb-2">Choose Game</p>
              <p className="text-gray-400">Pick Quiz or Snake</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">2️⃣</div>
              <p className="font-bold text-white mb-2">Earn Points</p>
              <p className="text-gray-400">Score by playing well</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">3️⃣</div>
              <p className="font-bold text-white mb-2">Get Credits</p>
              <p className="text-gray-400">Exchange points automatically</p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">4️⃣</div>
              <p className="font-bold text-white mb-2">Unlock Badges</p>
              <p className="text-gray-400">Achieve milestones</p>
            </div>
          </div>
        </div>

        {/* LEADERBOARD */}
        <div className="bg-slate-900/60 border border-slate-700 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Award size={28} className="text-yellow-400" />
            <h3 className="text-2xl font-bold text-white">Top Players</h3>
          </div>
          
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((player, idx) => (
              <div key={player.userId} className="flex items-center justify-between bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-slate-600 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold w-8 text-center">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                  </div>
                  <img src={player.avatar} alt={player.name} className="w-12 h-12 rounded-full border border-slate-600" />
                  <div>
                    <p className="font-bold text-white text-lg">{player.name}</p>
                    <p className="text-gray-400 text-sm">{player.creditsEarned} credits earned</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-cyan-400 text-xl">{player.credits} pts</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
