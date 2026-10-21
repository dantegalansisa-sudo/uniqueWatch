import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { damping: 26, stiffness: 260, mass: 0.5 });
  const sy = useSpring(y, { damping: 26, stiffness: 260, mass: 0.5 });
  const [mode, setMode] = useState<'' | 'hover' | 'view'>('');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    setEnabled(fine.matches);
    if (!fine.matches) return;
    document.documentElement.classList.add('has-cursor');
    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    // Event delegation so dynamically rendered elements are covered
    const over = (e: MouseEvent) => {
      const el = e.target as HTMLElement;
      if (el.closest('[data-cursor="view"]')) setMode('view');
      else if (el.closest('a, button, input, select, textarea, [role="button"]')) setMode('hover');
      else setMode('');
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseover', over);
    return () => {
      document.documentElement.classList.remove('has-cursor');
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [x, y]);

  if (!enabled) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} />
      <motion.div className={`cursor-ring ${mode ? `is-${mode}` : ''}`} style={{ x: sx, y: sy }}>
        <span>View</span>
      </motion.div>
    </>
  );
}
