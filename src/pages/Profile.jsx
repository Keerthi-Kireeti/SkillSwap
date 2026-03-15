import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import {
  getUserById, getListings, getSwapsByUser, createSwap, updateUser, BADGE_ICONS
} from '../data/store';
import { Zap, Edit3, Star, Award, Flame, CheckCircle, ArrowLeftRight, Plus, X, Save } from 'lucide-react';
import SkillCard from '../components/SkillCard';
import './Profile.css';

export default function Profile() {
  const { userId } = useParams();
  const { user: currentUser, refreshUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [editing, setEditing] = useState(false);
  const [tick, setTick] = useState(0);

  const profileUser = getUserById(userId);
  const isOwn = currentUser?.userId === userId;

  if (!profileUser) {
    return (
      <div className="page">
        <div className="container text-center">
          <div className="empty-state">
            <div className="empty-icon">👤</div>
            <h2>User not found</h2>
            <Link to="/marketplace" className="btn btn-primary mt-2">Go to Marketplace</Link>
          </div>
        </div>
      </div>
    );
  }

  const listings = getListings().filter((l) => l.createdBy === profileUser.userId);
  const swaps = getSwapsByUser(profileUser.userId);
  const completedSwaps = swaps.filter((s) => s.status === 'Completed');
  const streak = currentUser ? (currentUser.streaks?.[userId] || 0) : 0;

  // Edit state
  const [editForm, setEditForm] = useState({
    skillsOffered: (profileUser.skillsOffered || []).join(', '),
    skillsNeeded: (profileUser.skillsNeeded || []).join(', '),
    name: profileUser.name,
  });
  const setEdit = (k, v) => setEditForm((f) => ({ ...f, [k]: v }));

  const saveProfile = () => {
    updateUser(userId, {
      name: editForm.name.trim() || profileUser.name,
      skillsOffered: editForm.skillsOffered.split(',').map((s) => s.trim()).filter(Boolean),
      skillsNeeded: editForm.skillsNeeded.split(',').map((s) => s.trim()).filter(Boolean),
    });
    refreshUser();
    toast('Profile updated! 🎉', 'success');
    setEditing(false);
    setTick((t) => t + 1);
  };

  const handleSwapRequest = () => {
    if (!currentUser) { navigate('/auth'); return; }
    if (!listings.length) { toast("This user has no listings to swap with", 'info'); return; }
    createSwap({
      userA: profileUser.userId,
      userB: currentUser.userId,
      listingId: listings[0].listingId,
      creditsTransferred: 1,
    });
    toast(`Swap requested with ${profileUser.name}! 🚀`, 'success');
  };

  const freshUser = getUserById(userId);

  return (
    <div className="page">
      <div className="container">
        <div className="profile-layout">
          {/* Sidebar */}
          <aside className="profile-sidebar">
            <div className="profile-card card">
              <div className="profile-avatar-wrap">
                <img src={freshUser.avatar} alt={freshUser.name} className="profile-avatar" />
                {streak >= 2 && (
                  <div className="profile-streak"><Flame size={13} /> {streak} 🔥</div>
                )}
              </div>
              <h1 className="profile-name">{freshUser.name}</h1>
              <div className="text-muted text-sm text-center">{freshUser.email}</div>

              {freshUser.rating > 0 && (
                <div className="rating-row">
                  <Star size={14} fill="currentColor" style={{ color: '#fbbf24' }} />
                  <span className="font-bold">{freshUser.rating.toFixed(1)}</span>
                  <span className="text-muted text-sm">({freshUser.ratingCount} reviews)</span>
                </div>
              )}

              <div className="profile-stats-mini">
                <div className="stat-mini"><span className="stat-mini-val text-gradient">{freshUser.credits ?? 0}</span><span className="stat-mini-label">Credits</span></div>
                <div className="stat-mini"><span className="stat-mini-val" style={{ color: '#fbbf24' }}>{freshUser.completedSwaps ?? 0}</span><span className="stat-mini-label">Swaps</span></div>
                <div className="stat-mini"><span className="stat-mini-val" style={{ color: '#f472b6' }}>{freshUser.badges?.length ?? 0}</span><span className="stat-mini-label">Badges</span></div>
              </div>

              {!isOwn && currentUser && (
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleSwapRequest} id="request-swap-btn">
                  <ArrowLeftRight size={15} /> Request a Swap
                </button>
              )}
              {isOwn && (
                <button className="btn btn-secondary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setEditing(!editing)} id="edit-profile-btn">
                  <Edit3 size={15} /> {editing ? 'Cancel Editing' : 'Edit Profile'}
                </button>
              )}

              {/* Joined */}
              <div className="text-xs text-muted text-center">
                Joined {new Date(freshUser.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>

            {/* Badges */}
            {freshUser.badges?.length > 0 && (
              <div className="card profile-badges-card">
                <h3 className="profile-section-title"><Award size={16} /> Badges</h3>
                <div className="profile-badges-grid">
                  {freshUser.badges.map((b) => (
                    <div key={b} className="profile-badge-item" title={b}>
                      <span className="badge-big-icon">{BADGE_ICONS[b] || '🏅'}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center' }}>{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          {/* Main */}
          <main className="profile-main">
            {/* Edit Mode */}
            {editing && isOwn && (
              <div className="card mb-3 edit-form-card">
                <h3 className="profile-section-title mb-2"><Edit3 size={16} /> Edit Profile</h3>
                <div className="form-group mb-2">
                  <label className="form-label">Display Name</label>
                  <input id="edit-name" className="form-input" value={editForm.name} onChange={(e) => setEdit('name', e.target.value)} />
                </div>
                <div className="form-group mb-2">
                  <label className="form-label">Skills I Offer (comma-separated)</label>
                  <input id="edit-offered" className="form-input" placeholder="Python, Design, Guitar…" value={editForm.skillsOffered} onChange={(e) => setEdit('skillsOffered', e.target.value)} />
                </div>
                <div className="form-group mb-3">
                  <label className="form-label">Skills I Need (comma-separated)</label>
                  <input id="edit-needed" className="form-input" placeholder="React, Spanish, Video Editing…" value={editForm.skillsNeeded} onChange={(e) => setEdit('skillsNeeded', e.target.value)} />
                </div>
                <div className="flex gap-1">
                  <button className="btn btn-primary" onClick={saveProfile} id="save-profile-btn"><Save size={15} /> Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
                </div>
              </div>
            )}

            {/* Skills */}
            <div className="card mb-3">
              <h3 className="profile-section-title"><Zap size={16} /> Skills</h3>
              <div className="skills-section">
                <div>
                  <div className="skills-label">🟢 Offers</div>
                  <div className="skills-chips">
                    {(freshUser.skillsOffered || []).length > 0
                      ? freshUser.skillsOffered.map((s) => <span key={s} className="skill-chip skill-offered">{s}</span>)
                      : <span className="text-muted text-sm">{isOwn ? 'Add your skills above ↑' : 'No skills listed'}</span>
                    }
                  </div>
                </div>
                <div>
                  <div className="skills-label">🔵 Needs</div>
                  <div className="skills-chips">
                    {(freshUser.skillsNeeded || []).length > 0
                      ? freshUser.skillsNeeded.map((s) => <span key={s} className="skill-chip skill-needed">{s}</span>)
                      : <span className="text-muted text-sm">{isOwn ? 'Add what you need above ↑' : 'Nothing listed'}</span>
                    }
                  </div>
                </div>
              </div>
            </div>

            {/* Listings */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="profile-section-title"><Plus size={16} /> Skill Listings ({listings.length})</h3>
                {isOwn && <Link to="/create-listing" className="btn btn-primary btn-sm">+ Post Skill</Link>}
              </div>
              {listings.length > 0 ? (
                <div className="grid-auto">
                  {listings.map((l) => <SkillCard key={l.listingId} listing={l} />)}
                </div>
              ) : (
                <div className="empty-state" style={{ padding: '2rem' }}>
                  <div className="empty-icon" style={{ fontSize: '2rem' }}>📋</div>
                  <p className="text-muted">{isOwn ? 'Post your first skill!' : 'No listings yet'}</p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
