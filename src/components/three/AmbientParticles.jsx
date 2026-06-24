import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { AdditiveBlending, Color } from 'three';

import { COLORS_HEX } from '@utils/colors';
import { useStore } from '@/store/useStore';
import particlesVert from '@shaders/particles.vert';
import particlesFrag from '@shaders/particles.frag';

const COUNT = 4000;
const RADIUS = 40;

/**
 * AmbientParticles — Phase 4.2.
 *
 * A global field of 4000 GPU points scattered through a sphere (radius 40),
 * drawn with a custom shader: per-particle twinkle + distance-based sizing in
 * the vertex stage, soft radial sprites in the fragment stage. Colors are a mix
 * of accent-blue / accent-cyan / white. The field rotates slowly every frame
 * and drifts with scroll. Rendered as Points (not Mesh) for performance.
 *
 * Mount inside a <SceneManager> Canvas.
 */
export default function AmbientParticles() {
  const pointsRef = useRef(null);
  const materialRef = useRef(null);
  const { gl } = useThree();

  // Static geometry buffers: positions inside the sphere + per-particle colors.
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(COUNT * 3);
    const col = new Float32Array(COUNT * 3);
    const palette = [
      new Color(COLORS_HEX.accentBlue),
      new Color(COLORS_HEX.accentCyan),
      new Color(0xffffff),
    ];

    for (let i = 0; i < COUNT; i += 1) {
      // Even-ish distribution inside a sphere (cbrt keeps it from clustering).
      const r = RADIUS * Math.cbrt(Math.random());
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const sinPhi = Math.sin(phi);

      pos[i * 3 + 0] = r * sinPhi * Math.cos(theta);
      pos[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3 + 0] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    return [pos, col];
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScroll: { value: 0 },
      uPixelRatio: { value: Math.min(gl.getPixelRatio(), 2) },
      uColor: { value: new Color(0xffffff) },
    }),
    [gl]
  );

  useFrame((state) => {
    const points = pointsRef.current;
    if (points) {
      points.rotation.x += 0.0003;
      points.rotation.y += 0.0005;
    }
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      materialRef.current.uniforms.uScroll.value = useStore.getState().scrollProgress;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aColor" args={[colors, 3]} />
      </bufferGeometry>
      <shaderMaterial
        ref={materialRef}
        vertexShader={particlesVert}
        fragmentShader={particlesFrag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
        blending={AdditiveBlending}
      />
    </points>
  );
}
