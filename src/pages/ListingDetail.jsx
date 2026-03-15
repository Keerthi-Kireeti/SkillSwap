import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { getListingById, getUserById, createSwap } from '../data/store';
import { ArrowLeft, Zap, Clock, ArrowLeftRight, Star, Award, Flame } from 'lucide-react';
import { BADGE_ICONS } from '../data/store';
import './ListingDetail.css';

const DURATION_CREDITS = { '10 min': 0.17, '15 min': 0.25, '30 min': 0.5, '1 hour': 1 };

export default function ListingDetail() {
  const { listingId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [swapping, setSwapping] = useState(false);

  const listing = getListingById(listingId);
  if (!listing) {
    return (
      <div className="page">
        <div className="container text-center">
          <div className="empty-state">
            <div className="empty-icon">❌</div>
            <h2>Listing not found</h2>
            <Link to="/marketplace" className="btn btn-primary mt-2">Back to Marketplace</Link>
          </div>
        </div>
      </div>
    );
  }

  const creator = getUserById(listing.createdBy);
  const isOwn = user?.userId === listing.createdBy;
  const credits = DURATION_CREDITS[listing.duration] || 1;
  const streak = user ? (user.streaks?.[listing.createdBy] || 0) : 0;

  const handleSwap = async () => {
    if (!user) { navigate('/auth'); return; }
    if (isOwn) { toast("That's your own listing!", 'info'); return; }
    setSwapping(true);
    await new Promise((r) => setTimeout(r, 800));
    createSwap({
      userA: listing.createdBy,
      userB: user.userId,
      listingId: listing.listingId,
      creditsTransferred: credits,
    });
    toast('Swap request sent! 🚀 Check your dashboard.', 'success');
    setSwapping(false);
  };

  const timeAgo = (ts) => {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'just now';
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  };

  return (
    <div className="page">
      <div className="container">
        {/* Back */}
        <Link to="/marketplace" className="btn btn-ghost btn-sm mb-3" style={{ gap: '0.4rem' }}>
          <ArrowLeft size={16} /> Back to Marketplace
        </Link>

        <div className="detail-layout">
          {/* Main */}
          <div className="detail-main">
            <div className="card detail-card">
              <div className="detail-cat">{listing.category}</div>
              <h1 className="detail-title">{listing.title}</h1>
              <div className="detail-meta">
                <div className="detail-meta-item"><Clock size={14} /> {listing.duration}</div>
                <div className="detail-meta-item"><Zap size={14} /> {credits === 1 ? '1 credit' : `${credits} credits`}</div>
                <div className="detail-meta-item text-muted">{timeAgo(listing.timestamp)}</div>
                <div className="detail-meta-item text-muted">❤️ {listing.likes || 0} likes</div>
              </div>

              <p className="detail-desc">{listing.description}</p>

              <div className="detail-swap-box">
                <div className="detail-swap-side detail-swap-offer">
                  <div className="detail-swap-label">🟢 Skill Offered</div>
                  <div className="detail-swap-skill">{listing.skillOffered}</div>
                </div>
                <div className="detail-swap-arrow">
                  <ArrowLeftRight size={20} />
                </div>
                <div className="detail-swap-side detail-swap-need">
                  <div className="detail-swap-label">🔵 Skill Needed</div>
                  <div className="detail-swap-skill">{listing.skillNeeded}</div>
                </div>
              </div>

              {/* CTA */}
              {!isOwn ? (
                <button
                  className={`btn btn-primary detail-cta ${swapping ? 'loading' : ''}`}
                  onClick={handleSwap}
                  disabled={swapping}
                  id="detail-swap-btn"
                >
                  {swapping
                    ? <><span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Sending…</>
                    : <><ArrowLeftRight size={16} /> Request This Swap</>
                  }
                </button>
              ) : (
                <div className="badge badge-neutral" style={{ alignSelf: 'flex-start' }}>Your own listing</div>
              )}
            </div>
          </div>

          {/* Creator sidebar */}
          <aside className="detail-sidebar">
            {creator && (
              <div className="card creator-card">
                <div className="font-semibold text-sm mb-2" style={{ color: 'var(--text-muted)' }}>Posted by</div>
                <Link to={`/profile/${creator.userId}`} className="creator-profile-link">
                  <img src={creator.avatar} alt={creator.name} className="avatar avatar-lg" />
                  <div>
                    <div className="font-bold">{creator.name}</div>
                    {creator.rating > 0 && (
                      <div className="flex items-center gap-1 mt-1">
                        <Star size={13} fill="#fbbf24" style={{ color: '#fbbf24' }} />
                        <span className="text-sm font-semibold">{creator.rating.toFixed(1)}</span>
                        <span className="text-xs text-muted">({creator.ratingCount})</span>
                      </div>
                    )}
                  </div>
                </Link>

                {streak >= 2 && (
                  <div className="streak-badge mt-2"><Flame size={12} /> {streak} swap streak with you!</div>
                )}

                <div className="creator-stats">
                  <div className="creator-stat">
                    <span className="creator-stat-val text-gradient">{creator.credits ?? 0}</span>
                    <span className="creator-stat-label">Credits</span>
                  </div>
                  <div className="creator-stat">
                    <span className="creator-stat-val" style={{ color: '#fbbf24' }}>{creator.completedSwaps ?? 0}</span>
                    <span className="creator-stat-label">Swaps done</span>
                  </div>
                </div>

                {creator.badges?.length > 0 && (
                  <div>
                    <div className="text-xs text-muted mb-1" style={{ fontWeight: 600 }}>Badges</div>
                    <div className="flex flex-wrap gap-1">
                      {creator.badges.map((b) => (
                        <span key={b} className="badge badge-primary" title={b}>
                          {BADGE_ICONS[b] || '🏅'} {b}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {creator.skillsOffered?.length > 0 && (
                  <div>
                    <div className="skills-label">🟢 Also offers</div>
                    <div className="skills-chips">
                      {creator.skillsOffered.map((s) => (
                        <span key={s} className="skill-chip skill-offered">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <Link to={`/profile/${creator.userId}`} className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }} id="view-creator-profile">
                  View Full Profile
                </Link>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
