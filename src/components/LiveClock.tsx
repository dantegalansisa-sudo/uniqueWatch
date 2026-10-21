import { useEffect, useState } from 'react';

const useNow = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return now;
};

// Tiny analog dial — hands driven by the visitor's real local time
export function AnalogClock({ size = 44, className = '' }: { size?: number; className?: string }) {
  const now = useNow();
  const s = now.getSeconds();
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;
  return (
    <svg className={`analog ${className}`} width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="47" className="analog__case" />
      {Array.from({ length: 12 }).map((_, i) => (
        <line key={i} x1="50" y1="9" x2="50" y2={i % 3 === 0 ? 17 : 13} className="analog__idx" transform={`rotate(${i * 30} 50 50)`} />
      ))}
      <line x1="50" y1="50" x2="50" y2="28" className="analog__h" transform={`rotate(${h * 30} 50 50)`} />
      <line x1="50" y1="50" x2="50" y2="17" className="analog__m" transform={`rotate(${m * 6} 50 50)`} />
      <line x1="50" y1="58" x2="50" y2="13" className="analog__s" transform={`rotate(${s * 6} 50 50)`} />
      <circle cx="50" cy="50" r="2.6" className="analog__pin" />
    </svg>
  );
}

export function DigitalTime({ lang }: { lang: string }) {
  const now = useNow();
  const time = now.toLocaleTimeString(lang === 'es' ? 'es-PR' : 'en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit' });
  let tz = '';
  try {
    tz = Intl.DateTimeFormat('en-US', { timeZoneName: 'short' }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? '';
  } catch {
    /* ignore */
  }
  return (
    <span className="digital">
      {time} <em>{tz}</em>
    </span>
  );
}
