import { useMemo, useRef } from 'react';
import gsap from 'gsap';
import { FiChevronDown } from 'react-icons/fi';

import { useGSAP } from '@hooks/useGSAP';
import SceneManager from '@components/three/SceneManager';
import GlowButton from '@components/ui/GlowButton';
import { SITE } from '@/data/site';
import { useStore } from '@/store/useStore';

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

  // Turkish-locale uppercasing so "Dikici" → "DİKİCİ" (dotted capital I). Split
  // into two display lines (all-but-last words, then the surname) for the
  // knockout title.
  const nameLines = useMemo(() => {
    const parts = SITE.name.toLocaleUpperCase('tr-TR').split(' ');
    return [parts.slice(0, -1).join(' '), parts[parts.length - 1]];
  }, []);

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
          '[data-hero="name"]',
          { y: -28, autoAlpha: 0, scale: 1.06, transformOrigin: 'left center', duration: 0.85, ease: 'power3.out' },
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

  // Pinned exit: as the user scrolls out, content flies up + fades while the 3D
  // scene scales down and the particles contract (driven via the store). Pin for
  // an extra 30% of scroll travel, then normal scroll resumes into About.
  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      const setHeroExit = useStore.getState().setHeroExit;
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: 'top top',
          end: '+=30%',
          pin: true,
          scrub: 0.6, // 0.6s smooth catch-up
          onUpdate: (self) => setHeroExit(self.progress),
        },
      });
      tl.to(`.${styles.content}`, { y: -120, autoAlpha: 0, ease: 'none' }, 0).to(
        `.${styles.scrollCue}`,
        { y: -40, autoAlpha: 0, ease: 'none' },
        0
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
        </SceneManager>
      </div>

      <div className={styles.content}>
        <p data-hero="label" className={styles.label}>
          {SITE.heroLabel}
        </p>

        {/* Name as a knockout: a dim veil over the live scene, cut into the
            shape of the letters, so the WebGL scene shows through the type. An
            outline keeps it legible. Real <h1> kept for semantics + a11y. */}
        <h1 className={styles.srName}>{SITE.name}</h1>

        <svg
          data-hero="name"
          className={styles.nameSvg}
          viewBox="0 0 720 250"
          preserveAspectRatio="xMinYMid meet"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="heroNameDim" cx="32%" cy="50%" r="82%">
              <stop offset="0%" stopColor="#0a0a0f" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#0a0a0f" stopOpacity="0.12" />
            </radialGradient>
            <mask id="heroNameCut">
              <rect width="720" height="250" fill="#fff" />
              <text x="0" y="104" className={styles.nameMaskText}>{nameLines[0]}</text>
              <text x="0" y="224" className={styles.nameMaskText}>{nameLines[1]}</text>
            </mask>
          </defs>
          <rect width="720" height="250" fill="url(#heroNameDim)" mask="url(#heroNameCut)" />
          <text x="0" y="104" className={styles.nameOutline}>{nameLines[0]}</text>
          <text x="0" y="224" className={styles.nameOutline}>{nameLines[1]}</text>
        </svg>

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
