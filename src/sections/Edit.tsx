import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { animate, motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity, type PanInfo } from 'framer-motion';
import { useStore } from '../lib/store';
import { BRANDS, WATCHES, fmtPrice } from '../data/watches';
import { useIsDesktop } from '../lib/hooks';
import EditCard from '../components/EditCard';
import RevealText from '../components/RevealText';
import Icon from '../components/Icon';

const REST_TILT = -14;

function Chips({ value, onChange }: { value: string; onChange: (b: string) => void }) {
  const { t } = useStore();
  const brands = ['all', ...BRANDS];
  return (
    <div className="chips" role="tablist">
      {brands.map((b) => (
        <button key={b} role="tab" aria-selected={value === b} className={`chip ${value === b ? 'is-on' : ''}`} onClick={() => onChange(b)}>
          {value === b && <motion.span layoutId="chip-pill" className="chip__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span>{b === 'all' ? t.edit_all : b}</span>
        </button>
      ))}
    </div>
  );
}

/* ---------- Mobile: swipe carousel, watches swing with drag velocity ---------- */
function SwipeCarousel({ brand }: { brand: string }) {
  const { openQuick, t } = useStore();
  const list = useMemo(() => (brand === 'all' ? WATCHES : WATCHES.filter((w) => w.brand === brand)), [brand]);
  const x = useMotionValue(0);
  const v = useVelocity(x);
  const sv = useSpring(v, { stiffness: 260, damping: 38 });
  // At rest the watch leans; in motion it swings toward horizontal, like it is being carried
  const tilt = useTransform(sv, [-2400, 0, 2400], [REST_TILT + 52, REST_TILT, REST_TILT - 52]);
  const scale = useTransform(sv, [-2400, 0, 2400], [0.9, 1, 0.9]);
  const cardRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(300);
  const [index, setIndex] = useState(0);
  const moved = useRef(false);

  useLayoutEffect(() => {
    const measure = () => {
      const el = cardRef.current?.firstElementChild as HTMLElement | null;
      if (el) setStep(el.offsetWidth + 14);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    setIndex(0);
    animate(x, 0, { type: 'spring', stiffness: 260, damping: 32 });
  }, [brand, x]);

  const go = (i: number, velocity = 0) => {
    const n = Math.max(0, Math.min(list.length - 1, i));
    setIndex(n);
    animate(x, -n * step, { type: 'spring', stiffness: 240, damping: 30, velocity });
  };

  const onDragEnd = (_: unknown, info: PanInfo) => {
    // One card per swipe, like a native app carousel
    const { offset, velocity } = info;
    let next = index;
    if (offset.x < -step * 0.2 || velocity.x < -450) next = index + 1;
    else if (offset.x > step * 0.2 || velocity.x > 450) next = index - 1;
    go(next, velocity.x);
  };

  return (
    <div className="swipe">
      <motion.div
        ref={cardRef}
        className="swipe__track"
        style={{ x }}
        drag="x"
        dragMomentum={false}
        dragElastic={0.14}
        dragConstraints={{ left: -(list.length - 1) * step - 30, right: 30 }}
        onPointerDown={() => (moved.current = false)}
        onDragStart={() => (moved.current = true)}
        onDragEnd={onDragEnd}
      >
        {list.map((w, i) => (
          <EditCard
            key={w.slug}
            w={w}
            index={i}
            total={list.length}
            tilt={tilt}
            scale={scale}
            onOpen={() => {
              if (moved.current) return;
              if (i !== index) return go(i);
              openQuick(w.slug);
            }}
          />
        ))}
      </motion.div>
      <div className="swipe__meta">
        <div className="swipe__progress" aria-hidden="true">
          <motion.span animate={{ width: `${((index + 1) / list.length) * 100}%` }} transition={{ duration: 0.5 }} />
        </div>
        <span className="swipe__hint">{t.edit_hint}</span>
      </div>
    </div>
  );
}

/* ---------- Desktop: vertical scroll drives a pinned horizontal rail ---------- */
function PinnedRail({ brand }: { brand: string }) {
  const { openQuick } = useStore();
  const list = useMemo(() => (brand === 'all' ? WATCHES : WATCHES.filter((w) => w.brand === brand)), [brand]);
  const wrap = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const sx = useSpring(x, { stiffness: 120, damping: 26, mass: 0.4 });
  const v = useVelocity(sx);
  const sv = useSpring(v, { stiffness: 200, damping: 40 });
  const tilt = useTransform(sv, [-1800, 0, 1800], [REST_TILT + 40, REST_TILT, REST_TILT - 40]);
  const scale = useTransform(sv, [-1800, 0, 1800], [0.92, 1, 0.92]);
  const bar = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  useLayoutEffect(() => {
    const measure = () => {
      if (!track.current) return;
      setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [list.length]);

  return (
    <div ref={wrap} className="rail" style={{ height: `calc(100vh + ${dist}px)` }}>
      <div className="rail__sticky">
        <motion.div ref={track} className="rail__track" style={{ x: sx }}>
          {list.map((w, i) => (
            <EditCard key={w.slug} w={w} index={i} total={list.length} tilt={tilt} scale={scale} onOpen={() => openQuick(w.slug)} />
          ))}
          <Link to="/shop" className="rail__end" data-cursor="view">
            <span>
              {list.length}
              <small>pieces</small>
            </span>
            <Icon name="arrow" size={28} />
          </Link>
        </motion.div>
        <div className="rail__bar">
          <motion.span style={{ width: bar }} />
        </div>
      </div>
    </div>
  );
}

export default function Edit() {
  const { t } = useStore();
  const desktop = useIsDesktop();
  const [brand, setBrand] = useState('all');
  const latest = WATCHES.slice(1, 5);

  return (
    <section className="edit" id="collection">
      <div className="edit__head wrap">
        <div>
          <p className="eyebrow">{t.edit_eyebrow}</p>
          <RevealText tag="h2" className="h2" italicLast>
            {t.edit_title}
          </RevealText>
        </div>
        <Link to="/shop" className="link-arrow hide-m">
          {t.edit_viewall} <Icon name="arrow" size={18} />
        </Link>
      </div>
      <div className="edit__chips">
        <Chips value={brand} onChange={setBrand} />
      </div>

      {desktop ? <PinnedRail brand={brand} /> : <SwipeCarousel brand={brand} />}

      {!desktop && (
        <div className="latest wrap">
          <div className="latest__head">
            <span className="mono">
              {WATCHES.length} {t.edit_pieces}
            </span>
            <Link to="/shop" className="link-arrow">
              {t.edit_viewall} <Icon name="arrow" size={16} />
            </Link>
          </div>
          <ul className="latest__list">
            {latest.map((w, i) => (
              <motion.li key={w.slug} initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ delay: i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                <Link to={`/watch/${w.slug}`} className="row">
                  <span className="row__img" style={{ background: w.tone }}>
                    <img src={w.img} alt="" loading="lazy" />
                  </span>
                  <span className="row__txt">
                    <span className="mono">{w.brand}</span>
                    <strong>{w.model}</strong>
                    <em>{fmtPrice(w.price) ?? t.p_por}</em>
                  </span>
                  <Icon name="chevron" size={18} />
                </Link>
              </motion.li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
