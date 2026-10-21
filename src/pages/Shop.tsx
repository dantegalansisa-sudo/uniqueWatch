import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { BRANDS, WATCHES, type Condition } from '../data/watches';
import { containerVariants } from '../lib/easings';
import { waLink } from '../lib/i18n';
import RevealText from '../components/RevealText';
import ProductCard from '../components/ProductCard';
import Icon from '../components/Icon';

type Sort = 'featured' | 'low' | 'high' | 'new';

export default function Shop() {
  const { t } = useStore();
  const [params, setParams] = useSearchParams();
  const brand = params.get('brand') ?? 'all';
  const [q, setQ] = useState('');
  const [sort, setSort] = useState<Sort>('featured');
  const [cond, setCond] = useState<'all' | Condition>('all');

  const list = useMemo(() => {
    let l = WATCHES.filter((w) => brand === 'all' || w.brand === brand);
    if (cond !== 'all') l = l.filter((w) => w.condition === cond);
    if (q.trim()) {
      const s = q.toLowerCase();
      l = l.filter((w) => `${w.brand} ${w.model} ${w.nickname ?? ''} ${w.ref}`.toLowerCase().includes(s));
    }
    const price = (n: number | null) => n ?? Infinity;
    if (sort === 'low') l = [...l].sort((a, b) => price(a.price) - price(b.price));
    if (sort === 'high') l = [...l].sort((a, b) => (b.price ?? Infinity) - (a.price ?? Infinity));
    if (sort === 'new') l = [...l].sort((a, b) => b.year - a.year);
    return l;
  }, [brand, cond, q, sort]);

  const setBrand = (b: string) => {
    const p = new URLSearchParams(params);
    if (b === 'all') p.delete('brand');
    else p.set('brand', b);
    setParams(p, { replace: true });
  };

  return (
    <div className="shop page">
      <header className="page__head wrap">
        <p className="eyebrow">UNIQUE · {WATCHES.length} {t.edit_pieces}</p>
        <RevealText tag="h1" className="h1" immediate italicLast>
          {t.s_title}
        </RevealText>
        <p className="lead">{t.s_sub}</p>
      </header>

      <div className="shop__tools">
        <div className="wrap">
          <label className="search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.s_search} aria-label={t.s_search} />
            {q && (
              <button onClick={() => setQ('')} aria-label="Clear">
                <Icon name="close" size={16} />
              </button>
            )}
          </label>
          <div className="chips chips--scroll">
            {['all', ...BRANDS].map((b) => (
              <button key={b} className={`chip ${brand === b ? 'is-on' : ''}`} onClick={() => setBrand(b)}>
                {brand === b && <motion.span layoutId="shop-chip" className="chip__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <span>{b === 'all' ? t.edit_all : b}</span>
              </button>
            ))}
          </div>
          <div className="shop__filters">
            <label className="select">
              <Icon name="sliders" size={16} />
              <select value={cond} onChange={(e) => setCond(e.target.value as typeof cond)} aria-label={t.p_condition}>
                <option value="all">{t.s_cond_all}</option>
                {(['unworn', 'excellent', 'very-good'] as const).map((c) => (
                  <option key={c} value={c}>
                    {t.cond[c]}
                  </option>
                ))}
              </select>
            </label>
            <label className="select">
              <span className="mono">{t.s_sort}</span>
              <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label={t.s_sort}>
                {(Object.keys(t.s_sorts) as Sort[]).map((k) => (
                  <option key={k} value={k}>
                    {t.s_sorts[k]}
                  </option>
                ))}
              </select>
            </label>
            <span className="mono shop__count">
              {list.length} {t.s_results}
            </span>
          </div>
        </div>
      </div>

      <div className="wrap">
        <motion.div className="grid" variants={containerVariants} initial="hidden" animate="visible" key={brand + cond + sort}>
          <AnimatePresence mode="popLayout">
            {list.map((w) => (
              <ProductCard key={w.slug} w={w} />
            ))}
          </AnimatePresence>
        </motion.div>
        {list.length === 0 && (
          <div className="empty">
            <p>{t.s_empty}</p>
            <a className="btn btn--dark" href={waLink(t.wa_general)} target="_blank" rel="noreferrer">
              {t.visit_wa}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
