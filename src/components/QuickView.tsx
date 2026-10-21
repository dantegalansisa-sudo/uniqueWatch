import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { bySlug, fmtPrice, monthly } from '../data/watches';
import { fill, waLink } from '../lib/i18n';
import { EASINGS } from '../lib/easings';
import { useLockBody } from '../lib/hooks';
import Icon, { WhatsAppIcon } from './Icon';

const rise = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { delay: 0.28 + i * 0.06, duration: 0.6, ease: EASINGS.out } },
  exit: { opacity: 0, y: 16, transition: { duration: 0.18 } },
});

/**
 * Shared-element "lift" overlay: the card backdrop and the watch image share a
 * layoutId with the carousel card, so the watch physically rises from the card
 * into the detail view — and settles back down on close.
 */
export default function QuickView() {
  const { quick, openQuick } = useStore();
  const w = bySlug(quick ?? undefined);
  useLockBody(!!w);

  useEffect(() => {
    if (!w) return;
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && openQuick(null);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [w, openQuick]);

  return <AnimatePresence>{w && <Panel key={w.slug} slug={w.slug} />}</AnimatePresence>;
}

function Panel({ slug }: { slug: string }) {
  const { t, lang, openQuick, addToBag, bag, saved, toggleSaved } = useStore();
  const w = bySlug(slug)!;
  const [view, setView] = useState(0);
  const [more, setMore] = useState(false);
  const inBag = bag.includes(w.slug);
  const isSaved = saved.includes(w.slug);
  const name = `${w.brand} ${w.model}`;
  const views = [w.img, w.img, w.wrist].filter(Boolean) as string[];
  const close = () => openQuick(null);

  return (
    <motion.div className="qv" role="dialog" aria-modal="true" aria-label={name} layoutRoot>
      <motion.div className="qv__scrim" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} onClick={close} />

      <div className="qv__sheet">
        <div className="qv__top">
          <motion.div layoutId={`bg-${w.slug}`} className="qv__bg" style={{ background: w.tone, borderRadius: 0 }} transition={{ duration: 0.7, ease: EASINGS.premium }} />
          <motion.div className="qv__bar" {...rise(0)}>
            <button className="iconbtn" onClick={close} aria-label={t.p_back}>
              <Icon name="back" />
            </button>
            <span className="qv__brand" style={{ color: w.ink }}>
              {w.brand}
            </span>
            <button className={`iconbtn ${isSaved ? 'is-on' : ''}`} onClick={() => toggleSaved(w.slug)} aria-label={isSaved ? t.p_saved : t.p_save}>
              <Icon name="heart" />
            </button>
          </motion.div>

          <div className="qv__stage">
            <motion.img
              layoutId={`img-${w.slug}`}
              src={w.img}
              alt={name}
              className="qv__img"
              style={{ rotate: 0 }}
              transition={{ duration: 0.75, ease: EASINGS.premium }}
              draggable={false}
            />
            <AnimatePresence>
              {view > 0 && (
                <motion.div
                  key={view}
                  className={`qv__alt ${view === 1 ? 'is-dial' : 'is-wrist'}`}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASINGS.out }}
                  style={{ background: w.tone }}
                >
                  <img src={views[view]} alt="" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="qv__body">
          <motion.div className="qv__head" {...rise(1)}>
            <div>
              <h2 className="qv__name">
                {w.model}
                {w.nickname && <em> “{w.nickname}”</em>}
              </h2>
              <p className="qv__ref mono">
                {t.p_ref} {w.ref} · {w.year}
              </p>
            </div>
            <div className="qv__price">
              <strong>{fmtPrice(w.price) ?? t.p_por}</strong>
              {w.price && <span>{fill(t.p_monthly, { m: monthly(w.price)! })}</span>}
            </div>
          </motion.div>

          <motion.p className={`qv__desc ${more ? 'is-open' : ''}`} {...rise(2)}>
            {w.description[lang]}{' '}
            {!more && (
              <button className="qv__more" onClick={() => setMore(true)}>
                MORE
              </button>
            )}
          </motion.p>

          <motion.div className="qv__thumbs" {...rise(3)}>
            {views.map((src, i) => (
              <button key={i} className={`qv__thumb ${view === i ? 'is-on' : ''}`} onClick={() => setView(i)} style={{ background: w.tone }} aria-label={t.p_views[i]}>
                <img src={src} alt="" className={i === 1 ? 'is-dial' : ''} />
                <span>{t.p_views[i]}</span>
              </button>
            ))}
          </motion.div>

          <motion.div className="qv__grid" {...rise(4)}>
            {[
              [t.spec.case, w.specs.case],
              [t.spec.movement, w.specs.caliber],
              [t.spec.material, w.specs.material],
              [t.p_condition, t.cond[w.condition]],
              [t.p_set, t.set[w.set]],
              [t.spec.water, w.specs.water],
            ].map(([k, v]) => (
              <div key={k} className="qv__cell">
                <span>{k}</span>
                <strong>{v}</strong>
              </div>
            ))}
          </motion.div>

          <motion.div {...rise(5)}>
            <Link to={`/watch/${w.slug}`} className="qv__full" onClick={() => openQuick(null)}>
              {t.p_full} <Icon name="arrow" size={18} />
            </Link>
          </motion.div>
        </div>

        <motion.div className="qv__cta" initial={{ y: 100 }} animate={{ y: 0, transition: { delay: 0.35, duration: 0.6, ease: EASINGS.out } }} exit={{ y: 120, transition: { duration: 0.25 } }}>
          {w.price ? (
            <button className={`btn btn--dark btn--block ${inBag ? 'is-done' : ''}`} onClick={() => addToBag(w.slug)}>
              {inBag ? <Icon name="check" size={18} /> : <Icon name="bag" size={18} />}
              {inBag ? t.p_added : t.p_add}
            </button>
          ) : (
            <a className="btn btn--dark btn--block" href={waLink(fill(t.wa_piece, { w: name, r: w.ref }))} target="_blank" rel="noreferrer">
              {t.p_request}
            </a>
          )}
          <a className="btn btn--wa" href={waLink(fill(t.wa_piece, { w: name, r: w.ref }))} target="_blank" rel="noreferrer" aria-label={t.p_ask}>
            <WhatsAppIcon size={20} />
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}
