import { create } from 'zustand';

/**
 * Global UI/experience state (Zustand).
 * Phase 1 establishes the shape; sections and the WebGL layer subscribe to
 * these slices from Phase 4 onward (loading gate, active section, scroll, menu).
 */
export const useStore = create((set) => ({
  // --- Loading / intro gate ---
  isLoaded: false,
  setLoaded: (isLoaded) => set({ isLoaded }),

  loadProgress: 0,
  setLoadProgress: (loadProgress) => set({ loadProgress }),

  // --- Navigation ---
  activeSection: 'hero',
  setActiveSection: (activeSection) => set({ activeSection }),

  isMenuOpen: false,
  toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),
  setMenuOpen: (isMenuOpen) => set({ isMenuOpen }),

  // --- Scroll ---
  scrollProgress: 0,
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),

  // --- Capability flags (set by Phase 9 perf audit) ---
  reducedMotion: false,
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));

export default useStore;
