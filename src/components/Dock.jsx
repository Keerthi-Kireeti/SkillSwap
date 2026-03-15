import { motion, useMotionValue, useSpring, useTransform, AnimatePresence, MotionValue } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../lib/utils';

function useDockItemSize(mouseX, baseItemSize, magnification, distance, ref, spring) {
  const mouseDistance = useTransform(mouseX, (val) => {
    if (typeof val !== 'number' || isNaN(val)) return 0;
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - rect.x - baseItemSize / 2;
  });
  const targetSize = useTransform(
    mouseDistance,
    [-distance, 0, distance],
    [baseItemSize, magnification, baseItemSize]
  );
  return useSpring(targetSize, spring);
}

function DockItem({ icon, label, onClick, mouseX, baseItemSize, magnification, distance, spring, badgeCount }) {
  const ref = useRef(null);
  const isHovered = useMotionValue(0);
  const size = useDockItemSize(mouseX, baseItemSize, magnification, distance, ref, spring);
  const [showLabel, setShowLabel] = useState(false);

  useEffect(() => {
    const unsub = isHovered.on('change', (v) => setShowLabel(v === 1));
    return () => unsub();
  }, [isHovered]);

  return (
    <motion.div
      ref={ref}
      style={{ width: size, height: size }}
      onHoverStart={() => isHovered.set(1)}
      onHoverEnd={() => isHovered.set(0)}
      onFocus={() => isHovered.set(1)}
      onBlur={() => isHovered.set(0)}
      onClick={onClick}
      className="relative inline-flex items-center justify-center rounded-full cursor-pointer transition-all duration-300"
      style={{ 
        width: size, 
        height: size, 
        background: 'linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(236,72,153,0.08) 100%)',
        border: '1.5px solid rgba(99,102,241,0.3)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
      }}
      tabIndex={0}
      role="button"
      aria-label={label}
    >
      <motion.div 
        className="flex items-center justify-center"
        initial={{ scale: 1, opacity: 0.8 }}
        whileHover={{ scale: 1.1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
      {badgeCount !== undefined && badgeCount > 0 && (
        <motion.span 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ bounce: 0.5, duration: 0.3 }}
          style={{ 
            position: 'absolute', 
            top: -8, 
            right: -8, 
            background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: '#fff', 
            borderRadius: '9999px', 
            width: 20, 
            height: 20, 
            fontSize: '0.65rem', 
            fontWeight: 700, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          {badgeCount > 99 ? '99+' : badgeCount}
        </motion.span>
      )}
      <AnimatePresence>
        {showLabel && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.9 }}
            animate={{ opacity: 1, y: -12, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{ 
              position: 'absolute', 
              top: -40, 
              left: '50%', 
              transform: 'translateX(-50%)', 
              background: 'linear-gradient(135deg, rgba(13,13,26,0.95) 0%, rgba(10,10,20,0.95) 100%)',
              border: '1px solid rgba(99,102,241,0.4)',
              borderRadius: 8, 
              padding: '4px 12px', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              color: '#f0f0fa', 
              whiteSpace: 'nowrap', 
              zIndex: 999,
              boxShadow: '0 8px 24px rgba(99,102,241,0.2), 0 0 20px rgba(99,102,241,0.15)',
              backdropFilter: 'blur(12px)',
            }}
            role="tooltip"
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Dock({
  items,
  className = '',
  spring = { mass: 0.1, stiffness: 150, damping: 12 },
  magnification = 70,
  distance = 200,
  panelHeight = 64,
  dockHeight = 256,
  baseItemSize = 50,
}) {
  const mouseX = useMotionValue(Infinity);
  const isHovered = useMotionValue(0);

  const maxHeight = useMemo(
    () => Math.max(dockHeight, magnification + magnification / 2 + 4),
    [magnification, dockHeight]
  );

  const animatedHeight = useSpring(
    useTransform(isHovered, [0, 1], [panelHeight, maxHeight]),
    spring
  );

  return (
    <motion.div style={{ height: animatedHeight }} className="mx-2 flex max-w-full items-center">
      <motion.div
        onMouseMove={({ pageX }) => { isHovered.set(1); mouseX.set(pageX); }}
        onMouseLeave={() => { isHovered.set(0); mouseX.set(Infinity); }}
        className={cn('absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-3 w-fit rounded-3xl px-5 pb-3 transition-all duration-300 group', className)}
        style={{ 
          height: panelHeight, 
          background: 'linear-gradient(135deg, rgba(10,10,20,0.85) 0%, rgba(13,13,30,0.8) 100%)',
          border: '1.5px solid rgba(99,102,241,0.28)',
          backdropFilter: 'blur(30px)',
          boxShadow: '0 20px 64px rgba(99,102,241,0.15), 0 0 1px rgba(255,255,255,0.1) inset, 0 0 40px rgba(99,102,241,0.1)',
        }}
        role="toolbar"
        aria-label="Application dock"
      >
        {/* Top border glow effect */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: '10%',
          right: '10%',
          height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.4) 50%, transparent 100%)',
          opacity: 0.6,
          borderRadius: '50%',
        }} />
        
        {items.map((item, index) => (
          <DockItem
            key={index}
            icon={item.icon}
            label={item.label}
            onClick={item.onClick}
            mouseX={mouseX}
            baseItemSize={baseItemSize}
            magnification={magnification}
            distance={distance}
            spring={spring}
            badgeCount={item.badgeCount}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}
