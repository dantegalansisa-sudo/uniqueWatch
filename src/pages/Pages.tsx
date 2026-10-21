import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { BRANDS, WATCHES, fmtPrice } from '../data/watches';
import { fill, waLink } from '../lib/i18n';
import { EASINGS, containerVariants, cardVariants } from '../lib/easings';
import RevealText from '../components/RevealText';
import ProductCard from '../components/ProductCard';
import Icon, { WhatsAppIcon } from '../components/Icon';

/* ================= BAG ================= */
export function Bag() {
  const { t, bagItems, toggleBag, setCheckout } = useStore();
  const subtotal = bagItems.reduce((s, w) => s + (w.price ?? 0), 0);
  const hasPor = bagItems.some((w) => !w.price);
  const waText = `${t.wa_bag}\n${bagItems.map((w) => `• ${w.brand} ${w.model} (${w.ref}) ${fmtPrice(w.price) ?? ''}`).join('\n')}`;

  return (
    <div className="bagpage page wrap">
      <header className="page__head">
        <RevealText tag="h1" className="h1" immediate italicLast>
          {t.b_title}
        </RevealText>
      </header>
      {bagItems.length === 0 ? (
        <Empty text={t.b_empty} cta={t.b_empty_cta} icon="bag" />
      ) : (
        <div className="bag">
          <ul className="bag__list">
            <AnimatePresence initial={false}>
              {bagItems.map((w) => (
                <motion.li key={w.slug} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -80, height: 0, marginBottom: 0 }} transition={{ duration: 0.5, ease: EASINGS.out }}>
                  <Link to={`/watch/${w.slug}`} className="bagitem__img" style={{ background: w.tone }}>
                    <img src={w.img} alt="" />
                  </Link>
                  <div className="bagitem__txt">
                    <span className="mono">{w.brand}</span>
                    <strong>{w.model}</strong>
                    <span className="bagitem__meta">
                      {t.p_ref} {w.ref} · {t.cond[w.condition]} · {t.set[w.set]}
                    </span>
                    <button className="bagitem__rm" onClick={() => toggleBag(w.slug)}>
                      {t.b_remove}
                    </button>
                  </div>
                  <em className="bagitem__price">{fmtPrice(w.price) ?? t.p_por}</em>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <aside className="summary">
            <dl>
              <div>
                <dt>{t.b_subtotal}</dt>
                <dd>{fmtPrice(subtotal)}</dd>
              </div>
              <div>
                <dt>{t.b_shipping}</dt>
                <dd>{t.b_ship_v}</dd>
              </div>
              <div>
                <dt>{t.b_tax}</dt>
                <dd>{t.b_tax_v}</dd>
              </div>
              <div className="summary__total">
                <dt>{t.b_total}</dt>
                <dd>{fmtPrice(subtotal)}</dd>
              </div>
            </dl>
            {hasPor && <p className="summary__note">{t.b_por_note}</p>}
            <button className="btn btn--dark btn--block" onClick={() => setCheckout(true)}>
              <Icon name="lock" size={16} /> {t.b_checkout}
            </button>
            <div className="summary__or">
              <span>{t.b_or}</span>
            </div>
            <a className="btn btn--wa-line btn--block" href={waLink(waText)} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} /> {t.b_wa}
            </a>
            <p className="pdp__secure">
              <Icon name="lock" size={13} /> {t.p_secure}
            </p>
            <div className="summary__pay">
              {['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'Google Pay', 'Affirm', 'Klarna'].map((p) => (
                <span key={p} className="pay">
                  {p}
                </span>
              ))}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function Empty({ text, cta, icon }: { text: string; cta: string; icon: string }) {
  return (
    <motion.div className="empty" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <span className="empty__ico">
        <Icon name={icon} size={28} stroke={1.2} />
      </span>
      <p>{text}</p>
      <Link to="/shop" className="btn btn--dark">
        {cta} <Icon name="arrow" size={18} />
      </Link>
    </motion.div>
  );
}

/* ================= SAVED ================= */
export function Saved() {
  const { t, saved } = useStore();
  const list = WATCHES.filter((w) => saved.includes(w.slug));
  return (
    <div className="page wrap">
      <header className="page__head">
        <RevealText tag="h1" className="h1" immediate italicLast>
          {t.sv_title}
        </RevealText>
      </header>
      {list.length === 0 ? (
        <Empty text={t.sv_empty} cta={t.b_empty_cta} icon="heart" />
      ) : (
        <motion.div className="grid" variants={containerVariants} initial="hidden" animate="visible">
          <AnimatePresence mode="popLayout">
            {list.map((w) => (
              <ProductCard key={w.slug} w={w} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}

/* ================= ABOUT ================= */
export function About() {
  const { t } = useStore();
  return (
    <div className="about page">
      <header className="page__head wrap">
        <p className="eyebrow">{t.a_eyebrow}</p>
        <RevealText tag="h1" className="h1" immediate italicLast>
          {t.a_title}
        </RevealText>
      </header>
      <div className="about__grid wrap">
        <motion.div className="about__img" initial={{ clipPath: 'inset(0 0 100% 0 round 28px)' }} animate={{ clipPath: 'inset(0 0 0% 0 round 28px)' }} transition={{ duration: 1.3, ease: EASINGS.premium, delay: 0.2 }}>
          <img src="/img/m/man-navy.webp" alt="" />
        </motion.div>
        <div className="about__copy">
          <motion.img src="/img/logo.webp" alt="UNIQUE Watches & Jewelry" className="about__logo" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 1 }} />
          <p className="lead">{t.a_body1}</p>
          <p>{t.a_body2}</p>
          <motion.ul className="about__values" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {t.a_values.map((v, i) => (
              <motion.li key={v} variants={cardVariants}>
                <span className="mono">0{i + 1}</span> {v}
              </motion.li>
            ))}
          </motion.ul>
          <div className="about__brands">
            {BRANDS.map((b) => (
              <Link key={b} to={`/shop?brand=${encodeURIComponent(b)}`}>
                {b}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= SELL / TRADE ================= */
export function Sell() {
  const { t } = useStore();
  const [f, setF] = useState({ intent: 'sell', brand: 'Rolex', model: '', cond: 'excellent', papers: 'yes', name: '' });
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setF({ ...f, [k]: e.target.value });
  const intentWord = f.intent === 'sell' ? t.sl_sell.toLowerCase() : t.sl_trade.toLowerCase();
  const msg = `${fill(t.wa_sell, { i: intentWord })}\n• ${t.sl_brand}: ${f.brand}\n• ${t.sl_model}: ${f.model || '—'}\n• ${t.sl_cond}: ${t.cond[f.cond as keyof typeof t.cond]}\n• ${t.sl_set} ${f.papers === 'yes' ? t.sl_yes : t.sl_no}\n• ${t.sl_name}: ${f.name || '—'}`;

  return (
    <div className="sell page">
      <div className="sell__grid wrap">
        <div className="sell__intro">
          <p className="eyebrow">{t.sell_eyebrow}</p>
          <RevealText tag="h1" className="h1" immediate italicLast>
            {t.sl_title}
          </RevealText>
          <p className="lead">{t.sl_sub}</p>
          <motion.img src="/img/w/daytona.webp" alt="" className="sell__art" initial={{ opacity: 0, rotate: -30, y: 60 }} animate={{ opacity: 1, rotate: -12, y: 0 }} transition={{ duration: 1.3, ease: EASINGS.out, delay: 0.3 }} />
        </div>
        <motion.form className="form" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: EASINGS.out }} onSubmit={(e) => e.preventDefault()}>
          <fieldset className="seg">
            <legend>{t.sl_intent}</legend>
            {(['sell', 'trade'] as const).map((k) => (
              <label key={k} className={f.intent === k ? 'is-on' : ''}>
                <input type="radio" name="intent" value={k} checked={f.intent === k} onChange={set('intent')} />
                {k === 'sell' ? t.sl_sell : t.sl_trade}
              </label>
            ))}
          </fieldset>
          <label className="field">
            <span>{t.sl_brand}</span>
            <select value={f.brand} onChange={set('brand')}>
              {[...BRANDS, 'Other'].map((b) => (
                <option key={b}>{b}</option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>{t.sl_model}</span>
            <input value={f.model} onChange={set('model')} placeholder="Submariner 126610LN" />
          </label>
          <div className="field-row">
            <label className="field">
              <span>{t.sl_cond}</span>
              <select value={f.cond} onChange={set('cond')}>
                {(['unworn', 'excellent', 'very-good'] as const).map((c) => (
                  <option key={c} value={c}>
                    {t.cond[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>{t.sl_set}</span>
              <select value={f.papers} onChange={set('papers')}>
                <option value="yes">{t.sl_yes}</option>
                <option value="no">{t.sl_no}</option>
              </select>
            </label>
          </div>
          <label className="field">
            <span>{t.sl_name}</span>
            <input value={f.name} onChange={set('name')} autoComplete="name" />
          </label>
          <a className="btn btn--dark btn--block" href={waLink(msg)} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={18} /> {t.sl_send}
          </a>
          <p className="form__note">{t.sl_note}</p>
        </motion.form>
      </div>
    </div>
  );
}

/* ================= CLIENT CARE / POLICIES ================= */
export function Care() {
  const { t } = useStore();
  const [params, setParams] = useSearchParams();
  const tab = Math.min(4, Math.max(0, Number(params.get('tab') ?? 0)));
  return (
    <div className="care page wrap">
      <header className="page__head">
        <p className="eyebrow">UNIQUE</p>
        <RevealText tag="h1" className="h1" immediate italicLast>
          {t.po_title}
        </RevealText>
      </header>
      <div className="chips chips--scroll care__tabs" role="tablist">
        {t.po_tabs.map((p, i) => (
          <button key={p} role="tab" aria-selected={tab === i} className={`chip ${tab === i ? 'is-on' : ''}`} onClick={() => setParams({ tab: String(i) }, { replace: true })}>
            {tab === i && <motion.span layoutId="care-chip" className="chip__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
            <span>{p}</span>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.article key={tab} className="care__body" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.45, ease: EASINGS.out }}>
          <span className="mono care__n">0{tab + 1}</span>
          <h2 className="h2">{t.po_tabs[tab]}</h2>
          <p className="lead">{t.po_body[tab]}</p>
        </motion.article>
      </AnimatePresence>
      <div className="care__faq">
        {t.faq.map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
