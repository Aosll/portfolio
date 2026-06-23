/**
 * colors.js — design token constants (JS mirror of styles/variables.css).
 * Three.js materials and GSAP tweens read hex/number values from here so the
 * 3D layer and the DOM share one palette.
 */
export const COLORS = {
  bg: '#05060a',
  bgElev: '#0b0d14',
  text: '#e8eaf0',
  textMuted: '#9aa0b0',
  textDim: '#5a6072',

  accent: '#5eead4',
  accent2: '#818cf8',
  accent3: '#f472b6',
};

/** Same palette as Three.js-friendly hex numbers (0x...). */
export const COLORS_HEX = {
  bg: 0x05060a,
  bgElev: 0x0b0d14,
  accent: 0x5eead4,
  accent2: 0x818cf8,
  accent3: 0xf472b6,
};

export default COLORS;
