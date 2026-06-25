import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

import { COLORS_HEX } from '@utils/colors';
import { useStore } from '@/store/useStore';
import NeuralNetwork from '@components/three/NeuralNetwork';
import HologramMaterial from '@components/three/HologramMaterial';
import AmbientParticles from '@components/three/AmbientParticles';

/**
 * HeroScene — Phase 5.2.
 *
 * The Hero's 3D environment: a neural network off to the right, three floating
 * primitives rotating on independent axes, a fog-faded ground grid for depth,
 * and the ambient particle field. The camera dollies back and tilts down as the
 * page scrolls. Mounted inside the Hero's <SceneManager> Canvas.
 */
export default function HeroScene() {
  const sceneRef = useRef(null);
  const particlesRef = useRef(null);
  const gridRef = useRef(null);
  const netRef = useRef(null);
  const icoRef = useRef(null);
  const octaRef = useRef(null);
  const torusRef = useRef(null);

  // Lighter scene on phones: fewer neural-net nodes (see AmbientParticles + the
  // SceneManager dpr clamp for the rest of the mobile budget).
  const isMobile = useStore((s) => s.isMobile);

  useFrame((state) => {
    const { scrollProgress: p, heroExit: exit } = useStore.getState();

    // Scroll-driven camera: dolly z 5 → 8, tilt x 0 → -0.1.
    const cam = state.camera;
    cam.position.z = 5 + p * 3;
    cam.rotation.x = p * -0.1;

    // Exit transition (Phase 5.3): scene scales down, particles contract toward
    // center, grid fades out.
    if (sceneRef.current) sceneRef.current.scale.setScalar(1 - exit * 0.3); // 1 → 0.7
    if (particlesRef.current) particlesRef.current.scale.setScalar(1 - exit * 0.8); // contract
    if (gridRef.current) {
      gridRef.current.material.transparent = true;
      gridRef.current.material.opacity = 1 - exit;
    }

    // Each element rotates slowly on its own axes.
    if (netRef.current) netRef.current.rotation.y += 0.0006;
    if (icoRef.current) {
      icoRef.current.rotation.x += 0.002;
      icoRef.current.rotation.y += 0.003;
    }
    if (octaRef.current) {
      octaRef.current.rotation.y += 0.004;
      octaRef.current.rotation.z += 0.002;
    }
    if (torusRef.current) {
      torusRef.current.rotation.z += 0.0015;
      torusRef.current.rotation.x += 0.001;
    }
  });

  return (
    <>
      {/* Linear fog → grid and wireframes fade out around distance 15. */}
      <fog attach="fog" args={[COLORS_HEX.bgPrimary, 6, 16]} />

      {/* Scene group — scales down on exit. */}
      <group ref={sceneRef}>
        {/* 1. Neural network — right side, scaled down, slowly rotating. */}
        <group ref={netRef} position={[6, 0, -2]} scale={0.8}>
          <NeuralNetwork nodeCount={isMobile ? 36 : 60} />
        </group>

        {/* 2. Floating geometric shapes. */}
        <mesh ref={icoRef} position={[4, 3, -2]}>
          <icosahedronGeometry args={[1.2, 0]} />
          <meshBasicMaterial color={COLORS_HEX.accentCyan} wireframe />
        </mesh>

        <mesh ref={octaRef} position={[-4, -2, 0]}>
          <octahedronGeometry args={[0.8, 0]} />
          <HologramMaterial />
        </mesh>

        <mesh ref={torusRef} position={[0, 0, -6]}>
          <torusGeometry args={[1.5, 0.28, 16, 60]} />
          <meshBasicMaterial color={COLORS_HEX.accentPurple} wireframe />
        </mesh>

        {/* 3. Ground grid for perspective depth (fades out on exit). */}
        <gridHelper
          ref={gridRef}
          args={[40, 40, COLORS_HEX.accentBlue, COLORS_HEX.accentBlue]}
          position={[0, -4, 0]}
        />
      </group>

      {/* 5. Ambient particle field — contracts toward center on exit. */}
      <group ref={particlesRef}>
        <AmbientParticles />
      </group>
    </>
  );
}
