import { useEffect, useState } from 'react';
import { useThree } from '@react-three/fiber';

/**
 * useThreeScene — Phase 4.1.
 *
 * Reports scene mount state and exposes the live camera + renderer. Must be
 * called from inside the <SceneManager> Canvas tree (it reads R3F context);
 * `isReady` flips true once the camera and WebGL renderer exist.
 *
 * @returns {{ isReady: boolean, camera: import('three').Camera, renderer: import('three').WebGLRenderer }}
 */
export function useThreeScene() {
  const camera = useThree((state) => state.camera);
  const renderer = useThree((state) => state.gl);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (camera && renderer) setIsReady(true);
  }, [camera, renderer]);

  return { isReady, camera, renderer };
}

export default useThreeScene;
