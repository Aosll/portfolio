import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useGSAP } from '@hooks/useGSAP';
import GlassPanel from '@components/ui/GlassPanel';

import styles from './ExperienceSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const EXPERIENCES = [
  {
    id: 'arch-of-sigma',
    company: 'Arch of Sigma',
    role: 'Software Developer Intern',
    period: 'March – April 2026',
    side: 'right',
    icon: '>_',
    accent: '#00d4ff',
    highlights: [
      'Modular Python CLI with full CRUD operations',
      'Input validation + structured exception handling',
      'Excel PivotTables, VLOOKUP, IF/COUNT analysis',
    ],
    tags: ['Python', 'CLI', 'Data Analysis'],
  },
  {
    id: 'atm-bilisim',
    company: 'ATM Bilişim',
    role: 'Information Technology Intern',
    period: 'July – August 2025',
    side: 'left',
    icon: '☁',
    accent: '#4f8ef7',
    highlights: [
      'Microsoft Azure provisioning + resource management',
      'Microsoft 365 user management + security config',
      'Copilot AI workflow efficiency evaluation',
    ],
    tags: ['Azure', 'M365', 'Cloud'],
  },
  {
    id: 'turktractor',
    company: 'TürkTraktör A.Ş.',
    role: 'Cybersecurity Intern',
    period: 'July – August 2024',
    side: 'right',
    icon: '🛡',
    accent: '#8b5cf6',
    highlights: [
      'IBM QRadar SIEM log analysis + detection rules',
      'MITRE ATT&CK framework mapping + threat briefings',
      'LLM + Copilot AI research for IT automation',
    ],
    tags: ['QRadar', 'MITRE', 'SIEM', 'Cybersecurity'],
  },
];

// ─── Timeline spine (draw-on via clip-path) ───────────────────────────────────

function TimelineSpine() {
  const lineRef = useRef(null);

  useEffect(() => {
    if (!lineRef.current) return;
    gsap.set(lineRef.current, { scaleY: 0, transformOrigin: 'top center' });
    const trigger = ScrollTrigger.create({
      trigger: lineRef.current,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 0.6,
      onUpdate(self) {
        gsap.set(lineRef.current, { scaleY: self.progress });
      },
    });
    return () => trigger.kill();
  }, []);

  return <div ref={lineRef} className={styles.spine} aria-hidden="true" />;
}

// ─── Individual entry ─────────────────────────────────────────────────────────

function ExperienceEntry({ entry, index }) {
  const cardRef = useRef(null);
  const dotRef  = useRef(null);

  useEffect(() => {
    const card = cardRef.current;
    const dot  = dotRef.current;
    if (!card || !dot) return;

    const fromX = entry.side === 'right' ? 60 : -60;
    gsap.set(card, { autoAlpha: 0, x: fromX });
    gsap.set(dot,  { scale: 0 });

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 82%',
      once: true,
      onEnter() {
        gsap.to(card, { autoAlpha: 1, x: 0, duration: 0.7, ease: 'power3.out', delay: index * 0.08 });
        gsap.to(dot,  { scale: 1,          duration: 0.5, ease: 'back.out(2)', delay: index * 0.08 + 0.1 });
      },
    });

    return () => trigger.kill();
  }, [entry.side, index]);

  const isRight = entry.side === 'right';

  return (
    <div className={`${styles.entry} ${isRight ? styles.entryRight : styles.entryLeft}`}>
      {/* Card */}
      <GlassPanel
        ref={cardRef}
        className={styles.card}
        style={{ '--entry-accent': entry.accent }}
      >
        {/* Header */}
        <div className={styles.cardHeader}>
          <span className={styles.icon} style={{ color: entry.accent }}>{entry.icon}</span>
          <div className={styles.cardMeta}>
            <h3 className={styles.company}>{entry.company}</h3>
            <p className={styles.role}>{entry.role}</p>
          </div>
          <span className={styles.period}>{entry.period}</span>
        </div>

        {/* Highlights */}
        <ul className={styles.highlights}>
          {entry.highlights.map(h => (
            <li key={h} className={styles.highlight}>
              <span className={styles.bullet} style={{ background: entry.accent }} />
              {h}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className={styles.tagRow}>
          {entry.tags.map(t => (
            <span key={t} className={styles.tag} style={{ '--entry-accent': entry.accent }}>
              {t}
            </span>
          ))}
        </div>
      </GlassPanel>

      {/* Connector dot on the spine */}
      <div
        ref={dotRef}
        className={styles.dot}
        style={{ background: entry.accent, boxShadow: `0 0 12px ${entry.accent}` }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function ExperienceSection() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
      gsap.from('[data-exp="label"]',   { y: 20, autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: '[data-exp="label"]',   start: 'top 88%', once: true } });
      gsap.from('[data-exp="heading"]', { y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '[data-exp="heading"]', start: 'top 88%', once: true } });
    },
    { scope: rootRef }
  );

  return (
    <section
      id="experience"
      ref={rootRef}
      className={`section ${styles.experience}`}
      aria-label="Experience"
    >
      <div className={styles.inner}>
        {/* Heading */}
        <div className={styles.headingBlock}>
          <p data-exp="label" className={styles.label}>Professional Experience</p>
          <h2 data-exp="heading" className={styles.heading}>Internship Timeline</h2>
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          <TimelineSpine />
          {EXPERIENCES.map((entry, i) => (
            <ExperienceEntry key={entry.id} entry={entry} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
