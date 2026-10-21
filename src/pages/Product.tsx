import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';
import { AnimatePresence, motion, type PanInfo } from 'framer-motion';
import { useStore } from '../lib/store';
import { WATCHES, bySlug, fmtPrice, monthly } from '../data/watches';
import { fill, waLink } from '../lib/i18n';
import { EASINGS, containerVariants } from '../lib/easings';
import Icon, { WhatsAppIcon } from '../components/Icon';
import ProductCard from '../components/ProductCard';
import MagneticButton from '../components/MagneticButton';

const COND_LEVEL = { unworn: 3, excellent: 2, 'very-good': 1 } as const;

export default function Product() {
  const { slug } = useParams();
  const w = bySlug(slug);
  if (!w) return <Navigate to="/shop" replace />;
  return <ProductView key={w.slug} slug={w.slug} />;
}

function ProductView({ slug }: { slug: string }) {
  const w = bySlug(slug)!;
  const nav = useNavigate();
  const { t, lang, addToBag, bag, saved, toggleSaved, notify, setCheckout } = useStore();
  const [view, setView] = useState(0);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const name = `${w.brand} ${w.model}`;
  const views = [w.img, w.img, w.wrist].filter(Boolean) as string[];
  const inBag = bag.includes(w.slug);
  const isSaved = saved.includes(w.slug);
  const wa = waLink(fill(t.wa_piece, { w: name, r: w.ref }));
  const related = WATCHES.filter((x) => x.slug !== w.slug && (x.brand === w.brand || x.condition === w.condition)).slice(0, 4);

  useEffect(() => {
    document.title = `${name} ${w.ref} — UNIQUE Watches & Jewelry`;
    // Structured data so search engines can show price & availability
    const el = document.createElement('script');
    el.type = 'application/ld+json';
    el.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Product',
      name,
      brand: { '@type': 'Brand', name: w.brand },
      sku: w.ref,
      image: location.origin + w.img,
      description: w.description.en,
      itemCondition: w.condition === 'unworn' ? 'https://schema.org/NewCondition' : 'https://schema.org/UsedCondition',
      ...(w.price && { offers: { '@type': 'Offer', price: w.price, priceCurrency: 'USD', availability: 'https://schema.org/InStock' } }),
    });
    document.head.appendChild(el);
    return () => {
      el.remove();
      document.title = 'UNIQUE — Watches & Jewelry · Authenticated Luxury Timepieces';
    };
  }, [w, name]);

  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: name, url: location.href });
      else {
        await navigator.clipboard.writeText(location.href);
        notify(t.p_copied);
      }
    } catch {
      /* cancelled */
    }
  };

  const swipe = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -50) setView((v) => Math.min(views.length - 1, v + 1));
    if (info.offset.x > 50) setView((v) => Math.max(0, v - 1));
  };

  const buy = () => {
    addToBag(w.slug);
    setCheckout(true);
  };

  return (
    <div className="pdp" style={{ ['--tone' as string]: w.tone, ['--ink' as string]: w.ink }}>
      <div className="pdp__grid wrap">
        {/* ---------- Gallery ---------- */}
        <div className="pdp__gallery">
          <div className="pdp__bar">
            <button className="iconbtn" onClick={() => (history.length > 1 ? nav(-1) : nav('/shop'))} aria-label={t.p_back}>
              <Icon name="back" />
            </button>
            <div className="pdp__baractions">
              <button className="iconbtn" onClick={share} aria-label={t.p_share}>
                <Icon name="share" />
              </button>
              <button className={`iconbtn ${isSaved ? 'is-on' : ''}`} onClick={() => toggleSaved(w.slug)} aria-label={isSaved ? t.p_saved : t.p_save}>
                <Icon name="heart" />
              </button>
            </div>
          </div>
          <motion.div className="pdp__arc" initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 1, ease: EASINGS.out }} />
          <motion.div
            className={`pdp__stage ${zoom ? 'is-zoom' : ''}`}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={swipe}
            onMouseMove={(e) => {
              if (view === 2 || window.innerWidth < 960) return;
              const r = e.currentTarget.getBoundingClientRect();
              setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
            }}
            onMouseLeave={() => setZoom(null)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={view}
                src={views[view]}
                alt={`${name} — ${t.p_views[view]}`}
                className={`pdp__img v${view} ${w.slug.includes('santos-dumont') ? 'is-wide' : ''}`}
                initial={{ opacity: 0, y: view === 0 ? 60 : 0, scale: view === 0 ? 0.9 : 1.05, rotate: view === 0 ? -10 : 0 }}
                animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.8, ease: EASINGS.out }}
                style={zoom ? { transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
                draggable={false}
              />
            </AnimatePresence>
          </motion.div>
          <div className="pdp__thumbs">
            {views.map((src, i) => (
              <button key={i} className={`pdp__thumb ${view === i ? 'is-on' : ''}`} onClick={() => setView(i)} aria-label={t.p_views[i]}>
                <img src={src} alt="" className={i === 1 ? 'is-dial' : ''} />
                <span>{t.p_views[i]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ---------- Info ---------- */}
        <motion.div className="pdp__info" variants={containerVariants} initial="hidden" animate="visible">
          <Fade>
            <p className="eyebrow">
              {w.brand}
              {w.tag && <span className="pdp__tag">{w.tag[lang]}</span>}
            </p>
          </Fade>
          <Fade>
            <h1 className="pdp__name">
              {w.model}
              {w.nickname && <em> “{w.nickname}”</em>}
            </h1>
          </Fade>
          <Fade>
            <p className="pdp__ref mono">
              {t.p_ref} {w.ref} · {t.p_year} {w.year}
            </p>
          </Fade>
          <Fade>
            <div className="pdp__price">
              <strong>{fmtPrice(w.price) ?? t.p_por}</strong>
              {w.price && <span>{fill(t.p_monthly, { m: monthly(w.price)! })}</span>}
            </div>
          </Fade>
          <Fade>
            <div className="pdp__chips">
              <span className="pill">{t.cond[w.condition]}</span>
              <span className="pill">{t.set[w.set]}</span>
              <span className="pill pill--live">
                <i /> {t.p_stock}
              </span>
            </div>
          </Fade>
          <Fade>
            <div className="pdp__ctas">
              {w.price ? (
                <>
                  <button className={`btn btn--dark btn--block ${inBag ? 'is-done' : ''}`} onClick={() => addToBag(w.slug)}>
                    <Icon name={inBag ? 'check' : 'bag'} size={18} /> {inBag ? t.p_added : t.p_add}
                  </button>
                  <button className="btn btn--line btn--block" onClick={buy}>
                    <Icon name="lock" size={16} /> {t.p_buy}
                  </button>
                </>
              ) : (
                <MagneticButton href={wa} className="btn btn--dark btn--block">
                  {t.p_request}
                </MagneticButton>
              )}
              <a className="btn btn--wa-line btn--block" href={wa} target="_blank" rel="noreferrer">
                <WhatsAppIcon size={18} /> {w.price ? t.p_reserve : t.p_ask}
              </a>
              <p className="pdp__secure">
                <Icon name="lock" size={13} /> {t.p_secure} · Visa · Amex · Apple Pay · Affirm
              </p>
            </div>
          </Fade>

          <Fade>
            <section className="pdp__block">
              <h2>{t.p_about}</h2>
              <p className="pdp__desc">{w.description[lang]}</p>
            </section>
          </Fade>

          <Fade>
            <section className="pdp__block">
              <h2>{t.p_specs}</h2>
              <dl className="specs">
                <div>
                  <dt>{t.p_ref}</dt>
                  <dd className="mono">{w.ref}</dd>
                </div>
                <div>
                  <dt>{t.p_year}</dt>
                  <dd>{w.year}</dd>
                </div>
                {(Object.keys(w.specs) as (keyof typeof w.specs)[]).map((k) => (
                  <div key={k}>
                    <dt>{t.spec[k]}</dt>
                    <dd>{w.specs[k]}</dd>
                  </div>
                ))}
              </dl>
            </section>
          </Fade>

          <Fade>
            <section className="pdp__block">
              <h2>{t.p_condition}</h2>
              <motion.div className="meter" aria-label={t.cond[w.condition]} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {[1, 2, 3].map((n) => (
                  <motion.span
                    key={n}
                    className={n <= COND_LEVEL[w.condition] ? 'is-on' : ''}
                    variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: n * 0.12, duration: 0.6 } } }}
                  />
                ))}
              </motion.div>
              <p className="pdp__cond">
                <strong>{t.cond[w.condition]}</strong> — {t.cond_d[w.condition]}
              </p>
            </section>
          </Fade>

          <Fade>
            <section className="pdp__block">
              <h2>{t.p_included}</h2>
              <ul className="checks">
                {t.inc[w.set].map((x) => (
                  <li key={x}>
                    <Icon name="check" size={16} /> {x}
                  </li>
                ))}
              </ul>
            </section>
          </Fade>

          <Fade>
            <div className="pdp__assure">
              <div>
                <Icon name="shield" size={22} stroke={1.3} />
                <h3>{t.p_auth}</h3>
                <p>{t.p_auth_d}</p>
              </div>
              <div>
                <Icon name="truck" size={22} stroke={1.3} />
                <h3>{t.p_ship}</h3>
                <p>{t.p_ship_d}</p>
              </div>
            </div>
          </Fade>
        </motion.div>
      </div>

      {related.length > 0 && (
        <section className="related wrap">
          <h2 className="h3">{t.p_related}</h2>
          <motion.div className="related__row" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}>
            {related.map((r) => (
              <ProductCard key={r.slug} w={r} />
            ))}
          </motion.div>
          <Link to="/shop" className="link-arrow">
            {t.edit_viewall} <Icon name="arrow" size={16} />
          </Link>
        </section>
      )}

      {/* Mobile sticky purchase bar */}
      <motion.div className="buybar" initial={{ y: 120 }} animate={{ y: 0 }} transition={{ delay: 0.5, duration: 0.7, ease: EASINGS.out }}>
        <div className="buybar__price">
          <small>{w.brand}</small>
          <strong>{fmtPrice(w.price) ?? t.p_por}</strong>
        </div>
        {w.price ? (
          <button className={`btn btn--dark ${inBag ? 'is-done' : ''}`} onClick={() => addToBag(w.slug)}>
            <Icon name={inBag ? 'check' : 'bag'} size={18} /> {inBag ? t.p_added : t.p_add}
          </button>
        ) : (
          <a className="btn btn--dark" href={wa} target="_blank" rel="noreferrer">
            {t.p_request}
          </a>
        )}
        <a className="btn btn--wa" href={wa} target="_blank" rel="noreferrer" aria-label={t.p_ask}>
          <WhatsAppIcon size={20} />
        </a>
      </motion.div>
    </div>
  );
}

function Fade({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 26 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASINGS.out } },
      }}
    >
      {children}
    </motion.div>
  );
}
