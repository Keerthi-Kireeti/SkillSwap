import { useState, useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';
import { v4 as uuidv4 } from 'uuid';

const defaultMessages = [
  '🎉 Just completed a skill swap!',
  '⚡ 5 credits earned from teaching React!',
  '🎸 Guitar lesson booked successfully!',
  '🏆 New badge unlocked: Skill Champion!',
  '🔥 7-day streak! Keep it up!',
  '👥 New group session: Python Basics starting soon!',
  '⭐ You received a 5-star rating from Priya!',
  '🤖 AI found 3 perfect skill matches for you!',
];

const COLORS = ['hsl(250,70%,70%)', 'hsl(330,70%,70%)', 'hsl(180,70%,70%)', 'hsl(40,80%,70%)', 'hsl(130,60%,65%)'];
const NAMES = ['Aryan M.', 'Priya S.', 'Rahul V.', 'Ananya K.', 'Siddharth R.', 'Meera J.'];
const AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aryan',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Priya',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya',
];

function generateNote(customMessages) {
  const messages = customMessages || defaultMessages;
  return {
    id: uuidv4(),
    user: {
      name: NAMES[Math.floor(Math.random() * NAMES.length)],
      avatarUrl: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
    },
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    priority: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
  };
}

const priorityBorderMap = { high: '#ef4444', medium: '#f97316', low: '#6366f1' };

function NotifCard({ note, onDismiss, allowDismiss, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 320, background: 'rgba(10,10,22,0.85)', backdropFilter: 'blur(24px)',
        border: '1px solid rgba(99,102,241,0.2)',
        borderLeft: `4px solid ${priorityBorderMap[note.priority] || '#6366f1'}`,
        borderRadius: 14, padding: '0.85rem 1rem', display: 'flex', alignItems: 'flex-start',
        gap: '0.75rem', cursor: 'pointer', position: 'relative', overflow: 'hidden',
        boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      }}
    >
      {/* shimmer overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.04),transparent)', pointerEvents: 'none' }} />
      <img src={note.user.avatarUrl} alt={note.user.name} style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, border: `2px solid ${note.user.color}` }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
          <span style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-primary)' }}>{note.user.name}</span>
          <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{note.timestamp}</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{note.message}</p>
      </div>
      {allowDismiss && (
        <button
          onClick={(e) => { e.stopPropagation(); onDismiss(); }}
          aria-label="Dismiss"
          style={{ flexShrink: 0, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0, marginTop: 2 }}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
}

export default function AnimatedNotification({
  maxNotifications = 3,
  autoInterval = 4000,
  autoGenerate = false,
  customMessages,
  position = 'bottom-right',
  allowDismiss = true,
  autoDismissTimeout = 4500,
  onNotificationClick,
  className,
}) {
  const [notes, setNotes] = useState([]);
  const dismissTimers = useRef(new Map());

  const dismiss = useCallback((id) => {
    const t = dismissTimers.current.get(id);
    if (t) { clearTimeout(t); dismissTimers.current.delete(id); }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const addNote = useCallback(() => {
    const note = generateNote(customMessages);
    setNotes((prev) => {
      const capped = prev.length >= maxNotifications ? prev.slice(1) : prev;
      return [...capped, note];
    });
    if (autoDismissTimeout > 0) {
      const t = setTimeout(() => dismiss(note.id), autoDismissTimeout);
      dismissTimers.current.set(note.id, t);
    }
  }, [customMessages, maxNotifications, autoDismissTimeout, dismiss]);

  useEffect(() => {
    if (!autoGenerate) return;
    const first = setTimeout(addNote, 1200);
    const interval = setInterval(addNote, autoInterval);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [autoGenerate, autoInterval, addNote]);

  useEffect(() => () => dismissTimers.current.forEach(clearTimeout), []);

  const positionStyle = {
    'bottom-right': { position: 'fixed', bottom: 24, right: 24, zIndex: 9999 },
    'bottom-left': { position: 'fixed', bottom: 24, left: 24, zIndex: 9999 },
    'top-right': { position: 'fixed', top: 80, right: 24, zIndex: 9999 },
    'top-left': { position: 'fixed', top: 80, left: 24, zIndex: 9999 },
    center: { position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 },
  }[position] || { position: 'fixed', bottom: 24, right: 24, zIndex: 9999 };

  return (
    <div className={cn('', className)} style={{ ...positionStyle, display: 'flex', flexDirection: 'column', gap: 10, alignItems: 'flex-end', pointerEvents: 'none' }}>
      {notes.map((note) => (
        <div
          key={note.id}
          style={{
            pointerEvents: 'auto',
            animation: 'notifPopIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both',
          }}
        >
          <NotifCard
            note={note}
            allowDismiss={allowDismiss}
            onDismiss={() => dismiss(note.id)}
            onClick={() => { onNotificationClick?.(note); dismiss(note.id); }}
          />
        </div>
      ))}
      <style>{`
        @keyframes notifPopIn {
          0% {
            opacity: 0;
            transform: translateX(60px) translateY(20px) scale(0.8);
            filter: blur(8px);
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 1;
            transform: translateX(0) translateY(0) scale(1);
            filter: blur(0);
          }
        }
      `}</style>
    </div>
  );
}
