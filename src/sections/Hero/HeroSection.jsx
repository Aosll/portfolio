import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { FiChevronDown } from 'react-icons/fi';

import { useGSAP } from '@hooks/useGSAP';
import SceneManager from '@components/three/SceneManager';
import AmbientParticles from '@components/three/AmbientParticles';
import GlowButton from '@components/ui/GlowButton';
import { SITE } from '@/data/site';

import HeroScene from './HeroScene';
import styles from './HeroSection.module.css';

const NAV_OFFSET = 72;

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.lenis?.scrollTo) {
    window.lenis.scrollTo(el, { offset: -NAV_OFFSET });
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

/**
 * HeroSection — Phase 5.1.
 *
 * Cinematic entry: a fullscreen WebGL backdrop (3D scene + ambient particles)
 * behind left-aligned, vertically centered content — label, character-split
 * name, tagline, CTA row, a scrolling tech ticker and a scroll cue. A GSAP
 * timeline (0.4s delay) reveals each element in sequence on mount.
 */
export default function HeroSection() {
  const rootRef = useRef(null);

  // Turkish-locale uppercasing so "Dikici" → "DİKİCİ" (dotted capital I).
  const nameChars = useMemo(
    () => Array.from(SITE.name.toLocaleUpperCase('tr-TR')),
    []
  );

  // Duplicated tech list so the ticker can loop seamlessly.
  const ticker = useMemo(() => [...SITE.heroTech, ...SITE.heroTech], []);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) {
        gsap.set('[data-hero]', { autoAlpha: 1, clearProps: 'transform' });
        return;
      }

      const tl = gsap.timeline({ delay: 0.4, defaults: { ease: 'power3.out' } });
      tl.from('[data-hero="label"]', { y: 24, autoAlpha: 0, duration: 0.7 }, 0.0)
        .from(
          '[data-hero="char"]',
          { y: -48, autoAlpha: 0, stagger: 0.04, duration: 0.7, ease: 'back.out(1.4)' },
          0.3
        )
        .from('[data-hero="tagline"]', { x: 48, autoAlpha: 0, duration: 0.8 }, 0.8)
        .from(
          '[data-hero="cta"]',
          { scale: 0.6, autoAlpha: 0, stagger: 0.1, duration: 0.7, ease: 'back.out(1.7)' },
          1.1
        )
        .from('[data-hero="ticker"]', { y: 20, autoAlpha: 0, duration: 0.7 }, 1.4)
        .from(
          '[data-hero="cue"]',
          { y: -24, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)' },
          1.8
        );
    },
    { scope: rootRef }
  );

  return (
    <section
      id="hero"
      ref={rootRef}
      className={`section ${styles.hero}`}
      aria-label="Intro"
    >
      {/* Canvas (z0) + Particles (z1) — one WebGL layer behind the content. */}
      <div className={styles.canvas}>
        <SceneManager>
          <HeroScene />
          <AmbientParticles />
        </SceneManager>
      </div>

      <div className={styles.content}>
        <p data-hero="label" className={styles.label}>
          {SITE.heroLabel}
        </p>

        <h1 className={styles.name} aria-label={SITE.name}>
          {nameChars.map((char, i) => (
            <span
              // eslint-disable-next-line react/no-array-index-key
              key={`${char}-${i}`}
              data-hero="char"
              className={styles.char}
              aria-hidden="true"
            >
              {char === ' ' ? ' ' : char}
            </span>
          ))}
        </h1>

        <p data-hero="tagline" className={styles.tagline}>
          {SITE.heroTagline}
        </p>

        <div className={styles.ctaRow}>
          <span data-hero="cta" className={styles.ctaItem}>
            <GlowButton variant="primary" onClick={() => scrollToSection('projects')}>
              View Projects
            </GlowButton>
          </span>
          <span data-hero="cta" className={styles.ctaItem}>
            <GlowButton
              variant="outline"
              onClick={() => window.open(SITE.cv, '_blank', 'noopener')}
            >
              Download CV
            </GlowButton>
          </span>
        </div>

        <div data-hero="ticker" className={styles.ticker} aria-hidden="true">
          <div className={styles.tickerTrack}>
            {ticker.map((tech, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <span key={`${tech}-${i}`} className={styles.tickerItem}>
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      <button
        type="button"
        data-hero="cue"
        className={styles.scrollCue}
        onClick={() => scrollToSection('about')}
        aria-label="Scroll to explore"
      >
        <FiChevronDown className={styles.chevron} aria-hidden="true" />
        <span className={styles.scrollLabel}>SCROLL TO EXPLORE</span>
      </button>
    </section>
  );
}
