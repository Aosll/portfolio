/**
 * Single source of truth for site-wide identity & metadata.
 * Sections read from here so copy stays consistent across the experience.
 */
export const SITE = {
  name: 'Ömer Efe Dikici',
  role: 'Computer Engineer',
  // Hero copy (Phase 5.1). Kept here so the section reads, not hardcodes, its words.
  heroLabel: 'Computer Engineer + AI Lead',
  heroTagline: 'Building the bridge between AI, Security and Embedded Systems',
  heroTech: [
    'AI',
    'Security',
    'Embedded Systems',
    'IoT',
    'Firmware',
    'Machine Learning',
    'Python',
    'Networking',
    'React',
    'Three.js',
  ],
  cv: '/Omer_Efe_Dikici_CV.pdf', // file lives in /public
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
