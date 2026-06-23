import { useEffect, useRef } from 'react';

/**
 * useLenis — Phase 1 stub (implemented in Phase 3: smooth scroll engine).
 * Will instantiate a single Lenis instance, drive it via rAF, and expose it.
 */
export function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Phase 3 sets up Lenis here.
    return () => {
      lenisRef.current?.destroy?.();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}

export default useLenis;
