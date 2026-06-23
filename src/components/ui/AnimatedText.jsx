import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@hooks/useGSAP';
import styles from './AnimatedText.module.css';

/**
 * AnimatedText — Phase 2.3.
 *
 * Renders `text` with one of four GSAP-driven entrances:
 *   - reveal      words slide up out of a mask, staggered
 *   - glitch      cyberpunk RGB-split jitter
 *   - typewriter  characters appear one at a time, with a blinking caret
 *   - gradient    a color sweep animates across the text fill
 *
 * Props:
 *   - text       string to render
 *   - type       'reveal' | 'glitch' | 'typewriter' | 'gradient'
 *   - delay      seconds before the animation starts
 *   - className  extra class names
 */
export default function AnimatedText({
  text = '',
  type = 'reveal',
  delay = 0,
  className = '',
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const reduced = window.matchMedia?.(
        '(prefers-reduced-motion: reduce)'
      ).matches;

      if (type === 'reveal') {
        const words = el.querySelectorAll('[data-word]');
        if (reduced) {
          gsap.set(words, { yPercent: 0, opacity: 1 });
          return;
        }
        gsap.from(words, {
          yPercent: 120,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          delay,
        });
      } else if (type === 'typewriter') {
        const chars = el.querySelectorAll('[data-char]');
        if (reduced) {
          gsap.set(chars, { opacity: 1 });
          return;
        }
        gsap.set(chars, { opacity: 0 });
        gsap.to(chars, {
          opacity: 1,
          duration: 0.01,
          ease: 'none',
          stagger: 0.05,
          delay,
        });
      } else if (type === 'gradient') {
        if (reduced) return;
        gsap.fromTo(
          el,
          { backgroundPositionX: '0%' },
          {
            backgroundPositionX: '200%',
            duration: 6,
            ease: 'none',
            repeat: -1,
            delay,
          }
        );
      } else if (type === 'glitch') {
        const layers = el.querySelectorAll('[data-glitch-layer]');
        if (reduced) {
          gsap.set(layers, { x: 0, skewX: 0, opacity: 0 });
          return;
        }
        const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, delay });
        tl.to(layers, {
          x: () => gsap.utils.random(-4, 4),
          skewX: () => gsap.utils.random(-6, 6),
          opacity: 0.85,
          duration: 0.08,
          ease: 'steps(2)',
          stagger: 0.02,
          repeat: 5,
          yoyo: true,
          repeatRefresh: true,
        }).set(layers, { x: 0, skewX: 0, opacity: 0 });
      }
    },
    { scope: ref, dependencies: [text, type, delay] }
  );

  if (type === 'reveal') {
    return (
      <span ref={ref} className={[styles.root, className].filter(Boolean).join(' ')}>
        {text.split(' ').map((word, i) => (
          <span key={`${word}-${i}`} className={styles.wordMask}>
            <span data-word className={styles.word}>
              {word}
            </span>
          </span>
        ))}
      </span>
    );
  }

  if (type === 'typewriter') {
    return (
      <span ref={ref} className={[styles.root, className].filter(Boolean).join(' ')}>
        {[...text].map((char, i) => (
          <span key={i} data-char className={styles.char}>
            {char === ' ' ? ' ' : char}
          </span>
        ))}
        <span className={styles.caret} aria-hidden="true" />
      </span>
    );
  }

  if (type === 'glitch') {
    return (
      <span
        ref={ref}
        className={[styles.root, styles.glitch, className].filter(Boolean).join(' ')}
      >
        <span data-glitch-layer className={styles.glitchLayer} aria-hidden="true">
          {text}
        </span>
        <span data-glitch-layer className={styles.glitchLayer} aria-hidden="true">
          {text}
        </span>
        <span className={styles.glitchBase}>{text}</span>
      </span>
    );
  }

  // gradient
  return (
    <span
      ref={ref}
      className={[styles.root, styles.gradient, className].filter(Boolean).join(' ')}
    >
      {text}
    </span>
  );
}
