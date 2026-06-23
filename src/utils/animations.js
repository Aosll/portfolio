/**
 * animations.js — GSAP animation presets (Phase 1 baseline, expanded in Phase 3).
 * Centralized durations, easings and reusable tween configs keep motion
 * consistent across sections.
 */
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

export default { EASE, DURATION, fadeUp, staggerUp };
