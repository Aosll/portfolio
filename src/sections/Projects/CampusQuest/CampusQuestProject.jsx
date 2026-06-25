import { useRef, useMemo } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { COLORS_HEX } from '@utils/colors';
import GlassPanel from '@components/ui/GlassPanel';

import styles from './CampusQuestProject.module.css';

// ─── Accent ──────────────────────────────────────────────────────────────────

const ACCENT_HEX = 0x818cf8; // indigo-400

// ─── iPhone 15 Pro mockup ────────────────────────────────────────────────────

function PhoneMockup() {
  const phoneRef = useRef(null);
  const screenRef = useRef(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (phoneRef.current) {
      phoneRef.current.rotation.y = Math.sin(t * 0.4) * 0.3;
      phoneRef.current.rotation.x = Math.sin(t * 0.25) * 0.08;
    }
    // Scrolling UI on screen: scroll UV offset
    if (screenRef.current?.material) {
      screenRef.current.material.color.setHex(0x0d0d1a);
    }
  });

  return (
    <group ref={phoneRef} position={[0, 0, 0]}>
      {/* Phone body */}
      <mesh castShadow>
        <boxGeometry args={[1.0, 2.1, 0.09]} />
        <meshBasicMaterial color={0x1c1c1e} />
      </mesh>
      {/* Titanium frame edges */}
      <mesh>
        <boxGeometry args={[1.02, 2.12, 0.092]} />
        <meshBasicMaterial color={ACCENT_HEX} wireframe opacity={0.3} transparent />
      </mesh>
      {/* Screen surface */}
      <mesh ref={screenRef} position={[0, 0, 0.048]}>
        <planeGeometry args={[0.88, 1.9]} />
        <meshBasicMaterial color={0x0d0d1a} />
      </mesh>
      {/* Screen glow lines (simulated app UI) */}
      {[-0.55, -0.25, 0.05, 0.35, 0.65].map((y, i) => (
        <mesh key={i} position={[0, y, 0.05]}>
          <planeGeometry args={[0.7, 0.06]} />
          <meshBasicMaterial
            color={i === 2 ? ACCENT_HEX : 0x4a5568}
            transparent
            opacity={i === 2 ? 0.9 : 0.35}
          />
        </mesh>
      ))}
      {/* Dynamic island */}
      <mesh position={[0, 0.88, 0.049]}>
        <capsuleGeometry args={[0.04, 0.12, 4, 8]} />
        <meshBasicMaterial color={0x000000} />
      </mesh>
      {/* Side buttons */}
      <mesh position={[0.52, 0.2, 0]}>
        <boxGeometry args={[0.025, 0.28, 0.06]} />
        <meshBasicMaterial color={0x2d2d2d} />
      </mesh>
    </group>
  );
}

// ─── App icon floating above phone ───────────────────────────────────────────

function AppIcon() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = 1.4 + Math.sin(state.clock.elapsedTime * 0.9) * 0.1;
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });
  return (
    <group ref={ref} position={[0, 1.4, 0]}>
      {/* Icon background */}
      <mesh>
        <boxGeometry args={[0.38, 0.38, 0.04]} />
        <meshBasicMaterial color={ACCENT_HEX} />
      </mesh>
      {/* Icon border glow */}
      <mesh>
        <boxGeometry args={[0.40, 0.40, 0.038]} />
        <meshBasicMaterial color={ACCENT_HEX} wireframe transparent opacity={0.5} />
      </mesh>
    </group>
  );
}

// ─── Word cards flying in/out ─────────────────────────────────────────────────

const WORDS = ['HELLO', 'MERHABA', 'BONJOUR', 'HOLA', 'HALLO', 'CORRECT!', 'SWIFT', 'QUIZ'];

function WordCards() {
  const cardsRef = useRef([]);

  const cards = useMemo(() => Array.from({ length: 5 }, (_, i) => ({
    wordIdx: i % WORDS.length,
    startX:  (Math.random() - 0.5) * 3.5,
    startY:  (Math.random() - 0.5) * 2.5,
    startZ:  -1 + Math.random() * 2,
    phase:   i / 5,
    speed:   0.3 + Math.random() * 0.2,
  })), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    cardsRef.current.forEach((card, i) => {
      if (!card) return;
      const cfg = cards[i];
      const ph  = (cfg.phase + t * cfg.speed) % 1;
      card.position.set(
        cfg.startX * (1 - ph * 0.5),
        cfg.startY + ph * 0.8,
        cfg.startZ
      );
      card.material.opacity = ph < 0.15 ? ph / 0.15 : ph > 0.8 ? (1 - ph) / 0.2 : 0.85;
    });
  });

  return (
    <>
      {cards.map((cfg, i) => (
        <mesh key={i} ref={el => { cardsRef.current[i] = el; }}>
          <planeGeometry args={[0.55, 0.22]} />
          <meshBasicMaterial
            color={cfg.wordIdx === 5 ? 0x22c55e : ACCENT_HEX}
            transparent
            opacity={0.85}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
}

// ─── 5 flag icons orbiting phone ─────────────────────────────────────────────

const FLAG_COLORS = [0xef4444, 0x4f8ef7, 0x000000, 0x3b82f6, 0xf59e0b];
const FLAG_LABELS = ['TR', 'EN', 'DE', 'FR', 'ES'];

function FlagOrbit() {
  const flagsRef = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    flagsRef.current.forEach((g, i) => {
      if (!g) return;
      const angle = t * 0.5 + (i / 5) * Math.PI * 2;
      g.position.set(Math.cos(angle) * 1.8, Math.sin(angle * 0.4) * 0.3 - 0.2, Math.sin(angle) * 1.8);
    });
  });

  return (
    <>
      {FLAG_LABELS.map((label, i) => (
        <group key={label} ref={el => { flagsRef.current[i] = el; }}>
          <mesh>
            <planeGeometry args={[0.28, 0.19]} />
            <meshBasicMaterial color={FLAG_COLORS[i]} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
          {/* Border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.28, 0.19)]} />
            <lineBasicMaterial color={0xffffff} transparent opacity={0.3} />
          </lineSegments>
        </group>
      ))}
    </>
  );
}

// ─── SwiftUI code snippets (hologram planes) ─────────────────────────────────

const SNIPPETS = [
  { pos: [-2.2, 0.8,  0.5] },
  { pos: [ 2.1, 0.3, -0.4] },
  { pos: [-1.8, -0.9, 0.2] },
];

function CodeSnippets() {
  const snippetsRef = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    snippetsRef.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = SNIPPETS[i].pos[1] + Math.sin(t * 0.6 + i * 1.3) * 0.1;
      g.material.opacity = 0.2 + Math.sin(t * 0.8 + i) * 0.1;
    });
  });

  return (
    <>
      {SNIPPETS.map((s, i) => (
        <mesh key={i} ref={el => { snippetsRef.current[i] = el; }} position={s.pos}>
          <planeGeometry args={[0.9, 0.5]} />
          <meshBasicMaterial color={ACCENT_HEX} transparent opacity={0.22} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Code lines on snippets */}
      {SNIPPETS.map((s, si) =>
        [0.12, 0, -0.12].map((dy, li) => (
          <mesh key={`${si}-${li}`} position={[s.pos[0], s.pos[1] + dy, s.pos[2] + 0.001]}>
            <planeGeometry args={[0.6 - li * 0.1, 0.025]} />
            <meshBasicMaterial color={li === 0 ? 0x00d4ff : 0x818cf8} transparent opacity={0.5} />
          </mesh>
        ))
      )}
    </>
  );
}

// ─── Particle burst on correct answer ────────────────────────────────────────

function CorrectBurst() {
  const particlesRef = useRef([]);
  const COUNT = 16;

  const angles = useMemo(() => Array.from({ length: COUNT }, (_, i) => (i / COUNT) * Math.PI * 2), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    particlesRef.current.forEach((p, i) => {
      if (!p) return;
      const burst = (t * 0.7 + i * 0.06) % 3; // burst every 3s
      const active = burst < 1;
      p.visible = active;
      if (active) {
        const r = burst * 1.2;
        p.position.set(Math.cos(angles[i]) * r, Math.sin(angles[i]) * r, 0.1);
        p.material.opacity = 1 - burst;
      }
    });
  });

  return (
    <>
      {angles.map((_, i) => (
        <mesh key={i} ref={el => { particlesRef.current[i] = el; }} position={[0, 0, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshBasicMaterial color={0x22c55e} transparent opacity={1} />
        </mesh>
      ))}
    </>
  );
}

// ─── Apple-style ambient glow ─────────────────────────────────────────────────

function AmbientGlow() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) ref.current.material.opacity = 0.06 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02;
  });
  return (
    <mesh ref={ref} position={[0, 0, -0.5]}>
      <planeGeometry args={[5, 5]} />
      <meshBasicMaterial color={ACCENT_HEX} transparent opacity={0.06} />
    </mesh>
  );
}

function CampusQuestScene() {
  return (
    <>
      <fog attach="fog" args={[COLORS_HEX.bgPrimary, 5, 16]} />
      <AmbientGlow />
      <PhoneMockup />
      <AppIcon />
      <WordCards />
      <FlagOrbit />
      <CodeSnippets />
      <CorrectBurst />
    </>
  );
}

// ─── Content data ─────────────────────────────────────────────────────────────

const HIGHLIGHTS = [
  'Built 100% in Swift + SwiftUI + SpriteKit',
  '5-Language localization: TR, EN, DE, FR, ES',
  'On-device storage: SwiftData (no backend)',
  'Game engine: SpriteKit physics + animations',
];

const SUMMARY =
  'A solo native iOS educational word game shipped end-to-end. It combines SwiftUI screens, SpriteKit game moments, SwiftData persistence and 5-language localization without a backend dependency.';

const FEATURES = [
  { icon: '🎮', title: 'Educational Word Games', desc: 'Vocabulary challenges with game mechanics' },
  { icon: '🌍', title: '5 Languages',            desc: 'TR · EN · DE · FR · ES fully localized'   },
  { icon: '💾', title: 'SwiftData Persistence',  desc: 'On-device storage, zero backend'           },
  { icon: '⚡', title: 'Native iOS Performance', desc: 'Pure Swift, 60fps SpriteKit rendering'    },
];

const TAGS = ['Swift', 'SwiftUI', 'SpriteKit', 'SwiftData', 'iOS'];

// ─── Main export ──────────────────────────────────────────────────────────────

export default function CampusQuestProject() {
  return (
    <div className={styles.root}>
      {/* Left: content */}
      <GlassPanel variant="intense" className={styles.panel}>
        <div className={styles.roleBadge}>SOLO PROJECT — Independently Shipped</div>

        <h2 className={styles.title}>CampusQuest <span className={styles.titleSub}>Academy</span></h2>
        <p className={styles.subtitle}>Native iOS Educational Word Game</p>
        <p className={styles.summary}>{SUMMARY}</p>

        {/* Highlights */}
        <ul className={styles.highlights}>
          {HIGHLIGHTS.map(h => (
            <li key={h} className={styles.highlight}>
              <span className={styles.highlightDot} />
              {h}
            </li>
          ))}
        </ul>

        {/* Feature grid */}
        <div className={styles.featureGrid}>
          {FEATURES.map(f => (
            <GlassPanel key={f.title} className={styles.featureCard}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <span className={styles.featureTitle}>{f.title}</span>
              <span className={styles.featureDesc}>{f.desc}</span>
            </GlassPanel>
          ))}
        </div>

        {/* Tags */}
        <div className={styles.tagRow}>
          {TAGS.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>

        {/* GitHub */}
        <a
          href="https://github.com/Aosll/CampusQuest"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.githubBtn}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          View on GitHub
        </a>
      </GlassPanel>

      {/* Right: 3D scene */}
      <div className={styles.scene}>
        <Canvas
          camera={{ fov: 50, position: [0, 0.5, 5.5] }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
          style={{ width: '100%', height: '100%' }}
        >
          <CampusQuestScene />
        </Canvas>
      </div>
    </div>
  );
}
