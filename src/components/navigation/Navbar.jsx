import { useEffect, useRef, useState } from 'react';
import { FiGithub, FiMenu, FiX } from 'react-icons/fi';
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
      <button className={styles.logo} onClick={() => scrollToSection('hero')} aria-label="Go to top">
        OED
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
