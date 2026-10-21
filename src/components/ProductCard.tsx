import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import { fmtPrice, type Watch } from '../data/watches';
import { cardVariants } from '../lib/easings';
import Icon from './Icon';

export default function ProductCard({ w }: { w: Watch }) {
  const { t, lang, saved, toggleSaved } = useStore();
  const isSaved = saved.includes(w.slug);
  return (
    <motion.article className="pcard" variants={cardVariants} layout>
      <Link to={`/watch/${w.slug}`} className="pcard__link" data-cursor="view" aria-label={`${w.brand} ${w.model}`}>
        <span className="pcard__media" style={{ background: w.tone }}>
          <img src={w.img} alt="" loading="lazy" className={w.slug.includes('santos-dumont') ? 'is-wide' : ''} />
          <span className="pcard__cond">{t.cond[w.condition]}</span>
          {w.tag && <span className="pcard__tag">{w.tag[lang]}</span>}
        </span>
        <span className="pcard__txt">
          <span className="mono pcard__brand">{w.brand}</span>
          <strong className="pcard__model">{w.model}</strong>
          <span className="pcard__row">
            <em>{fmtPrice(w.price) ?? t.p_por}</em>
            <span className="mono pcard__ref">{w.ref.split('.')[0]}</span>
          </span>
        </span>
      </Link>
      <button className={`pcard__heart ${isSaved ? 'is-on' : ''}`} onClick={() => toggleSaved(w.slug)} aria-label={isSaved ? t.p_saved : t.p_save}>
        <Icon name="heart" size={18} />
      </button>
    </motion.article>
  );
}
