import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useGSAP } from '@hooks/useGSAP';
import GlassPanel from '@components/ui/GlassPanel';

import styles from './AboutSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Stat cards ──────────────────────────────────────────────────────────────

const STATS = [
  { value: 3,  suffix: '',  label: 'Internships'           },
  { value: 1,  suffix: '',  label: 'Solo App Published'    },
  { value: 5,  suffix: '+', label: 'Technologies'          },
  { value: 2,  suffix: '',  label: 'Years Club Vice-Chair' },
];

function StatCard({ value, suffix, label }) {
  const numRef = useRef(null);
  const cardRef = useRef(null);

  useEffect(() => {
    const el = numRef.current;
    const card = cardRef.current;
    const obj = { n: 0 };

    const trigger = ScrollTrigger.create({
      trigger: card,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          n: value,
          duration: 1.4,
          ease: 'power2.out',
          onUpdate: () => {
            el.textContent = Math.round(obj.n) + suffix;
          },
        });
        gsap.fromTo(card, { y: 32, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.7, ease: 'power3.out' });
      },
    });

    return () => trigger.kill();
  }, [value, suffix]);

  return (
    <GlassPanel ref={cardRef} className={styles.statCard} style={{ opacity: 0 }}>
      <span ref={numRef} className={styles.statValue}>0{suffix}</span>
      <span className={styles.statLabel}>{label}</span>
    </GlassPanel>
  );
}

// ─── Orbit icon ──────────────────────────────────────────────────────────────

const ORBIT_ICONS = [
  { label: 'Python',    symbol: 'Py',  color: '#4f8ef7' },
  { label: 'Swift',     symbol: 'Sw',  color: '#f05138' },
  { label: 'C',         symbol: 'C',   color: '#00d4ff' },
  { label: 'Azure',     symbol: 'Az',  color: '#0089d6' },
  { label: 'ESP32',     symbol: 'ESP', color: '#10b981' },
  { label: 'Security',  symbol: '🛡',  color: '#8b5cf6' },
];

function TechOrbit() {
  const orbitRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(null);
  const animRef = useRef(null);
  const angleRef = useRef(0);
  const rafRef = useRef(null);

  const COUNT = ORBIT_ICONS.length;
  const RX = 110;
  const RY = 36;

  function positionIcons(icons, base) {
    icons?.forEach((icon, i) => {
      const angle = base + (i / COUNT) * Math.PI * 2;
      const x = Math.cos(angle) * RX;
      const y = Math.sin(angle) * RY;
      const scale = 0.7 + 0.3 * ((Math.sin(angle) + 1) / 2);
      const opacity = 0.5 + 0.5 * ((Math.sin(angle) + 1) / 2);
      icon.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`;
      icon.style.opacity = String(opacity);
      icon.style.zIndex = Math.round(scale * 10);
    });
  }

  useEffect(() => {
    const icons = orbitRef.current?.querySelectorAll('[data-orbit-icon]');

    // Position immediately so icons never pile up at center before first rAF.
    positionIcons(icons, angleRef.current);

    function tick() {
      if (!paused) angleRef.current += 0.005;
      positionIcons(icons, angleRef.current);
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [paused]);

  return (
    <div
      className={styles.orbit}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => { setPaused(false); setHovered(null); }}
    >
      {ORBIT_ICONS.map((icon) => (
        <div
          key={icon.label}
          data-orbit-icon
          className={`${styles.orbitIcon} ${hovered === icon.label ? styles.orbitIconActive : ''}`}
          style={{
            '--icon-color': icon.color,
            // Pre-position each icon on the ellipse so they're never piled at center.
            transform: (() => {
              const angle = (ORBIT_ICONS.indexOf(icon) / ORBIT_ICONS.length) * Math.PI * 2;
              return `translate(calc(-50% + ${Math.cos(angle) * 110}px), calc(-50% + ${Math.sin(angle) * 36}px)) scale(${0.7 + 0.3 * ((Math.sin(angle) + 1) / 2)})`;
            })(),
            opacity: String(0.5 + 0.5 * ((Math.sin((ORBIT_ICONS.indexOf(icon) / ORBIT_ICONS.length) * Math.PI * 2) + 1) / 2)),
          }}
          onMouseEnter={() => setHovered(icon.label)}
        >
          <span className={styles.orbitSymbol}>{icon.symbol}</span>
          <span className={styles.orbitLabel}>{icon.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function AboutSection() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;

      gsap.from('[data-about="label"]',   { y: 20, autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: '[data-about="label"]',   start: 'top 88%', once: true } });
      gsap.from('[data-about="heading"]', { y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '[data-about="heading"]', start: 'top 88%', once: true } });

      gsap.utils.toArray('[data-about="para"]').forEach((el, i) => {
        gsap.from(el, { y: 24, autoAlpha: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
      });

      gsap.from('[data-about="card"]', { x: 60, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: '[data-about="card"]', start: 'top 80%', once: true } });
    },
    { scope: rootRef }
  );

  return (
    <section
      id="about"
      ref={rootRef}
      className={`section ${styles.about}`}
      aria-label="About"
    >
      <div className={styles.inner}>
        {/* ── Left column (60%) ── */}
        <div className={styles.left}>
          <p data-about="label" className={styles.label}>About Me</p>

          <h2 data-about="heading" className={styles.heading}>
            Engineering Mindset &amp; Innovation Journey
          </h2>

          <p data-about="para" className={styles.para}>
            CS graduate June&nbsp;2026, full-stack engineer with&nbsp;3 internships, a
            senior AI&nbsp;Lead project, and a solo iOS app shipped end-to-end. Each role
            has pushed both the technical boundary and the product deadline — simultaneously.
          </p>
          <p data-about="para" className={styles.para}>
            My work spans cybersecurity (IBM&nbsp;QRadar, MITRE&nbsp;ATT&amp;CK), embedded
            systems (ESP32, TinyML), cloud infrastructure (Azure), and mobile development
            (Swift). I build firmware that talks to the cloud and interfaces that talk to users.
          </p>
          <p data-about="para" className={styles.para}>
            A secondary field in Business&nbsp;Administration adds product strategy and
            stakeholder communication to every build — because great engineering still needs
            to ship, get adopted, and make sense to the people funding it.
          </p>

          <div className={styles.statsGrid}>
            {STATS.map((s) => (
              <StatCard key={s.label} {...s} />
            ))}
          </div>
        </div>

        {/* ── Right column (40%) ── */}
        <div className={styles.right}>
          <GlassPanel data-about="card" variant="intense" className={styles.profileCard} style={{ opacity: 0 }}>
            <div className={styles.initialsWrap}>
              <span className={styles.initials}>OED</span>
            </div>

            <TechOrbit />

            <div className={styles.profileMeta}>
              <p className={styles.profileName}>Ömer Efe Dikici</p>
              <p className={styles.profileRole}>Computer Engineer · AI Lead</p>
            </div>
          </GlassPanel>
        </div>
      </div>
    </section>
  );
}
