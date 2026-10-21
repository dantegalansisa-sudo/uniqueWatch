import { motion } from 'framer-motion';
import { EASINGS } from '../lib/easings';

interface Props {
  children: string;
  className?: string;
  delay?: number;
  tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  italicLast?: boolean;
  immediate?: boolean;
}

// Word-by-word mask reveal for editorial headlines.
// The observer sits on the (unclipped) heading; words inherit the variant.
export default function RevealText({ children, className = '', delay = 0, tag = 'h2', italicLast, immediate }: Props) {
  const Tag = motion[tag];
  const words = children.split(' ');
  const trigger = immediate ? { animate: 'show' } : { whileInView: 'show', viewport: { once: true, amount: 0.3 } };
  return (
    <Tag className={`reveal ${className}`} aria-label={children} initial="hidden" {...trigger}>
      {words.map((word, i) => (
        <span key={i} className="reveal__mask" aria-hidden="true">
          <motion.span
            className={italicLast && i === words.length - 1 ? 'reveal__word it' : 'reveal__word'}
            variants={{
              hidden: { y: '110%', rotate: 3 },
              show: { y: 0, rotate: 0, transition: { duration: 0.9, delay: delay + i * 0.06, ease: EASINGS.premium } },
            }}
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
