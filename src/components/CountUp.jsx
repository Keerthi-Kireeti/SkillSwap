import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/utils';

const formatValue = (val, precision, sep) =>
  val.toFixed(precision).replace(/\B(?=(\d{3})+(?!\d))/g, sep);

const easingFunctions = {
  linear: [0, 0, 1, 1],
  easeIn: [0.42, 0, 1, 1],
  easeOut: [0, 0, 0.58, 1],
  easeInOut: [0.42, 0, 0.58, 1],
};

const animationPresets = {
  default: { type: 'tween' },
  bounce: { type: 'spring', bounce: 0.25 },
  spring: { type: 'spring', stiffness: 100, damping: 10 },
  gentle: { type: 'spring', stiffness: 60, damping: 15 },
  energetic: { type: 'spring', stiffness: 300, damping: 20 },
};

const colorSchemes = {
  default: 'text-inherit',
  gradient: 'bg-clip-text text-transparent',
  primary: 'text-primary',
  secondary: 'text-secondary',
  custom: '',
};

export function CountUp({
  value,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  easing = 'easeOut',
  separator = ',',
  interactive = false,
  triggerOnView = true,
  className,
  numberClassName,
  animationStyle = 'default',
  colorScheme = 'default',
  customColor,
  onAnimationComplete,
}) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const containerRef = useRef(null);
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    formatValue(latest, decimals, separator)
  );

  const animationConfig = {
    ...(animationPresets[animationStyle] || animationPresets.default),
    ease: easingFunctions[easing],
    duration: animationStyle === 'default' ? duration : undefined,
  };

  useEffect(() => {
    if (!triggerOnView) {
      animate(count.get(), value, {
        ...animationConfig,
        onUpdate: (latest) => count.set(latest),
        onComplete: () => {
          setHasAnimated(true);
          onAnimationComplete?.();
        },
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          animate(count.get(), value, {
            ...animationConfig,
            onUpdate: (latest) => count.set(latest),
            onComplete: () => {
              setHasAnimated(true);
              onAnimationComplete?.();
            },
          });
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [value, triggerOnView, hasAnimated]); // eslint-disable-line

  const isGradient = colorScheme === 'gradient';

  return (
    <div ref={containerRef} className={cn('inline-flex items-center font-bold', className)}>
      <motion.div
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        className={cn('flex items-center', colorSchemes[colorScheme], numberClassName)}
        style={{
          ...(isGradient ? { backgroundImage: 'linear-gradient(to right, #6366f1, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } : {}),
          ...(colorScheme === 'custom' && customColor ? { color: customColor } : {}),
        }}
      >
        {prefix && <span className="mr-1">{prefix}</span>}
        <motion.span>{rounded}</motion.span>
        {suffix && <span className="ml-1">{suffix}</span>}
      </motion.div>
    </div>
  );
}
