import { useState, useRef, useEffect } from 'react';
import { Eye, EyeOff, Check, X } from 'lucide-react';
import { cn } from '../lib/utils';

const calculateStrength = (password) => {
  if (!password) return { score: 0, level: 'empty' };
  let score = 0;
  if (password.length > 5) score += 1;
  if (password.length > 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  let level = 'empty';
  if (score === 0) level = 'empty';
  else if (score <= 2) level = 'weak';
  else if (score <= 4) level = 'medium';
  else if (score <= 5) level = 'strong';
  else level = 'very-strong';
  return { score, level };
};

const strengthColors = {
  empty: '#e5e7eb',
  weak: '#ef4444',
  medium: '#f97316',
  strong: '#22c55e',
  'very-strong': '#10b981',
};

const strengthLabels = {
  empty: '',
  weak: 'Weak',
  medium: 'Medium',
  strong: 'Strong',
  'very-strong': 'Very Strong',
};

export function PasswordStrengthIndicator({
  value = '',
  className,
  label = 'Password',
  showScore = true,
  showScoreNumber = false,
  onChange,
  onStrengthChange,
  placeholder = 'Enter your password',
  showVisibilityToggle = true,
}) {
  const [password, setPassword] = useState(value);
  const [showPassword, setShowPassword] = useState(false);
  const { score, level } = calculateStrength(password);
  const inputRef = useRef(null);

  useEffect(() => {
    onStrengthChange?.(level);
  }, [level]); // eslint-disable-line

  const handleChange = (e) => {
    const val = e.target.value;
    setPassword(val);
    onChange?.(val);
  };

  const toggleVisibility = () => {
    setShowPassword((s) => !s);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const segmentsFilled = Math.min(Math.ceil(score / 1.5), 4);

  return (
    <div className={cn('', className)} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label htmlFor="psi-password" className="form-label">{label}</label>
          {showScoreNumber && (
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              {Math.floor((score / 6) * 10)}/10
            </span>
          )}
        </div>
      )}

      <div style={{ position: 'relative' }}>
        <input
          ref={inputRef}
          id="psi-password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={handleChange}
          placeholder={placeholder}
          className="form-input"
          style={{ paddingRight: showVisibilityToggle ? '5.5rem' : '1rem' }}
        />

        {/* Check/X indicator */}
        {password && (
          <div style={{ position: 'absolute', right: showVisibilityToggle ? '2.8rem' : '0.75rem', top: '50%', transform: 'translateY(-50%)' }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: level === 'weak' ? '#ef4444' : level === 'medium' ? '#f97316' : '#22c55e',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {level === 'weak'
                ? <X size={13} style={{ color: '#fff' }} />
                : <Check size={13} style={{ color: '#fff' }} />}
            </div>
          </div>
        )}

        {/* Eye toggle */}
        {showVisibilityToggle && (
          <button
            type="button"
            onClick={toggleVisibility}
            style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {/* Strength bars */}
      <div style={{ display: 'flex', gap: '4px', height: '6px' }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            style={{
              flex: 1, height: '100%', borderRadius: '9999px',
              background: i < segmentsFilled ? strengthColors[level] : 'rgba(255,255,255,0.08)',
              transition: 'background 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Label */}
      {showScore && level !== 'empty' && (
        <p style={{ fontSize: '0.75rem', color: strengthColors[level], transition: 'color 0.3s' }}>
          {strengthLabels[level]}
        </p>
      )}
    </div>
  );
}
