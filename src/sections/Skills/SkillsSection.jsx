import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useGSAP } from '@hooks/useGSAP';
import GlassPanel from '@components/ui/GlassPanel';
import { prefersReducedMotion } from '@utils/motion';

import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Radar data ────────────────────────────────────────────────────────────────
// ring: 0=Expert 1=Advanced 2=Proficient 3=Familiar   quad: 0-3 (see QUAD_LABELS)
// Every entry is a real term from Ömer's domains (languages, security, AI/embedded,
// cloud/mobile) so the radar reads as his actual toolkit.
const TECHS = [
  // Languages & Data
  { name: 'Python',          ring: 0, quad: 0, desc: 'ML pipelines, backend, scripting' },
  { name: 'Java',            ring: 1, quad: 0, desc: 'OOP fundamentals and coursework' },
  { name: 'C++',             ring: 1, quad: 0, desc: 'OOP, data structures, performance' },
  { name: 'C',               ring: 1, quad: 0, desc: 'Systems & embedded firmware' },
  { name: 'MySQL',           ring: 2, quad: 0, desc: 'Relational design & queries' },
  // Cybersecurity
  { name: 'IBM QRadar',      ring: 0, quad: 1, desc: 'SIEM log analysis & detection' },
  { name: 'MITRE ATT&CK',    ring: 1, quad: 1, desc: 'Adversary TTP mapping' },
  { name: 'Kali Linux',      ring: 1, quad: 1, desc: 'Nmap · Hydra · Wireshark' },
  { name: 'Pen-Testing',     ring: 2, quad: 1, desc: 'Vulnerability assessment' },
  // AI & Embedded
  { name: 'ESP32',           ring: 1, quad: 2, desc: 'Wi-Fi / BLE MCU firmware' },
  { name: 'TinyML',          ring: 1, quad: 2, desc: 'On-device ML, Edge Impulse' },
  { name: 'Edge Impulse',    ring: 2, quad: 2, desc: 'Collect, train, deploy pipeline' },
  { name: 'TensorFlow Lite', ring: 2, quad: 2, desc: 'Compact model deployment' },
  { name: 'ESP-NOW',         ring: 2, quad: 2, desc: 'Low-latency wireless mesh' },
  // Cloud & Mobile
  { name: 'Swift',           ring: 1, quad: 3, desc: 'Native iOS development' },
  { name: 'Azure',           ring: 1, quad: 3, desc: 'Provisioning & monitoring' },
  { name: 'SwiftUI',         ring: 2, quad: 3, desc: 'Declarative iOS UI' },
  { name: 'M365',            ring: 2, quad: 3, desc: 'Entra ID, admin & security' },
  { name: 'SpriteKit',       ring: 2, quad: 3, desc: 'Native iOS game rendering' },
];

const RING_LABELS = ['Expert', 'Advanced', 'Proficient', 'Familiar'];
const QUAD_LABELS = ['Languages & Data', 'Cybersecurity', 'AI & Embedded', 'Cloud & Mobile'];
const RING_COLORS = ['#00d4ff', '#4f8ef7', '#8b5cf6', '#10b981'];
const RING_RADII  = [66, 106, 146, 186];     // SVG units from center
const CX = 220, CY = 220, SIZE = 440;          // SVG viewport

// Deterministic layout: within each quadrant, sort techs inner→outer by ring and
// spread them evenly across the wedge. Dots end up on a tidy spiral, so neither
// the dots nor their labels collide (the old hash-jitter caused the overlap).
const LAYOUT = (() => {
  const byQuad = [[], [], [], []];
  TECHS.forEach((t) => byQuad[t.quad].push(t));
  const out = {};
  byQuad.forEach((list, quad) => {
    const sorted = [...list].sort((a, b) => a.ring - b.ring);
    const center = quad * 90 - 45;  // wedge centre angle
    const span   = 64;              // usable arc inside the 90° wedge
    const n      = sorted.length;
    sorted.forEach((t, i) => {
      const frac  = n === 1 ? 0.5 : i / (n - 1);
      const angle = ((center - span / 2 + frac * span) * Math.PI) / 180;
      const r     = RING_RADII[t.ring];
      out[t.name] = {
        x: CX + Math.cos(angle) * r,
        y: CY + Math.sin(angle) * r,
        above: i % 2 === 0, // alternate label side for extra breathing room
      };
    });
  });
  return out;
})();

// ─── Competencies (narrative, no percentages) ──────────────────────────────────

const COMPETENCIES = [
  {
    label: 'Programming & Data',
    accent: '#00d4ff',
    techs: ['Python', 'C / C++', 'Java', 'Swift', 'MySQL'],
    blurb:
      'Comfortable moving between low-level C / C++ systems work, Python automation and data handling, Java OOP foundations, Swift application code, and MySQL-backed relational thinking.',
  },
  {
    label: 'Cybersecurity',
    accent: '#8b5cf6',
    techs: ['IBM QRadar', 'MITRE ATT&CK', 'Kali Linux', 'Nmap', 'Hydra', 'Wireshark'],
    blurb:
      'Built blue-team experience through QRadar log analysis and detection-rule work, then validated IoT attack paths with Kali tooling, Nmap scans, Hydra credential attacks and Wireshark captures.',
  },
  {
    label: 'AI & Machine Learning',
    accent: '#4f8ef7',
    techs: ['TinyML', 'TensorFlow Lite', 'Edge Impulse', 'Gesture Classification'],
    blurb:
      'Focused on edge AI: collect clean sensor data, train compact models, validate accuracy thresholds, and deploy inference to constrained microcontroller environments.',
  },
  {
    label: 'Embedded & IoT',
    accent: '#10b981',
    techs: ['ESP32', 'Embedded C', 'ESP-NOW', 'Sensor Integration', 'TCP/IP'],
    blurb:
      'Works close to hardware with ESP32 firmware, sensor integration, ESP-NOW communication, TCP/IP concepts, and real-time behavior for wearable and IoT prototypes.',
  },
  {
    label: 'Cloud & Platforms',
    accent: '#0078d4',
    techs: ['Azure', 'Microsoft 365', 'Entra ID', 'Copilot'],
    blurb:
      'Operated Azure resources in a business environment, handled provisioning and monitoring, and administered Microsoft 365 users, access control and security settings.',
  },
  {
    label: 'Mobile & Web',
    accent: '#f472b6',
    techs: ['SwiftUI', 'SwiftData', 'SpriteKit', 'React', 'Three.js'],
    blurb:
      'Ships native iOS experiences with SwiftUI, SwiftData and SpriteKit, while also building expressive web interfaces with React, Three.js and GSAP.',
  },
];

// ─── Soft skills ───────────────────────────────────────────────────────────────

const SOFT_SKILLS = [
  { label: 'Leadership',       icon: '◆', blurb: 'Served as AI Lead on a 4-person senior project and Vice Chairman of the TEDU Science & Technology Society.' },
  { label: 'Communication',    icon: '◈', blurb: 'Delivered threat-briefing presentations and turns technical security or embedded details into stakeholder-readable language.' },
  { label: 'Teamwork',         icon: '⬡', blurb: 'Contributes across small project teams where firmware, security validation, data analysis and product decisions have to move together.' },
  { label: 'Product Thinking', icon: '◇', blurb: 'Uses the Business Administration secondary field to frame engineering decisions around users, adoption, deadlines and constraints.' },
  { label: 'Ownership',        icon: '⊚', blurb: 'Takes projects from idea to working build, including a solo native iOS game with localization and on-device persistence.' },
  { label: 'Adaptability',     icon: '✦', blurb: 'Cross-domain range from three internships: cybersecurity operations, cloud workplace IT and software development.' },
];

// ─── Tooltip ────────────────────────────────────────────────────────────────────

function Tooltip({ tech, x, y }) {
  if (!tech) return null;
  const left = x > SIZE * 0.65 ? x - 160 : x + 16;
  const top  = y > SIZE * 0.65 ? y - 80  : y + 12;
  return (
    <foreignObject x={left} y={top} width={150} height={80} style={{ overflow: 'visible' }}>
      <div className={styles.tooltip}>
        <span className={styles.tooltipName}>{tech.name}</span>
        <span className={styles.tooltipRing} style={{ color: RING_COLORS[tech.ring] }}>
          {RING_LABELS[tech.ring]}
        </span>
        <span className={styles.tooltipDesc}>{tech.desc}</span>
      </div>
    </foreignObject>
  );
}

// ─── Tech Radar SVG ─────────────────────────────────────────────────────────────

function TechRadar() {
  const [hovered, setHovered] = useState(null); // tech name
  const [hovQuad, setHovQuad] = useState(null); // quad index
  const dotsRef  = useRef([]);
  const radarRef = useRef(null);

  // Dots fly in from the centre on reveal (skipped under reduced-motion, where
  // they simply appear in place so the radar is never left blank).
  useEffect(() => {
    if (!radarRef.current) return undefined;

    if (prefersReducedMotion()) {
      dotsRef.current.forEach((el) => {
        if (!el) return;
        gsap.set(el, { attr: { cx: el.dataset.tx, cy: el.dataset.ty }, opacity: 1, scale: 1 });
      });
      return undefined;
    }

    const trigger = ScrollTrigger.create({
      trigger: radarRef.current,
      start: 'top 80%',
      once: true,
      onEnter: () => {
        dotsRef.current.forEach((el, i) => {
          if (!el) return;
          gsap.fromTo(el,
            { attr: { cx: CX, cy: CY }, opacity: 0, scale: 0 },
            { attr: { cx: el.dataset.tx, cy: el.dataset.ty }, opacity: 1, scale: 1,
              duration: 0.7, delay: i * 0.04, ease: 'back.out(1.5)',
              transformOrigin: 'center center',
            }
          );
        });
      },
    });
    dotsRef.current.forEach((el) => {
      if (!el) return;
      gsap.set(el, { attr: { cx: CX, cy: CY }, opacity: 0, scale: 0 });
    });
    return () => trigger.kill();
  }, []);

  const hoveredTech = hovered ? TECHS.find((t) => t.name === hovered) : null;
  const hoveredPos  = hovered ? LAYOUT[hovered] : null;

  return (
    <div ref={radarRef} className={styles.radarWrap}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className={styles.radarSvg}
        aria-label="Technology radar"
      >
        {/* Quadrant highlight on hover */}
        {hovQuad !== null && (
          <path
            d={(() => {
              const a1 = ((hovQuad * 90 - 90) * Math.PI) / 180;
              const a2 = ((hovQuad * 90)       * Math.PI) / 180;
              const R  = RING_RADII[3] + 14;
              return `M${CX},${CY} L${CX + Math.cos(a1) * R},${CY + Math.sin(a1) * R}
                A${R},${R} 0 0,1 ${CX + Math.cos(a2) * R},${CY + Math.sin(a2) * R} Z`;
            })()}
            fill="rgba(79,142,247,0.07)"
            stroke="none"
          />
        )}

        {/* Quadrant dividers */}
        {[0, 90, 180, 270].map((deg) => {
          const r = (deg * Math.PI) / 180;
          const R = RING_RADII[3] + 14;
          return (
            <line
              key={deg}
              x1={CX} y1={CY}
              x2={CX + Math.cos(r) * R}
              y2={CY + Math.sin(r) * R}
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
          );
        })}

        {/* Concentric rings */}
        {RING_RADII.map((r, i) => (
          <circle
            key={i}
            cx={CX} cy={CY} r={r}
            fill="none"
            stroke={RING_COLORS[i]}
            strokeWidth={i === 0 ? 1.5 : 1}
            strokeOpacity={0.25}
            strokeDasharray={i > 0 ? '4 6' : undefined}
          />
        ))}

        {/* Ring labels */}
        {RING_RADII.map((r, i) => (
          <text
            key={i}
            x={CX} y={CY - r + 10}
            textAnchor="middle"
            fontSize="8"
            fill={RING_COLORS[i]}
            fillOpacity={0.6}
            fontFamily="JetBrains Mono, monospace"
          >
            {RING_LABELS[i]}
          </text>
        ))}

        {/* Quadrant labels */}
        {QUAD_LABELS.map((label, i) => {
          const angleDeg = i * 90 - 45;
          const angleRad = (angleDeg * Math.PI) / 180;
          const r = RING_RADII[3] + 26;
          return (
            <text
              key={i}
              x={CX + Math.cos(angleRad) * r}
              y={CY + Math.sin(angleRad) * r}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8.5"
              fill="rgba(160,174,192,0.6)"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.06em"
              style={{ textTransform: 'uppercase', cursor: 'default' }}
              onMouseEnter={() => setHovQuad(i)}
              onMouseLeave={() => setHovQuad(null)}
            >
              {label}
            </text>
          );
        })}

        {/* Tech dots. The always-visible labels live in the legend below so the
            radar itself stays readable at every viewport size. */}
        {TECHS.map((tech, i) => {
          const pos    = LAYOUT[tech.name];
          const color  = RING_COLORS[tech.ring];
          const isHov  = hovered === tech.name;
          return (
            <g key={tech.name}>
              <title>{`${tech.name}: ${tech.desc}`}</title>
              {isHov && <circle cx={pos.x} cy={pos.y} r={14} fill={color} fillOpacity={0.12} />}
              <circle
                ref={(el) => { dotsRef.current[i] = el; }}
                data-tx={pos.x}
                data-ty={pos.y}
                cx={pos.x} cy={pos.y}
                r={isHov ? 7 : 5}
                fill={color}
                fillOpacity={isHov ? 1 : 0.85}
                stroke={isHov ? '#fff' : color}
                strokeWidth={isHov ? 1.5 : 0.5}
                strokeOpacity={0.6}
                style={{ cursor: 'pointer', transition: 'r 0.15s, fill-opacity 0.15s' }}
                onMouseEnter={() => { setHovered(tech.name); setHovQuad(tech.quad); }}
                onMouseLeave={() => { setHovered(null); setHovQuad(null); }}
              />
              {isHov && (
                <text
                  x={pos.x}
                  y={pos.above ? pos.y - 12 : pos.y + 18}
                  textAnchor="middle"
                  fontSize="8"
                  fill="#fff"
                  fontFamily="JetBrains Mono, monospace"
                  style={{ pointerEvents: 'none' }}
                >
                  {tech.name}
                </text>
              )}
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredTech && hoveredPos && (
          <Tooltip tech={hoveredTech} x={hoveredPos.x} y={hoveredPos.y} />
        )}
      </svg>
      <div className={styles.radarLegend} aria-label="Technology radar legend">
        {TECHS.map((tech) => (
          <span
            key={tech.name}
            className={styles.radarLegendItem}
            style={{ '--legend-color': RING_COLORS[tech.ring] }}
            onMouseEnter={() => { setHovered(tech.name); setHovQuad(tech.quad); }}
            onMouseLeave={() => { setHovered(null); setHovQuad(null); }}
          >
            {tech.name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Competency card ────────────────────────────────────────────────────────────

function CompetencyCard({ comp, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    gsap.set(el, { autoAlpha: 0, y: 26 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      once: true,
      onEnter() {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: (index % 2) * 0.08 });
      },
    });
    return () => trigger.kill();
  }, [index]);

  return (
    <GlassPanel ref={ref} className={styles.compCard} style={{ '--comp-accent': comp.accent }}>
      <h3 className={styles.compLabel}>{comp.label}</h3>
      <p className={styles.compBlurb}>{comp.blurb}</p>
      <div className={styles.compTechs}>
        {comp.techs.map((t) => (
          <span key={t} className={styles.compTech}>{t}</span>
        ))}
      </div>
    </GlassPanel>
  );
}

// ─── Soft-skill card ────────────────────────────────────────────────────────────

function SoftSkill({ skill, index }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return undefined;
    gsap.set(el, { autoAlpha: 0, y: 20 });
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 92%',
      once: true,
      onEnter() {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power3.out', delay: (index % 3) * 0.06 });
      },
    });
    return () => trigger.kill();
  }, [index]);

  return (
    <div ref={ref} className={styles.softCard}>
      <span className={styles.softIcon} aria-hidden="true">{skill.icon}</span>
      <div className={styles.softText}>
        <h4 className={styles.softLabel}>{skill.label}</h4>
        <p className={styles.softBlurb}>{skill.blurb}</p>
      </div>
    </div>
  );
}

// ─── Main section ───────────────────────────────────────────────────────────────

export default function SkillsSection() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) return;
      gsap.from('[data-skills="label"]',   { y: 20, autoAlpha: 0, duration: 0.6, scrollTrigger: { trigger: '[data-skills="label"]',   start: 'top 88%', once: true } });
      gsap.from('[data-skills="heading"]', { y: 30, autoAlpha: 0, duration: 0.7, ease: 'power3.out', scrollTrigger: { trigger: '[data-skills="heading"]', start: 'top 88%', once: true } });
      gsap.from('[data-skills="sub"]',     { x: 40, autoAlpha: 0, duration: 0.7, scrollTrigger: { trigger: '[data-skills="sub"]', start: 'top 88%', once: true } });
    },
    { scope: rootRef }
  );

  return (
    <section
      id="skills"
      ref={rootRef}
      className={`section ${styles.skills}`}
      aria-label="Skills"
    >
      <div className={styles.inner}>
        {/* Heading */}
        <div className={styles.headingBlock}>
          <p data-skills="label" className={styles.label}>Technical Skills</p>
          <h2 data-skills="heading" className={styles.heading}>Tech Radar &amp; Competencies</h2>
          <p data-skills="sub" className={styles.sub}>
            An interactive map of the tools and domains I work in — plotted by depth of
            experience, then unpacked below.
          </p>
        </div>

        {/* Radar */}
        <TechRadar />

        {/* Competencies — narrative, no percentages */}
        <div className={styles.subBlock}>
          <p className={styles.subLabel}>Competencies</p>
          <div className={styles.compGrid}>
            {COMPETENCIES.map((c, i) => (
              <CompetencyCard key={c.label} comp={c} index={i} />
            ))}
          </div>
        </div>

        {/* Soft skills */}
        <div className={styles.subBlock}>
          <p className={styles.subLabel}>Soft Skills</p>
          <div className={styles.softGrid}>
            {SOFT_SKILLS.map((s, i) => (
              <SoftSkill key={s.label} skill={s} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
