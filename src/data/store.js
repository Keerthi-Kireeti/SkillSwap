// SkillSwap Data Store — localStorage-backed persistence

const KEYS = {
  USERS: 'ss_users',
  LISTINGS: 'ss_listings',
  SWAPS: 'ss_swaps',
  CURRENT_USER: 'ss_current_user',
  ACTIVITY_LOGS: 'ss_activity_logs',
  GROUP_SESSIONS: 'ss_group_sessions',
  SESSION_TIMER: 'ss_session_timer',
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const read = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || null;
  } catch {
    return null;
  }
};

const write = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

// ── Seed Data ────────────────────────────────────────────────────────────────

const SEED_USERS = [
  {
    userId: 'u1',
    name: 'Aryan Mehta',
    email: 'aryan@campus.edu',
    password: 'demo123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=aryan',
    skillsOffered: ['Python', 'Machine Learning', 'Data Analysis'],
    skillsNeeded: ['UI Design', 'Video Editing'],
    credits: 24,
    creditsEarned: 28,
    creditsSpent: 4,
    badges: ['Code Ninja', 'Study Mentor', 'Skill Champion'],
    completedSwaps: 8,
    streaks: { u2: 5, u3: 2 },
    dailyStreakDays: 12,
    lastActiveDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    totalHoursOnApp: 24.5,
    totalHoursLearned: 12,
    rating: 4.8,
    ratingCount: 6,
    createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
  },
  {
    userId: 'u2',
    name: 'Priya Sharma',
    email: 'priya@campus.edu',
    password: 'demo123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
    skillsOffered: ['Figma', 'UI/UX Design', 'Graphic Design'],
    skillsNeeded: ['Python', 'Machine Learning'],
    credits: 19,
    creditsEarned: 23,
    creditsSpent: 4,
    badges: ['Design Wizard', 'Creative Guru', 'Study Mentor'],
    completedSwaps: 7,
    streaks: { u1: 5 },
    dailyStreakDays: 8,
    lastActiveDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    totalHoursOnApp: 18,
    totalHoursLearned: 9,
    rating: 4.9,
    ratingCount: 5,
    createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
  },
  {
    userId: 'u3',
    name: 'Siddharth Rao',
    email: 'sid@campus.edu',
    password: 'demo123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=siddharth',
    skillsOffered: ['Guitar', 'Music Theory', 'Mixing'],
    skillsNeeded: ['Web Development', 'React'],
    credits: 11,
    creditsEarned: 13,
    creditsSpent: 2,
    badges: ['Creative Guru', 'Study Mentor'],
    completedSwaps: 4,
    streaks: { u1: 2 },
    dailyStreakDays: 5,
    lastActiveDate: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0],
    totalHoursOnApp: 10,
    totalHoursLearned: 5,
    rating: 4.6,
    ratingCount: 3,
    createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
  },
  {
    userId: 'u4',
    name: 'Neha Kapoor',
    email: 'neha@campus.edu',
    password: 'demo123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=neha',
    skillsOffered: ['Spanish', 'French', 'German'],
    skillsNeeded: ['Data Science', 'Photography'],
    credits: 8,
    creditsEarned: 10,
    creditsSpent: 2,
    badges: ['Study Mentor', 'Language Pro'],
    completedSwaps: 3,
    streaks: {},
    dailyStreakDays: 3,
    lastActiveDate: new Date(Date.now() - 3 * 86400000).toISOString().split('T')[0],
    totalHoursOnApp: 7,
    totalHoursLearned: 4,
    rating: 4.7,
    ratingCount: 4,
    createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
  },
  {
    userId: 'u5',
    name: 'Rahul Verma',
    email: 'rahul@campus.edu',
    password: 'demo123',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rahul',
    skillsOffered: ['React', 'Node.js', 'TypeScript'],
    skillsNeeded: ['Guitar', 'Spanish'],
    credits: 15,
    creditsEarned: 17,
    creditsSpent: 2,
    badges: ['Code Ninja', 'Skill Champion'],
    completedSwaps: 6,
    streaks: {},
    dailyStreakDays: 9,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalHoursOnApp: 16,
    totalHoursLearned: 7,
    rating: 4.5,
    ratingCount: 5,
    createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
  },
];

const today = new Date().toISOString().split('T')[0];

const SEED_ACTIVITY_LOGS = [
  { logId: 'al1', userId: 'u1', date: today, hoursOnApp: 2.5, hoursLearned: 1, action: 'Completed Python swap with Priya' },
  { logId: 'al2', userId: 'u1', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], hoursOnApp: 1.5, hoursLearned: 0.5, action: 'Browsed marketplace' },
  { logId: 'al3', userId: 'u2', date: today, hoursOnApp: 3, hoursLearned: 2, action: 'Completed Figma swap with Aryan' },
  { logId: 'al4', userId: 'u1', date: new Date(Date.now() - 2 * 86400000).toISOString().split('T')[0], hoursOnApp: 2, hoursLearned: 1.5, action: 'Group session: Python Basics' },
];

const SEED_LISTINGS = [
  {
    listingId: 'l1',
    title: 'Python & ML Help in Exchange for UI Design',
    description:
      'I can help you with Python fundamentals, NumPy, Pandas, and intro to ML using Scikit-learn. Looking for someone who can help me design a clean UI for my portfolio app.',
    skillOffered: 'Python / Machine Learning',
    skillNeeded: 'UI Design',
    duration: '1 hour',
    durationMinutes: 60,
    category: 'Coding',
    createdBy: 'u1',
    timestamp: new Date(Date.now() - 2 * 86400000).toISOString(),
    likes: 12,
  },
  {
    listingId: 'l2',
    title: 'Figma UI/UX Design for Python Tutoring',
    description:
      "I'll design high-fidelity Figma mockups for your project — landing pages, dashboards, mobile screens. In return I need someone to teach me Python basics and help me with my data structures assignment.",
    skillOffered: 'Figma / UI Design',
    skillNeeded: 'Python Tutoring',
    duration: '1 hour',
    durationMinutes: 60,
    category: 'Design',
    createdBy: 'u2',
    timestamp: new Date(Date.now() - 3 * 86400000).toISOString(),
    likes: 18,
  },
  {
    listingId: 'l3',
    title: 'Guitar Lessons for Web Dev Help',
    description:
      'Been playing guitar for 5 years. I can teach you chords, scales, and basic theory. Need someone to help me build my personal website using React.',
    skillOffered: 'Guitar',
    skillNeeded: 'React / Web Development',
    duration: '30 min',
    durationMinutes: 30,
    category: 'Music',
    createdBy: 'u3',
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
    likes: 9,
  },
  {
    listingId: 'l4',
    title: 'Learn Spanish in 30 mins — Trade for Data Science Help',
    description:
      'Native-level Spanish speaker. I can help you practice conversational Spanish, grammar, or exam prep. Looking for someone who knows data science and can help me understand visualization.',
    skillOffered: 'Spanish',
    skillNeeded: 'Data Science',
    duration: '30 min',
    durationMinutes: 30,
    category: 'Languages',
    createdBy: 'u4',
    timestamp: new Date(Date.now() - 4 * 86400000).toISOString(),
    likes: 7,
  },
  {
    listingId: 'l5',
    title: 'Quick Debugging Help (15 min) for Graphic Design',
    description:
      'Stuck on a bug? I can help debug Python, JavaScript, or C++ code in just 15 minutes. In exchange, I need help designing a logo for my college club.',
    skillOffered: 'Debugging Help',
    skillNeeded: 'Logo Design',
    duration: '15 min',
    durationMinutes: 15,
    category: 'Coding',
    createdBy: 'u1',
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
    likes: 22,
  },
  {
    listingId: 'l6',
    title: 'Music Mixing & Production Session',
    description:
      'I use Ableton Live and can help you produce a track, mix audio, or learn basic music production concepts. Looking for someone to help me with a web assignment.',
    skillOffered: 'Music Production / Mixing',
    skillNeeded: 'HTML/CSS Help',
    duration: '1 hour',
    durationMinutes: 60,
    category: 'Music',
    createdBy: 'u3',
    timestamp: new Date(Date.now() - 6 * 86400000).toISOString(),
    likes: 14,
  },
];

const SEED_SWAPS = [
  {
    swapId: 's1',
    userA: 'u1',
    userB: 'u2',
    listingId: 'l1',
    status: 'Completed',
    creditsTransferred: 1,
    timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
  {
    swapId: 's2',
    userA: 'u2',
    userB: 'u1',
    listingId: 'l2',
    status: 'Completed',
    creditsTransferred: 1,
    timestamp: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    swapId: 's3',
    userA: 'u1',
    userB: 'u3',
    listingId: 'l3',
    status: 'Pending',
    creditsTransferred: 0,
    timestamp: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];

const SEED_GROUP_SESSIONS = [
  {
    sessionId: 'gs1',
    title: 'Python for Beginners — Weekly Bootcamp',
    description: 'A weekly group session covering Python basics, data types, loops, and functions. Perfect for absolute beginners. Bring questions!',
    subject: 'Python',
    category: 'Coding',
    hostId: 'u1',
    maxParticipants: 8,
    participants: ['u2', 'u4'],
    creditsPerSession: 2,
    scheduledAt: new Date(Date.now() + 2 * 86400000).toISOString(),
    duration: '90 min',
    status: 'Upcoming',
    tags: ['Python', 'Beginner', 'Programming'],
    meetLink: 'https://meet.google.com/abc-def-ghi',
    createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
  {
    sessionId: 'gs2',
    title: 'Figma Design Sprint — UI Patterns',
    description: 'Learn modern UI patterns in Figma! We will cover auto-layout, components, and design systems. Ideal for anyone starting with UI design.',
    subject: 'UI/UX Design',
    category: 'Design',
    hostId: 'u2',
    maxParticipants: 6,
    participants: ['u1', 'u5'],
    creditsPerSession: 2,
    scheduledAt: new Date(Date.now() + 4 * 86400000).toISOString(),
    duration: '1 hour',
    status: 'Upcoming',
    tags: ['Figma', 'Design', 'UI'],
    meetLink: 'https://meet.google.com/xyz-uvw-rst',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
  },
  {
    sessionId: 'gs3',
    title: 'Guitar Chord Crash Course',
    description: 'Learn the 10 most important guitar chords in a single session. From open chords to barre chords — we will get you strumming your first song!',
    subject: 'Guitar',
    category: 'Music',
    hostId: 'u3',
    maxParticipants: 5,
    participants: ['u4'],
    creditsPerSession: 1,
    scheduledAt: new Date(Date.now() + 86400000).toISOString(),
    duration: '45 min',
    status: 'Upcoming',
    tags: ['Guitar', 'Music', 'Beginner'],
    meetLink: 'https://meet.google.com/gtr-chs-101',
    createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    sessionId: 'gs4',
    title: 'React Hooks Deep Dive',
    description: 'A technical session on useState, useEffect, useContext, useReducer, and custom hooks. Intermediate level — you should know React basics.',
    subject: 'React',
    category: 'Coding',
    hostId: 'u5',
    maxParticipants: 10,
    participants: ['u1', 'u3'],
    creditsPerSession: 2,
    scheduledAt: new Date(Date.now() - 86400000).toISOString(),
    duration: '2 hours',
    status: 'Completed',
    tags: ['React', 'JavaScript', 'Hooks'],
    meetLink: 'https://meet.google.com/rct-hks-adv',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

// ── Init ─────────────────────────────────────────────────────────────────────

export const initStore = () => {
  if (!read(KEYS.USERS)) write(KEYS.USERS, SEED_USERS);
  if (!read(KEYS.LISTINGS)) write(KEYS.LISTINGS, SEED_LISTINGS);
  if (!read(KEYS.SWAPS)) write(KEYS.SWAPS, SEED_SWAPS);
  if (!read(KEYS.ACTIVITY_LOGS)) write(KEYS.ACTIVITY_LOGS, SEED_ACTIVITY_LOGS);
  if (!read(KEYS.GROUP_SESSIONS)) write(KEYS.GROUP_SESSIONS, SEED_GROUP_SESSIONS);
};

// ── Auth ─────────────────────────────────────────────────────────────────────

export const getCurrentUser = () => read(KEYS.CURRENT_USER);
export const setCurrentUser = (user) => write(KEYS.CURRENT_USER, user);
export const logout = () => localStorage.removeItem(KEYS.CURRENT_USER);

export const login = (email, password) => {
  const users = read(KEYS.USERS) || [];
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (!user) return { success: false, error: 'Invalid email or password' };
  // Update daily streak on login
  updateDailyStreak(user.userId);
  // Log app session start
  logAppSession(user.userId, 0.1, 'Logged in');
  const { password: _, ...safeUser } = getUserById(user.userId);
  setCurrentUser(safeUser);
  return { success: true, user: safeUser };
};

export const signup = ({ name, email, password, avatar }) => {
  const users = read(KEYS.USERS) || [];
  if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, error: 'Email already registered' };
  }
  const newUser = {
    userId: uid(),
    name,
    email,
    password,
    avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    skillsOffered: [],
    skillsNeeded: [],
    credits: 3,
    creditsEarned: 0,
    creditsSpent: 0,
    badges: [],
    completedSwaps: 0,
    streaks: {},
    dailyStreakDays: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    totalHoursOnApp: 0,
    totalHoursLearned: 0,
    rating: 0,
    ratingCount: 0,
    createdAt: new Date().toISOString(),
  };
  write(KEYS.USERS, [...users, newUser]);
  const { password: _, ...safeUser } = newUser;
  setCurrentUser(safeUser);
  return { success: true, user: safeUser };
};

// ── Users ─────────────────────────────────────────────────────────────────────

export const getUsers = () => read(KEYS.USERS) || [];

export const getUserById = (id) => (read(KEYS.USERS) || []).find((u) => u.userId === id);

export const updateUser = (userId, updates) => {
  const users = read(KEYS.USERS) || [];
  const idx = users.findIndex((u) => u.userId === userId);
  if (idx === -1) return;
  users[idx] = { ...users[idx], ...updates };
  write(KEYS.USERS, users);
  const cu = getCurrentUser();
  if (cu && cu.userId === userId) {
    const { password: _, ...safeUser } = users[idx];
    setCurrentUser(safeUser);
  }
  return users[idx];
};

export const getLeaderboard = () => {
  const users = read(KEYS.USERS) || [];
  return users
    .map((u) => ({ ...u }))
    .sort((a, b) => (b.creditsEarned || 0) - (a.creditsEarned || 0));
};

// ── Listings ──────────────────────────────────────────────────────────────────

export const getListings = () => read(KEYS.LISTINGS) || [];
export const getListingById = (id) => (read(KEYS.LISTINGS) || []).find((l) => l.listingId === id);

export const createListing = (data) => {
  const listings = read(KEYS.LISTINGS) || [];
  const newListing = { listingId: uid(), likes: 0, timestamp: new Date().toISOString(), ...data };
  write(KEYS.LISTINGS, [newListing, ...listings]);
  return newListing;
};

export const deleteListing = (listingId) => {
  const listings = read(KEYS.LISTINGS) || [];
  write(KEYS.LISTINGS, listings.filter((l) => l.listingId !== listingId));
};

export const toggleListingLike = (listingId) => {
  const listings = read(KEYS.LISTINGS) || [];
  const idx = listings.findIndex((l) => l.listingId === listingId);
  if (idx === -1) return;
  listings[idx] = { ...listings[idx], likes: (listings[idx].likes || 0) + 1 };
  write(KEYS.LISTINGS, listings);
  return listings[idx];
};

// ── Swaps ─────────────────────────────────────────────────────────────────────

export const getSwaps = () => read(KEYS.SWAPS) || [];
export const getSwapsByUser = (userId) =>
  (read(KEYS.SWAPS) || []).filter((s) => s.userA === userId || s.userB === userId);

export const createSwap = ({ userA, userB, listingId, creditsTransferred }) => {
  const swaps = read(KEYS.SWAPS) || [];
  const newSwap = {
    swapId: uid(),
    userA, userB, listingId,
    status: 'Pending',
    creditsTransferred,
    timestamp: new Date().toISOString(),
  };
  write(KEYS.SWAPS, [...swaps, newSwap]);
  return newSwap;
};

export const updateSwapStatus = (swapId, status) => {
  const swaps = read(KEYS.SWAPS) || [];
  const idx = swaps.findIndex((s) => s.swapId === swapId);
  if (idx === -1) return;
  swaps[idx] = { ...swaps[idx], status };

  if (status === 'Completed') {
    const swap = swaps[idx];
    const userA = getUserById(swap.userA);
    const userB = getUserById(swap.userB);
    if (userA && userB) {
      const hoursLearned = (swap.creditsTransferred || 1);
      updateUser(userA.userId, {
        credits: (userA.credits || 0) + swap.creditsTransferred,
        creditsEarned: (userA.creditsEarned || 0) + swap.creditsTransferred,
        completedSwaps: (userA.completedSwaps || 0) + 1,
        totalHoursOnApp: (userA.totalHoursOnApp || 0) + hoursLearned,
      });
      updateUser(userB.userId, {
        credits: Math.max(0, (userB.credits || 0) - swap.creditsTransferred),
        creditsSpent: (userB.creditsSpent || 0) + swap.creditsTransferred,
        completedSwaps: (userB.completedSwaps || 0) + 1,
        totalHoursLearned: (userB.totalHoursLearned || 0) + hoursLearned,
        totalHoursOnApp: (userB.totalHoursOnApp || 0) + hoursLearned,
      });
      // Streaks
      const ua = getUserById(swap.userA);
      const ub = getUserById(swap.userB);
      updateUser(ua.userId, {
        streaks: { ...(ua.streaks || {}), [ub.userId]: ((ua.streaks || {})[ub.userId] || 0) + 1 },
      });
      updateUser(ub.userId, {
        streaks: { ...(ub.streaks || {}), [ua.userId]: ((ub.streaks || {})[ua.userId] || 0) + 1 },
      });
      // Activity logs
      const listing = getListingById(swap.listingId);
      logAppSession(swap.userA, hoursLearned, `Completed swap: ${listing?.skillOffered || 'skill'}`);
      logAppSession(swap.userB, hoursLearned, `Learned: ${listing?.skillOffered || 'skill'}`);
      updateActivityLearned(swap.userB, hoursLearned);
      // Badges
      assignBadges(swap.userA);
      assignBadges(swap.userB);
    }
  }

  write(KEYS.SWAPS, swaps);
  return swaps[idx];
};

// ── Activity Logs ────────────────────────────────────────────────────────────

export const getActivityLogs = () => read(KEYS.ACTIVITY_LOGS) || [];

export const getActivityByUser = (userId) =>
  (read(KEYS.ACTIVITY_LOGS) || []).filter((l) => l.userId === userId);

export const logAppSession = (userId, hours, action = '') => {
  const logs = read(KEYS.ACTIVITY_LOGS) || [];
  const dateKey = new Date().toISOString().split('T')[0];
  const existingIdx = logs.findIndex((l) => l.userId === userId && l.date === dateKey);
  if (existingIdx !== -1) {
    logs[existingIdx] = {
      ...logs[existingIdx],
      hoursOnApp: (logs[existingIdx].hoursOnApp || 0) + hours,
      action: action || logs[existingIdx].action,
    };
  } else {
    logs.push({ logId: uid(), userId, date: dateKey, hoursOnApp: hours, hoursLearned: 0, action });
  }
  write(KEYS.ACTIVITY_LOGS, logs);
  // Update user total hours
  const user = getUserById(userId);
  if (user) updateUser(userId, { totalHoursOnApp: (user.totalHoursOnApp || 0) + hours });
};

export const updateActivityLearned = (userId, hours) => {
  const logs = read(KEYS.ACTIVITY_LOGS) || [];
  const dateKey = new Date().toISOString().split('T')[0];
  const existingIdx = logs.findIndex((l) => l.userId === userId && l.date === dateKey);
  if (existingIdx !== -1) {
    logs[existingIdx] = { ...logs[existingIdx], hoursLearned: (logs[existingIdx].hoursLearned || 0) + hours };
  } else {
    logs.push({ logId: uid(), userId, date: dateKey, hoursOnApp: 0, hoursLearned: hours, action: 'Skill learned' });
  }
  write(KEYS.ACTIVITY_LOGS, logs);
};

// ── Daily Streak ──────────────────────────────────────────────────────────────

export const updateDailyStreak = (userId) => {
  const user = getUserById(userId);
  if (!user) return;
  const today = new Date().toISOString().split('T')[0];
  const lastDate = user.lastActiveDate;
  if (lastDate === today) return; // Already counted today
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const newStreak = lastDate === yesterday ? (user.dailyStreakDays || 0) + 1 : 1;
  updateUser(userId, { dailyStreakDays: newStreak, lastActiveDate: today });
};

// ── Badges ────────────────────────────────────────────────────────────────────

export const BADGE_RULES = [
  { badge: 'Code Ninja', icon: '⚡', color: '#818cf8', desc: 'Expert coder with 1+ coding swap', condition: (u) => (u.skillsOffered || []).some((s) => /python|javascript|code|react|js|cpp|java|typescript|node/i.test(s)) && u.completedSwaps >= 1 },
  { badge: 'Design Wizard', icon: '🎨', color: '#f472b6', desc: 'Design master with 1+ design swap', condition: (u) => (u.skillsOffered || []).some((s) => /design|figma|ui|ux|graphic/i.test(s)) && u.completedSwaps >= 1 },
  { badge: 'Study Mentor', icon: '📚', color: '#34d399', desc: '2+ swaps completed', condition: (u) => u.completedSwaps >= 2 },
  { badge: 'Creative Guru', icon: '🎵', color: '#fbbf24', desc: 'Music or arts expert', condition: (u) => (u.skillsOffered || []).some((s) => /music|guitar|art|creative|mixing/i.test(s)) && u.completedSwaps >= 1 },
  { badge: 'Skill Champion', icon: '🏆', color: '#22d3ee', desc: '5+ swaps completed', condition: (u) => u.completedSwaps >= 5 },
  { badge: 'Language Pro', icon: '🌍', color: '#c084fc', desc: 'Multilingual teacher', condition: (u) => (u.skillsOffered || []).some((s) => /spanish|french|german|language|japanese|hindi|mandarin/i.test(s)) },
  { badge: 'Streak Master', icon: '🔥', color: '#f97316', desc: '7-day daily streak', condition: (u) => (u.dailyStreakDays || 0) >= 7 },
  { badge: 'Social Butterfly', icon: '🦋', color: '#a78bfa', desc: 'Swapped with 3+ different people', condition: (u) => Object.keys(u.streaks || {}).length >= 3 },
  { badge: 'Quick Learner', icon: '🚀', color: '#38bdf8', desc: '5+ hours of learning logged', condition: (u) => (u.totalHoursLearned || 0) >= 5 },
  { badge: 'Group Leader', icon: '👑', color: '#fcd34d', desc: 'Hosted a group session', condition: (u) => (u.groupSessionsHosted || 0) >= 1 },
];

const assignBadges = (userId) => {
  const user = getUserById(userId);
  if (!user) return;
  const currentBadges = user.badges || [];
  const newBadges = BADGE_RULES
    .filter((rule) => rule.condition(user) && !currentBadges.includes(rule.badge))
    .map((rule) => rule.badge);
  if (newBadges.length > 0) {
    updateUser(userId, { badges: [...currentBadges, ...newBadges] });
  }
};

export const checkAndAssignBadges = (userId) => assignBadges(userId);

// ── Group Sessions ────────────────────────────────────────────────────────────

export const getGroupSessions = () => read(KEYS.GROUP_SESSIONS) || [];

export const getGroupSessionById = (id) =>
  (read(KEYS.GROUP_SESSIONS) || []).find((s) => s.sessionId === id);

export const createGroupSession = (data) => {
  const sessions = read(KEYS.GROUP_SESSIONS) || [];
  const newSession = {
    sessionId: uid(),
    participants: [],
    status: 'Upcoming',
    createdAt: new Date().toISOString(),
    ...data,
  };
  write(KEYS.GROUP_SESSIONS, [newSession, ...sessions]);
  // Badge for hosting
  const user = getUserById(data.hostId);
  if (user) {
    updateUser(data.hostId, { groupSessionsHosted: (user.groupSessionsHosted || 0) + 1 });
    assignBadges(data.hostId);
  }
  return newSession;
};

export const joinGroupSession = (sessionId, userId) => {
  const sessions = read(KEYS.GROUP_SESSIONS) || [];
  const idx = sessions.findIndex((s) => s.sessionId === sessionId);
  if (idx === -1) return { success: false, error: 'Session not found' };
  const session = sessions[idx];
  if (session.participants.includes(userId)) return { success: false, error: 'Already joined' };
  if (session.participants.length >= session.maxParticipants) return { success: false, error: 'Session is full' };
  // Deduct credits
  const user = getUserById(userId);
  if (!user) return { success: false, error: 'User not found' };
  if ((user.credits || 0) < session.creditsPerSession) return { success: false, error: 'Insufficient credits' };
  updateUser(userId, {
    credits: user.credits - session.creditsPerSession,
    creditsSpent: (user.creditsSpent || 0) + session.creditsPerSession,
  });
  sessions[idx] = { ...session, participants: [...session.participants, userId] };
  write(KEYS.GROUP_SESSIONS, sessions);
  logAppSession(userId, 0.5, `Joined group session: ${session.title}`);
  return { success: true, session: sessions[idx] };
};

export const leaveGroupSession = (sessionId, userId) => {
  const sessions = read(KEYS.GROUP_SESSIONS) || [];
  const idx = sessions.findIndex((s) => s.sessionId === sessionId);
  if (idx === -1) return;
  sessions[idx] = {
    ...sessions[idx],
    participants: sessions[idx].participants.filter((p) => p !== userId),
  };
  write(KEYS.GROUP_SESSIONS, sessions);
};

export const getSessionsByUser = (userId) => {
  const sessions = read(KEYS.GROUP_SESSIONS) || [];
  return sessions.filter((s) => s.hostId === userId || s.participants.includes(userId));
};

// ── AI Suggestions ────────────────────────────────────────────────────────────

export const getAISuggestions = (currentUser) => {
  if (!currentUser) return { skills: [], friends: [] };
  const allUsers = getUsers();
  const allListings = getListings();

  // Skills the user needs — find listings that offer those skills
  const skillSuggestions = [];
  (currentUser.skillsNeeded || []).forEach((needed) => {
    const matches = allListings.filter(
      (l) =>
        l.createdBy !== currentUser.userId &&
        l.skillOffered.toLowerCase().includes(needed.toLowerCase().split(' ')[0])
    );
    matches.slice(0, 2).forEach((l) => {
      if (!skillSuggestions.find((s) => s.listingId === l.listingId)) {
        skillSuggestions.push({
          listingId: l.listingId,
          type: 'skill',
          reason: `Matches your learning goal: "${needed}"`,
          listing: l,
          score: 95 - Math.floor(Math.random() * 10),
        });
      }
    });
  });

  // Find popular listings user hasn't interacted with
  const popularListings = allListings
    .filter((l) => l.createdBy !== currentUser.userId)
    .sort((a, b) => b.likes - a.likes)
    .slice(0, 3);

  popularListings.forEach((l) => {
    if (!skillSuggestions.find((s) => s.listingId === l.listingId)) {
      skillSuggestions.push({
        listingId: l.listingId,
        type: 'trending',
        reason: `Trending in ${l.category} — ${l.likes} students interested`,
        listing: l,
        score: 80 + Math.floor(Math.random() * 15),
      });
    }
  });

  // Friend suggestions: users whose offered skills match what currentUser needs
  const friendSuggestions = allUsers
    .filter((u) => u.userId !== currentUser.userId)
    .map((u) => {
      let score = 0;
      const reasons = [];
      // Common interests
      const commonOffered = (u.skillsOffered || []).filter((s) =>
        (currentUser.skillsNeeded || []).some((n) => n.toLowerCase().includes(s.toLowerCase().split('/')[0].trim()))
      );
      if (commonOffered.length > 0) {
        score += commonOffered.length * 30;
        reasons.push(`Can teach you ${commonOffered.slice(0, 2).join(', ')}`);
      }
      // Common skills needed (study buddies)
      const commonNeeded = (u.skillsNeeded || []).filter((s) =>
        (currentUser.skillsNeeded || []).some((n) => n.toLowerCase().includes(s.toLowerCase().split(' ')[0]))
      );
      if (commonNeeded.length > 0) {
        score += commonNeeded.length * 15;
        reasons.push(`Shares interest in ${commonNeeded.slice(0, 2).join(', ')}`);
      }
      // High rating bonus
      if (u.rating >= 4.7) { score += 10; reasons.push('Highly rated mentor'); }
      // Active user bonus
      if (u.completedSwaps >= 5) { score += 10; reasons.push('Super active on SkillSwap'); }

      return { user: u, score, reason: reasons.join(' · ') || 'Active community member' };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 4);

  return {
    skills: skillSuggestions.sort((a, b) => b.score - a.score).slice(0, 5),
    friends: friendSuggestions,
  };
};

// ── Constants ─────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  'All', 'Coding', 'Design', 'Tutoring', 'Video Editing',
  'Music', 'Languages', 'Photography', 'Writing', 'Other',
];

export const DURATIONS = ['10 min', '15 min', '30 min', '45 min', '1 hour', '90 min', '2 hours', 'Custom'];

export const BADGE_ICONS = {
  'Code Ninja': '⚡',
  'Design Wizard': '🎨',
  'Study Mentor': '📚',
  'Creative Guru': '🎵',
  'Skill Champion': '🏆',
  'Language Pro': '🌍',
  'Streak Master': '🔥',
  'Social Butterfly': '🦋',
  'Quick Learner': '🚀',
  'Group Leader': '👑',
};
