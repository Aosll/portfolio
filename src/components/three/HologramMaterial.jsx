import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Color, DoubleSide } from 'three';

import { COLORS } from '@utils/colors';
import hologramVert from '@shaders/hologram.vert';
import hologramFrag from '@shaders/hologram.frag';

/**
 * HologramMaterial — Phase 4.4.
 *
 * Wrapper around the hologram shader (vertex ripple + fresnel rim, scanlines,
 * flicker, premultiplied-alpha transparency). Drop it in as a mesh's material:
 *
 *   <mesh>
 *     <icosahedronGeometry args={[1.4, 1]} />
 *     <HologramMaterial colorA={...} colorB={...} />
 *   </mesh>
 *
 * Drives its own `uTime`; mount inside a <SceneManager> Canvas.
 */
export default function HologramMaterial({
  colorA = COLORS.accentCyan,
  colorB = COLORS.accentPurple,
  side = DoubleSide,
  ...props
}) {
  const ref = useRef(null);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorA: { value: new Color(colorA) },
      uColorB: { value: new Color(colorB) },
    }),
    // colors are kept in sync via the effect below; init once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    uniforms.uColorA.value.set(colorA);
    uniforms.uColorB.value.set(colorB);
  }, [colorA, colorB, uniforms]);

  useFrame((state) => {
    if (ref.current) ref.current.uniforms.uTime.value = state.clock.elapsedTime;
  });

  return (
    <shaderMaterial
      ref={ref}
      vertexShader={hologramVert}
      fragmentShader={hologramFrag}
      uniforms={uniforms}
      transparent
      premultipliedAlpha
      depthWrite={false}
      side={side}
      {...props}
    />
  );
}
