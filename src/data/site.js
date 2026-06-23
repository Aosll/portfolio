/**
 * Single source of truth for site-wide identity & metadata.
 * Sections read from here so copy stays consistent across the experience.
 */
export const SITE = {
  name: 'Ömer Efe Dikici',
  role: 'Computer Engineer',
  tagline: 'Embedded systems, IoT security & immersive software.',
  stack: ['Three.js', 'GSAP', 'Lenis', 'WebGL', 'React'],
  location: 'Türkiye',
  email: 'omerdikici52@gmail.com',
};

export const SOCIALS = {
  github: 'https://github.com/Aosll',
  linkedin: '',
  email: `mailto:${SITE.email}`,
};

export default SITE;
