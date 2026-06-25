import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { COLORS_HEX } from '@utils/colors';
import GlassPanel from '@components/ui/GlassPanel';

import styles from './IlterAkkeProject.module.css';

// ─── Accent ──────────────────────────────────────────────────────────────────

const ACCENT     = '#5eead4';
const ACCENT_HEX = 0x5eead4;

// ─── 3D Scene ────────────────────────────────────────────────────────────────

// Glove proxy: animated TorusKnot with wireframe + glow edges
function GloveProxy() {
  const meshRef = useRef(null);
  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += dt * 0.4;
      meshRef.current.rotation.x = Math.sin(Date.now() * 0.0005) * 0.2;
    }
  });
  return (
    <mesh ref={meshRef} position={[0, 0.3, 0]}>
      <torusKnotGeometry args={[0.9, 0.28, 128, 16]} />
      <meshBasicMaterial color={ACCENT_HEX} wireframe />
    </mesh>
  );
}

// Finger sensor nodes: 5 orbiting spheres emitting data streams
function SensorNodes() {
  const groupRef = useRef(null);
  const streamRefs = useRef([]);

  const positions = useMemo(() =>
    Array.from({ length: 5 }, (_, i) => {
      const angle = (i / 5) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 1.9, Math.sin(angle * 0.5) * 0.6, Math.sin(angle) * 1.9);
    }), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.25;

    // Animate stream particles along lines toward center
    streamRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const progress = ((t * 0.6 + i * 0.2) % 1);
      const pos = positions[i];
      mesh.position.set(
        pos.x * (1 - progress),
        pos.y * (1 - progress),
        pos.z * (1 - progress)
      );
      mesh.material.opacity = progress < 0.85 ? 0.9 : 1 - (progress - 0.85) / 0.15;
    });
  });

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <group key={i}>
          {/* Sensor node sphere */}
          <mesh position={pos}>
            <sphereGeometry args={[0.09, 12, 12]} />
            <meshBasicMaterial color={ACCENT_HEX} />
          </mesh>

          {/* Connection line to center */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([pos.x, pos.y, pos.z, 0, 0, 0]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={ACCENT_HEX} opacity={0.25} transparent />
          </line>

          {/* Data stream particle */}
          <mesh ref={el => { streamRefs.current[i] = el; }}>
            <sphereGeometry args={[0.045, 8, 8]} />
            <meshBasicMaterial color={0x00ffff} transparent opacity={0.9} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// ESP32 chip: flat glowing box
function ESP32Chip() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.position.y = -1.5 + Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
    }
  });
  return (
    <group ref={ref} position={[0, -1.5, 0]}>
      <mesh>
        <boxGeometry args={[1.1, 0.12, 0.7]} />
        <meshBasicMaterial color={0x1a3a2a} />
      </mesh>
      {/* Glowing edge outline */}
      <mesh>
        <boxGeometry args={[1.12, 0.14, 0.72]} />
        <meshBasicMaterial color={ACCENT_HEX} wireframe opacity={0.6} transparent />
      </mesh>
      {/* ESP32 label approximation: small chips */}
      {[-0.3, 0, 0.3].map((x, i) => (
        <mesh key={i} position={[x, 0.08, 0]}>
          <boxGeometry args={[0.18, 0.04, 0.12]} />
          <meshBasicMaterial color={ACCENT_HEX} opacity={0.5} transparent />
        </mesh>
      ))}
    </group>
  );
}

// WiFi / ESP-NOW rings
function WiFiRings() {
  const ringsRef = useRef([]);
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    ringsRef.current.forEach((ring, i) => {
      if (!ring) return;
      const phase = (t * 0.5 + i * 0.33) % 1;
      ring.scale.setScalar(0.6 + phase * 1.4);
      ring.material.opacity = 0.35 * (1 - phase);
    });
  });
  return (
    <group position={[0, -1.5, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} ref={el => { ringsRef.current[i] = el; }} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.7, 0.72, 48]} />
          <meshBasicMaterial color={ACCENT_HEX} transparent opacity={0.3} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

// Floating gesture icon planes
function GestureIcons() {
  const iconsRef = useRef([]);
  const icons = useMemo(() => [
    { pos: [-1.8, 1.4, 0.5], label: '✊' },
    { pos: [ 1.8, 1.2, 0.3], label: '✋' },
    { pos: [ 0,   2.0, -0.5], label: '👆' },
  ], []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    iconsRef.current.forEach((g, i) => {
      if (!g) return;
      g.position.y = icons[i].pos[1] + Math.sin(t * 0.7 + i * 1.2) * 0.12;
    });
  });

  return (
    <>
      {icons.map((icon, i) => (
        <group key={i} ref={el => { iconsRef.current[i] = el; }} position={icon.pos}>
          <mesh>
            <planeGeometry args={[0.4, 0.4]} />
            <meshBasicMaterial color={ACCENT_HEX} opacity={0.15} transparent side={THREE.DoubleSide} />
          </mesh>
          {/* Border */}
          <lineSegments>
            <edgesGeometry args={[new THREE.PlaneGeometry(0.4, 0.4)]} />
            <lineBasicMaterial color={ACCENT_HEX} opacity={0.5} transparent />
          </lineSegments>
        </group>
      ))}
    </>
  );
}

function IlterAkkeScene() {
  return (
    <>
      <fog attach="fog" args={[COLORS_HEX.bgPrimary, 5, 14]} />
      <ambientLight intensity={0.1} />
      <GloveProxy />
      <SensorNodes />
      <ESP32Chip />
      <WiFiRings />
      <GestureIcons />
    </>
  );
}

// ─── Architecture step card ───────────────────────────────────────────────────

const ARCH_STEPS = [
  { icon: '⬡', label: 'ESP32 MCU' },
  { icon: '◈', label: 'TinyML Engine' },
  { icon: '◉', label: 'Gesture Model' },
  { icon: '≋', label: 'ESP-NOW' },
  { icon: '▶', label: 'Command Output' },
];

const METRICS = [
  'On-device inference: <50ms latency',
  'TensorFlow Lite model: validated accuracy threshold',
  'ESP-NOW wireless: sub-10ms transmission',
  'Edge Impulse pipeline: collect → train → deploy',
];

const SUMMARY =
  'A 4-person senior project: an ESP32 wearable glove that classifies hand gestures on-device and sends commands over ESP-NOW. Ömer led the AI side, from dataset preparation through TinyML model training and validation.';

const TAGS = ['ESP32', 'TinyML', 'TensorFlow Lite', 'Edge Impulse', 'ESP-NOW', 'Embedded C', 'Python'];

// ─── Main export ──────────────────────────────────────────────────────────────

export default function IlterAkkeProject({ isActive = true }) {
  return (
    <div className={styles.root}>
      {/* Left: content panel */}
      <GlassPanel variant="intense" className={styles.panel}>
        <div className={styles.roleBadge}>AI LEAD — 4-Person Team</div>

        <h2 className={styles.title}>ILTER-AKKE</h2>
        <p className={styles.subtitle}>Smart Command &amp; Control Glove</p>
        <p className={styles.summary}>{SUMMARY}</p>

        {/* Architecture flow */}
        <div className={styles.archRow}>
          {ARCH_STEPS.map((step, i) => (
            <div key={step.label} className={styles.archStep}>
              <div className={styles.archCard}>
                <span className={styles.archIcon}>{step.icon}</span>
                <span className={styles.archLabel}>{step.label}</span>
              </div>
              {i < ARCH_STEPS.length - 1 && (
                <span className={styles.archArrow}>→</span>
              )}
            </div>
          ))}
        </div>

        {/* Metrics */}
        <ul className={styles.metrics}>
          {METRICS.map(m => (
            <li key={m} className={styles.metric}>
              <span className={styles.metricDot} />
              {m}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className={styles.tagRow}>
          {TAGS.map(t => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>

        {/* GitHub */}
        <a
          href="https://github.com/ILTER-AKKE/AKKE-Smart-Command-Control-Glove"
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
          frameloop={isActive ? 'always' : 'never'}
          camera={{ fov: 55, position: [0, 0.5, 5.5] }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 1.5]}
          style={{ width: '100%', height: '100%' }}
        >
          <IlterAkkeScene />
        </Canvas>
      </div>
    </div>
  );
}
