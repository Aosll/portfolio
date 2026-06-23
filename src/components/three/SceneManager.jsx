import { useMemo } from 'react';
import { Vector2 } from 'three';
import { Canvas } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  Vignette,
} from '@react-three/postprocessing';

/**
 * SceneManager — Phase 4.1.
 *
 * Centralized R3F <Canvas> that every section's 3D environment mounts into.
 * Renders transparent (alpha) so the CSS background shows through, runs a shared
 * post-processing stack (bloom → chromatic aberration → vignette), and forwards
 * `children`, `className` and `style` so each section can size/position it.
 *
 * The hosting element should be `position: relative`; by default the canvas
 * fills it (absolute inset 0), overridable via the `style` prop.
 */
export default function SceneManager({ children, className, style }) {
  // ChromaticAberration's offset becomes a Vector2 shader uniform — give it a
  // real Vector2 (an array would break the uniform).
  const caOffset = useMemo(() => new Vector2(0.001, 0.001), []);

  const canvasStyle = useMemo(
    () => ({ position: 'absolute', inset: 0, ...style }),
    [style]
  );

  return (
    <Canvas
      className={className}
      style={canvasStyle}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      camera={{ fov: 60, near: 0.1, far: 1000, position: [0, 0, 5] }}
    >
      {children}

      <EffectComposer>
        <Bloom intensity={1.2} luminanceThreshold={0.5} />
        <ChromaticAberration offset={caOffset} />
        <Vignette darkness={0.4} />
      </EffectComposer>
    </Canvas>
  );
}
