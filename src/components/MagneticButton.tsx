import { useRef, useState, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  className?: string;
  strength?: number;
  ariaLabel?: string;
}

export default function MagneticButton({ children, href, to, onClick, className = '', strength = 0.3, ariaLabel }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const move = (e: React.MouseEvent) => {
    const r = ref.current!.getBoundingClientRect();
    setPos({ x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength });
  };

  const inner = to ? (
    <Link to={to} className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </Link>
  ) : href ? (
    <a href={href} className={className} onClick={onClick} target="_blank" rel="noreferrer" aria-label={ariaLabel}>
      {children}
    </a>
  ) : (
    <button type="button" className={className} onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  );

  return (
    <div ref={ref} onMouseMove={move} onMouseLeave={() => setPos({ x: 0, y: 0 })} className="magnetic">
      <motion.div animate={pos} transition={{ type: 'spring', stiffness: 220, damping: 18, mass: 0.6 }}>
        {inner}
      </motion.div>
    </div>
  );
}
