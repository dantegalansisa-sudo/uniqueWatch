import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useStore } from '../lib/store';
import Icon, { WhatsAppIcon } from './Icon';
import { waLink } from '../lib/i18n';

// App-style bottom navigation (mobile only)
export default function TabBar() {
  const { t, bag, saved } = useStore();
  const { pathname } = useLocation();
  const tabs = [
    { to: '/', icon: 'home', label: t.nav_home, count: 0 },
    { to: '/shop', icon: 'grid', label: t.nav_shop, count: 0 },
    null,
    { to: '/saved', icon: 'heart', label: t.nav_saved, count: saved.length },
    { to: '/bag', icon: 'bag', label: t.nav_bag, count: bag.length },
  ];
  const isActive = (to: string) =>
    to === '/' ? pathname === '/' : pathname.startsWith(to) || (to === '/shop' && pathname.startsWith('/watch'));

  return (
    <nav className="tabbar" aria-label="App">
      {tabs.map((tab) =>
        tab === null ? (
          <a key="wa" href={waLink(t.wa_general)} target="_blank" rel="noreferrer" className="tabbar__wa" aria-label={t.nav_chat}>
            <WhatsAppIcon size={22} />
          </a>
        ) : (
          <NavLink key={tab.to} to={tab.to} className={`tabbar__item ${isActive(tab.to) ? 'is-on' : ''}`} aria-label={tab.label}>
            {isActive(tab.to) && (
              <motion.span layoutId="tab-pill" className="tabbar__pill" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
            )}
            <span className="tabbar__ico">
              <Icon name={tab.icon} size={21} />
              {tab.count > 0 && <span className="badge">{tab.count}</span>}
            </span>
            <span className="tabbar__lbl">{tab.label}</span>
          </NavLink>
        ),
      )}
    </nav>
  );
}
