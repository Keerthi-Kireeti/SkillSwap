import React, { useRef, useEffect, useState, useMemo, createContext, useContext } from 'react';
import { useAnimationFrame, useInView, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

// Utility function
const wrap = (min, max, v) => {
  const rangeSize = max - min;
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

export { wrap };

const ThreeDScrollTriggerContext = createContext(null);

export function ThreeDScrollTriggerContainer({ children, className, ...props }) {
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });

  return (
    <ThreeDScrollTriggerContext.Provider value={velocityFactor}>
      <div className={cn('relative w-full', className)} {...props}>
        {children}
      </div>
    </ThreeDScrollTriggerContext.Provider>
  );
}

function ThreeDScrollTriggerRowImpl({ children, baseVelocity = 5, direction = 1, className, velocityFactor, ...props }) {
  const containerRef = useRef(null);
  const [numCopies, setNumCopies] = useState(3);
  const x = useMotionValue(0);
  const prevTimeRef = useRef(null);
  const unitWidthRef = useRef(0);
  const baseXRef = useRef(0);

  const childrenArray = useMemo(() => React.Children.toArray(children), [children]);
  const BlockContent = useMemo(() => (
    <div className="inline-flex shrink-0">{childrenArray}</div>
  ), [childrenArray]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const block = container.querySelector('.threed-scroll-trigger-block');
    if (block) {
      unitWidthRef.current = block.scrollWidth;
      const containerWidth = container.offsetWidth;
      const needed = Math.max(3, Math.ceil(containerWidth / unitWidthRef.current) + 2);
      setNumCopies(needed);
    }
  }, [childrenArray]);

  const isInView = useInView(containerRef, { margin: '20%' });

  useAnimationFrame((time) => {
    if (!isInView) return;
    if (prevTimeRef.current == null) prevTimeRef.current = time;
    const dt = Math.max(0, (time - prevTimeRef.current) / 1000);
    prevTimeRef.current = time;
    const unitWidth = unitWidthRef.current;
    if (unitWidth <= 0) return;
    const velocity = velocityFactor.get();
    const speedMultiplier = Math.min(5, Math.abs(velocity));
    const scrollDirection = velocity >= 0 ? 1 : -1;
    const currentDirection = direction * scrollDirection;
    const pixelsPerSecond = (unitWidth * baseVelocity) / 100;
    const moveBy = currentDirection * pixelsPerSecond * (1 + speedMultiplier) * dt;
    const newX = baseXRef.current + moveBy;
    if (newX >= unitWidth) baseXRef.current = newX % unitWidth;
    else if (newX <= 0) baseXRef.current = unitWidth + (newX % unitWidth);
    else baseXRef.current = newX;
    x.set(baseXRef.current);
  });

  const xTransform = useTransform(x, (v) => `translate3d(${-v}px,0,0)`);

  return (
    <div ref={containerRef} className={cn('w-full overflow-hidden whitespace-nowrap', className)} {...props}>
      <motion.div className="inline-flex will-change-transform" style={{ transform: xTransform }}>
        {Array.from({ length: numCopies }).map((_, i) => (
          <div key={i} className={cn('inline-flex shrink-0', i === 0 ? 'threed-scroll-trigger-block' : '')}>
            {BlockContent}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

function ThreeDScrollTriggerRowLocal(props) {
  const { scrollY } = useScroll();
  const localVelocity = useVelocity(scrollY);
  const localSmooth = useSpring(localVelocity, { damping: 50, stiffness: 400 });
  const localFactor = useTransform(localSmooth, (v) => {
    const sign = v < 0 ? -1 : 1;
    const magnitude = Math.min(5, (Math.abs(v) / 1000) * 5);
    return sign * magnitude;
  });
  return <ThreeDScrollTriggerRowImpl {...props} velocityFactor={localFactor} />;
}

export function ThreeDScrollTriggerRow(props) {
  const shared = useContext(ThreeDScrollTriggerContext);
  if (shared) return <ThreeDScrollTriggerRowImpl {...props} velocityFactor={shared} />;
  return <ThreeDScrollTriggerRowLocal {...props} />;
}

export default ThreeDScrollTriggerRow;
