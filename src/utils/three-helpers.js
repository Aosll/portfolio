/**
 * three-helpers.js — small Three.js utilities (Phase 1 baseline, used from Phase 4).
 */

/** Map a value from one range to another. */
export const mapRange = (value, inMin, inMax, outMin, outMax) =>
  ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

/** Linear interpolation. */
export const lerp = (a, b, t) => a + (b - a) * t;

/** Frame-rate-independent damping toward a target. */
export const damp = (current, target, lambda, dt) =>
  lerp(current, target, 1 - Math.exp(-lambda * dt));

/** Clamp a value to [min, max]. */
export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/** Device pixel ratio capped for performance (Phase 9 audit tunes this). */
export const getPixelRatio = () => Math.min(window.devicePixelRatio || 1, 2);
