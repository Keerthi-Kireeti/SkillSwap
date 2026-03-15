import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getLeaderboard, BADGE_ICONS } from '../data/store';
import { Trophy, Zap, Star, Flame, TrendingUp, Medal, Crown } from 'lucide-react';
import ScrollList from '../components/ScrollList';
import { CountUp } from '../components/CountUp';
import './Leaderboard.css';

const RANK_META = [
  { bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', glow: 'rgba(251,191,36,0.4)', label: '🥇', crown: true },
  { bg: 'linear-gradient(135deg, #e2e8f0, #94a3b8)', glow: 'rgba(148,163,184,0.4)', label: '🥈', crown: false },
  { bg: 'linear-gradient(135deg, #fb923c, #b45309)', glow: 'rgba(251,146,60,0.4)', label: '🥉', crown: false },
];

const STAT_TABS = [
  { key: 'creditsEarned', label: 'Credits Earned', icon: <Zap size={15} />, color: '#818cf8' },
  { key: 'completedSwaps', label: 'Swaps', icon: <TrendingUp size={15} />, color: '#34d399' },
  { key: 'rating', label: 'Rating', icon: <Star size={15} />, color: '#fbbf24' },
  { key: 'dailyStreakDays', label: 'Streak Days', icon: <Flame size={15} />, color: '#f97316' },
];

export default function Leaderboard() {
  const [sortBy, setSortBy] = useState('creditsEarned');
  const [users, setUsers] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const all = getLeaderboard();
    setUsers(all);
    setTimeout(() => setVisible(true), 100);
  }, []);

  const sorted = [...users].sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0));
  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3);

  return (
    <div className="page lb-page">
      {/* Bg orbs */}
      <div className="lb-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-4" />
      </div>

      <div className="container">
        {/* Header */}
        <div className={`lb-header ${visible ? 'animate-fade-in-up' : ''}`}>
          <div className="lb-header-icon">
            <Trophy size={32} style={{ color: '#fbbf24' }} />
          </div>
          <div>
            <div className="section-pill"><Crown size={12} /> Leaderboard</div>
            <h1 className="lb-title">Campus Champions</h1>
            <p className="lb-subtitle">Who's leading the skill revolution on campus? 🚀</p>
          </div>
        </div>

        {/* Sort Tabs */}
        <div className="lb-tabs">
          {STAT_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`lb-tab ${sortBy === tab.key ? 'active' : ''}`}
              onClick={() => setSortBy(tab.key)}
              style={{ '--tab-color': tab.color }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Podium — Top 3 */}
        {top3.length > 0 && (
          <div className="lb-podium">
            {/* 2nd place */}
            {top3[1] && (
              <PodiumCard user={top3[1]} rank={2} sortBy={sortBy} meta={RANK_META[1]} delay={200} />
            )}
            {/* 1st place */}
            {top3[0] && (
              <PodiumCard user={top3[0]} rank={1} sortBy={sortBy} meta={RANK_META[0]} delay={0} tall />
            )}
            {/* 3rd place */}
            {top3[2] && (
              <PodiumCard user={top3[2]} rank={3} sortBy={sortBy} meta={RANK_META[2]} delay={300} />
            )}
          </div>
        )}

        {/* Full Rankings — ScrollList */}
        <div className="lb-table-section">
          <h2 className="lb-section-title">
            <Medal size={18} style={{ color: '#818cf8' }} /> Full Rankings
          </h2>
          <ScrollList
            data={sorted}
            itemHeight={110}
            renderItem={(user, index) => (
              <LeaderboardRow key={user.userId} user={user} rank={index + 1} sortBy={sortBy} />
            )}
          />
        </div>
      </div>
    </div>
  );
}

function PodiumCard({ user, rank, sortBy, meta, delay, tall }) {
  const statVal = user[sortBy] ?? 0;
  const statLabel = STAT_TABS.find((t) => t.key === sortBy)?.label || '';

  return (
    <div
      className={`podium-card ${tall ? 'podium-first' : ''}`}
      style={{ '--glow': meta.glow, animationDelay: `${delay}ms` }}
    >
      {rank === 1 && (
        <div className="podium-crown-wrap">
          <Crown size={28} style={{ color: '#fbbf24', filter: 'drop-shadow(0 0 10px rgba(251,191,36,0.8))' }} />
        </div>
      )}
      <div className="podium-rank-badge" style={{ background: meta.bg }}>
        {rank}
      </div>
      <div className="podium-avatar-wrap" style={{ '--glow': meta.glow }}>
        <img src={user.avatar} alt={user.name} className={`avatar ${tall ? 'avatar-xl' : 'avatar-lg'}`} />
        <div className="podium-avatar-ring" />
      </div>
      <div className="podium-name">{user.name}</div>
      <div className="podium-stat-value" style={{ background: meta.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
        <CountUp
          value={typeof statVal === 'number' ? statVal : 0}
          decimals={typeof statVal === 'number' && statVal % 1 !== 0 ? 1 : 0}
          duration={1.8}
          animationStyle="bounce"
          className="podium-stat-value"
          style={{ background: meta.bg, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        />
      </div>
      <div className="podium-stat-label">{statLabel}</div>
      <div className="podium-badges">
        {(user.badges || []).slice(0, 3).map((b) => (
          <span key={b} title={b} className="podium-badge-icon">{BADGE_ICONS[b] || '🏅'}</span>
        ))}
      </div>
      <Link to={`/profile/${user.userId}`} className="btn btn-sm btn-outline" style={{ marginTop: '0.75rem', fontSize: '0.75rem' }}>
        View Profile
      </Link>
    </div>
  );
}

function LeaderboardRow({ user, rank, sortBy }) {
  const isTop3 = rank <= 3;
  const statVal = user[sortBy] ?? 0;
  const tabMeta = STAT_TABS.find((t) => t.key === sortBy);
  const maxVal = 30; // approximate max for progress bar

  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : null;

  return (
    <div className={`lb-row ${isTop3 ? 'lb-row-top' : ''} animate-fade-in-up`} style={{ animationDelay: `${(rank - 1) * 50}ms` }}>
      <div className="lb-row-rank">
        {rankEmoji ? (
          <span className="lb-rank-medal">{rankEmoji}</span>
        ) : (
          <span className="lb-rank-num">#{rank}</span>
        )}
      </div>
      <img src={user.avatar} alt={user.name} className="avatar avatar-md" />
      <div className="lb-row-info">
        <div className="lb-row-name">
          {user.name}
          {(user.dailyStreakDays || 0) >= 7 && (
            <span className="streak-badge" style={{ marginLeft: '0.5rem' }}><Flame size={10} /> {user.dailyStreakDays}d</span>
          )}
        </div>
        <div className="lb-row-badges">
          {(user.badges || []).slice(0, 4).map((b) => (
            <span key={b} className="lb-badge-chip" title={b}>{BADGE_ICONS[b] || '🏅'} {b}</span>
          ))}
        </div>
      </div>
      <div className="lb-row-stat">
        <div className="lb-row-stat-val" style={{ color: tabMeta?.color }}>
          {typeof statVal === 'number' && statVal % 1 !== 0 ? statVal.toFixed(1) : statVal}
        </div>
        <div className="lb-row-stat-label">{tabMeta?.label}</div>
      </div>
      <div className="lb-row-progress">
        <div className="progress-bar" style={{ width: '120px' }}>
          <div
            className="progress-fill"
            style={{ width: `${Math.min(100, ((statVal / maxVal) * 100))}%`, background: tabMeta?.color || 'var(--grad-primary)' }}
          />
        </div>
        <div className="lb-mini-stats">
          <span title="Total credits"><Zap size={11} /> {user.credits ?? 0}</span>
          <span title="Rating"><Star size={11} /> {user.rating?.toFixed(1) || '—'}</span>
          <span title="Swaps"><TrendingUp size={11} /> {user.completedSwaps ?? 0}</span>
        </div>
      </div>
      <Link to={`/profile/${user.userId}`} className="btn btn-sm btn-ghost">Profile →</Link>
    </div>
  );
}
