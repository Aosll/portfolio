import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useGSAP } from '@hooks/useGSAP';
import { prefersReducedMotion } from '@utils/motion';

import styles from './KineticDivider.module.css';

gsap.registerPlugin(ScrollTrigger);

/**
 * KineticDivider — oversized two-line statement that slides horizontally with
 * scroll (lines drift in opposite directions). Decorative: marked aria-hidden
 * so it doesn't add noise for screen readers. Parallax is skipped under
 * reduced-motion, leaving the text centered and static.
 */
export default function KineticDivider({
  lineOne = 'BUILDING THE BRIDGE',
  lineTwo = 'BETWEEN AI & HARDWARE',
}) {
  const rootRef = useRef(null);
  const lineOneRef = useRef(null);
  const lineTwoRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      const scrollTrigger = {
        trigger: rootRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 0.6,
      };
      // Tight travel keeps the statement kinetic without pushing either line
      // beyond the viewport at the scroll extremes.
      gsap.fromTo(lineOneRef.current, { xPercent: 2.5 }, { xPercent: -2.5, ease: 'none', scrollTrigger });
      gsap.fromTo(lineTwoRef.current, { xPercent: -2.5 }, { xPercent: 2.5, ease: 'none', scrollTrigger });
    },
    { scope: rootRef }
  );

  return (
    <div ref={rootRef} className={styles.divider} aria-hidden="true">
      <div ref={lineOneRef} className={`${styles.line} ${styles.fill} u-gradient-flow`}>
        {lineOne}
      </div>
      <div ref={lineTwoRef} className={`${styles.line} ${styles.outline}`}>
        {lineTwo}
      </div>
    </div>
  );
}
