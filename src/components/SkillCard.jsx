import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserById, createSwap, toggleListingLike } from '../data/store';
import { useToast } from './Toast';
import { Heart, Clock, ArrowLeftRight, Zap, Flame, Star } from 'lucide-react';
import './SkillCard.css';

// Utility function (moved outside component to avoid impure function calls during render)
const timeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'just now';
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const CATEGORY_COLORS = {
  Coding: { bg: 'rgba(99,102,241,0.12)', color: '#818cf8', border: 'rgba(99,102,241,0.25)' },
  Design: { bg: 'rgba(236,72,153,0.12)', color: '#f472b6', border: 'rgba(236,72,153,0.25)' },
  Tutoring: { bg: 'rgba(16,185,129,0.12)', color: '#34d399', border: 'rgba(16,185,129,0.25)' },
  Music: { bg: 'rgba(245,158,11,0.12)', color: '#fbbf24', border: 'rgba(245,158,11,0.25)' },
  Languages: { bg: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: 'rgba(6,182,212,0.25)' },
  'Video Editing': { bg: 'rgba(239,68,68,0.12)', color: '#f87171', border: 'rgba(239,68,68,0.25)' },
  Photography: { bg: 'rgba(168,85,247,0.12)', color: '#c084fc', border: 'rgba(168,85,247,0.25)' },
  Writing: { bg: 'rgba(20,184,166,0.12)', color: '#2dd4bf', border: 'rgba(20,184,166,0.25)' },
  Other: { bg: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: 'rgba(148,163,184,0.25)' },
};

const DURATION_CREDITS = { '10 min': 0.17, '15 min': 0.25, '30 min': 0.5, '1 hour': 1 };

export default function SkillCard({ listing, onSwapRequested }) {
  const { user } = useAuth();
  const toast = useToast();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(listing.likes || 0);
  const [swapping, setSwapping] = useState(false);

  const creator = getUserById(listing.createdBy);
  const isOwn = user?.userId === listing.createdBy;
  const catStyle = CATEGORY_COLORS[listing.category] || CATEGORY_COLORS.Other;
  const credits = DURATION_CREDITS[listing.duration] || 1;

  const handleLike = (e) => {
    e.preventDefault();
    if (!user) { toast('Log in to like listings', 'info'); return; }
    if (liked) return;
    const updated = toggleListingLike(listing.listingId);
    setLikeCount(updated?.likes || likeCount + 1);
    setLiked(true);
    toast('Added to favourites ✨', 'success');
  };

  const handleSwap = (e) => {
    e.preventDefault();
    if (!user) { toast('Log in to request a swap', 'info'); return; }
    if (isOwn) { toast("You can't swap with yourself 😅", 'info'); return; }
    setSwapping(true);
    setTimeout(() => {
      createSwap({
        userA: listing.createdBy,
        userB: user.userId,
        listingId: listing.listingId,
        creditsTransferred: credits,
      });
      toast('Swap requested! 🚀 Check your dashboard.', 'success');
      setSwapping(false);
      if (onSwapRequested) onSwapRequested();
    }, 600);
  };

  return (
    <article className="skill-card">
      {/* Header */}
      <div className="skill-card-head">
        <div className="flex items-center gap-1" style={{ flex: 1, overflow: 'hidden' }}>
          {creator ? (
            <Link to={`/profile/${creator.userId}`} className="creator-link">
              <img src={creator.avatar} alt={creator.name} className="avatar avatar-sm" />
            </Link>
          ) : (
            <div className="avatar avatar-sm" style={{ background: 'var(--surface)' }} />
          )}
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <Link to={`/profile/${creator?.userId || ''}`} className="creator-name truncate">{creator?.name || 'Unknown'}</Link>
            <div className="text-xs text-muted">{timeAgo(listing.timestamp)}</div>
          </div>
        </div>
        <div className="skill-cat-badge" style={{ background: catStyle.bg, color: catStyle.color, border: `1px solid ${catStyle.border}` }}>
          {listing.category}
        </div>
      </div>

      {/* Title */}
      <Link to={`/listing/${listing.listingId}`} className="skill-card-title">{listing.title}</Link>
      <p className="skill-card-desc">{listing.description}</p>

      {/* Swap Info */}
      <div className="swap-row">
        <div className="swap-side swap-offer">
          <span className="swap-label">Offers</span>
          <span className="swap-skill">{listing.skillOffered}</span>
        </div>
        <div className="swap-icon"><ArrowLeftRight size={14} /></div>
        <div className="swap-side swap-need">
          <span className="swap-label">Needs</span>
          <span className="swap-skill">{listing.skillNeeded}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="skill-card-footer">
        <div className="flex items-center gap-1">
          <div className="duration-badge">
            <Clock size={11} /> {listing.duration}
          </div>
          <div className="credit-badge">
            <Zap size={11} /> {credits === 1 ? '1 credit' : `${credits} credits`}
          </div>
          {creator?.rating > 0 && (
            <div className="rating-mini">
              <Star size={11} fill="currentColor" /> {creator.rating.toFixed(1)}
            </div>
          )}
        </div>
        <div className="skill-card-actions">
          <button
            className={`like-btn ${liked ? 'liked' : ''}`}
            onClick={handleLike}
            title="Like"
            id={`like-${listing.listingId}`}
          >
            <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
          </button>
          {!isOwn && (
            <button
              className={`btn btn-primary btn-sm swap-btn ${swapping ? 'loading' : ''}`}
              onClick={handleSwap}
              disabled={swapping}
              id={`swap-${listing.listingId}`}
            >
              {swapping ? <span className="spinner" style={{ width: 14, height: 14, borderWidth: 2 }} /> : <><ArrowLeftRight size={12} /> Swap!</>}
            </button>
          )}
          {isOwn && <span className="badge badge-neutral text-xs">Your listing</span>}
        </div>
      </div>
    </article>
  );
}
