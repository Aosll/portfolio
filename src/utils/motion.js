/**
 * motion.js — shared reduced-motion check.
 *
 * Sections that hide content with `gsap.set(el, { autoAlpha: 0 })` and reveal it
 * on scroll call this first; when it returns true they skip the hide+reveal
 * entirely, leaving content in its natural visible state. Kept in one place so
 * every section reads the same media query.
 */
export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export default prefersReducedMotion;
