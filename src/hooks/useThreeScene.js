import { useRef } from 'react';

/**
 * useThreeScene — Phase 1 stub (implemented in Phase 4: WebGL scene engine).
 * Will provide shared scene context (camera rig, clock, pointer) to 3D layers.
 */
export function useThreeScene() {
  const sceneRef = useRef(null);

  // Phase 4 returns the live scene manager handle.
  return sceneRef;
}

export default useThreeScene;
