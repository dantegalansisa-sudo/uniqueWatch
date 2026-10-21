import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DICTS, type Dict, type Lang } from './i18n';
import { bySlug, type Watch } from '../data/watches';

const read = <T,>(k: string, fallback: T): T => {
  try {
    const v = localStorage.getItem(k);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
};
const write = (k: string, v: unknown) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {
    /* storage unavailable */
  }
};

interface Store {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: Dict;
  bag: string[];
  saved: string[];
  bagItems: Watch[];
  toggleBag: (slug: string) => void;
  addToBag: (slug: string) => void;
  toggleSaved: (slug: string) => void;
  toast: string | null;
  notify: (msg: string) => void;
  quick: string | null;
  openQuick: (slug: string | null) => void;
  checkout: boolean;
  setCheckout: (v: boolean) => void;
}

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => read('uw-lang', 'en'));
  const [bag, setBag] = useState<string[]>(() => read('uw-bag', []));
  const [saved, setSaved] = useState<string[]>(() => read('uw-saved', []));
  const [toast, setToast] = useState<string | null>(null);
  const [quick, setQuick] = useState<string | null>(null);
  const [checkout, setCheckout] = useState(false);

  useEffect(() => write('uw-bag', bag), [bag]);
  useEffect(() => write('uw-saved', saved), [saved]);
  useEffect(() => {
    write('uw-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const t = DICTS[lang];

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout((notify as unknown as { _t?: number })._t);
    (notify as unknown as { _t?: number })._t = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const addToBag = useCallback(
    (slug: string) => {
      setBag((b) => (b.includes(slug) ? b : [...b, slug]));
      notify(DICTS[lang].toast_added);
    },
    [lang, notify],
  );

  const toggleBag = useCallback(
    (slug: string) => {
      setBag((b) => (b.includes(slug) ? b.filter((s) => s !== slug) : [...b, slug]));
    },
    [],
  );

  const toggleSaved = useCallback(
    (slug: string) => {
      setSaved((s) => {
        const has = s.includes(slug);
        notify(has ? DICTS[lang].toast_removed : DICTS[lang].toast_saved);
        return has ? s.filter((x) => x !== slug) : [...s, slug];
      });
    },
    [lang, notify],
  );

  const bagItems = useMemo(() => bag.map((s) => bySlug(s)).filter(Boolean) as Watch[], [bag]);

  const value: Store = {
    lang,
    setLang: setLangState,
    t,
    bag,
    saved,
    bagItems,
    toggleBag,
    addToBag,
    toggleSaved,
    toast,
    notify,
    quick,
    openQuick: setQuick,
    checkout,
    setCheckout,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useStore = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStore outside provider');
  return c;
};
