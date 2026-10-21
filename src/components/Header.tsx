import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { useStore } from '../lib/store';
import Icon from './Icon';
import { EASINGS } from '../lib/easings';

export function LangToggle() {
  const { lang, setLang } = useStore();
  return (
    <div className="lang" role="group" aria-label="Language">
      {(['en', 'es'] as const).map((l) => (
        <button key={l} className={lang === l ? 'is-on' : ''} onClick={() => setLang(l)} aria-pressed={lang === l}>
          {lang === l && <motion.span layoutId="lang-pill" className="lang__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <span>{l.toUpperCase()}</span>
        </button>
      ))}
    </div>
  );
}

export function Wordmark({ small }: { small?: boolean }) {
  return (
    <span className={`wordmark ${small ? 'wordmark--sm' : ''}`}>
      <span className="wordmark__name">UNIQUE</span>
      <span className="wordmark__sub">Watches &amp; Jewelry</span>
    </span>
  );
}

export default function Header() {
  const { t, bag, saved } = useStore();
  const { pathname } = useLocation();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [menu, setMenu] = useState(false);

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 160);
    setSolid(y > 24);
  });
  useEffect(() => setMenu(false), [pathname]);

  const links = [
    { to: '/shop', label: t.nav_shop },
    { to: '/about', label: t.nav_about },
    { to: '/sell', label: t.nav_sell },
    { to: '/care', label: t.nav_policies },
  ];

  return (
    <>
      <motion.header
        className={`hdr ${solid || menu ? 'is-solid' : ''}`}
        animate={{ y: hidden && !menu ? '-110%' : '0%' }}
        transition={{ duration: 0.5, ease: EASINGS.premium }}
      >
        <div className="hdr__in">
          <nav className="hdr__nav" aria-label="Primary">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className="hdr__link">
                <span>{l.label}</span>
              </NavLink>
            ))}
          </nav>
          <button className="hdr__burger" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <span className={menu ? 'is-x' : ''} />
          </button>
          <Link to="/" className="hdr__brand" aria-label="UNIQUE home">
            <img src="/img/monogram.webp" alt="" className="hdr__mono" width={46} height={26} />
            <Wordmark small />
          </Link>
          <div className="hdr__actions">
            <LangToggle />
            <Link to="/shop" className="hdr__icon hide-m" aria-label="Search">
              <Icon name="search" />
            </Link>
            <Link to="/saved" className="hdr__icon hide-m" aria-label={t.nav_saved}>
              <Icon name="heart" />
              {saved.length > 0 && <span className="badge">{saved.length}</span>}
            </Link>
            <Link to="/bag" className="hdr__icon hide-m" aria-label={t.nav_bag}>
              <Icon name="bag" />
              <AnimatePresence>
                {bag.length > 0 && (
                  <motion.span key={bag.length} className="badge" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                    {bag.length}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {menu && (
          <motion.div
            className="mmenu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.7, ease: EASINGS.premium }}
          >
            <nav>
              {[{ to: '/', label: t.nav_home }, ...links, { to: '/saved', label: t.nav_saved }].map((l, i) => (
                <motion.div key={l.to} initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.25 + i * 0.06, duration: 0.6, ease: EASINGS.out }}>
                  <Link to={l.to} className="mmenu__link">
                    <em>0{i + 1}</em>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <p className="mmenu__foot">Tu tiempo. Tu esencia.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
