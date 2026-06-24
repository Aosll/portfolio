import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { AdditiveBlending, Color, Object3D, Vector3 } from 'three';

import { COLORS } from '@utils/colors';

const FIRE_INTERVAL = 2; // seconds between random activations
const BOUND = 10; // nodes scattered in ±10 units

// Edge shader: each vertex carries its node's color + a progress coord (0 at one
// endpoint, 1 at the other) and a per-edge phase offset. A bright pulse rides
// along each edge driven by uTime; the base color comes from the firing nodes.
const lineVertex = /* glsl */ `
  attribute vec3 aColor;
  attribute float aProgress;
  attribute float aOffset;
  varying vec3 vColor;
  varying float vProgress;
  varying float vOffset;
  void main() {
    vColor = aColor;
    vProgress = aProgress;
    vOffset = aOffset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const lineFragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec3 vColor;
  varying float vProgress;
  varying float vOffset;
  void main() {
    float pulsePos = fract(uTime * 0.4 + vOffset);
    float d = abs(vProgress - pulsePos);
    float pulse = smoothstep(0.07, 0.0, d);
    vec3 col = vColor + vColor * pulse * 2.5;
    float alpha = 0.10 + pulse * 0.5 + length(vColor) * 0.25;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

/**
 * NeuralNetwork — Phase 4.3.
 *
 * A 3D graph of glowing nodes (instanced emissive spheres) wired by edges
 * (LineSegments) within a distance threshold. Pulses travel along the edges via
 * a time uniform, and every 2s a random node "fires": its activation bleeds to
 * neighbors and decays, propagating color along the graph (cyan → blue → dim).
 *
 * Used by the Hero and Skills sections; mount inside a <SceneManager> Canvas.
 */
export default function NeuralNetwork({
  nodeCount = 60,
  connectionThreshold = 4.5,
  colorPrimary = COLORS.accentCyan,
  colorSecondary = COLORS.accentBlue,
  animated = true,
}) {
  const meshRef = useRef(null);
  const lineGeoRef = useRef(null);
  const lineMatRef = useRef(null);
  const fireTimer = useRef(0);

  const primary = useMemo(() => new Color(colorPrimary), [colorPrimary]);
  const secondary = useMemo(() => new Color(colorSecondary), [colorSecondary]);
  const tmp = useMemo(() => new Color(), []);
  const uniforms = useMemo(() => ({ uTime: { value: 0 } }), []);

  // Node positions, edge list (within threshold), and the buffers that back the
  // LineSegments geometry. Recomputed only when topology props change.
  const graph = useMemo(() => {
    const nodes = [];
    for (let i = 0; i < nodeCount; i += 1) {
      nodes.push(
        new Vector3(
          (Math.random() * 2 - 1) * BOUND,
          (Math.random() * 2 - 1) * BOUND,
          (Math.random() * 2 - 1) * BOUND
        )
      );
    }

    const edges = [];
    const adjacency = Array.from({ length: nodeCount }, () => []);
    for (let i = 0; i < nodeCount; i += 1) {
      for (let j = i + 1; j < nodeCount; j += 1) {
        if (nodes[i].distanceTo(nodes[j]) < connectionThreshold) {
          edges.push([i, j]);
          adjacency[i].push(j);
          adjacency[j].push(i);
        }
      }
    }

    const ne = edges.length;
    const edgePositions = new Float32Array(ne * 6);
    const edgeColors = new Float32Array(ne * 6);
    const edgeProgress = new Float32Array(ne * 2);
    const edgeOffsets = new Float32Array(ne * 2);

    edges.forEach(([a, b], e) => {
      const na = nodes[a];
      const nb = nodes[b];
      edgePositions.set([na.x, na.y, na.z, nb.x, nb.y, nb.z], e * 6);
      edgeProgress[e * 2] = 0;
      edgeProgress[e * 2 + 1] = 1;
      const off = Math.random();
      edgeOffsets[e * 2] = off;
      edgeOffsets[e * 2 + 1] = off;
    });

    return { nodes, edges, adjacency, edgePositions, edgeColors, edgeProgress, edgeOffsets };
  }, [nodeCount, connectionThreshold]);

  const activation = useMemo(() => new Float32Array(nodeCount), [nodeCount]);

  // Color a node/edge endpoint by its activation: dim blue at rest → bright cyan
  // when firing. Returns the shared `tmp` color (read it immediately).
  const colorFor = (a) => tmp.copy(secondary).lerp(primary, a).multiplyScalar(0.25 + 0.95 * a);

  // Seed instance matrices + initial (dim) colors for nodes and edges.
  useEffect(() => {
    const mesh = meshRef.current;
    if (mesh) {
      const dummy = new Object3D();
      graph.nodes.forEach((n, i) => {
        dummy.position.copy(n);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
        mesh.setColorAt(i, colorFor(0));
      });
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    const geo = lineGeoRef.current;
    if (geo) {
      const colAttr = geo.getAttribute('aColor');
      const dim = colorFor(0);
      for (let e = 0; e < graph.edges.length; e += 1) {
        colAttr.array.set([dim.r, dim.g, dim.b, dim.r, dim.g, dim.b], e * 6);
      }
      colAttr.needsUpdate = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [graph, primary, secondary]);

  useFrame((state, delta) => {
    if (lineMatRef.current) {
      lineMatRef.current.uniforms.uTime.value = animated ? state.clock.elapsedTime : 0;
    }
    if (!animated) return;

    // Fire a random node every FIRE_INTERVAL seconds.
    fireTimer.current += delta;
    if (fireTimer.current >= FIRE_INTERVAL) {
      fireTimer.current = 0;
      activation[Math.floor(Math.random() * nodeCount)] = 1;
    }

    // Bleed activation outward along edges, then decay everything.
    for (let i = 0; i < nodeCount; i += 1) {
      const a = activation[i];
      if (a > 0.05) {
        for (const j of graph.adjacency[i]) {
          if (activation[j] < a) activation[j] = Math.min(1, activation[j] + a * 0.04);
        }
      }
    }
    for (let i = 0; i < nodeCount; i += 1) activation[i] *= 0.97;

    // Push node colors.
    const mesh = meshRef.current;
    if (mesh) {
      for (let i = 0; i < nodeCount; i += 1) mesh.setColorAt(i, colorFor(activation[i]));
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }

    // Push edge endpoint colors so activation visibly travels along edges.
    const geo = lineGeoRef.current;
    if (geo) {
      const arr = geo.getAttribute('aColor').array;
      graph.edges.forEach(([a, b], e) => {
        const ca = colorFor(activation[a]);
        arr[e * 6 + 0] = ca.r;
        arr[e * 6 + 1] = ca.g;
        arr[e * 6 + 2] = ca.b;
        const cb = colorFor(activation[b]);
        arr[e * 6 + 3] = cb.r;
        arr[e * 6 + 4] = cb.g;
        arr[e * 6 + 5] = cb.b;
      });
      geo.getAttribute('aColor').needsUpdate = true;
    }
  });

  return (
    <group>
      <instancedMesh ref={meshRef} args={[undefined, undefined, nodeCount]}>
        <sphereGeometry args={[0.06, 10, 10]} />
        <meshBasicMaterial toneMapped={false} />
      </instancedMesh>

      <lineSegments>
        <bufferGeometry ref={lineGeoRef}>
          <bufferAttribute attach="attributes-position" args={[graph.edgePositions, 3]} />
          <bufferAttribute attach="attributes-aColor" args={[graph.edgeColors, 3]} />
          <bufferAttribute attach="attributes-aProgress" args={[graph.edgeProgress, 1]} />
          <bufferAttribute attach="attributes-aOffset" args={[graph.edgeOffsets, 1]} />
        </bufferGeometry>
        <shaderMaterial
          ref={lineMatRef}
          vertexShader={lineVertex}
          fragmentShader={lineFragment}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}
