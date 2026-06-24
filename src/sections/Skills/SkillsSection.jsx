import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useGSAP } from '@hooks/useGSAP';
import GlassPanel from '@components/ui/GlassPanel';

import styles from './SkillsSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ────────────────────────────────────────────────────────────────────

// ring: 0=Expert 1=Advanced 2=Proficient 3=Beginner   quadrant: 0-3
const TECHS = [
  // Expert
  { name: 'Python',       ring: 0, quad: 0, desc: 'Primary language — scripting, ML pipelines, backend'     },
  { name: 'C',            ring: 0, quad: 0, desc: 'Systems programming, embedded firmware'                   },
  { name: 'Swift',        ring: 0, quad: 3, desc: 'Native iOS development, SwiftUI, SwiftData'               },
  { name: 'Cybersecurity',ring: 0, quad: 1, desc: 'QRadar SIEM, MITRE ATT&CK, threat modelling'             },
  // Advanced
  { name: 'C++',          ring: 1, quad: 0, desc: 'OOP, DSA, performance-critical code'                      },
  { name: 'Java',         ring: 1, quad: 0, desc: 'Academic projects, OOP fundamentals'                      },
  { name: 'SQL',          ring: 1, quad: 0, desc: 'Relational DB design, complex queries'                    },
  { name: 'ESP32',        ring: 1, quad: 2, desc: 'Wi-Fi/BLE MCU, ESPNOW mesh, sensor fusion'               },
  { name: 'TinyML',       ring: 1, quad: 2, desc: 'Edge Impulse, TensorFlow Lite on microcontrollers'        },
  { name: 'Azure',        ring: 1, quad: 2, desc: 'Azure services, M365, Entra ID, cloud infra'              },
  // Proficient
  { name: 'GSAP',         ring: 2, quad: 3, desc: 'Web animations, scroll-driven timelines'                  },
  { name: 'Flask',        ring: 2, quad: 3, desc: 'REST APIs, ML model serving'                              },
  { name: 'TensorFlow',   ring: 2, quad: 0, desc: 'Model training, Keras API, Edge deployment'               },
  { name: 'Three.js',     ring: 2, quad: 3, desc: 'WebGL, 3D scenes, shaders'                               },
  // Beginner
  { name: 'Kubernetes',   ring: 3, quad: 2, desc: 'Container orchestration basics'                           },
  { name: 'Rust',         ring: 3, quad: 0, desc: 'Memory safety, systems programming exploration'           },
];

const RING_LABELS  = ['Expert', 'Advanced', 'Proficient', 'Beginner'];
const QUAD_LABELS  = ['Languages', 'Security', 'Cloud + Embedded', 'Mobile + Web'];
const RING_COLORS  = ['#00d4ff', '#4f8ef7', '#8b5cf6', '#10b981'];
const RING_RADII   = [68, 110, 152, 192];   // SVG units from center
const CX = 220, CY = 220, SIZE = 440;       // SVG viewport

const SKILL_BARS = [
  { label: 'Programming Languages', techs: 'Python · Swift · C · C++ · Java',              pct: 90 },
  { label: 'Cybersecurity',         techs: 'QRadar · Kali · MITRE ATT&CK',                pct: 85 },
  { label: 'Cloud & Azure',         techs: 'Azure · M365 · Entra ID',                     pct: 80 },
  { label: 'Embedded Systems',      techs: 'ESP32 · TinyML · ESPNOW',                     pct: 78 },
  { label: 'Mobile Development',    techs: 'SwiftUI · SwiftData',                         pct: 82 },
  { label: 'AI & Machine Learning', techs: 'TensorFlow Lite · Edge Impulse',              pct: 75 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function dotPosition(tech) {
  // Each quadrant is 90°. Add a per-tech hash offset so dots spread inside their quadrant.
  const hash = tech.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const baseAngle = tech.quad * 90 - 45; // center of each quadrant
  const spread    = ((hash % 60) - 30);  // ±30° spread within quadrant
  const angleDeg  = baseAngle + spread;
  const angleRad  = (angleDeg * Math.PI) / 180;
  const r         = RING_RADII[tech.ring] - 8 + (hash % 16); // subtle radial jitter
  return { x: CX + Math.cos(angleRad) * r, y: CY + Math.sin(angleRad) * r };
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function Tooltip({ tech, x, y }) {
  if (!tech) return null;
  // Keep tooltip inside SVG viewport
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

// ─── Tech Radar SVG ──────────────────────────────────────────────────────────

function TechRadar() {
  const [hovered, setHovered]     = useState(null); // tech name
  const [hovQuad, setHovQuad]     = useState(null); // quad index
  const dotsRef                   = useRef([]);
  const radarRef                   = useRef(null);

  // Animate dots flying in from center on reveal
  useEffect(() => {
    if (!radarRef.current) return;
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
    // Set initial positions (invisible at center)
    dotsRef.current.forEach(el => {
      if (!el) return;
      gsap.set(el, { attr: { cx: CX, cy: CY }, opacity: 0, scale: 0 });
    });
    return () => trigger.kill();
  }, []);

  const hoveredTech = hovered ? TECHS.find(t => t.name === hovered) : null;
  const hoveredPos  = hoveredTech ? dotPosition(hoveredTech) : null;

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
        {[0, 90, 180, 270].map(deg => {
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
          const r = RING_RADII[3] + 24;
          return (
            <text
              key={i}
              x={CX + Math.cos(angleRad) * r}
              y={CY + Math.sin(angleRad) * r}
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="8.5"
              fill="rgba(160,174,192,0.55)"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.08em"
              style={{ textTransform: 'uppercase', cursor: 'default' }}
              onMouseEnter={() => setHovQuad(i)}
              onMouseLeave={() => setHovQuad(null)}
            >
              {label}
            </text>
          );
        })}

        {/* Tech dots */}
        {TECHS.map((tech, i) => {
          const { x, y } = dotPosition(tech);
          const color    = RING_COLORS[tech.ring];
          const isHov    = hovered === tech.name;
          return (
            <g key={tech.name}>
              {/* Glow halo */}
              {isHov && (
                <circle cx={x} cy={y} r={14} fill={color} fillOpacity={0.12} />
              )}
              {/* Dot */}
              <circle
                ref={el => { dotsRef.current[i] = el; }}
                data-tx={x}
                data-ty={y}
                cx={x} cy={y}
                r={isHov ? 7 : 5}
                fill={color}
                fillOpacity={isHov ? 1 : 0.8}
                stroke={isHov ? '#fff' : color}
                strokeWidth={isHov ? 1.5 : 0.5}
                strokeOpacity={0.6}
                style={{ cursor: 'pointer', transition: 'r 0.15s, fill-opacity 0.15s' }}
                onMouseEnter={() => { setHovered(tech.name); setHovQuad(tech.quad); }}
                onMouseLeave={() => { setHovered(null); setHovQuad(null); }}
              />
              {/* Label */}
              <text
                x={x} y={y - 9}
                textAnchor="middle"
                fontSize="7"
                fill={isHov ? '#fff' : color}
                fillOpacity={isHov ? 1 : 0.7}
                fontFamily="JetBrains Mono, monospace"
                style={{ pointerEvents: 'none', transition: 'fill-opacity 0.15s' }}
              >
                {tech.name}
              </text>
            </g>
          );
        })}

        {/* Tooltip */}
        {hoveredTech && hoveredPos && (
          <Tooltip tech={hoveredTech} x={hoveredPos.x} y={hoveredPos.y} />
        )}
      </svg>
    </div>
  );
}

// ─── Skill bar ───────────────────────────────────────────────────────────────

function SkillBar({ label, techs, pct }) {
  const barRef  = useRef(null);
  const fillRef = useRef(null);

  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: barRef.current,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        gsap.fromTo(barRef.current, { autoAlpha: 0, x: -24 }, { autoAlpha: 1, x: 0, duration: 0.5, ease: 'power2.out' });
        gsap.fromTo(fillRef.current, { width: '0%' }, { width: `${pct}%`, duration: 1.0, ease: 'power3.out', delay: 0.15 });
      },
    });
    gsap.set(barRef.current, { autoAlpha: 0 });
    return () => trigger.kill();
  }, [pct]);

  return (
    <div ref={barRef} className={styles.skillBar}>
      <div className={styles.skillBarHeader}>
        <span className={styles.skillBarLabel}>{label}</span>
        <span className={styles.skillBarPct}>{pct}%</span>
      </div>
      <p className={styles.skillBarTechs}>{techs}</p>
      <div className={styles.skillBarTrack}>
        <div ref={fillRef} className={styles.skillBarFill} style={{ width: 0 }} />
      </div>
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function SkillsSection() {
  const rootRef = useRef(null);

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduce) return;
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
            An interactive map of tools and languages — plotted by depth of experience across four domains.
          </p>
        </div>

        {/* Radar */}
        <TechRadar />

        {/* Skill bars */}
        <div className={styles.barsGrid}>
          {SKILL_BARS.map(s => (
            <SkillBar key={s.label} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
