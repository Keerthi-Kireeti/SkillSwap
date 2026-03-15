import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ThreeDCarousel({
  items = [],
  autoRotate = true,
  rotateInterval = 4000,
}) {
  const [active, setActive] = useState(0);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const minSwipe = 50;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!autoRotate || !isInView || isHovering || items.length === 0) return;
    const id = setInterval(() => setActive((p) => (p + 1) % items.length), rotateInterval);
    return () => clearInterval(id);
  }, [isInView, isHovering, autoRotate, rotateInterval, items.length]);

  const n = items.length;
  const getCardStyle = (index) => {
    if (index === active)
      return { transform: 'scale(1) translateX(0)',     opacity: 1,    zIndex: 20, transition: 'all 0.5s ease' };
    if (index === (active + 1) % n)
      return { transform: 'scale(0.92) translateX(42%)',  opacity: 0.55, zIndex: 10, transition: 'all 0.5s ease' };
    if (index === (active - 1 + n) % n)
      return { transform: 'scale(0.92) translateX(-42%)', opacity: 0.55, zIndex: 10, transition: 'all 0.5s ease' };
    return { transform: 'scale(0.85)', opacity: 0, zIndex: 0, transition: 'all 0.5s ease' };
  };

  const onTouchStart = (e) => { setTouchStart(e.targetTouches[0].clientX); setTouchEnd(null); };
  const onTouchMove  = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd   = () => {
    if (!touchStart || !touchEnd) return;
    const dist = touchStart - touchEnd;
    if (dist > minSwipe)  setActive((p) => (p + 1) % n);
    else if (dist < -minSwipe) setActive((p) => (p - 1 + n) % n);
  };

  if (items.length === 0) return null;

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', overflow: 'hidden', height: 480 }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Cards */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {items.map((item, index) => (
          <div
            key={item.id ?? index}
            style={{ position: 'absolute', width: '100%', maxWidth: 380, ...getCardStyle(index) }}
          >
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            }}>
              {/* Image banner */}
              <div style={{
                position: 'relative', height: 180,
                backgroundImage: `url(${item.imageUrl})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
                <div style={{
                  position: 'relative', zIndex: 1, height: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', textAlign: 'center', padding: '1rem',
                }}>
                  <span style={{ fontSize: 22, fontWeight: 900, letterSpacing: '0.04em' }}>
                    {item.brand?.toUpperCase()}
                  </span>
                  <div style={{ width: 40, height: 3, background: '#fff', margin: '0.4rem auto' }} />
                  <span style={{ fontSize: 13 }}>{item.title}</span>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '1.25rem 1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>{item.title}</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>{item.brand}</p>
                <p style={{
                  fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem',
                  display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {item.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '1rem' }}>
                  {(item.tags || []).map((tag, i) => (
                    <span key={i} style={{
                      padding: '0.2rem 0.6rem', borderRadius: 9999,
                      background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border)',
                      fontSize: '0.7rem', color: 'var(--text-muted)',
                    }}>{tag}</span>
                  ))}
                </div>
                {item.link && (
                  <Link
                    to={item.link}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: 'var(--primary-light)', fontSize: '0.83rem', fontWeight: 600, textDecoration: 'none' }}
                  >
                    Learn more <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Nav buttons */}
      {['left', 'right'].map((side) => (
        <button
          key={side}
          onClick={() => setActive((p) => side === 'left' ? (p - 1 + n) % n : (p + 1) % n)}
          aria-label={side === 'left' ? 'Previous' : 'Next'}
          style={{
            position: 'absolute', [side]: 16, top: '50%', transform: 'translateY(-50%)', zIndex: 30,
            background: 'rgba(10,10,20,0.8)', border: '1px solid rgba(99,102,241,0.25)',
            borderRadius: '50%', width: 40, height: 40, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: 'pointer', color: 'var(--text-primary)',
          }}
        >
          {side === 'left' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      ))}

      {/* Dot indicators */}
      <div style={{ position: 'absolute', bottom: 16, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 8, zIndex: 30 }}>
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: active === i ? 20 : 8, height: 8, borderRadius: 9999,
              background: active === i ? 'var(--primary-light)' : 'rgba(255,255,255,0.2)',
              border: 'none', cursor: 'pointer', transition: 'all 0.3s',
            }}
          />
        ))}
      </div>
    </div>
  );
}
