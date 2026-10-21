import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, useVelocity, useAnimationFrame, useMotionValue } from 'framer-motion';
import { useStore } from '../lib/store';
import { BRANDS, WATCHES } from '../data/watches';
import { PHONE_DISPLAY, waLink } from '../lib/i18n';
import { EASINGS, cardVariants, containerVariants } from '../lib/easings';
import RevealText from '../components/RevealText';
import MagneticButton from '../components/MagneticButton';
import AnimatedCounter from '../components/AnimatedCounter';
import Icon, { WhatsAppIcon } from '../components/Icon';
import { useIsDesktop } from '../lib/hooks';

/* ---------- Brand marquee: speed and skew react to scroll velocity ---------- */
export function Marquee() {
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [-2000, 0, 2000], [-4, 1, 4], { clamp: false });
  const skew = useTransform(vel, [-2000, 2000], [8, -8]);
  const x = useTransform(base, (v) => `${((v % 50) + 50) % 50 - 50}%`);
  useAnimationFrame((_, delta) => {
    base.set(base.get() - 0.0025 * delta * Math.max(1, Math.abs(factor.get())) * Math.sign(factor.get() || 1));
  });
  const items = [...BRANDS, ...BRANDS];
  return (
    <div className="marquee t-ink" aria-label={BRANDS.join(', ')}>
      <motion.div className="marquee__row" style={{ x, skewX: skew }}>
        {[0, 1].map((k) => (
          <span key={k} className="marquee__set" aria-hidden="true">
            {items.map((b, i) => (
              <span key={i} className="marquee__item">
                {b}
                <i>✦</i>
              </span>
            ))}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ---------- Editorial: models wearing pieces, parallax collage ---------- */
function Par({ src, speed, className, alt = '' }: { src: string; speed: number; className: string; alt?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [speed, -speed]);
  // Observer on the unclipped wrapper; the clip-path reveal runs on the child
  return (
    <motion.div ref={ref} className={`par-wrap ${className}`} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
      <motion.div
        className="par"
        variants={{
          hidden: { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
          show: { clipPath: 'inset(0% 0% 0% 0% round 24px)', transition: { duration: 1.3, ease: EASINGS.premium } },
        }}
      >
        <motion.img src={src} alt={alt} style={{ y, scale: 1.12 }} loading="lazy" />
      </motion.div>
    </motion.div>
  );
}

export function Editorial() {
  const { t } = useStore();
  return (
    <section className="t-forest">
      <div className="editorial wrap">
      <div className="editorial__copy">
        <p className="eyebrow">{t.ed_eyebrow}</p>
        <RevealText tag="h2" className="h2 h2--xl" italicLast>
          {t.ed_title}
        </RevealText>
        <motion.p className="lead" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.9, delay: 0.2 }}>
          {t.ed_body}
        </motion.p>
        <MagneticButton to="/shop" className="btn btn--line">
          {t.ed_cta} <Icon name="arrow" size={18} />
        </MagneticButton>
      </div>
      <div className="editorial__grid">
        <Par src="/img/m/man-beige.webp" speed={40} className="p1" alt="Model wearing a two-tone Rolex" />
        <Par src="/img/m/woman-white.webp" speed={90} className="p2" alt="Model wearing a gold watch" />
        <Par src="/img/m/wrist-blue.webp" speed={60} className="p3" alt="Rolex Submariner on the wrist" />
        <Par src="/img/m/woman-cartier.webp" speed={110} className="p4" alt="Model wearing a Cartier watch" />
      </div>
      </div>
    </section>
  );
}

/* ---------- The Unique standard + stats ---------- */
export function Standard() {
  const { t } = useStore();
  const items = [
    { icon: 'shield', t: t.std_1t, d: t.std_1d },
    { icon: 'truck', t: t.std_2t, d: t.std_2d },
    { icon: 'gear', t: t.std_3t, d: t.std_3d },
    { icon: 'lock', t: t.std_4t, d: t.std_4d },
  ];
  return (
    <section className="standard t-mist">
      <div className="wrap">
        <div className="sec-head">
          <p className="eyebrow">{t.std_eyebrow}</p>
          <RevealText tag="h2" className="h2" italicLast>
            {t.std_title}
          </RevealText>
        </div>
        <motion.div className="standard__grid" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}>
          {items.map((it, i) => (
            <motion.article key={it.t} className="std" variants={cardVariants} whileHover={{ y: -6 }}>
              <span className="std__n mono">0{i + 1}</span>
              <span className="std__ico">
                <Icon name={it.icon} size={22} stroke={1.3} />
              </span>
              <h3>{it.t}</h3>
              <p>{it.d}</p>
            </motion.article>
          ))}
        </motion.div>
        <div className="stats">
          {[
            { n: WATCHES.length, s: '', l: t.stat_1 },
            { n: BRANDS.length, s: '', l: t.stat_2 },
            { n: 48, s: 'h', l: t.stat_3 },
            { n: 100, s: '%', l: t.stat_4 },
          ].map((s) => (
            <div key={s.l} className="stat">
              <strong>
                <AnimatedCounter target={s.n} suffix={s.s} />
              </strong>
              <span>{s.l}</span>
            </div>
          ))}
        </div>
        <div className="paybar" aria-label="Payment methods">
          <span className="paybar__lbl">
            <Icon name="lock" size={14} /> {t.p_secure}
          </span>
          <span className="paybar__list">
            {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Affirm', 'Klarna'].map((p) => (
              <span key={p} className="pay">
                {p}
              </span>
            ))}
          </span>
        </div>
      </div>
    </section>
  );
}

/* ---------- How it works: line draws as you scroll ---------- */
export function HowItWorks() {
  const { t } = useStore();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const draw = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const desktop = useIsDesktop();
  const steps = [
    [t.how_1t, t.how_1d],
    [t.how_2t, t.how_2d],
    [t.how_3t, t.how_3d],
    [t.how_4t, t.how_4d],
  ];
  return (
    <section className="t-white">
      <div className="how wrap">
      <div className="sec-head">
        <p className="eyebrow">{t.how_eyebrow}</p>
        <RevealText tag="h2" className="h2" italicLast>
          {t.how_title}
        </RevealText>
      </div>
      <div ref={ref} className="how__steps">
        <div className="how__line">
          <motion.span style={desktop ? { scaleX: draw } : { scaleY: draw }} />
        </div>
        {steps.map(([title, d], i) => (
          <motion.div key={title} className="how__step" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.6 }} transition={{ duration: 0.7, delay: i * 0.08, ease: EASINGS.out }}>
            <span className="how__dot">
              <i />
            </span>
            <span className="mono how__n">0{i + 1}</span>
            <h3>{title}</h3>
            <p>{d}</p>
          </motion.div>
        ))}
      </div>
      </div>
    </section>
  );
}

/* ---------- Sell / trade ---------- */
export function SellCta() {
  const { t } = useStore();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const rot = useTransform(scrollYProgress, [0, 1], [-30, 25]);
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);
  return (
    <section ref={ref} className="sellcta t-white">
      <div className="sellcta__card wrap t-navy">
        <div className="sellcta__copy">
          <p className="eyebrow">{t.sell_eyebrow}</p>
          <RevealText tag="h2" className="h2" italicLast>
            {t.sell_title}
          </RevealText>
          <p className="lead">{t.sell_body}</p>
          <MagneticButton to="/sell" className="btn btn--dark">
            {t.sell_cta} <Icon name="arrow" size={18} />
          </MagneticButton>
        </div>
        <div className="sellcta__art" aria-hidden="true">
          <motion.img src="/img/w/day-date.webp" alt="" style={{ rotate: rot, y }} className="sellcta__w1" />
          <motion.img src="/img/w/royal-oak.webp" alt="" style={{ rotate: useTransform(rot, (r) => -r * 0.7), y: useTransform(y, (v) => -v) }} className="sellcta__w2" />
          <span className="sellcta__ring" />
        </div>
      </div>
    </section>
  );
}

/* ---------- FAQ accordion ---------- */
export function Faq() {
  const { t } = useStore();
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="faq wrap">
      <div className="sec-head">
        <p className="eyebrow">{t.faq_eyebrow}</p>
        <RevealText tag="h2" className="h2" italicLast>
          {t.faq_title}
        </RevealText>
      </div>
      <div className="faq__list">
        {t.faq.map(([q, a], i) => (
          <div key={q} className={`faq__item ${open === i ? 'is-open' : ''}`}>
            <button className="faq__q" onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i}>
              <span className="mono">0{i + 1}</span>
              <span className="faq__qt">{q}</span>
              <span className="faq__pm" aria-hidden="true" />
            </button>
            <AnimatePresence initial={false}>
              {open === i && (
                <motion.div className="faq__a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: EASINGS.premium }}>
                  <p>{a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
      <Link to="/care" className="link-arrow">
        {t.nav_policies} <Icon name="arrow" size={16} />
      </Link>
    </section>
  );
}

/* ---------- Concierge ---------- */
export function Concierge() {
  const { t } = useStore();
  return (
    <section className="concierge t-ink">
      <div className="concierge__in wrap">
        <motion.img src="/img/monogram.webp" alt="" className="concierge__mono" initial={{ opacity: 0, scale: 0.8, rotate: -10 }} whileInView={{ opacity: 1, scale: 1, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASINGS.out }} />
        <p className="eyebrow">{t.visit_eyebrow}</p>
        <RevealText tag="h2" className="h2 h2--xl" italicLast>
          {t.visit_title}
        </RevealText>
        <p className="lead">{t.visit_body}</p>
        <div className="concierge__ctas">
          <MagneticButton href={waLink(t.wa_general)} className="btn btn--dark">
            <WhatsAppIcon size={18} /> {t.visit_wa}
          </MagneticButton>
          <a className="btn btn--line" href="tel:+19393194127">
            <Icon name="phone" size={18} /> {PHONE_DISPLAY}
          </a>
        </div>
        <p className="concierge__hours mono">{t.visit_hours}</p>
      </div>
    </section>
  );
}
