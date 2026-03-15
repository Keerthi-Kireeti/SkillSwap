import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  getSwapsByUser, getListings, getUserById, updateSwapStatus, deleteListing,
  BADGE_ICONS, BADGE_RULES, getActivityByUser, getAISuggestions, getSessionsByUser,
  checkAndAssignBadges, getLeaderboard
} from '../data/store';
import {
  Zap, TrendingUp, CheckCircle, Clock, Award, List, ArrowLeftRight, Trash2,
  Star, Flame, Plus, Brain, Users, BarChart2, Target, Calendar,
  BookOpen, Trophy, Sparkles, ChevronRight
} from 'lucide-react';
import './Dashboard.css';

const STATUS_COLORS = {
  Pending: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  Accepted: { bg: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
  Completed: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
};

const TABS = [
  { key: 'overview', label: '🔁 Active Swaps' },
  { key: 'completed', label: '✅ Completed' },
  { key: 'listings', label: '📋 My Listings' },
  { key: 'streaks', label: '🔥 Streaks' },
  { key: 'activity', label: '⏱ Activity Log' },
  { key: 'ai', label: '🤖 AI Suggest' },
  { key: 'badges', label: '🏅 Badges' },
  { key: 'groups', label: '👥 Group Sessions' },
];

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [tab, setTab] = useState('overview');
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (user) checkAndAssignBadges(user.userId);
  }, [user?.userId]);

  if (!user) {
    return (
      <div className="page">
        <div className="container text-center">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h2>Please log in to view your dashboard</h2>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/auth')}>Log In</button>
          </div>
        </div>
      </div>
    );
  }

  const swaps = getSwapsByUser(user.userId);
  const listings = getListings().filter((l) => l.createdBy === user.userId);
  const activeSwaps = swaps.filter((s) => s.status === 'Pending' || s.status === 'Accepted');
  const completedSwaps = swaps.filter((s) => s.status === 'Completed');
  const activityLogs = getActivityByUser(user.userId);
  const aiSuggestions = getAISuggestions(user);
  const groupSessions = getSessionsByUser(user.userId);

  const refetch = () => { setTick((t) => t + 1); refreshUser(); };

  const handleComplete = (swapId) => {
    updateSwapStatus(swapId, 'Completed');
    toast('SkillSwap completed! Credits transferred ⚡', 'success');
    refetch();
  };

  const handleDelete = (listingId) => {
    deleteListing(listingId);
    toast('Listing removed', 'info');
    refetch();
  };

  const STAT_CARDS = [
    { icon: <Zap size={22} />, label: 'Total Credits', value: user.credits ?? 0, color: '#818cf8', bg: 'rgba(99,102,241,0.12)', suffix: '' },
    { icon: <TrendingUp size={22} />, label: 'Credits Earned', value: user.creditsEarned ?? 0, color: '#34d399', bg: 'rgba(16,185,129,0.12)' },
    { icon: <ArrowLeftRight size={22} />, label: 'Credits Spent', value: user.creditsSpent ?? 0, color: '#f472b6', bg: 'rgba(236,72,153,0.12)' },
    { icon: <CheckCircle size={22} />, label: 'Completed Swaps', value: user.completedSwaps ?? 0, color: '#22d3ee', bg: 'rgba(6,182,212,0.12)' },
    { icon: <Clock size={22} />, label: 'Hours on App', value: (user.totalHoursOnApp ?? 0).toFixed(1), color: '#fbbf24', bg: 'rgba(245,158,11,0.12)' },
    { icon: <BookOpen size={22} />, label: 'Hours Learned', value: (user.totalHoursLearned ?? 0).toFixed(1), color: '#c084fc', bg: 'rgba(168,85,247,0.12)' },
  ];

  return (
    <div className="page dash-page">
      <div className="dash-bg-orbs">
        <div className="orb orb-1" style={{ opacity: 0.5 }} />
        <div className="orb orb-3" style={{ opacity: 0.3 }} />
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="dash-header animate-fade-in-up">
          <div className="dash-greeting">
            <div className="dash-avatar-wrap">
              <img src={user.avatar} alt={user.name} className="avatar avatar-lg avatar-glow" />
              {(user.dailyStreakDays || 0) >= 3 && (
                <div className="dash-streak-crown">
                  <Flame size={16} style={{ color: '#f97316' }} />
                </div>
              )}
            </div>
            <div>
              <h1 className="dash-title">
                Hey, <span className="text-gradient">{user.name.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-secondary text-sm">
                {user.dailyStreakDays >= 7 ? '🔥 On fire! ' : ''}{user.dailyStreakDays || 1}-day streak · Rank #{getRank(user.userId)} on campus
              </p>
            </div>
          </div>
          <div className="dash-header-actions">
            <Link to="/leaderboard" className="btn btn-secondary">
              <Trophy size={15} /> Leaderboard
            </Link>
            <Link to="/create-listing" className="btn btn-primary" id="dash-post-btn">
              <Plus size={16} /> Post a Skill
            </Link>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="dash-stats">
          {STAT_CARDS.map((s, i) => (
            <div key={s.label} className={`card-stat dash-stat animate-fade-in-up stagger-${i + 1}`}>
              <div className="dash-stat-icon" style={{ background: s.bg, color: s.color }}>
                {s.icon}
              </div>
              <div>
                <div className="dash-stat-value" style={{ color: s.color }}>{s.value}</div>
                <div className="dash-stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Daily Streak Mini Banner */}
        {(user.dailyStreakDays || 0) > 0 && (
          <div className="dash-streak-banner animate-fade-in-up">
            <div className="dash-streak-fire animate-fire">🔥</div>
            <div>
              <div className="dash-streak-main">{user.dailyStreakDays || 1} Day Streak!</div>
              <div className="text-xs text-secondary">You've been active {user.dailyStreakDays || 1} days in a row. Keep it up!</div>
            </div>
            <div className="dash-streak-dots">
              {Array.from({ length: Math.min(7, user.dailyStreakDays || 1) }).map((_, i) => (
                <div key={i} className="dash-streak-dot active" style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
              {Array.from({ length: Math.max(0, 7 - (user.dailyStreakDays || 1)) }).map((_, i) => (
                <div key={`e${i}`} className="dash-streak-dot" />
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="dash-tabs">
          {TABS.map((t) => (
            <button
              key={t.key}
              className={`dash-tab ${tab === t.key ? 'active' : ''}`}
              onClick={() => setTab(t.key)}
              id={`dash-tab-${t.key}`}
            >
              {t.label}
              {t.key === 'overview' && activeSwaps.length > 0 && <span className="dash-tab-count">{activeSwaps.length}</span>}
              {t.key === 'ai' && <span className="dash-tab-count new">NEW</span>}
            </button>
          ))}
        </div>

        {/* ── Tab: Active Swaps ────────────────────────────── */}
        {tab === 'overview' && (
          <div>
            {activeSwaps.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">🤝</div>
                <h3>No active swaps</h3>
                <p className="text-muted">Go to the marketplace and request your first skill swap!</p>
                <Link to="/marketplace" className="btn btn-primary mt-2">Browse Marketplace</Link>
              </div>
            ) : (
              <div className="swaps-list">
                {activeSwaps.map((swap) => (
                  <SwapCard key={swap.swapId} swap={swap} currentUser={user} onComplete={handleComplete} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Completed ───────────────────────────────── */}
        {tab === 'completed' && (
          <div>
            {completedSwaps.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">✅</div><h3>No completed swaps yet</h3></div>
            ) : (
              <div className="swaps-list">
                {completedSwaps.map((swap) => (
                  <SwapCard key={swap.swapId} swap={swap} currentUser={user} completed />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: My Listings ────────────────────────────── */}
        {tab === 'listings' && (
          <div>
            {listings.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <h3>No listings yet</h3>
                <Link to="/create-listing" className="btn btn-primary mt-2"><Plus size={15} /> Post Your First Skill</Link>
              </div>
            ) : (
              <div className="listings-list">
                {listings.map((listing) => (
                  <div key={listing.listingId} className="listing-row card">
                    <div style={{ flex: 1 }}>
                      <div className="flex items-center gap-1 mb-1 flex-wrap">
                        <span className="skill-chip skill-offered">{listing.skillOffered}</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>
                        <span className="skill-chip skill-needed">{listing.skillNeeded}</span>
                        <span className="skill-chip skill-category">{listing.category}</span>
                      </div>
                      <h3 className="listing-row-title">{listing.title}</h3>
                      <div className="text-xs text-muted" style={{ marginTop: '0.25rem' }}>
                        {new Date(listing.timestamp).toLocaleDateString()} · {listing.duration} · {listing.likes || 0} likes
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Link to={`/listing/${listing.listingId}`} className="btn btn-secondary btn-sm">View</Link>
                      <button id={`del-${listing.listingId}`} className="btn btn-danger btn-sm" onClick={() => handleDelete(listing.listingId)}>
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Streaks ─────────────────────────────────── */}
        {tab === 'streaks' && <StreaksTab user={user} />}

        {/* ── Tab: Activity Log ────────────────────────────── */}
        {tab === 'activity' && <ActivityTab logs={activityLogs} user={user} />}

        {/* ── Tab: AI Suggestions ──────────────────────────── */}
        {tab === 'ai' && <AITab suggestions={aiSuggestions} />}

        {/* ── Tab: Badges ──────────────────────────────────── */}
        {tab === 'badges' && <BadgesTab user={user} />}

        {/* ── Tab: Group Sessions ──────────────────────────── */}
        {tab === 'groups' && <GroupSessionsTab sessions={groupSessions} userId={user.userId} />}
      </div>
    </div>
  );
}

// ── Streaks Tab ────────────────────────────────────────────────────────────────

function StreaksTab({ user }) {
  const streakData = Object.entries(user.streaks || {});
  const dailyStreak = user.dailyStreakDays || 0;
  const totalSwaps = user.completedSwaps || 0;

  const milestones = [
    { target: 3, label: '3-day streak', icon: '🔥', color: '#fbbf24' },
    { target: 7, label: 'Week warrior', icon: '⚡', color: '#818cf8' },
    { target: 14, label: '2-week champion', icon: '🏆', color: '#22d3ee' },
    { target: 30, label: 'Monthly master', icon: '👑', color: '#f97316' },
  ];

  return (
    <div className="streak-tab animate-fade-in-up">
      {/* Daily streak hero */}
      <div className="streak-hero card-glow card">
        <div className="streak-hero-fire animate-fire">🔥</div>
        <div className="streak-hero-main">
          <div className="streak-hero-num text-gradient-warm">{dailyStreak}</div>
          <div className="streak-hero-label">Day Streak</div>
        </div>
        <div className="streak-hero-info">
          <p>You've been active <strong>{dailyStreak} consecutive days</strong> on SkillSwap. Don't break the chain!</p>
          <div className="streak-calendar">
            {Array.from({ length: 14 }).map((_, i) => {
              const isActive = i >= (14 - Math.min(14, dailyStreak));
              return (
                <div
                  key={i}
                  className={`streak-day ${isActive ? 'active' : ''}`}
                  style={{ animationDelay: `${i * 50}ms` }}
                />
              );
            })}
          </div>
          <div className="text-xs text-muted mt-1">Last 14 days</div>
        </div>
      </div>

      {/* Milestones */}
      <h3 className="dash-section-title mb-2 mt-3"><Target size={16} /> Daily Streak Milestones</h3>
      <div className="streak-milestones">
        {milestones.map((m) => {
          const done = dailyStreak >= m.target;
          const progress = Math.min(100, (dailyStreak / m.target) * 100);
          return (
            <div key={m.target} className={`streak-milestone card ${done ? 'done' : ''}`}>
              <div className="streak-milestone-icon" style={{ opacity: done ? 1 : 0.4 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="flex justify-between mb-1">
                  <span className="font-semibold text-sm">{m.label}</span>
                  <span className="text-xs text-muted">{Math.min(dailyStreak, m.target)}/{m.target} days</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: m.color }} />
                </div>
              </div>
              {done && <span className="badge badge-success">✓ Done</span>}
            </div>
          );
        })}
      </div>

      {/* Partner streaks */}
      {streakData.length > 0 && (
        <>
          <h3 className="dash-section-title mb-2 mt-3"><Flame size={16} /> Partner Streaks</h3>
          <div className="partner-streaks">
            {streakData.map(([partnerId, count]) => {
              const partner = getUserById(partnerId);
              if (!partner) return null;
              return (
                <div key={partnerId} className="partner-streak-card card">
                  <Link to={`/profile/${partnerId}`}>
                    <img src={partner.avatar} alt={partner.name} className="avatar avatar-md" />
                  </Link>
                  <div style={{ flex: 1 }}>
                    <div className="font-semibold">{partner.name}</div>
                    <div className="text-xs text-secondary">{count} swap{count !== 1 ? 's' : ''} together</div>
                    <div className="progress-bar mt-1">
                      <div className="progress-fill" style={{ width: `${Math.min(100, count * 20)}%` }} />
                    </div>
                  </div>
                  <div className="partner-streak-num">
                    <Flame size={14} style={{ color: '#f97316' }} />
                    <span className="text-orange font-bold text-lg">{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Swap milestones */}
      <h3 className="dash-section-title mb-2 mt-3"><Trophy size={16} /> Swap Milestones</h3>
      <div className="swap-milestones">
        {[1, 3, 5, 10, 20].map((target) => {
          const done = totalSwaps >= target;
          return (
            <div key={target} className={`swap-milestone ${done ? 'done' : ''}`}>
              <div className="swap-milestone-icon">{done ? '✅' : '⬜'}</div>
              <div className="text-sm">
                <span className={done ? 'text-success font-semibold' : 'text-muted'}>{target} swap{target !== 1 ? 's' : ''}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Activity Log Tab ──────────────────────────────────────────────────────────

function ActivityTab({ logs, user }) {
  const totalHours = (user.totalHoursOnApp || 0).toFixed(1);
  const totalLearned = (user.totalHoursLearned || 0).toFixed(1);
  const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const weekData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(Date.now() - (6 - i) * 86400000).toISOString().split('T')[0];
    const log = logs.find((l) => l.date === d);
    return { date: d, hours: log?.hoursOnApp || 0, learned: log?.hoursLearned || 0 };
  });
  const maxHours = Math.max(...weekData.map((w) => w.hours), 1);

  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="activity-tab animate-fade-in-up">
      {/* Summary cards */}
      <div className="grid-2 mb-3">
        <div className="card-stat card">
          <div className="dash-stat-icon" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}><Clock size={22} /></div>
          <div>
            <div className="dash-stat-value" style={{ color: '#818cf8' }}>{totalHours}h</div>
            <div className="dash-stat-label">Total Time on App</div>
          </div>
        </div>
        <div className="card-stat card">
          <div className="dash-stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#34d399' }}><BookOpen size={22} /></div>
          <div>
            <div className="dash-stat-value" style={{ color: '#34d399' }}>{totalLearned}h</div>
            <div className="dash-stat-label">Hours Spent Learning</div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card mb-3">
        <h3 className="dash-section-title mb-3"><BarChart2 size={16} /> This Week's Activity</h3>
        <div className="activity-chart">
          {weekData.map((day, i) => (
            <div key={day.date} className="activity-bar-col">
              <div className="activity-bar-wrap">
                <div
                  className="activity-bar"
                  style={{ height: `${(day.hours / maxHours) * 100}%` }}
                  title={`${day.hours}h on app, ${day.learned}h learned`}
                >
                  <div
                    className="activity-bar-learned"
                    style={{ height: `${day.hours > 0 ? (day.learned / day.hours) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="activity-bar-label">{dayLabels[i]}</div>
              <div className="activity-bar-val">{day.hours > 0 ? `${day.hours}h` : ''}</div>
            </div>
          ))}
        </div>
        <div className="activity-legend">
          <span className="activity-legend-item"><span style={{ background: '#818cf8' }} /> App time</span>
          <span className="activity-legend-item"><span style={{ background: '#34d399' }} /> Learning</span>
        </div>
      </div>

      {/* Log entries */}
      <h3 className="dash-section-title mb-2"><List size={16} /> Recent Activity</h3>
      {sortedLogs.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">📊</div><p>No activity logged yet. Start using the app!</p></div>
      ) : (
        <div className="activity-log-list">
          {sortedLogs.slice(0, 10).map((log) => (
            <div key={log.logId} className="activity-log-row card">
              <div className="activity-log-date">
                <Calendar size={14} />
                {new Date(log.date).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <div style={{ flex: 1 }}>
                <div className="font-medium text-sm">{log.action || 'App activity'}</div>
                <div className="flex gap-2 mt-1">
                  <span className="badge badge-primary"><Clock size={10} /> {log.hoursOnApp?.toFixed(1) || 0}h on app</span>
                  {(log.hoursLearned || 0) > 0 && (
                    <span className="badge badge-success"><BookOpen size={10} /> {log.hoursLearned.toFixed(1)}h learned</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AI Suggestions Tab ────────────────────────────────────────────────────────

function AITab({ suggestions }) {
  return (
    <div className="ai-tab animate-fade-in-up">
      <div className="ai-header card" style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(236,72,153,0.1))', border: '1px solid rgba(99,102,241,0.25)', marginBottom: '2rem' }}>
        <div className="flex items-center gap-2 mb-2">
          <div className="ai-brain-icon animate-pulse-glow">
            <Brain size={28} style={{ color: '#818cf8' }} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem' }}>AI Skill Engine</h2>
            <p className="text-xs text-secondary">Personalized recommendations powered by your goals & activity</p>
          </div>
        </div>
        <div className="cyber-line" />
      </div>

      {/* Skill suggestions */}
      <h3 className="dash-section-title mb-2"><Sparkles size={16} style={{ color: '#fbbf24' }} /> Recommended Skills for You</h3>
      {suggestions.skills.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">🤖</div><p>Set your skills needed in your profile to get suggestions!</p></div>
      ) : (
        <div className="ai-skills-list mb-4">
          {suggestions.skills.map((s) => (
            <div key={s.listingId} className="ai-skill-card card">
              <div className="ai-skill-meta">
                <div className={`ai-badge ${s.type === 'skill' ? 'ai-badge-match' : 'ai-badge-trend'}`}>
                  {s.type === 'skill' ? '🎯 Perfect Match' : '🔥 Trending'}
                </div>
                <div className="ai-score">
                  <div className="ai-score-ring" style={{ '--pct': s.score }}>
                    <span>{s.score}%</span>
                  </div>
                </div>
              </div>
              <h4 className="ai-skill-title">{s.listing?.title}</h4>
              <p className="text-xs text-secondary">{s.reason}</p>
              <div className="flex gap-1 mt-2 flex-wrap">
                <span className="skill-chip skill-offered">{s.listing?.skillOffered}</span>
                <span className="badge badge-neutral">{s.listing?.duration}</span>
              </div>
              <Link to={`/listing/${s.listingId}`} className="btn btn-primary btn-sm mt-2" style={{ alignSelf: 'flex-start' }}>
                View Listing <ChevronRight size={13} />
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Friend suggestions */}
      <h3 className="dash-section-title mb-2"><Users size={16} style={{ color: '#22d3ee' }} /> Suggested Study Partners</h3>
      {suggestions.friends.length === 0 ? (
        <div className="empty-state"><div className="empty-icon">👥</div><p>Update your skills profile to get friend suggestions!</p></div>
      ) : (
        <div className="ai-friends-grid">
          {suggestions.friends.map((f) => (
            <div key={f.user.userId} className="ai-friend-card card card-3d">
              <div className="ai-friend-header">
                <img src={f.user.avatar} alt={f.user.name} className="avatar avatar-lg avatar-glow" />
                <div className="ai-compatibility">
                  <div className="ai-compat-ring" style={{ '--score': f.score }}>
                    <span className="text-xs font-bold">{Math.min(99, f.score)}%</span>
                  </div>
                  <div className="text-xs text-muted">match</div>
                </div>
              </div>
              <div className="font-semibold">{f.user.name}</div>
              <p className="text-xs text-secondary">{f.reason}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(f.user.skillsOffered || []).slice(0, 3).map((s) => (
                  <span key={s} className="skill-chip skill-offered" style={{ fontSize: '0.7rem', padding: '0.15rem 0.5rem' }}>{s}</span>
                ))}
              </div>
              <div className="flex gap-1 mt-2">
                <Link to={`/profile/${f.user.userId}`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Profile</Link>
                <Link to="/marketplace" className="btn btn-primary btn-sm" style={{ flex: 1 }}>Connect</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Badges Tab ────────────────────────────────────────────────────────────────

function BadgesTab({ user }) {
  const earned = user.badges || [];
  const allBadges = BADGE_RULES;

  return (
    <div className="badges-tab animate-fade-in-up">
      <div className="badges-summary mb-3">
        <div className="badge-count-hero">
          <span className="text-gradient" style={{ fontSize: '3rem', fontWeight: 900 }}>{earned.length}</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>/ {allBadges.length} badges earned</span>
        </div>
        <div className="progress-bar" style={{ maxWidth: 300 }}>
          <div className="progress-fill" style={{ width: `${(earned.length / allBadges.length) * 100}%` }} />
        </div>
      </div>

      <div className="badges-full-grid">
        {allBadges.map((rule) => {
          const hasIt = earned.includes(rule.badge);
          const progress = rule.condition(user) ? 100 : getProgress(rule, user);
          return (
            <div
              key={rule.badge}
              className={`badge-full-card card ${hasIt ? 'badge-earned' : 'badge-locked'}`}
              style={{ '--badge-color': rule.color }}
            >
              <div className="badge-full-icon-wrap">
                <span className="badge-full-icon">{rule.icon}</span>
                {!hasIt && <div className="badge-lock">🔒</div>}
              </div>
              <div className="badge-full-name" style={{ color: hasIt ? rule.color : 'var(--text-muted)' }}>
                {rule.badge}
              </div>
              <div className="badge-full-desc">{rule.desc}</div>
              <div className="progress-bar mt-1">
                <div className="progress-fill" style={{ width: `${progress}%`, background: rule.color }} />
              </div>
              <div className="text-xs text-muted mt-1 text-right">{progress}% complete</div>
              {hasIt && (
                <div className="badge badge-success" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>✓ Earned!</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function getProgress(rule, user) {
  if (rule.badge === 'Study Mentor') return Math.min(100, (user.completedSwaps / 2) * 100);
  if (rule.badge === 'Skill Champion') return Math.min(100, (user.completedSwaps / 5) * 100);
  if (rule.badge === 'Streak Master') return Math.min(100, ((user.dailyStreakDays || 0) / 7) * 100);
  if (rule.badge === 'Social Butterfly') return Math.min(100, (Object.keys(user.streaks || {}).length / 3) * 100);
  if (rule.badge === 'Quick Learner') return Math.min(100, ((user.totalHoursLearned || 0) / 5) * 100);
  return 10;
}

// ── Group Sessions Tab ────────────────────────────────────────────────────────

function GroupSessionsTab({ sessions, userId }) {
  const hosted = sessions.filter((s) => s.hostId === userId);
  const joined = sessions.filter((s) => s.participants.includes(userId));

  const SessionMini = ({ session }) => {
    const host = getUserById(session.hostId);
    const statusColor = session.status === 'Upcoming' ? '#34d399' : '#818cf8';
    return (
      <div className="card gs-mini-card">
        <div className="flex justify-between items-start mb-1">
          <span className="badge" style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>{session.status}</span>
          <span className="text-xs text-muted"><Zap size={10} /> {session.creditsPerSession} credits</span>
        </div>
        <h4 style={{ fontSize: '0.95rem', marginBottom: '0.35rem' }}>{session.title}</h4>
        <div className="text-xs text-secondary mb-2">
          {new Date(session.scheduledAt).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          {' · '}{session.duration}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-muted"><Users size={10} /> {session.participants.length}/{session.maxParticipants} participants</div>
          <Link to="/group-sessions" className="btn btn-sm btn-ghost">View →</Link>
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in-up">
      <div className="flex justify-between items-center mb-3">
        <h3 className="dash-section-title"><Users size={16} /> My Group Sessions</h3>
        <Link to="/group-sessions" className="btn btn-primary btn-sm"><Plus size={13} /> Browse All</Link>
      </div>

      {hosted.length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-secondary mb-2 mt-2">Hosting ({hosted.length})</h4>
          <div className="grid-auto-sm mb-3">
            {hosted.map((s) => <SessionMini key={s.sessionId} session={s} />)}
          </div>
        </>
      )}

      {joined.length > 0 && (
        <>
          <h4 className="text-sm font-semibold text-secondary mb-2 mt-2">Joined ({joined.length})</h4>
          <div className="grid-auto-sm">
            {joined.map((s) => <SessionMini key={s.sessionId} session={s} />)}
          </div>
        </>
      )}

      {sessions.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">👥</div>
          <h3>No group sessions yet</h3>
          <p className="text-muted">Join or host a group session to learn with others!</p>
          <Link to="/group-sessions" className="btn btn-primary mt-2"><Users size={15} /> Explore Group Sessions</Link>
        </div>
      )}
    </div>
  );
}

// ── SwapCard ──────────────────────────────────────────────────────────────────

function SwapCard({ swap, currentUser, onComplete, completed }) {
  const listing = getListings().find((l) => l.listingId === swap.listingId);
  const otherUserId = swap.userA === currentUser.userId ? swap.userB : swap.userA;
  const otherUser = getUserById(otherUserId);
  const statusStyle = STATUS_COLORS[swap.status] || STATUS_COLORS.Pending;
  const isProvider = swap.userA === currentUser.userId;
  const streak = (currentUser.streaks || {})[otherUserId] || 0;

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="swap-card card card-3d">
      <div className="swap-card-head">
        <div className="flex items-center gap-1">
          {otherUser && (
            <Link to={`/profile/${otherUser.userId}`}>
              <img src={otherUser.avatar} alt={otherUser.name} className="avatar avatar-md" />
            </Link>
          )}
          <div>
            <div className="font-semibold">{otherUser?.name || 'Unknown User'}</div>
            <div className="text-xs text-muted">{timeAgo(swap.timestamp)}</div>
          </div>
          {streak >= 2 && (
            <div className="streak-badge"><Flame size={12} /> {streak}🔥 Streak</div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <div className="badge" style={{ background: statusStyle.bg, color: statusStyle.color, border: `1px solid ${statusStyle.border}` }}>
            {swap.status}
          </div>
          <div className="credit-badge-mini">
            <Zap size={10} /> {swap.creditsTransferred} credit{swap.creditsTransferred !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {listing && (
        <div className="swap-card-listing">
          <span className="text-xs text-muted">Listing:</span>
          <Link to={`/listing/${listing.listingId}`} className="swap-listing-title">{listing.title}</Link>
        </div>
      )}

      <div className="swap-card-roles">
        <div className={`role-pill ${isProvider ? 'role-provider' : 'role-receiver'}`}>
          {isProvider ? '🟢 You are providing' : '🔵 You are receiving'}
        </div>
      </div>

      {!completed && swap.status === 'Pending' && isProvider && (
        <button className="btn btn-primary btn-sm" onClick={() => onComplete(swap.swapId)} id={`complete-${swap.swapId}`}>
          <CheckCircle size={14} /> Mark as Completed
        </button>
      )}
    </div>
  );
}

function getRank(userId) {
  try {
    const lb = getLeaderboard();
    const idx = lb.findIndex((u) => u.userId === userId);
    return idx === -1 ? '?' : idx + 1;
  } catch {
    return '?';
  }
}
