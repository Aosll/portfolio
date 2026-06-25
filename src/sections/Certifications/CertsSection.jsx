import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GlassPanel from '@components/ui/GlassPanel';
import { prefersReducedMotion } from '@utils/motion';

import styles from './CertsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

const CERTS = [
  {
    id: 'huawei-cloudmetrik',
    title: 'Cybersecurity Bootcamp',
    issuer: 'Huawei & CloudMetrik',
    year: '2026',
    accent: '#ef4444',
    icon: '华',
  },
  {
    id: 'linux-icta',
    title: 'Linux in Cybersecurity',
    issuer: 'ICTA',
    year: '2025',
    accent: '#f59e0b',
    icon: '$_',
  },
  {
    id: 'db-attacks-icta',
    title: 'Database Attacks & Security',
    issuer: 'ICTA',
    year: '2025',
    accent: '#4f8ef7',
    icon: '◧',
  },
  {
    id: 'java-c-icta',
    title: 'Advanced Java & C Programming',
    issuer: 'ICTA',
    year: '2025',
    accent: '#00d4ff',
    icon: '{ }',
  },
  {
    id: 'azure-microsoft',
    title: 'Microsoft Azure Introduction',
    issuer: 'Microsoft',
    year: '2025',
    accent: '#0078d4',
    icon: '⬡',
  },
  {
    id: 'se-hkust',
    title: 'Software Engineering Specialization',
    issuer: 'HKUST',
    year: '2025',
    accent: '#8b5cf6',
    icon: '◈',
    note: 'UML · Testing · Design',
  },
];

const EDUCATION = [
  {
    id: 'bsc-cs',
    degree: 'BSc Computer Engineering',
    school: 'TED University',
    detail: '100% English instruction',
    period: 'July 2023 – June 2026',
    accent: '#00d4ff',
    icon: '⊞',
    primary: true,
  },
  {
    id: 'business-admin',
    degree: 'Secondary Field — Business Administration',
    school: 'TED University',
    detail: '',
    period: 'Sep 2024 – June 2026',
    accent: '#8b5cf6',
    icon: '◈',
    primary: false,
  },
];

const ACTIVITIES = [
  { label: 'Vice Chairman · TEDU Science & Technology Society',  duration: '2 Years'   },
  { label: 'Table Tennis Competitor',                            duration: '12 Years'  },
];

// ─── Cert card ────────────────────────────────────────────────────────────────

function CertCard({ cert, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return; // leave content visible, skip the reveal
    gsap.set(el, { autoAlpha: 0, y: 28 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: (index % 3) * 0.08 });
      },
    });
    return () => trigger.kill();
  }, [index]);

  return (
    <GlassPanel
      ref={ref}
      className={styles.certCard}
      style={{ '--cert-accent': cert.accent }}
    >
      <div className={styles.certTop}>
        <span className={styles.certIcon} style={{ color: cert.accent }}>{cert.icon}</span>
        <span className={styles.certYear}>{cert.year}</span>
      </div>
      <h3 className={styles.certTitle}>{cert.title}</h3>
      {cert.note && <p className={styles.certNote}>{cert.note}</p>}
      <p className={styles.certIssuer}>{cert.issuer}</p>
    </GlassPanel>
  );
}

// ─── Education card ───────────────────────────────────────────────────────────

function EduCard({ edu, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return; // leave content visible, skip the reveal
    gsap.set(el, { autoAlpha: 0, y: 24 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter() {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: index * 0.12 });
      },
    });
    return () => trigger.kill();
  }, [index]);

  return (
    <GlassPanel
      ref={ref}
      variant={edu.primary ? 'intense' : 'default'}
      className={`${styles.eduCard} ${edu.primary ? styles.eduCardPrimary : ''}`}
      style={{ '--edu-accent': edu.accent }}
    >
      <span className={styles.eduIcon} style={{ color: edu.accent }}>{edu.icon}</span>
      <h3 className={styles.eduDegree}>{edu.degree}</h3>
      <p className={styles.eduSchool}>{edu.school}</p>
      {edu.detail && <p className={styles.eduDetail}>{edu.detail}</p>}
      <p className={styles.eduPeriod}>{edu.period}</p>
    </GlassPanel>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function CertsSection() {
  const rootRef       = useRef(null);
  const labelRef      = useRef(null);
  const headingRef    = useRef(null);
  const eduLabelRef   = useRef(null);
  const eduHeadingRef = useRef(null);
  const actLabelRef   = useRef(null);

  useEffect(() => {
    if (prefersReducedMotion()) return; // leave headings visible, skip the reveal
    const els = [eduLabelRef, eduHeadingRef, labelRef, headingRef, actLabelRef];
    els.forEach((r, i) => {
      if (!r.current) return;
      gsap.set(r.current, { autoAlpha: 0, y: 20 });
      ScrollTrigger.create({
        trigger: r.current,
        start: 'top 88%',
        once: true,
        onEnter() {
          gsap.to(r.current, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: i * 0.05 });
        },
      });
    });
  }, []);

  return (
    <section
      id="certifications"
      ref={rootRef}
      className={`section ${styles.certs}`}
      aria-label="Certifications"
    >
      <div className={styles.inner}>

        {/* ── Education (leads the section) ── */}
        <div className={styles.block}>
          <div className={styles.headingRow}>
            <div>
              <p ref={eduLabelRef} className={styles.label}>Education</p>
              <h2 ref={eduHeadingRef} className={styles.heading}>Academic Background</h2>
            </div>
          </div>
          <div className={styles.eduGrid}>
            {EDUCATION.map((edu, i) => (
              <EduCard key={edu.id} edu={edu} index={i} />
            ))}
          </div>
        </div>

        {/* ── Certifications ── */}
        <div className={styles.block}>
          <div className={styles.headingRow}>
            <div>
              <p ref={labelRef} className={styles.label}>Certifications &amp; Training</p>
              <h2 ref={headingRef} className={styles.heading}>
                Verified Credentials
                <span className={styles.countBadge}>{CERTS.length}</span>
              </h2>
            </div>
          </div>
          <div className={styles.certsGrid}>
            {CERTS.map((cert, i) => (
              <CertCard key={cert.id} cert={cert} index={i} />
            ))}
          </div>
        </div>

        {/* ── Activities ── */}
        <div className={styles.subsection}>
          <p ref={actLabelRef} className={styles.label}>Activities &amp; Interests</p>
          <div className={styles.activitiesRow}>
            {ACTIVITIES.map(a => (
              <div key={a.label} className={styles.activityPill}>
                <span className={styles.activityLabel}>{a.label}</span>
                <span className={styles.activityDuration}>{a.duration}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
