import { useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import gsap from 'gsap';

/**
 * useLenis — Phase 3.1.
 *
 * Instantiates the single Lenis smooth-scroll engine, drives it from GSAP's
 * ticker (one rAF loop shared with all GSAP animations / ScrollTrigger), and
 * exposes the instance.
 *
 * The instance is also published to `window.lenis` so non-descendant components
 * (e.g. the Navbar) can request smooth `scrollTo` without prop drilling.
 *
 * @returns the Lenis instance (or null until mounted).
 */
export function useLenis() {
  const [lenis, setLenis] = useState(null);

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      infinite: false,
      gestureDirection: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Connect Lenis to the GSAP ticker (single rAF loop).
    const raf = (time) => instance.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    window.lenis = instance;
    setLenis(instance);

    return () => {
      gsap.ticker.remove(raf);
      instance.destroy();
      if (window.lenis === instance) delete window.lenis;
    };
  }, []);

  return lenis;
}

export default useLenis;
