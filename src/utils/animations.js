import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';

/**
 * animations.js — GSAP animation presets (Phase 1 baseline, expanded in Phase 3).
 * Centralized durations, easings and reusable tween configs/presets keep motion
 * consistent across sections. ScrollTrigger + SplitText are registered once here.
 *
 * Every preset function returns the tween/timeline it creates and accepts an
 * `options` override merged into the GSAP vars (a `scrollTrigger` config
 * included), so callers can scope, scrub or retime any preset.
 */
gsap.registerPlugin(ScrollTrigger, SplitText);

export const EASE = {
  out: 'power3.out',
  inOut: 'power2.inOut',
  expo: 'expo.out',
  back: 'back.out(1.7)',
};

export const DURATION = {
  fast: 0.4,
  base: 0.8,
  slow: 1.2,
};

/** Fade + rise — the default section reveal. */
export const fadeUp = {
  from: { autoAlpha: 0, y: 40 },
  to: { autoAlpha: 1, y: 0, duration: DURATION.base, ease: EASE.out },
};

/** Staggered children reveal. */
export const staggerUp = {
  from: { autoAlpha: 0, y: 24 },
  to: { autoAlpha: 1, y: 0, duration: DURATION.base, ease: EASE.out, stagger: 0.08 },
};

/* ----------------------------------------------------------------------------
   Phase 3.2 — preset functions
---------------------------------------------------------------------------- */

/** Fade + rise into place. */
export function fadeInUp(element, options = {}) {
  if (!element) return undefined;
  return gsap.fromTo(
    element,
    { y: 60, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', ...options }
  );
}

/**
 * Word-by-word text reveal. Splits `element` into words (each wrapped in an
 * overflow-hidden mask) and slides them up from below the clip.
 */
export function revealText(element, options = {}) {
  if (!element) return undefined;
  const { stagger = 0.04, ...rest } = options;
  const split = new SplitText(element, { type: 'words', mask: 'words' });
  return gsap.from(split.words, {
    y: '110%',
    opacity: 0,
    duration: 0.9,
    ease: 'power3.out',
    stagger,
    ...rest,
  });
}

/** Pop in with a slight overshoot. */
export function scaleIn(element, options = {}) {
  if (!element) return undefined;
  return gsap.fromTo(
    element,
    { scale: 0.85, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.7)', ...options }
  );
}

/** Slide in from the left. */
export function slideInLeft(element, x = 80, options = {}) {
  if (!element) return undefined;
  return gsap.fromTo(
    element,
    { x: -x, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', ...options }
  );
}

/** Slide in from the right. */
export function slideInRight(element, x = 80, options = {}) {
  if (!element) return undefined;
  return gsap.fromTo(
    element,
    { x, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out', ...options }
  );
}

/**
 * Scroll-triggered staggered reveal of `elements` within a `trigger` container,
 * using the fadeInUp motion. Fires when the trigger hits 80% of the viewport
 * and reverses when scrolled back up.
 */
export function createScrollReveal(trigger, elements, options = {}) {
  if (!trigger || !elements) return undefined;
  const {
    start = 'top 80%',
    toggleActions = 'play none none reverse',
    stagger = 0.12,
    ...rest
  } = options;
  return gsap.fromTo(
    elements,
    { y: 60, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: 'power3.out',
      stagger,
      scrollTrigger: { trigger, start, toggleActions, ...rest },
    }
  );
}

/**
 * Vertical parallax tied to scroll. `speed` is the fraction of the element's
 * height it travels across its scroll range (negative reverses direction).
 */
export function createParallax(element, speed = 0.5, options = {}) {
  if (!element) return undefined;
  return gsap.to(element, {
    yPercent: speed * 100,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      ...options,
    },
  });
}

export default { EASE, DURATION, fadeUp, staggerUp };
