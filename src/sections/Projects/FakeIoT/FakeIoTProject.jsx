import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame, Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import { COLORS_HEX } from '@utils/colors';
import GlassPanel from '@components/ui/GlassPanel';

import styles from './FakeIoTProject.module.css';

// ─── Constants ────────────────────────────────────────────────────────────────

const ACCENT      = '#f472b6';
const RED_HEX     = 0xef4444;
const GREEN_HEX   = 0x22c55e;
const CYAN_HEX    = 0x00d4ff;
const ATTACK_COUNT = 8;

// ─── Dark grid floor ──────────────────────────────────────────────────────────

function GridFloor() {
  return (
    <group position={[0, -1.8, 0]}>
      <gridHelper args={[16, 20, RED_HEX, 0x220000]} rotation={[0, 0, 0]} />
    </group>
  );
}

// ─── Central honeypot node (glowing green ESP32) ──────────────────────────────

function HoneypotNode({ onDetect }) {
  const meshRef   = useRef(null);
  const glowRef   = useRef(null);
  const flashRef  = useRef({ active: false, t: 0 });

  // Expose flash trigger via ref so AttackNodes can call it
  useEffect(() => {
    window.__fakeiotDetect = () => {
      flashRef.current = { active: true, t: 0 };
      onDetect?.();
    };
    return () => { delete window.__fakeiotDetect; };
  }, [onDetect]);

  useFrame((_, dt) => {
    const f = flashRef.current;
    if (f.active) {
      f.t += dt * 3;
      const brightness = Math.max(0, 1 - f.t);
      if (meshRef.current) meshRef.current.material.color.setHex(brightness > 0.1 ? 0xffffff : GREEN_HEX);
      if (f.t > 1) { f.active = false; f.t = 0; }
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(Date.now() * 0.002) * 0.12);
      glowRef.current.material.opacity = 0.12 + Math.sin(Date.now() * 0.002) * 0.05;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 16, 16]} />
        <meshBasicMaterial color={GREEN_HEX} transparent opacity={0.12} />
      </mesh>
      {/* Core */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color={GREEN_HEX} />
      </mesh>
      {/* Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.3, 0.32, 32]} />
        <meshBasicMaterial color={GREEN_HEX} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

// ─── Flask server: wireframe cylinder ────────────────────────────────────────

function FlaskServer() {
  const ref = useRef(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.3;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.7) * 0.08;
    }
  });
  return (
    <group ref={ref} position={[0, 0.55, 0]}>
      <mesh>
        <cylinderGeometry args={[0.18, 0.18, 0.55, 16, 1, true]} />
        <meshBasicMaterial color={CYAN_HEX} wireframe />
      </mesh>
      <mesh>
        <cylinderGeometry args={[0.185, 0.185, 0.56, 16]} />
        <meshBasicMaterial color={CYAN_HEX} transparent opacity={0.06} />
      </mesh>
    </group>
  );
}

// ─── Attack nodes (8 red spheres approaching) ────────────────────────────────

function AttackNodes() {
  const groupRef = useRef(null);
  const nodesRef = useRef([]);

  const origins = useMemo(() => Array.from({ length: ATTACK_COUNT }, (_, i) => {
    const angle = (i / ATTACK_COUNT) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(angle) * 5.5, (Math.random() - 0.5) * 2, Math.sin(angle) * 5.5);
  }), []);

  const phases = useMemo(() => Array.from({ length: ATTACK_COUNT }, (_, i) => i / ATTACK_COUNT), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    nodesRef.current.forEach((node, i) => {
      if (!node) return;
      const phase   = (phases[i] + t * 0.18) % 1;
      const origin  = origins[i];
      node.position.set(
        origin.x * (1 - phase),
        origin.y * (1 - phase),
        origin.z * (1 - phase)
      );
      // Flash detection near center
      if (phase > 0.92) {
        window.__fakeiotDetect?.();
      }
      node.material.opacity = phase > 0.88 ? 1 - (phase - 0.88) / 0.12 : 1;
    });
  });

  return (
    <group ref={groupRef}>
      {origins.map((origin, i) => (
        <group key={i}>
          {/* Attacker sphere */}
          <mesh ref={el => { nodesRef.current[i] = el; }}>
            <sphereGeometry args={[0.1, 10, 10]} />
            <meshBasicMaterial color={RED_HEX} transparent opacity={1} />
          </mesh>

          {/* Dashed attack vector (static line; animation implied by moving sphere) */}
          <line>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[new Float32Array([origin.x, origin.y, origin.z, 0, 0, 0]), 3]}
              />
            </bufferGeometry>
            <lineBasicMaterial color={RED_HEX} opacity={0.18} transparent />
          </line>
        </group>
      ))}
    </group>
  );
}

// ─── Network packets: small cubes on paths ────────────────────────────────────

function NetworkPackets() {
  const packetsRef = useRef([]);
  const COUNT = 12;

  const paths = useMemo(() => Array.from({ length: COUNT }, (_, i) => {
    const angle = (i / COUNT) * Math.PI * 2;
    const r = 1.4 + (i % 3) * 0.4;
    return new THREE.Vector3(Math.cos(angle) * r, (Math.sin(i) * 0.5), Math.sin(angle) * r);
  }), []);

  const phases = useMemo(() => Array.from({ length: COUNT }, (_, i) => i / COUNT), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    packetsRef.current.forEach((mesh, i) => {
      if (!mesh) return;
      const p   = paths[i];
      const ph  = (phases[i] + t * 0.35) % 1;
      mesh.position.set(p.x * (1 - ph), p.y * (1 - ph), p.z * (1 - ph));
      mesh.rotation.x += 0.04;
      mesh.rotation.y += 0.06;
    });
  });

  return (
    <>
      {paths.map((_, i) => (
        <mesh key={i} ref={el => { packetsRef.current[i] = el; }}>
          <boxGeometry args={[0.055, 0.055, 0.055]} />
          <meshBasicMaterial color={i % 2 === 0 ? CYAN_HEX : RED_HEX} transparent opacity={0.75} />
        </mesh>
      ))}
    </>
  );
}

function FakeIoTScene() {
  return (
    <>
      <fog attach="fog" args={[COLORS_HEX.bgPrimary, 5, 18]} />
      <GridFloor />
      <HoneypotNode />
      <FlaskServer />
      <AttackNodes />
      <NetworkPackets />
    </>
  );
}

// ─── Scrolling terminal log ───────────────────────────────────────────────────

const LOG_LINES = [
  { t: 'WARN',  m: '[192.168.1.47] SSH brute-force detected — 240 attempts'   },
  { t: 'INFO',  m: 'Nmap SYN scan from 10.0.0.23 — ports 22, 80, 443'        },
  { t: 'ALERT', m: 'Hydra credential attack — user:root pass:admin123'        },
  { t: 'INFO',  m: 'Wireshark capture: 1.2 MB TCP stream logged'              },
  { t: 'WARN',  m: '[10.0.0.91] ARP spoof attempt on subnet'                  },
  { t: 'ALERT', m: 'Login attempt — user:pi pass:raspberry'                   },
  { t: 'INFO',  m: 'Flask API /status — 200 OK (honeypot response sent)'      },
  { t: 'WARN',  m: '[172.16.0.4] Port scan: 4096 ports in 0.8s'              },
  { t: 'ALERT', m: 'Credential dump — 14 unique pairs captured'               },
  { t: 'INFO',  m: 'ESP32 heartbeat OK — uptime 14h 32m'                      },
];

function TerminalLog({ isActive = true }) {
  const [lines, setLines] = useState(LOG_LINES.slice(0, 5));
  useEffect(() => {
    if (!isActive) return undefined;
    let idx = 5;
    const id = setInterval(() => {
      setLines(prev => {
        const next = [...prev.slice(-7), LOG_LINES[idx % LOG_LINES.length]];
        idx++;
        return next;
      });
    }, 1800);
    return () => clearInterval(id);
  }, [isActive]);

  return (
    <div className={styles.terminal} aria-label="Attack log">
      <div className={styles.terminalBar}>
        <span className={styles.terminalDot} style={{ background: '#ef4444' }} />
        <span className={styles.terminalDot} style={{ background: '#f59e0b' }} />
        <span className={styles.terminalDot} style={{ background: '#22c55e' }} />
        <span className={styles.terminalTitle}>honeypot.log</span>
      </div>
      <div className={styles.terminalBody}>
        {lines.map((line, i) => (
          <div key={i} className={`${styles.logLine} ${i === lines.length - 1 ? styles.logLineNew : ''}`}>
            <span className={`${styles.logTag} ${styles[`logTag${line.t}`]}`}>[{line.t}]</span>
            <span className={styles.logMsg}>{line.m}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Content data ─────────────────────────────────────────────────────────────

const ARCH = [
  [
    { icon: '⬡', label: 'ESP32 Device' },
    { icon: '⬢', label: 'Flask API'    },
    { icon: '▦', label: 'Log Engine'   },
  ],
  [
    { icon: '◈', label: 'Kali Linux'    },
    { icon: '⬡', label: 'Nmap/Hydra'   },
    { icon: '≋', label: 'Attack Traffic'},
  ],
];

const OUTCOMES = [
  'Successfully captured and logged brute-force attacks',
  'Nmap scan detection via packet analysis',
  'Hydra attack patterns identified and classified',
  'Wireshark traffic capture integrated',
];

const SUMMARY =
  'An ESP32-based IoT honeypot with a Flask pipeline. Ömer led security testing and validation, using Kali Linux tooling to simulate attacker behavior and verify what the platform captured.';

const TAGS = ['ESP32', 'Flask', 'Python', 'Kali Linux', 'Nmap', 'Hydra', 'Wireshark', 'TCP/IP'];

// ─── Main export ──────────────────────────────────────────────────────────────

export default function FakeIoTProject({ isActive = true }) {
  return (
    <div className={styles.root}>
      {/* Left: content */}
      <GlassPanel variant="intense" className={styles.panel}>
        <div className={styles.roleBadge}>SECURITY LEAD — Personal Contribution</div>

        <h2 className={styles.title}>FakeIoT<span className={styles.titleAccent}>Honeypot</span></h2>
        <p className={styles.subtitle}>IoT Deception &amp; Security Testing Platform</p>
        <p className={styles.summary}>{SUMMARY}</p>

        {/* Architecture */}
        <div className={styles.archBlock}>
          {ARCH.map((row, ri) => (
            <div key={ri} className={styles.archRow}>
              {row.map((step, si) => (
                <div key={step.label} className={styles.archStep}>
                  <div className={styles.archCard}>
                    <span className={styles.archIcon}>{step.icon}</span>
                    <span className={styles.archLabel}>{step.label}</span>
                  </div>
                  {si < row.length - 1 && <span className={styles.archArrow}>→</span>}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Outcomes */}
        <ul className={styles.outcomes}>
          {OUTCOMES.map(o => (
            <li key={o} className={styles.outcome}>
              <span className={styles.outcomeDot} />
              {o}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div className={styles.tagRow}>
          {TAGS.map(t => <span key={t} className={styles.tag}>{t}</span>)}
        </div>

        {/* GitHub */}
        <a
          href="https://github.com/FakeIoTHoneypot/FakeIoTHoneypot"
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

      {/* Right: 3D + terminal */}
      <div className={styles.right}>
        <div className={styles.scene}>
          <Canvas
            frameloop={isActive ? 'always' : 'never'}
            camera={{ fov: 55, position: [0, 2.5, 7] }}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
            dpr={[1, 1.5]}
            style={{ width: '100%', height: '100%' }}
          >
            <FakeIoTScene />
          </Canvas>
        </div>
        <TerminalLog isActive={isActive} />
      </div>
    </div>
  );
}
