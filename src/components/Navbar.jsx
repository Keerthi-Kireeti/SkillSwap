import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Plus, Trophy, Users, Flame, Zap } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <img src="/skillswap-logo.png" alt="SkillSwap" className="logo-image" />
          <span className="logo-text"><span className="logo-accent">Skill</span> Swap</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="navbar-links hide-mobile">
          <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>Marketplace</Link>
          <Link to="/leaderboard" className={`nav-link ${isActive('/leaderboard') ? 'active' : ''}`}><Trophy size={14} /> Leaderboard</Link>
          <Link to="/group-sessions" className={`nav-link ${isActive('/group-sessions') ? 'active' : ''}`}><Users size={14} /> Groups</Link>
          {user && <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>Dashboard</Link>}
        </div>

        {/* Right Side */}
        <div className="navbar-right">
          {user ? (
            <>
              <Link to="/create-listing" className="btn btn-primary btn-sm hide-mobile" id="nav-post-skill-btn">
                <Plus size={15} /> Post Skill
              </Link>

              {/* Streak indicator */}
              {(user.dailyStreakDays || 0) >= 3 && (
                <div className="streak-pill">
                  <Flame size={13} style={{ color: '#f97316' }} />
                  <span>{user.dailyStreakDays}d</span>
                </div>
              )}
              {/* Credits badge */}
              <div className="credits-pill">
                <Zap size={13} />
                <span>{user.credits ?? 0}</span>
              </div>

              {/* Avatar dropdown */}
              <div className="avatar-dropdown" ref={dropRef}>
                <button
                  className="avatar-btn"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  id="nav-avatar-btn"
                >
                  <img src={user.avatar} alt={user.name} className="avatar avatar-sm" />
                  <ChevronDown size={14} className={`chevron ${dropdownOpen ? 'open' : ''}`} />
                </button>
                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <img src={user.avatar} alt={user.name} className="avatar avatar-md" />
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-xs text-muted">{user.email}</div>
                      </div>
                    </div>
                    <div className="divider" style={{ margin: '0.5rem 0' }} />
                    <Link to={`/profile/${user.userId}`} className="dropdown-item" onClick={() => setDropdownOpen(false)} id="nav-profile-link">
                      <User size={15} /> My Profile
                    </Link>
                    <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)} id="nav-dashboard-link">
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <Link to="/leaderboard" className="dropdown-item" onClick={() => setDropdownOpen(false)} id="nav-leaderboard-link">
                      <Trophy size={15} /> Leaderboard
                    </Link>
                    <Link to="/group-sessions" className="dropdown-item" onClick={() => setDropdownOpen(false)} id="nav-groups-link">
                      <Users size={15} /> Group Sessions
                    </Link>
                    <div className="divider" style={{ margin: '0.5rem 0' }} />
                    <button className="dropdown-item danger" onClick={handleLogout} id="nav-logout-btn">
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link to="/auth" className="btn btn-ghost btn-sm hide-mobile" id="nav-login-btn">Log In</Link>
              <Link to="/auth?tab=signup" className="btn btn-primary btn-sm" id="nav-signup-btn">Sign Up Free</Link>
            </>
          )}

          {/* Mobile hamburger */}
          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} id="nav-menu-btn">
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="mobile-menu">
          <Link to="/marketplace" className="mobile-link" onClick={() => setMenuOpen(false)}>Marketplace</Link>
          <Link to="/leaderboard" className="mobile-link" onClick={() => setMenuOpen(false)}>🏆 Leaderboard</Link>
          <Link to="/group-sessions" className="mobile-link" onClick={() => setMenuOpen(false)}>👥 Group Sessions</Link>
          {user && <Link to="/dashboard" className="mobile-link" onClick={() => setMenuOpen(false)}>Dashboard</Link>}
          {user && <Link to="/create-listing" className="mobile-link" onClick={() => setMenuOpen(false)}>Post Skill</Link>}
          {user && <Link to={`/profile/${user.userId}`} className="mobile-link" onClick={() => setMenuOpen(false)}>My Profile</Link>}
          {user ? (
            <button className="mobile-link danger" onClick={handleLogout}>Sign Out</button>
          ) : (
            <>
              <Link to="/auth" className="mobile-link" onClick={() => setMenuOpen(false)}>Log In</Link>
              <Link to="/auth?tab=signup" className="mobile-link accent" onClick={() => setMenuOpen(false)}>Sign Up Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
