import { useEffect, useState } from 'react';

export function useMedia(query: string) {
  const [m, setM] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}

export const useIsDesktop = () => useMedia('(min-width: 960px)');

export function useLockBody(lock: boolean) {
  useEffect(() => {
    if (!lock) return;
    document.documentElement.classList.add('is-locked');
    return () => document.documentElement.classList.remove('is-locked');
  }, [lock]);
}
