import { useRef, useEffect } from 'react';

const SliderItem = ({ item, onClick, itemRef }) => (
  <div
    ref={itemRef}
    onClick={onClick}
    style={{
      position: 'absolute', top: '50%', left: '50%',
      width: 'clamp(150px, 28vw, 280px)', height: 'clamp(200px, 37vw, 370px)',
      marginTop: 'calc(clamp(200px, 37vw, 370px) / -2)',
      marginLeft: 'calc(clamp(150px, 28vw, 280px) / -2)',
      borderRadius: '16px', overflow: 'hidden', cursor: 'pointer',
      userSelect: 'none', willChange: 'transform',
      boxShadow: '0 25px 50px rgba(0,0,0,0.6)',
    }}
  >
    <div className="slider-item-content" style={{ position: 'absolute', inset: 0, zIndex: 1, transition: 'opacity 0.3s ease' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 40%, rgba(0,0,0,0.6) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 3, color: '#fff', fontSize: 'clamp(16px, 2.5vw, 24px)', fontWeight: 700, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
        {item.title}
      </div>
      <div style={{ position: 'absolute', top: 10, left: 16, zIndex: 3, color: 'rgba(255,255,255,0.6)', fontSize: 'clamp(18px, 7vw, 60px)', fontWeight: 900, lineHeight: 1 }}>
        {item.num}
      </div>
      <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} loading="lazy" />
    </div>
  </div>
);

export default function ThreeDSlider({ items, speedWheel = 0.05, speedDrag = -0.15, onItemClick }) {
  const progressRef = useRef(50);
  const targetProgressRef = useRef(50);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const containerRef = useRef(null);
  const rafRef = useRef(null);
  const itemRefs = useRef([]);
  const cacheRef = useRef({});

  const numItems = items.length;

  useEffect(() => {
    let active = true;
    const loop = () => {
      if (!active) return;
      progressRef.current += (targetProgressRef.current - progressRef.current) * 0.1;
      const progress = progressRef.current;
      const clamped = Math.max(0, Math.min(progress, 100));
      const activeFloat = (clamped / 100) * (numItems - 1);

      itemRefs.current.forEach((el, index) => {
        if (!el) return;
        const denominator = numItems > 1 ? numItems - 1 : 1;
        const ratio = (index - activeFloat) / denominator;
        const tx = ratio * 800;
        const ty = ratio * 200;
        const rot = ratio * 120;
        const dist = Math.abs(index - activeFloat);
        const z = numItems - dist;
        const opacity = (z / numItems) * 3 - 2;
        const newTransform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
        const newZIndex = String(Math.round(z * 10));
        const newOpacity = String(Math.max(0, Math.min(1, opacity)));

        if (!cacheRef.current[index]) cacheRef.current[index] = { transform: '', zIndex: '', opacity: '' };
        const cache = cacheRef.current[index];
        if (cache.transform !== newTransform) { el.style.transform = newTransform; cache.transform = newTransform; }
        if (cache.zIndex !== newZIndex) { el.style.zIndex = newZIndex; cache.zIndex = newZIndex; }
        const inner = el.querySelector('.slider-item-content');
        if (inner && cache.opacity !== newOpacity) { inner.style.opacity = newOpacity; cache.opacity = newOpacity; }
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => { active = false; if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [numItems]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const getX = (e) => ('touches' in e ? e.touches[0].clientX : e.clientX);
    const onWheel = (e) => {
      const next = targetProgressRef.current + e.deltaY * speedWheel;
      if ((next < 0 && e.deltaY < 0) || (next > 100 && e.deltaY > 0)) return;
      e.preventDefault();
      targetProgressRef.current = Math.max(0, Math.min(100, next));
    };
    const onDown = (e) => { isDownRef.current = true; startXRef.current = getX(e); };
    const onMove = (e) => {
      if (!isDownRef.current) return;
      const diff = (getX(e) - startXRef.current) * speedDrag;
      targetProgressRef.current = Math.max(0, Math.min(100, targetProgressRef.current + diff));
      startXRef.current = getX(e);
    };
    const onUp = () => { isDownRef.current = false; };
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('mousedown', onDown);
    container.addEventListener('touchstart', onDown, { passive: true });
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    return () => {
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('mousedown', onDown);
      container.removeEventListener('touchstart', onDown);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
    };
  }, [speedWheel, speedDrag]);

  const handleClick = (item, index) => {
    const denominator = numItems > 1 ? numItems - 1 : 1;
    targetProgressRef.current = (index / denominator) * 100;
    onItemClick?.(item, index);
  };

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '420px', overflow: 'hidden', cursor: 'grab' }}>
      <div style={{ position: 'relative', zIndex: 10, height: '100%', pointerEvents: 'none', transform: 'scale(0.8)', transformOrigin: 'center' }}>
        {items.map((item, index) => (
          <div
            key={index}
            ref={(el) => { itemRefs.current[index] = el; }}
            onClick={() => handleClick(item, index)}
            style={{ position: 'absolute', top: '50%', left: '50%', width: 'clamp(150px,28vw,280px)', height: 'clamp(200px,37vw,370px)', marginTop: 'calc(clamp(200px,37vw,370px)/-2)', marginLeft: 'calc(clamp(150px,28vw,280px)/-2)', borderRadius: 16, overflow: 'hidden', cursor: 'pointer', userSelect: 'none', willChange: 'transform', boxShadow: '0 25px 50px rgba(0,0,0,0.6)', pointerEvents: 'auto' }}
          >
            <div className="slider-item-content" style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
              <div style={{ position: 'absolute', inset: 0, zIndex: 2, background: 'linear-gradient(to bottom,rgba(0,0,0,.35) 0%,transparent 40%,rgba(0,0,0,.65) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 16, left: 16, zIndex: 3, color: '#fff', fontSize: 'clamp(15px,2vw,22px)', fontWeight: 700 }}>{item.title}</div>
              <div style={{ position: 'absolute', top: 10, left: 16, zIndex: 3, color: 'rgba(255,255,255,.55)', fontSize: 'clamp(22px,6vw,56px)', fontWeight: 900, lineHeight: 1 }}>{item.num}</div>
              <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} loading="lazy" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
