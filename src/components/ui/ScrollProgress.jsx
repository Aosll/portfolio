import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@hooks/useGSAP';
import { useStore } from '@/store/useStore';
import styles from './ScrollProgress.module.css';

/**
 * ScrollProgress — Phase 3.3.
 *
 * Fixed vertical dot rail on the right edge — one dot per section, threaded by a
 * connecting line. The active section's dot enlarges (GSAP) and glows cyan, with
 * its label appearing alongside. Clicking a dot smooth-scrolls there via Lenis.
 *
 * Note: the spec calls for 8 dots; the site currently ships 7 sections, so the
 * rail renders 7 (one per real section).
 */
const NAV_OFFSET = 72;

const SECTIONS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'contact', label: 'Contact' },
];

export default function ScrollProgress() {
  const ref = useRef(null);
  const currentSection = useStore((s) => s.currentSection);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (window.lenis?.scrollTo) {
      window.lenis.scrollTo(el, { offset: -NAV_OFFSET });
    } else {
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  // Smooth dot scale transition + label entrance whenever the section changes.
  useGSAP(
    () => {
      const dots = ref.current?.querySelectorAll('[data-dot]') ?? [];
      dots.forEach((dot) => {
        gsap.to(dot, {
          scale: dot.dataset.id === currentSection ? 1.7 : 1,
          duration: 0.4,
          ease: 'power3.out',
        });
      });
      const label = ref.current?.querySelector('[data-label]');
      if (label) gsap.from(label, { autoAlpha: 0, x: 8, duration: 0.4, ease: 'power3.out' });
    },
    { scope: ref, dependencies: [currentSection] }
  );

  return (
    <nav ref={ref} className={styles.progress} aria-label="Section progress">
      <ul className={styles.track}>
        {SECTIONS.map((section) => {
          const active = currentSection === section.id;
          return (
            <li key={section.id} className={styles.item}>
              {active && (
                <span data-label className={styles.label}>
                  {section.label}
                </span>
              )}
              <button
                type="button"
                data-dot
                data-id={section.id}
                className={[styles.dot, active ? styles.active : ''].filter(Boolean).join(' ')}
                onClick={() => scrollToSection(section.id)}
                aria-label={`Go to ${section.label}`}
                aria-current={active ? 'true' : undefined}
              />
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
