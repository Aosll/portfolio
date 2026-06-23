/**
 * colors.js — design token constants (JS mirror of styles/variables.css).
 * Three.js materials and GSAP tweens read values from here so the 3D layer and
 * the DOM share one palette. Keep in sync with variables.css.
 */
export const COLORS = {
  bgPrimary: '#0a0a0f',
  bgSecondary: '#0d0d1a',
  bgCard: 'rgba(18, 18, 31, 0.85)',
  bgGlass: 'rgba(255, 255, 255, 0.03)',

  accentBlue: '#4f8ef7',
  accentCyan: '#00d4ff',
  accentPurple: '#8b5cf6',
  accentEmerald: '#10b981',
  accentGold: '#f59e0b',

  textPrimary: '#f0f4ff',
  textSecondary: '#a0aec0',
  textMuted: '#4a5568',
};

/** Same palette as Three.js-friendly hex numbers (0x...). */
export const COLORS_HEX = {
  bgPrimary: 0x0a0a0f,
  bgSecondary: 0x0d0d1a,
  accentBlue: 0x4f8ef7,
  accentCyan: 0x00d4ff,
  accentPurple: 0x8b5cf6,
  accentEmerald: 0x10b981,
  accentGold: 0xf59e0b,
};

export default COLORS;
