import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { createListing, CATEGORIES, DURATIONS } from '../data/store';
import { Zap, ArrowRight, Sparkles } from 'lucide-react';
import './CreateListing.css';

const CATEGORY_LIST = CATEGORIES.filter((c) => c !== 'All');

export default function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    skillOffered: '',
    skillNeeded: '',
    duration: '1 hour',
    category: 'Coding',
  });
  const [customDuration, setCustomDuration] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/auth'); return; }
    if (!form.title.trim() || !form.skillOffered.trim() || !form.skillNeeded.trim()) {
      toast('Please fill in all required fields', 'error'); return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    const finalDuration = form.duration === 'Custom' ? (customDuration || '1 hour') : form.duration;
    createListing({ ...form, duration: finalDuration, createdBy: user.userId });
    toast('Listing posted! 🎉 Your skill is now live on the marketplace.', 'success');
    navigate('/marketplace');
    setLoading(false);
  };

  if (!user) {
    return (
      <div className="page">
        <div className="container text-center">
          <div className="empty-state">
            <div className="empty-icon">🔒</div>
            <h2>Sign in to post a skill</h2>
            <button className="btn btn-primary mt-2" onClick={() => navigate('/auth')}>Log In / Sign Up</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <div className="create-layout">
          {/* Form */}
          <div className="create-form-wrap">
            <div className="create-header">
              <div className="create-icon"><Sparkles size={22} /></div>
              <div>
                <h1 className="create-title">Post a Skill</h1>
                <p className="text-secondary text-sm">Share what you can offer and what you're looking for</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="create-form" id="create-listing-form">
              <div className="form-group">
                <label className="form-label">Listing Title *</label>
                <input
                  id="listing-title"
                  className="form-input"
                  type="text"
                  placeholder="e.g. Python Tutoring for Figma Design Help"
                  value={form.title}
                  onChange={(e) => set('title', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  id="listing-desc"
                  className="form-textarea"
                  placeholder="Describe what you'll teach, your experience, what you expect from your partner…"
                  value={form.description}
                  onChange={(e) => set('description', e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Skill You Offer * 🟢</label>
                  <input
                    id="listing-offered"
                    className="form-input"
                    type="text"
                    placeholder="e.g. Python, Figma, Guitar…"
                    value={form.skillOffered}
                    onChange={(e) => set('skillOffered', e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Skill You Need * 🔵</label>
                  <input
                    id="listing-needed"
                    className="form-input"
                    type="text"
                    placeholder="e.g. UI Design, React, Music…"
                    value={form.skillNeeded}
                    onChange={(e) => set('skillNeeded', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select id="listing-cat" className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
                    {CATEGORY_LIST.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Session Duration</label>
                  <select id="listing-dur" className="form-select" value={form.duration} onChange={(e) => set('duration', e.target.value)}>
                    {DURATIONS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              {form.duration === 'Custom' && (
                <div className="form-group">
                  <label className="form-label">Custom Duration</label>
                  <input
                    id="listing-custom-dur"
                    className="form-input"
                    type="text"
                    placeholder="e.g. 45 min, 2 hours"
                    value={customDuration}
                    onChange={(e) => setCustomDuration(e.target.value)}
                  />
                </div>
              )}

              <button type="submit" className="btn btn-primary create-submit" disabled={loading} id="create-submit-btn">
                {loading
                  ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  : <><Zap size={16} /> Post Listing <ArrowRight size={16} /></>
                }
              </button>
            </form>
          </div>

          {/* Preview */}
          <div className="create-preview-wrap">
            <div className="preview-header">
              <span className="text-sm font-semibold text-secondary">Live Preview</span>
            </div>
            <div className="preview-card card-glow card">
              <div className="preview-cat-badge">{form.category}</div>
              <h3 className="preview-title">{form.title || 'Your listing title will appear here'}</h3>
              <p className="preview-desc">{form.description || 'Your description will appear here…'}</p>
              {(form.skillOffered || form.skillNeeded) && (
                <div className="swap-row">
                  <div className="swap-side swap-offer">
                    <span className="swap-label">Offers</span>
                    <span className="swap-skill">{form.skillOffered || '—'}</span>
                  </div>
                  <div className="swap-icon" style={{ color: 'var(--text-muted)' }}>⇄</div>
                  <div className="swap-side swap-need">
                    <span className="swap-label">Needs</span>
                    <span className="swap-skill">{form.skillNeeded || '—'}</span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1 mt-2">
                <span className="duration-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.2rem 0.55rem', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '9999px', fontSize: '0.72rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                  ⏱ {form.duration === 'Custom' ? (customDuration || 'Custom') : form.duration}
                </span>
              </div>
            </div>

            <div className="tips-card card mt-3">
              <h4 className="font-semibold mb-2" style={{ fontSize: '0.9rem' }}>💡 Tips for a great listing</h4>
              <ul className="tips-list">
                <li>Be specific about what you'll teach and your experience level</li>
                <li>Mention any tools or prerequisites upfront</li>
                <li>A clear description gets 3x more swap requests</li>
                <li>Micro-skills (10–30 min) get snapped up faster!</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
