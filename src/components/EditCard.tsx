import { motion, type MotionValue } from 'framer-motion';
import { useStore } from '../lib/store';
import { fmtPrice, type Watch } from '../data/watches';
import Icon from './Icon';

interface Props {
  w: Watch;
  index: number;
  total: number;
  tilt: MotionValue<number>;
  scale?: MotionValue<number>;
  onOpen: () => void;
  hidden?: boolean;
}

export default function EditCard({ w, index, total, tilt, scale, onOpen, hidden }: Props) {
  const { t, lang, addToBag, bag } = useStore();
  const inBag = bag.includes(w.slug);
  return (
    <article className="ecard" data-cursor="view" onClick={onOpen} style={{ ['--ink' as string]: w.ink }} aria-label={`${w.brand} ${w.model}`}>
      <motion.div layoutId={`bg-${w.slug}`} className="ecard__bg" style={{ background: w.tone, borderRadius: 28 }} transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }} />
      <div className="ecard__txt">
        <span className="ecard__brand mono">{w.brand}</span>
        <h3 className="ecard__model">{w.model}</h3>
        <span className="ecard__price mono">{fmtPrice(w.price) ?? t.p_por}</span>
      </div>
      <span className="ecard__rule" aria-hidden="true" />
      <div className="ecard__stage">
        {!hidden && (
          <motion.img
            layoutId={`img-${w.slug}`}
            src={w.img}
            alt=""
            className={`ecard__img ${w.slug.includes('santos-dumont') ? 'is-wide' : ''}`}
            style={{ rotate: tilt, scale }}
            transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            draggable={false}
          />
        )}
      </div>
      <div className="ecard__foot">
        <span className="ecard__idx mono">
          {String(index + 1).padStart(2, '0')} <i>/ {String(total).padStart(2, '0')}</i>
        </span>
        {w.tag && <span className="ecard__tag">{w.tag[lang]}</span>}
        {w.price && (
          <button
            className={`ecard__add ${inBag ? 'is-on' : ''}`}
            aria-label={t.p_add}
            onClick={(e) => {
              e.stopPropagation();
              addToBag(w.slug);
            }}
          >
            <Icon name={inBag ? 'check' : 'plus'} size={18} />
          </button>
        )}
      </div>
    </article>
  );
}
