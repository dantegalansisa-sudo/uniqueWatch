import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { PHONE_DISPLAY, waLink } from '../lib/i18n';
import { EASINGS } from '../lib/easings';
import { useLockBody } from '../lib/hooks';
import Icon, { WhatsAppIcon } from './Icon';
import { Wordmark } from './Header';

export function Footer() {
  const { t } = useStore();
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <div className="foot__brand">
            <img src="/img/logo.webp" alt="UNIQUE Watches & Jewelry" className="foot__logo" loading="lazy" />
            <p className="foot__tag">{t.foot_tag}</p>
          </div>
          <div className="foot__cols">
            <div>
              <h4>{t.foot_shop}</h4>
              <Link to="/shop">{t.nav_shop}</Link>
              <Link to="/saved">{t.nav_saved}</Link>
              <Link to="/sell">{t.nav_sell}</Link>
              <Link to="/about">{t.nav_about}</Link>
            </div>
            <div>
              <h4>{t.foot_care}</h4>
              {t.po_tabs.map((p, i) => (
                <Link key={p} to={`/care?tab=${i}`}>
                  {p}
                </Link>
              ))}
            </div>
            <div>
              <h4>{t.foot_contact}</h4>
              <a href={waLink(t.wa_general)} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
              <a href="tel:+19393194127">{PHONE_DISPLAY}</a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">
                Instagram
              </a>
              <span className="foot__muted">{t.visit_hours}</span>
            </div>
          </div>
        </div>
        <div className="foot__huge" aria-hidden="true">
          <Wordmark />
        </div>
        <p className="foot__legal">{t.foot_legal}</p>
        <div className="foot__bottom">
          <span>© {new Date().getFullYear()} UNIQUE Watches &amp; Jewelry · Puerto Rico, USA</span>
          <span className="foot__links">
            <Link to="/care?tab=4">{t.foot_privacy}</Link>
            <Link to="/care?tab=1">{t.foot_terms}</Link>
            <Link to="/care">{t.foot_access}</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}

export function Toast() {
  const { toast } = useStore();
  return (
    <div className="toast-wrap" aria-live="polite">
      <AnimatePresence>
        {toast && (
          <motion.div key={toast} className="toast" initial={{ y: -30, opacity: 0, scale: 0.9 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -20, opacity: 0 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
            <Icon name="check" size={16} /> {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function WhatsAppFab() {
  const { t } = useStore();
  return (
    <motion.a className="wafab" href={waLink(t.wa_general)} target="_blank" rel="noreferrer" aria-label={t.nav_chat} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, type: 'spring' }}>
      <WhatsAppIcon size={24} />
      <span className="wafab__lbl">{t.nav_chat}</span>
    </motion.a>
  );
}

// Demo stand-in for a Stripe Checkout redirect
export function CheckoutSheet() {
  const { t, checkout, setCheckout } = useStore();
  useLockBody(checkout);
  return (
    <AnimatePresence>
      {checkout && (
        <motion.div className="sheet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="sheet__scrim" onClick={() => setCheckout(false)} />
          <motion.div className="sheet__panel" role="dialog" aria-modal="true" initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ duration: 0.6, ease: EASINGS.premium }}>
            <span className="sheet__grab" />
            <div className="stripe-mark">
              <Icon name="lock" size={18} />
              <span>stripe</span>
            </div>
            <h3>{t.b_demo_t}</h3>
            <p>{t.b_demo_d}</p>
            <button className="btn btn--dark btn--block" onClick={() => setCheckout(false)}>
              {t.b_demo_ok}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Preloader() {
  const [show, setShow] = useState(() => {
    try {
      return !sessionStorage.getItem('uw-intro');
    } catch {
      return true;
    }
  });
  useEffect(() => {
    if (!show) return;
    const id = window.setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem('uw-intro', '1');
      } catch {
        /* ignore */
      }
    }, 1900);
    return () => window.clearTimeout(id);
  }, [show]);
  return (
    <AnimatePresence>
      {show && (
        <motion.div className="pre" exit={{ clipPath: 'inset(0 0 100% 0)' }} transition={{ duration: 0.9, ease: EASINGS.premium }}>
          <motion.img src="/img/monogram.webp" alt="" initial={{ opacity: 0, scale: 0.9, filter: 'blur(8px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1, ease: EASINGS.out }} />
          <div className="pre__bar">
            <motion.span initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.6, ease: EASINGS.smooth }} />
          </div>
          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }}>
            Tu tiempo. Tu esencia.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
