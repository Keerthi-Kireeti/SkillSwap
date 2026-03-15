import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { opacity: 0, scale: 0.7, transition: { duration: 0.35, ease: 'easeOut' } },
  focused: { opacity: 1, scale: 1, zIndex: 10, transition: { duration: 0.35, ease: 'easeOut' } },
  next: { opacity: 1, scale: 0.95, zIndex: 5, transition: { duration: 0.35, ease: 'easeOut' } },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: 'easeOut' } },
};

export default function ScrollList({ data, renderItem, itemHeight = 155 }) {
  const listRef = useRef(null);
  const [focusedIndex, setFocusedIndex] = useState(0);

  useEffect(() => {
    const updateFocused = () => {
      if (!listRef.current) return;
      const container = listRef.current;
      const children = Array.from(container.children);
      const scrollTop = container.scrollTop;
      const containerCenter = container.clientHeight / 2;

      let closest = 0;
      let minDist = Infinity;

      children.forEach((child, index) => {
        const itemCenter = child.offsetTop + child.offsetHeight / 2;
        const dist = Math.abs(itemCenter - scrollTop - containerCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = index;
        }
      });

      setFocusedIndex(closest);
    };

    updateFocused();
    const el = listRef.current;
    el?.addEventListener('scroll', updateFocused);
    return () => el?.removeEventListener('scroll', updateFocused);
  }, [data, itemHeight]);

  return (
    <div
      ref={listRef}
      className="mx-auto w-full"
      style={{ height: '500px', overflowY: 'auto', scrollbarWidth: 'none' }}
    >
      {data.map((item, index) => {
        let variant = 'hidden';
        if (index === focusedIndex) variant = 'focused';
        else if (index === focusedIndex + 1) variant = 'next';
        else if (Math.abs(index - focusedIndex) <= 2) variant = 'visible';

        return (
          <motion.div
            key={index}
            className="mx-auto max-w-3xl"
            variants={itemVariants}
            initial="hidden"
            animate={variant}
            style={{ height: itemHeight ? `${itemHeight}px` : 'auto' }}
          >
            {renderItem(item, index)}
          </motion.div>
        );
      })}
    </div>
  );
}
