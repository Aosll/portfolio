import { useEffect } from 'react';
import { useStore } from '@/store/useStore';

/**
 * useScrollProgress — Phase 3.1.
 *
 * Tracks overall page scroll progress (0..1) and which `<section id>` is
 * currently active, pushing both into the global store (`scrollProgress`,
 * `currentSection`). Subscribes to the Lenis scroll event when the engine is
 * running, falling back to a rAF-throttled native scroll listener otherwise.
 */
export function useScrollProgress() {
  const setScrollProgress = useStore((s) => s.setScrollProgress);
  const setCurrentSection = useStore((s) => s.setCurrentSection);

  useEffect(() => {
    let lastSection = null;

    // Active section = the one crossing a reference line ~35% down the viewport.
    const activeSection = () => {
      const ref = window.innerHeight * 0.35;
      let active = null;
      document.querySelectorAll('section[id]').forEach((sec) => {
        const { top, bottom } = sec.getBoundingClientRect();
        if (top <= ref && bottom >= ref) active = sec.id;
      });
      return active;
    };

    const update = (progress) => {
      setScrollProgress(Math.min(1, Math.max(0, progress)));
      const active = activeSection();
      if (active && active !== lastSection) {
        lastSection = active;
        setCurrentSection(active);
      }
    };

    const lenis = window.lenis;
    if (lenis?.on) {
      const onScroll = ({ progress }) => update(progress ?? 0);
      lenis.on('scroll', onScroll);
      update(lenis.progress ?? 0);
      return () => lenis.off?.('scroll', onScroll);
    }

    // Fallback: native scroll, throttled to one update per frame.
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        update(max > 0 ? window.scrollY / max : 0);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [setScrollProgress, setCurrentSection]);
}

export default useScrollProgress;
