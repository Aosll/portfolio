import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';
import { SITE } from '@/data/site';
import styles from './LoadingScreen.module.css';

/**
 * LoadingScreen — Phase 3.4 (minimal placeholder).
 *
 * Intro gate shown while `isLoading` is true. Animates loadingProgress 0→100,
 * fades out, then clears the loading flag so the experience is revealed. A
 * richer cinematic loader replaces this when its own spec lands.
 */
export default function LoadingScreen() {
  const rootRef = useRef(null);
  const loadingProgress = useStore((s) => s.loadingProgress);
  const setLoadingProgress = useStore((s) => s.setLoadingProgress);
  const setIsLoading = useStore((s) => s.setIsLoading);

  useGSAPProgress(rootRef, setLoadingProgress, setIsLoading);

  return (
    <div ref={rootRef} className={styles.screen} role="status" aria-live="polite">
      <div className={`${styles.brand} u-gradient-flow`}>{SITE.name}</div>
      <div className={styles.bar}>
        <span className={styles.fill} style={{ width: `${loadingProgress}%` }} />
      </div>
      <div className={styles.percent}>{loadingProgress}%</div>
    </div>
  );
}

function useGSAPProgress(rootRef, setLoadingProgress, setIsLoading) {
  useEffect(() => {
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value: 100,
      duration: 1.6,
      ease: 'power2.inOut',
      onUpdate: () => setLoadingProgress(Math.round(counter.value)),
      onComplete: () => {
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.6,
          ease: 'power2.inOut',
          onComplete: () => setIsLoading(false),
        });
      },
    });
    return () => tween.kill();
  }, [rootRef, setLoadingProgress, setIsLoading]);
}
