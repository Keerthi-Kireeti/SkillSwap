import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  getGroupSessions, createGroupSession, joinGroupSession, leaveGroupSession,
  getUserById, CATEGORIES
} from '../data/store';
import { Users, Clock, Zap, Plus, Calendar, BookOpen, Search, Filter, Globe, Lock } from 'lucide-react';
import './GroupSessions.css';

const CATEGORY_ICONS = {
  Coding: '💻', Design: '🎨', Tutoring: '📚', Music: '🎵',
  Languages: '🌍', 'Video Editing': '🎬', Photography: '📸', Writing: '✍️', Other: '🔮', All: '✨',
};

export default function GroupSessions() {
  const { user, refreshUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setSessions(getGroupSessions());
  }, [tick]);

  const refetch = () => { setTick((t) => t + 1); refreshUser(); };

  const filteredSessions = sessions.filter((s) => {
    const matchCat = filter === 'All' || s.category === filter;
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.subject.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleJoin = (sessionId) => {
    if (!user) { navigate('/auth'); return; }
    const result = joinGroupSession(sessionId, user.userId);
    if (result.success) {
      toast('Joined session! 🎉 Check your dashboard for details.', 'success');
      refetch();
    } else {
      toast(result.error, 'error');
    }
  };

  const handleLeave = (sessionId) => {
    leaveGroupSession(sessionId, user.userId);
    toast('Left the session', 'info');
    refetch();
  };

  return (
    <div className="page gs-page">
      <div className="gs-orbs">
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="container">
        {/* Header */}
        <div className="gs-header animate-fade-in-up">
          <div>
            <div className="section-pill"><Users size={12} /> Group Sessions</div>
            <h1 className="gs-title">Learn Together, <span className="text-gradient">Grow Together</span></h1>
            <p className="gs-subtitle">
              Join group sessions where one expert teaches many students with the same interest. 
              More value, less credits! 🔥
            </p>
          </div>
          {user && (
            <button className="btn btn-primary btn-lg" onClick={() => setShowCreate(true)} id="create-session-btn">
              <Plus size={18} /> Host a Session
            </button>
          )}
        </div>

        {/* Stats bar */}
        <div className="gs-stats-bar animate-fade-in-up stagger-1">
          <div className="gs-stat-item">
            <span className="gs-stat-val">{sessions.filter(s => s.status === 'Upcoming').length}</span>
            <span className="gs-stat-label">Upcoming</span>
          </div>
          <div className="gs-stat-divider" />
          <div className="gs-stat-item">
            <span className="gs-stat-val">{sessions.reduce((acc, s) => acc + s.participants.length, 0)}</span>
            <span className="gs-stat-label">Learners Joined</span>
          </div>
          <div className="gs-stat-divider" />
          <div className="gs-stat-item">
            <span className="gs-stat-val">{new Set(sessions.map(s => s.subject)).size}</span>
            <span className="gs-stat-label">Topics Covered</span>
          </div>
          <div className="gs-stat-divider" />
          <div className="gs-stat-item">
            <span className="gs-stat-val">{sessions.filter(s => s.status === 'Completed').length}</span>
            <span className="gs-stat-label">Completed</span>
          </div>
        </div>

        {/* Filters */}
        <div className="gs-filters animate-fade-in-up stagger-2">
          <div className="gs-search-wrap">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              className="gs-search"
              placeholder="Search sessions, topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="gs-cats">
            {['All', 'Coding', 'Design', 'Music', 'Languages', 'Tutoring'].map((cat) => (
              <button
                key={cat}
                className={`gs-cat-btn ${filter === cat ? 'active' : ''}`}
                onClick={() => setFilter(cat)}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Sessions Grid */}
        {filteredSessions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <h3>No sessions found</h3>
            <p className="text-muted">Be the first to host a group session!</p>
            {user && <button className="btn btn-primary mt-2" onClick={() => setShowCreate(true)}>Host a Session</button>}
          </div>
        ) : (
          <div className="gs-grid">
            {filteredSessions.map((session, i) => (
              <SessionCard
                key={session.sessionId}
                session={session}
                currentUser={user}
                onJoin={handleJoin}
                onLeave={handleLeave}
                delay={i * 80}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateSessionModal
          user={user}
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); refetch(); toast('Session created! Students can now join 🚀', 'success'); }}
        />
      )}
    </div>
  );
}

function SessionCard({ session, currentUser, onJoin, onLeave, delay }) {
  const host = getUserById(session.hostId);
  const isJoined = currentUser && session.participants.includes(currentUser.userId);
  const isHost = currentUser && session.hostId === currentUser.userId;
  const isFull = session.participants.length >= session.maxParticipants;
  const spotsLeft = session.maxParticipants - session.participants.length;
  const scheduledDate = new Date(session.scheduledAt);
  const isPast = scheduledDate < new Date();
  const catIcon = CATEGORY_ICONS[session.category] || '📖';

  const formatDate = (date) => {
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const statusColor = session.status === 'Upcoming' ? '#34d399' : session.status === 'Completed' ? '#818cf8' : '#fbbf24';

  return (
    <div
      className="gs-card card card-3d animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Category banner */}
      <div className="gs-card-banner" style={{ '--cat-color': getCatColor(session.category) }}>
        <span className="gs-cat-emoji">{catIcon}</span>
        <div className="gs-card-badges">
          <span className="badge" style={{ background: `${statusColor}22`, color: statusColor, border: `1px solid ${statusColor}44` }}>
            {session.status}
          </span>
          <span className="badge badge-neutral">{session.category}</span>
        </div>
      </div>

      <h3 className="gs-card-title">{session.title}</h3>
      <p className="gs-card-desc">{session.description}</p>

      {/* Tags */}
      <div className="gs-tags">
        {(session.tags || []).map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="gs-card-meta">
        <div className="gs-meta-item">
          <Calendar size={14} style={{ color: 'var(--text-muted)' }} />
          <span>{formatDate(session.scheduledAt)}</span>
        </div>
        <div className="gs-meta-item">
          <Clock size={14} style={{ color: 'var(--text-muted)' }} />
          <span>{session.duration}</span>
        </div>
        <div className="gs-meta-item">
          <Zap size={14} style={{ color: '#fbbf24' }} />
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>{session.creditsPerSession} credits</span>
        </div>
      </div>

      {/* Participants */}
      <div className="gs-participants">
        <div className="gs-avatar-stack">
          {session.participants.slice(0, 5).map((pId) => {
            const p = getUserById(pId);
            return p ? (
              <img key={pId} src={p.avatar} alt={p.name} className="avatar avatar-sm gs-stacked-avatar" title={p.name} />
            ) : null;
          })}
        </div>
        <div className="gs-spots">
          <span className={spotsLeft === 0 ? 'text-danger' : spotsLeft <= 2 ? 'text-warning' : 'text-success'}>
            {spotsLeft === 0 ? 'Full' : `${spotsLeft} spot${spotsLeft !== 1 ? 's' : ''} left`}
          </span>
          <span className="text-muted"> · {session.participants.length}/{session.maxParticipants}</span>
        </div>
      </div>

      {/* Host */}
      {host && (
        <div className="gs-host">
          <img src={host.avatar} alt={host.name} className="avatar avatar-sm" />
          <span className="text-xs text-secondary">Hosted by <strong>{host.name}</strong></span>
          {isHost && <span className="badge badge-primary" style={{ marginLeft: 'auto' }}>You</span>}
        </div>
      )}

      {/* Actions */}
      <div className="gs-card-actions">
        {isHost ? (
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} disabled>
            You're hosting 📋
          </button>
        ) : isJoined ? (
          <>
            <a href={session.meetLink} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm" style={{ flex: 1 }}>
              <Globe size={13} /> Join Meeting
            </a>
            <button className="btn btn-danger btn-sm" onClick={() => onLeave(session.sessionId)}>Leave</button>
          </>
        ) : session.status === 'Completed' || isPast ? (
          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} disabled>Session Ended</button>
        ) : (
          <button
            className="btn btn-primary btn-sm"
            style={{ flex: 1 }}
            onClick={() => onJoin(session.sessionId)}
            disabled={isFull}
            id={`join-session-${session.sessionId}`}
          >
            <Users size={13} />
            {isFull ? 'Session Full' : `Join · ${session.creditsPerSession} credit${session.creditsPerSession !== 1 ? 's' : ''}`}
          </button>
        )}
      </div>
    </div>
  );
}

function CreateSessionModal({ user, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: '', description: '', subject: '', category: 'Coding',
    maxParticipants: 8, creditsPerSession: 2, duration: '1 hour',
    scheduledAt: '', meetLink: '', tags: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.subject || !form.scheduledAt) return;
    setLoading(true);
    setTimeout(() => {
      createGroupSession({
        ...form,
        hostId: user.userId,
        maxParticipants: Number(form.maxParticipants),
        creditsPerSession: Number(form.creditsPerSession),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      setLoading(false);
      onCreated();
    }, 600);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 600 }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h2 style={{ fontSize: '1.4rem' }}>🎓 Host a Group Session</h2>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Session Title *</label>
            <input className="form-input" placeholder="e.g. Python for Beginners — Weekly Bootcamp" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Subject / Topic *</label>
              <input className="form-input" placeholder="e.g. Python, Guitar, Spanish" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.filter(c => c !== 'All').map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea className="form-textarea" placeholder="What will participants learn? Who is it for?" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Schedule Date & Time *</label>
              <input type="datetime-local" className="form-input" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">Duration</label>
              <select className="form-select" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })}>
                {['30 min', '45 min', '1 hour', '90 min', '2 hours'].map((d) => <option key={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Max Participants</label>
              <input type="number" className="form-input" min={2} max={50} value={form.maxParticipants} onChange={(e) => setForm({ ...form, maxParticipants: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Credits per Participant</label>
              <input type="number" className="form-input" min={1} max={10} value={form.creditsPerSession} onChange={(e) => setForm({ ...form, creditsPerSession: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Meet / Zoom Link (optional)</label>
            <input className="form-input" placeholder="https://meet.google.com/..." value={form.meetLink} onChange={(e) => setForm({ ...form, meetLink: e.target.value })} />
          </div>
          <div className="form-group">
            <label className="form-label">Tags (comma-separated)</label>
            <input className="form-input" placeholder="Python, Beginner, Programming" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
          </div>
          <div className="flex gap-1 mt-1">
            <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading} id="submit-session-btn">
              {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><Plus size={16} /> Create Session</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function getCatColor(cat) {
  const colors = {
    Coding: '#818cf8', Design: '#f472b6', Music: '#fbbf24',
    Languages: '#34d399', Tutoring: '#22d3ee', 'Video Editing': '#fb923c',
  };
  return colors[cat] || '#818cf8';
}
