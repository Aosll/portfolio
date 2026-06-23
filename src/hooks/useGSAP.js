/**
 * useGSAP — Phase 1 re-export stub.
 *
 * The project depends on the official @gsap/react hook. We re-export it here so
 * the rest of the codebase imports from a single internal path (@hooks/useGSAP),
 * letting Phase 3 layer in ScrollTrigger defaults without touching call sites.
 */
import { useGSAP } from '@gsap/react';

export { useGSAP };
export default useGSAP;
