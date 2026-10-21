import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion';
import { useStore } from '../lib/store';
import { bySlug, fmtPrice, monthly } from '../data/watches';
import { fill, waLink } from '../lib/i18n';
import { EASINGS } from '../lib/easings';
import { AnalogClock, DigitalTime } from '../components/LiveClock';
import MagneticButton from '../components/MagneticButton';
import Icon, { WhatsAppIcon } from '../components/Icon';

const WORD = 'UNIQUE'.split('');

function BigWord({ delay = 0.2, className = '' }: { delay?: number; className?: string }) {
  return (
    <span className={`bigword ${className}`} aria-hidden="true">
      {WORD.map((c, i) => (
        <span key={i} className="bigword__mask">
          <motion.span
            initial={{ y: '105%' }}
            animate={{ y: 0 }}
            transition={{ delay: delay + i * 0.07, duration: 1.2, ease: EASINGS.cinematic }}
          >
            {c}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

function HeroTitle({ delay = 0.5 }: { delay?: number }) {
  const { t } = useStore();
  return (
    <h1 className="hero-title" aria-label={`${t.hero_l1} ${t.hero_l2}`}>
      {[t.hero_l1, t.hero_l2].map((line, i) => (
        <span key={line} className="hero-title__line" aria-hidden="true">
          <motion.span
            className={i === 1 ? 'it' : ''}
            initial={{ y: '110%', rotate: 2 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ delay: delay + i * 0.12, duration: 1, ease: EASINGS.premium }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/* ================= MOBILE HERO ================= */
export function HeroMobile() {
  const { t, lang } = useStore();
  const ref = useRef<HTMLElement>(null);
  const w = bySlug('cartier-santos-dumont-rose-gold')!;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const rot = useTransform(scrollYProgress, [0, 1], [0, 28]);
  const sc = useTransform(scrollYProgress, [0, 1], [1, 0.82]);
  const wy = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const wordX = useTransform(scrollYProgress, [0, 1], ['0%', '-22%']);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} className="hm">
      <motion.div className="hm__time" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
        <AnalogClock size={30} />
        <span>
          <small>{t.hero_local}</small>
          <DigitalTime lang={lang} />
        </span>
      </motion.div>

      <div className="hm__stage">
        <motion.div className="hm__word" style={{ x: wordX }}>
          <BigWord delay={0.15} />
        </motion.div>
        <motion.div className="hm__orbit" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.3, duration: 1.4, ease: EASINGS.out }} />
        <motion.div style={{ rotate: rot, scale: sc, y: wy }} className="hm__watchwrap">
          <div className="float">
          <motion.img
            src={w.img}
            alt={`${w.brand} ${w.model}`}
            className="hm__watch"
            initial={{ opacity: 0, y: 90, rotate: -28, scale: 0.78, filter: 'blur(12px)' }}
            animate={{ opacity: 1, y: 0, rotate: -6, scale: 1, filter: 'blur(0px)' }}
            transition={{ delay: 0.45, duration: 1.5, ease: EASINGS.out }}
            draggable={false}
          />
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.7 }} className="hm__chipwrap">
          <Link to={`/watch/${w.slug}`} className="hm__chip">
            <span className="dot" />
            <span>
              <small>{t.hero_featured}</small>
              {w.brand} {w.model}
            </span>
            <strong className="mono">{fmtPrice(w.price)}</strong>
          </Link>
        </motion.div>
      </div>

      <motion.div className="hm__copy" style={{ opacity: fade }}>
        <motion.p className="eyebrow" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          {t.hero_eyebrow}
        </motion.p>
        <HeroTitle delay={0.6} />
        <motion.p className="hm__sub" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.8 }}>
          {t.hero_sub}
        </motion.p>
        <motion.div className="hm__ctas" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}>
          <MagneticButton to="/shop" className="btn btn--dark">
            {t.hero_cta} <Icon name="arrow" size={18} />
          </MagneticButton>
          <a className="btn btn--round" href={waLink(t.wa_general)} target="_blank" rel="noreferrer" aria-label={t.hero_cta2}>
            <WhatsAppIcon size={20} />
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ================= DESKTOP HERO ================= */
const SLIDES = ['cartier-santos-dumont-rose-gold', 'rolex-daytona-panda-white', 'patek-philippe-nautilus-5711-blue'];

export function HeroDesktop() {
  const { t, lang, addToBag, bag } = useStore();
  const ref = useRef<HTMLElement>(null);
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const w = bySlug(SLIDES[i])!;
  const inBag = bag.includes(w.slug);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const rY = useTransform(smx, [-1, 1], [-10, 10]);
  const rX = useTransform(smy, [-1, 1], [7, -7]);
  const wordShift = useTransform(smx, [-1, 1], [24, -24]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const stageY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const stageS = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const wordSpacing = useTransform(scrollYProgress, [0, 1], ['-0.02em', '0.12em']);
  const sideFade = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const go = (n: number) => {
    setDir(n > i || (i === SLIDES.length - 1 && n === 0) ? 1 : -1);
    setI((n + SLIDES.length) % SLIDES.length);
  };

  useEffect(() => {
    const id = window.setTimeout(() => go(i + 1), 8000);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <section
      ref={ref}
      className="hd"
      onMouseMove={(e) => {
        mx.set((e.clientX / window.innerWidth) * 2 - 1);
        my.set((e.clientY / window.innerHeight) * 2 - 1);
      }}
    >
      <motion.div className="hd__word" style={{ x: wordShift, letterSpacing: wordSpacing }}>
        <BigWord delay={0.2} />
      </motion.div>

      <motion.div className="hd__stage" style={{ y: stageY, scale: stageS, rotateX: rX, rotateY: rY }}>
        <AnimatePresence mode="popLayout" custom={dir} initial={false}>
          <motion.img
            key={w.slug}
            src={w.img}
            alt={`${w.brand} ${w.model}`}
            className={`hd__watch ${i === 0 ? 'is-hero' : 'is-std'}`}
            custom={dir}
            initial={{ opacity: 0, x: dir * 220, rotate: dir * 18, scale: 0.85, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, rotate: i === 0 ? 0 : -8, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: dir * -220, rotate: dir * -18, scale: 0.85, filter: 'blur(10px)' }}
            transition={{ duration: 1.1, ease: EASINGS.premium }}
            draggable={false}
          />
        </AnimatePresence>
        <motion.img
          src={w.img}
          alt=""
          className={`hd__shadow ${i === 0 ? 'is-hero' : 'is-std'}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          aria-hidden="true"
        />
      </motion.div>

      <motion.div className="hd__left" style={{ opacity: sideFade }}>
        <AnimatePresence mode="wait">
          <motion.div key={w.slug} initial="i" animate="a" exit="e" variants={{ a: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}>
            {[
              <p key="e" className="eyebrow">
                {w.tag ? w.tag[lang] : t.hero_featured} · {w.brand}
              </p>,
              <h2 key="h" className="hd__name">
                {w.model}
                {w.nickname && <em>{w.nickname}</em>}
              </h2>,
              <p key="d" className="hd__desc">
                {w.description[lang].split('. ')[0]}.
              </p>,
              <div key="c" className="hd__ctas">
                <MagneticButton to={`/watch/${w.slug}`} className="btn btn--line">
                  {t.p_full}
                </MagneticButton>
                <button className={`btn btn--sq ${inBag ? 'is-done' : ''}`} onClick={() => addToBag(w.slug)} aria-label={t.p_add}>
                  <Icon name={inBag ? 'check' : 'plus'} size={18} />
                </button>
                <span className="hd__add">{inBag ? t.p_added : t.p_add}</span>
              </div>,
            ].map((el, k) => (
              <motion.div
                key={k}
                variants={{
                  i: { opacity: 0, y: 30 },
                  a: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASINGS.out } },
                  e: { opacity: 0, y: -16, transition: { duration: 0.3 } },
                }}
              >
                {el}
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div className="hd__right" style={{ opacity: sideFade }}>
        <AnimatePresence mode="wait">
          <motion.div key={w.slug} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.3, duration: 0.8, ease: EASINGS.out } }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
            <dl className="hd__specs">
              <div>
                <dt>{w.specs.case}</dt>
                <dd>{t.spec.case}</dd>
              </div>
              <div>
                <dt>{w.specs.caliber}</dt>
                <dd>{w.specs.movement}</dd>
              </div>
              <div>
                <dt>{w.specs.material}</dt>
                <dd>{t.spec.material}</dd>
              </div>
            </dl>
            <p className="hd__price">{fmtPrice(w.price)}</p>
            <p className="hd__monthly">{w.price && fill(t.p_monthly, { m: monthly(w.price)! })}</p>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="hd__foot">
        <motion.div className="hd__clock" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
          <AnalogClock size={38} />
          <span>
            <small>{t.hero_local}</small>
            <DigitalTime lang={lang} />
          </span>
        </motion.div>
        <div className="hd__nav">
          <button className="iconbtn" onClick={() => go(i - 1)} aria-label="Previous">
            <Icon name="back" size={18} />
          </button>
          <div className="hd__dots">
            {SLIDES.map((s, k) => (
              <button key={s} className={k === i ? 'is-on' : ''} onClick={() => go(k)} aria-label={`Slide ${k + 1}`}>
                {k === i && <motion.span className="hd__dotfill" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 8, ease: 'linear' }} />}
              </button>
            ))}
          </div>
          <button className="iconbtn" onClick={() => go(i + 1)} aria-label="Next">
            <Icon name="arrow" size={18} />
          </button>
        </div>
        <a className="hd__scroll" href="#collection">
          <span>{t.hero_scroll}</span>
          <i />
        </a>
      </div>
    </section>
  );
}
