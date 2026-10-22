import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import Lenis from 'lenis';
import Header from './components/Header';
import TabBar from './components/TabBar';
import QuickView from './components/QuickView';
import { CheckoutSheet, Footer, Preloader, Toast, WhatsAppFab } from './components/Chrome';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Product from './pages/Product';
import { About, Bag, Care, Saved, Sell } from './pages/Pages';
import { EASINGS } from './lib/easings';

let lenis: Lenis | null = null;

function useSmoothScroll() {
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    let raf = 0;
    const loop = (time: number) => {
      lenis?.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    const lock = new MutationObserver(() => {
      if (document.documentElement.classList.contains('is-locked')) lenis?.stop();
      else lenis?.start();
    });
    lock.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      cancelAnimationFrame(raf);
      lock.disconnect();
      lenis?.destroy();
      lenis = null;
    };
  }, []);
}

export default function App() {
  const location = useLocation();
  useSmoothScroll();
  const isPdp = location.pathname.startsWith('/watch/');

  return (
    <MotionConfig reducedMotion="user">
      <Preloader />
      <Header />
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          if (lenis) lenis.scrollTo(0, { immediate: true });
          else window.scrollTo(0, 0);
        }}
      >
        <motion.main
          key={location.pathname}
          className={`main ${isPdp ? 'main--pdp' : ''}`}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASINGS.out } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.3, ease: EASINGS.snappy } }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/watch/:slug" element={<Product />} />
            <Route path="/bag" element={<Bag />} />
            <Route path="/saved" element={<Saved />} />
            <Route path="/about" element={<About />} />
            <Route path="/sell" element={<Sell />} />
            <Route path="/care" element={<Care />} />
            <Route path="*" element={<Home />} />
          </Routes>
          <Footer />
        </motion.main>
      </AnimatePresence>
      {!isPdp && <TabBar />}
      <WhatsAppFab />
      <QuickView />
      <CheckoutSheet />
      <Toast />
    </MotionConfig>
  );
}
