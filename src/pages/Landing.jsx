import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Zap, ArrowRight, Users, Award, Clock, Star, Shield, Trophy, Flame, Brain, BookOpen } from 'lucide-react';
import { getListings, getLeaderboard } from '../data/store';
import SkillCard from '../components/SkillCard';
import { CountUp } from '../components/CountUp';
import ThreeDSlider from '../components/ThreeDSlider';
import ThreeDCarousel from '../components/ThreeDCarousel';
import AnimatedNotification from '../components/AnimatedNotification';
import './Landing.css';

// ── Data ───────────────────────────────────────────────────────────────────────
const STEPS = [
  { icon: '📋', num: '01', title: 'Post Your Skill', desc: 'Tell the community what you can teach — code, design, music, languages, anything goes!', color: '#818cf8' },
  { icon: '🤝', num: '02', title: 'Match & Swap', desc: 'Browse listings, find a match, and request a skill swap. Both sides need to accept.', color: '#f472b6' },
  { icon: '⚡', num: '03', title: 'Earn Credits', desc: 'Complete the swap, earn Skill Credits. No money involved — just pure peer-to-peer learning.', color: '#34d399' },
];

const BADGES_SHOW = [
  { icon: '⚡', name: 'Code Ninja', desc: 'Complete 3 coding swaps to unlock this elite badge', color: '#818cf8', rarity: 'Rare' },
  { icon: '🎨', name: 'Design Wizard', desc: 'Master 5 design-related sessions to become a pixel perfectionist', color: '#f472b6', rarity: 'Epic' },
  { icon: '📚', name: 'Study Mentor', desc: 'Teach 2+ group sessions and help peers on their learning journey', color: '#34d399', rarity: 'Uncommon' },
  { icon: '🎵', name: 'Creative Guru', desc: 'Achieve mastery in art, music, or creative skills across swaps', color: '#fbbf24', rarity: 'Legendary' },
  { icon: '🏆', name: 'Skill Champion', desc: 'Complete 5 successful swaps with 4.8+ rating from partners', color: '#22d3ee', rarity: 'Epic' },
  { icon: '🌍', name: 'Language Pro', desc: 'Swap in 3+ different languages to prove your multilingual prowess', color: '#c084fc', rarity: 'Rare' },
  { icon: '🔥', name: 'Streak Master', desc: 'Maintain a 7+ day learning streak without missing a single day', color: '#f97316', rarity: 'Legendary' },
  { icon: '🦋', name: 'Social Butterfly', desc: 'Build genuine connections by swapping with 5+ different partners', color: '#a78bfa', rarity: 'Uncommon' },
  { icon: '🚀', name: 'Quick Learner', desc: 'Put in 10+ hours of learning and showcase rapid skill growth', color: '#38bdf8', rarity: 'Epic' },
  { icon: '👑', name: 'Community Leader', desc: 'Host 5+ group sessions and build a loyal community around your expertise', color: '#fcd34d', rarity: 'Legendary' },
  { icon: '🧠', name: 'Brain Master', desc: 'Score 80+ on 3 skill quizzes to prove intellectual dominance', color: '#818cf8', rarity: 'Rare' },
  { icon: '💎', name: 'Credit Mogul', desc: 'Accumulate 100+ Skill Credits through consistent swaps and trading', color: '#ec4899', rarity: 'Legendary' },
];

const STATS = [
  { icon: <Users size={22} />, num: 2400, label: 'Active Students', suffix: '+', color: '#818cf8' },
  { icon: <Zap size={22} />, num: 8100, label: 'Skill Credits Traded', suffix: '+', color: '#34d399' },
  { icon: <Award size={22} />, num: 320, label: 'Badges Earned', suffix: '+', color: '#f472b6' },
  { icon: <Star size={22} />, num: 4.9, label: 'Avg. Rating', suffix: '/5', decimals: 1, color: '#fbbf24' },
];

const FEATURES = [
  { icon: <Clock size={26} />, title: 'Micro Skills', desc: '10-minute doubt help, 15-minute debugging, 30-min tutoring — even short help counts.', color: '#818cf8' },
  { icon: <Flame size={26} />, title: 'Skill Streaks', desc: 'Track your daily learning streaks! Miss a day and you lose your streak. Stay consistent!', color: '#f97316' },
  { icon: <Shield size={26} />, title: 'Credit System', desc: '1 hour = 1 Skill Credit. Transparent, fair, and completely cashless peer exchange.', color: '#34d399' },
  { icon: <Trophy size={26} />, title: 'Leaderboards', desc: 'Compete with classmates! Climb the ranks by earning more credits and completing swaps.', color: '#fbbf24' },
  { icon: <Brain size={26} />, title: 'AI Suggestions', desc: 'Our AI engine matches you with the perfect skills and study partners based on your goals.', color: '#22d3ee' },
  { icon: <BookOpen size={26} />, title: 'Group Sessions', desc: 'One expert, many learners. Host or join group sessions on topics you all care about.', color: '#c084fc' },
];

const MARQUEE_SKILLS = [
  '⚛️ React', '🐍 Python', '🎨 Figma', '🎸 Guitar', '🌍 Spanish', '🎥 Video Editing',
  '📐 UI/UX', '🔒 Cybersecurity', '📊 Data Science', '🎤 Public Speaking', '📝 Writing',
  '🎹 Piano', '🧮 DSA', '🛠️ DevOps', '🤖 Machine Learning', '📱 App Dev',
];

const CAROUSEL_ITEMS = [
  { id: 1, title: 'Python Bootcamp', brand: 'Aryan Mehta', description: 'Weekly group sessions on Python basics, data structures, and functions. Perfect for absolute beginners.', tags: ['Python', 'Beginner', 'Coding'], imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&q=80', link: '/group-sessions' },
  { id: 2, title: 'Figma UI/UX Sprint', brand: 'Priya Sharma', description: 'Learn modern UI patterns, auto-layout, and design systems in Figma. Ideal for anyone starting with UI design.', tags: ['Figma', 'Design', 'UI'], imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80', link: '/group-sessions' },
  { id: 3, title: 'Guitar Crash Course', brand: 'Siddharth Rao', description: 'Learn the 10 most important guitar chords in a single session. From open chords to barre chords!', tags: ['Guitar', 'Music', 'Beginner'], imageUrl: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=400&q=80', link: '/group-sessions' },
  { id: 4, title: 'Spanish for Travelers', brand: 'Ananya Kumari', description: 'Conversational Spanish in 4 sessions. Numbers, greetings, directions, and restaurant phrases.', tags: ['Spanish', 'Language', 'Travel'], imageUrl: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&q=80', link: '/group-sessions' },
];

// Curated skill images for Live Marketplace variety
const SKILL_IMAGES = [
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', // Python - code on screen
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&q=80',   // Figma/Design - design workspace
  'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=600&q=80', // Guitar - musician
  'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&q=80', // React/Web - developer
  'https://images.unsplash.com/photo-1516321318423-f06f70504504?w=600&q=80', // Machine Learning - data
  'https://images.unsplash.com/photo-1512941691920-25bda36dc643?w=600&q=80',   // Mobile - phone/app
  'https://images.unsplash.com/photo-1533391473915-f49f60e1a185?w=600&q=80', // Video Editing - camera
  'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=600&q=80', // Languages - books
  'https://images.unsplash.com/photo-1455287437820-39de37a4da0d?w=600&q=80', // Content Writing - writing
  'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80', // Photography - camera lens
];

// ── Main Component ─────────────────────────────────────────────────────────────
export default function Landing() {
  const { user } = useAuth();
  const listings = getListings().slice(0, 4);
  const leaderboard = getLeaderboard().slice(0, 3);

  // Build 3D slider items from real listings + additional default skills with sequential numbering
  const defaultSkills = [
    { title: 'React Development', imageUrl: SKILL_IMAGES[3] },
    { title: 'Machine Learning', imageUrl: SKILL_IMAGES[4] },
    { title: 'Mobile App Dev', imageUrl: SKILL_IMAGES[5] },
    { title: 'Video Editing', imageUrl: SKILL_IMAGES[6] },
    { title: 'Language Tutoring', imageUrl: SKILL_IMAGES[7] },
    { title: 'Content Writing', imageUrl: SKILL_IMAGES[8] },
    { title: 'Photography', imageUrl: SKILL_IMAGES[9] },
    { title: 'Piano Lessons', imageUrl: SKILL_IMAGES[1] },
  ];

  const skillImageMap = {
    'React Development': SKILL_IMAGES[3],
    'Machine Learning': SKILL_IMAGES[4],
    'Mobile App Dev': SKILL_IMAGES[5],
    'Video Editing': SKILL_IMAGES[6],
    'Language Tutoring': SKILL_IMAGES[7],
    'Content Writing': SKILL_IMAGES[8],
    'Photography': SKILL_IMAGES[9],
    'Piano Lessons': SKILL_IMAGES[1],
  };

  const defaultSkillsWithImages = defaultSkills.map(skill => ({
    ...skill,
    imageUrl: skillImageMap[skill.title] || skill.imageUrl
  }));

  const allSkillsForSlider = [
    ...(listings.length > 0 ? listings.map((l, i) => ({
      title: l.skillOffered || l.title,
      imageUrl: SKILL_IMAGES[i % SKILL_IMAGES.length],
    })) : []),
    ...defaultSkillsWithImages.slice(0, Math.max(0, 8 - listings.length))
  ];

  const sliderItems = allSkillsForSlider.map((item, i) => ({
    ...item,
    num: String(i + 1).padStart(2, '0'),
  }));

  return (
    <div className="landing">
      {/* ── Global Animated Notification (bottom-right) ────────────── */}
      <AnimatedNotification
        position="bottom-right"
        maxNotifications={3}
        autoGenerate={false}
        allowDismiss
      />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="hero-section">
        <div className="hero-bg-orbs" aria-hidden="true">
          <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />
        </div>

        <div className="container hero-content">
          <div className="hero-pill animate-fade-in-up">
            <span className="hero-pill-dot" />
            🎓 Built for campus communities — 100% free to use
          </div>

          <h1 className="hero-title animate-fade-in-up stagger-1">
            Exchange Skills.<br />
            <span className="text-gradient">Not Money.</span>
          </h1>

          <p className="hero-subtitle animate-fade-in-up stagger-2">
            SkillSwap is the cashless marketplace where college students trade skills
            hour-for-hour. Teach what you know, learn what you don't.
          </p>

          <div className="hero-cta animate-fade-in-up stagger-3">
            {user ? (
              <>
                <Link to="/marketplace" className="btn btn-primary btn-lg" id="hero-browse-btn">
                  Browse Skills <ArrowRight size={18} />
                </Link>
                <Link to="/create-listing" className="btn btn-secondary btn-lg" id="hero-post-btn">
                  Post a Skill
                </Link>
              </>
            ) : (
              <>
                <Link to="/auth?tab=signup" className="btn btn-primary btn-lg" id="hero-start-btn">
                  Start Swapping Skills <ArrowRight size={18} />
                </Link>
                <Link to="/marketplace" className="btn btn-secondary btn-lg" id="hero-explore-btn">
                  Explore Marketplace
                </Link>
              </>
            )}
          </div>

          <div className="hero-tags animate-fade-in-up stagger-4">
            {['Python', 'Figma', 'Guitar', 'Spanish', 'React', 'Video Editing', 'Tutoring', '+ more'].map((t) => (
              <span key={t} className="hero-tag">{t}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats (with CountUp) ──────────────────────────────────── */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            {STATS.map((s) => (
              <div key={s.label} className="stat-card">
                <div className="stat-icon" style={{ background: `${s.color}22`, color: s.color, border: `1px solid ${s.color}44` }}>
                  {s.icon}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 0 }}>
                    <CountUp
                      value={s.num}
                      duration={2.5}
                      decimals={s.decimals || 0}
                      suffix={s.suffix}
                      colorScheme="custom"
                      customColor={s.color}
                      className="stat-value"
                      animationStyle="gentle"
                      separator=","
                    />
                  </div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it Works ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-pill">How it Works</div>
            <h2 className="section-title">Three steps to your first swap</h2>
            <p className="section-subtitle">No payments, no subscriptions, just peer-to-peer skill sharing on campus.</p>
          </div>
          <div className="steps-grid">
            {STEPS.map((step, i) => (
              <div key={i} className="step-card card-3d" style={{ '--step-color': step.color }}>
                <div className="step-num" style={{ color: step.color }}>{step.num}</div>
                <div className="step-emoji">{step.icon}</div>
                <div className="step-glow-bar" style={{ background: step.color }} />
                <h3 className="step-title">{step.title}</h3>
                <p className="step-desc">{step.desc}</p>
                {i < STEPS.length - 1 && <div className="step-arrow hide-mobile">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Leaderboard Teaser ──────────────────────────────────────── */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-pill"><Trophy size={12} /> Leaderboard</div>
              <h2 className="section-title">Campus Champions</h2>
              <p className="section-subtitle">Who's topping the SkillSwap leaderboard right now?</p>
            </div>
            <Link to="/leaderboard" className="btn btn-outline hide-mobile">View Full Leaderboard →</Link>
          </div>
          <div className="leader-preview">
            {leaderboard.map((u, i) => (
              <div key={u.userId} className={`leader-row card ${i === 0 ? 'leader-first' : ''}`}>
                <div className="leader-rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}</div>
                <img src={u.avatar} alt={u.name} className="avatar avatar-md" />
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">{u.name}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {(u.badges || []).slice(0, 3).map((b) => (
                      <span key={b} className="leader-badge-chip">{b}</span>
                    ))}
                  </div>
                </div>
                <div className="leader-credits">
                  <Zap size={14} style={{ color: '#fbbf24' }} />
                  <CountUp value={u.creditsEarned || 0} duration={1.5} colorScheme="custom" customColor="#fbbf24" className="font-bold" />
                  <span className="text-xs text-muted">credits</span>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <Link to="/leaderboard" className="btn btn-primary btn-lg" id="view-leaderboard-btn">
              <Trophy size={16} /> Full Leaderboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live Feed — ThreeDSlider ─────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-pill">Live Marketplace</div>
            <h2 className="section-title">Skills being swapped right now</h2>
            <p className="section-subtitle">Drag or scroll to explore — click a card to jump to the listing.</p>
          </div>
        </div>
        <ThreeDSlider
          items={sliderItems}
          speedWheel={0.04}
          speedDrag={-0.12}
        />
        <div className="container text-center mt-3">
          <Link to="/marketplace" className="btn btn-primary btn-lg" id="view-all-btn">
            View All Listings <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── Group Sessions — ThreeDCarousel ────────────────────────── */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-pill"><Users size={12} /> Group Sessions</div>
            <h2 className="section-title">Learn together, grow together 🚀</h2>
            <p className="section-subtitle">Join group sessions where one expert teaches multiple students at once — more value, less credits!</p>
          </div>
          <ThreeDCarousel items={CAROUSEL_ITEMS} autoRotate rotateInterval={4500} />
          <div className="text-center mt-3">
            <Link to="/group-sessions" className="btn btn-primary btn-lg" id="group-sessions-btn">
              <Users size={16} /> Explore Group Sessions <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Badges ────────────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <div>
              <div className="section-pill">Gamification</div>
              <h2 className="section-title">Earn badges, build reputation</h2>
              <p className="section-subtitle">Every swap you complete earns you badges and grows your campus reputation.</p>
            </div>
          </div>
          <div className="badges-grid">
            {BADGES_SHOW.map((b, i) => (
              <div key={b.name} className="badge-showcase-card animate-fade-in-up" style={{ animationDelay: `${i * 60}ms`, '--badge-glow': b.color }}>
                <div className="badge-showcase-icon" style={{ background: `${b.color}22`, border: `1.5px solid ${b.color}44` }}>
                  <span style={{ fontSize: '1.6rem' }}>{b.icon}</span>
                </div>
                <div className="badge-showcase-name" style={{ color: b.color }}>{b.name}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', color: b.color, marginBottom: '0.5rem', opacity: 0.8 }}>
                  {b.rarity}
                </div>
                <div className="badge-showcase-desc">{b.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section className="section section-dark">
        <div className="container">
          <div className="section-header text-center">
            <div className="section-pill">Features</div>
            <h2 className="section-title">Everything for a Gen Z marketplace</h2>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.title} className="feature-card card-3d">
                <div className="feature-icon" style={{ background: `${f.color}1a`, color: f.color, boxShadow: `0 0 20px ${f.color}22` }}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="section cta-section">
        <div className="container text-center">
          <div className="cta-box holographic">
            <div className="cta-badge">🚀 Free to join forever</div>
            <h2 className="cta-title">Ready to start swapping?</h2>
            <p className="cta-subtitle">Join hundreds of students already exchanging skills on campus.</p>
            <div className="flex gap-2 justify-center flex-wrap">
              <Link to={user ? '/marketplace' : '/auth?tab=signup'} className="btn btn-primary btn-lg" id="cta-join-btn">
                {user ? 'Go to Marketplace' : 'Create Your Free Account'} <ArrowRight size={18} />
              </Link>
              <Link to="/leaderboard" className="btn btn-secondary btn-lg" id="cta-lb-btn">
                <Trophy size={16} /> View Leaderboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container footer-inner">
          <div className="flex items-center gap-1">
            <img src="/skillswap-logo.png" alt="SkillSwap" style={{ height: '35px', width: 'auto', objectFit: 'contain' }} />
          </div>
          <p className="footer-copy">© 2026 SkillSwap — Built for campus communities 🎓</p>
          <div className="footer-links">
            <Link to="/marketplace">Marketplace</Link>
            <Link to="/leaderboard">Leaderboard</Link>
            <Link to="/group-sessions">Groups</Link>
            <Link to="/auth">Sign Up</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
