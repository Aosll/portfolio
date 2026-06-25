import { useEffect, useRef, useState } from 'react';
import { FiGithub, FiLinkedin, FiMenu, FiX } from 'react-icons/fi';
import gsap from 'gsap';
import { useStore } from '@/store/useStore';
import { SOCIALS } from '@/data/site';
import styles from './Navbar.module.css';

/**
 * Navbar — Phase 2.4.
 *
 * Fixed glass header. Highlights the active section from the store, smooth-scrolls
 * to a section on click (via Lenis when available, native scroll otherwise),
 * collapses to a hamburger menu under 768px, and hides/shows with scroll direction.
 *
 * Lenis note: this reads `window.lenis` so smooth scroll upgrades automatically
 * once Phase 3 instantiates Lenis and exposes the instance there.
 */
const NAV_LINKS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' },
];

const NAV_OFFSET = 72; // approx navbar height, so targets aren't hidden under it

export default function Navbar() {
  const navRef = useRef(null);
  const lastScroll = useRef(0);
  const hidden = useRef(false);
  const [scrolled, setScrolled] = useState(false);

  const currentSection = useStore((s) => s.currentSection);
  const setCurrentSection = useStore((s) => s.setCurrentSection);
  const isMenuOpen = useStore((s) => s.isMenuOpen);
  const toggleMenu = useStore((s) => s.toggleMenu);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const lenis = window.lenis; // Phase 3 exposes the Lenis instance here
      if (lenis?.scrollTo) {
        lenis.scrollTo(el, { offset: -NAV_OFFSET });
      } else {
        const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
    setCurrentSection(id);
    if (useStore.getState().isMenuOpen) toggleMenu();
  };

  // blur-on-scroll + hide/show on scroll direction (GSAP)
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);

      const goingDown = y > lastScroll.current;
      lastScroll.current = y;

      // keep the bar visible while the mobile menu is open
      const shouldHide = y > 120 && goingDown && !useStore.getState().isMenuOpen;
      if (shouldHide !== hidden.current) {
        hidden.current = shouldHide;
        gsap.to(navRef.current, {
          yPercent: shouldHide ? -100 : 0,
          duration: 0.4,
          ease: 'power3.out',
        });
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={[styles.navbar, scrolled ? styles.scrolled : ''].filter(Boolean).join(' ')}
    >
      <button
        className={styles.logo}
        onClick={() => scrollToSection('hero')}
        aria-label="Ömer Efe Dikici — go to top"
      >
        {/* Hexagonal "die" with a tiny neural-net node graph — echoes the hero
            scene and ties the brand to AI / embedded systems. */}
        <svg className={styles.logoMark} viewBox="0 0 40 40" aria-hidden="true">
          <defs>
            <linearGradient id="navLogoGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#00d4ff" />
              <stop offset="55%" stopColor="#4f8ef7" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
          <path
            d="M20 3 L34.7 11.5 L34.7 28.5 L20 37 L5.3 28.5 L5.3 11.5 Z"
            fill="none"
            stroke="url(#navLogoGrad)"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <g stroke="url(#navLogoGrad)" strokeWidth="1.1" strokeOpacity="0.8">
            <line x1="13" y1="14" x2="28" y2="21" />
            <line x1="28" y1="21" x2="14" y2="28" />
            <line x1="13" y1="14" x2="14" y2="28" />
          </g>
          <circle cx="13" cy="14" r="2.4" fill="#00d4ff" />
          <circle cx="28" cy="21" r="2.4" fill="#8b5cf6" />
          <circle cx="14" cy="28" r="2.4" fill="#4f8ef7" />
        </svg>
        <span className={styles.logoWord}>OED</span>
      </button>

      <nav className={styles.links} aria-label="Primary">
        {NAV_LINKS.map((link) => (
          <button
            key={link.id}
            className={[styles.link, currentSection === link.id ? styles.active : '']
              .filter(Boolean)
              .join(' ')}
            onClick={() => scrollToSection(link.id)}
          >
            {link.label}
          </button>
        ))}
      </nav>

      <div className={styles.actions}>
        {SOCIALS.linkedin && (
          <a
            className={styles.iconLink}
            href={SOCIALS.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FiLinkedin />
          </a>
        )}
        <a
          className={styles.iconLink}
          href={SOCIALS.github}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <FiGithub />
        </a>
        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {isMenuOpen && (
        <nav className={styles.mobilePanel} aria-label="Mobile">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              className={[styles.mobileLink, currentSection === link.id ? styles.active : '']
                .filter(Boolean)
                .join(' ')}
              onClick={() => scrollToSection(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
