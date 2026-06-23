import { useEffect, useState } from 'react';

/**
 * useScrollProgress — Phase 1 stub (wired to Lenis in Phase 3).
 * Returns overall page scroll progress in the 0..1 range.
 */
export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return progress;
}

export default useScrollProgress;
