import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { Zap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { PasswordStrengthIndicator } from '../components/PasswordStrengthIndicator';
import './Auth.css';

export default function Auth() {
  const [params] = useSearchParams();
  const [tab, setTab] = useState(params.get('tab') === 'signup' ? 'signup' : 'login');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login, signup, user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => { if (user) navigate('/dashboard'); }, [user]);
  useEffect(() => { setTab(params.get('tab') === 'signup' ? 'signup' : 'login'); }, [params]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    if (tab === 'login') {
      const res = await login(form.email, form.password);
      if (res.success) {
        toast('Welcome back! 🎉', 'success');
        navigate('/dashboard');
      } else {
        toast(res.error, 'error');
      }
    } else {
      if (!form.name.trim()) { toast('Please enter your name', 'error'); setLoading(false); return; }
      if (form.password.length < 6) { toast('Password must be 6+ characters', 'error'); setLoading(false); return; }
      const res = await signup({ name: form.name, email: form.email, password: form.password });
      if (res.success) {
        toast('Account created! Welcome to SkillSwap 🚀', 'success');
        navigate('/dashboard');
      } else {
        toast(res.error, 'error');
      }
    }
    setLoading(false);
  };

  const demoLogin = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 400));
    const res = await login('aryan@campus.edu', 'demo123');
    if (res.success) { toast('Logged in as Aryan (demo) 👋', 'success'); navigate('/dashboard'); }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1" />
        <div className="auth-orb auth-orb-2" />
      </div>

      <Link to="/" className="auth-back"><ArrowLeft size={16} /> Back to home</Link>

      <div className="auth-card">
        {/* Logo */}
        <div className="auth-logo">
          <img src="/skillswap-logo.png" alt="SkillSwap" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')} id="tab-login">Log In</button>
          <button className={`auth-tab ${tab === 'signup' ? 'active' : ''}`} onClick={() => setTab('signup')} id="tab-signup">Sign Up</button>
        </div>

        <h1 className="auth-title">{tab === 'login' ? 'Welcome back 👋' : 'Join the community 🎓'}</h1>
        <p className="auth-subtitle">
          {tab === 'login'
            ? 'Log in to access your skills marketplace.'
            : 'Trade skills, earn credits, zero cost.'}
        </p>

        <form className="auth-form" onSubmit={handleSubmit} id="auth-form">
          {tab === 'signup' && (
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input id="input-name" className="form-input" type="text" placeholder="Alex Johnson" value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input id="input-email" className="form-input" type="email" placeholder="you@campus.edu" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <div className="form-group">
            {tab === 'signup' ? (
              <PasswordStrengthIndicator
                value={form.password}
                label="Password"
                placeholder="Create a strong password"
                showScore
                showVisibilityToggle
                onChange={(v) => set('password', v)}
              />
            ) : (
              <>
                <label className="form-label">Password</label>
                <div className="pw-wrap">
                  <input
                    id="input-password"
                    className="form-input"
                    type={showPw ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => set('password', e.target.value)}
                    required
                  />
                  <button type="button" className="pw-toggle" onClick={() => setShowPw(!showPw)}>
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </>
            )}
          </div>

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading} id="auth-submit-btn">
            {loading ? <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
              : tab === 'login' ? 'Log In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn btn-secondary demo-btn" onClick={demoLogin} disabled={loading} id="demo-login-btn">
          🎭 Try Demo Account (Aryan)
        </button>

        {tab === 'signup' && (
          <p className="auth-terms">
            By signing up you get <strong>3 free Skill Credits</strong> to start swapping right away!
          </p>
        )}

        <p className="auth-switch">
          {tab === 'login' ? "Don't have an account? " : 'Already have one? '}
          <button className="auth-switch-btn" onClick={() => setTab(tab === 'login' ? 'signup' : 'login')}>
            {tab === 'login' ? 'Sign Up' : 'Log In'}
          </button>
        </p>
      </div>
    </div>
  );
}
