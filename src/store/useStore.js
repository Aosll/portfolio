import { create } from 'zustand';

/**
 * Global UI / experience state (Zustand).
 *
 * Shape defined in Phase 1.4. Sections, navigation and the WebGL layer
 * subscribe to these slices from Phase 3 onward.
 */
export const useStore = create((set) => ({
  // --- State ---
  currentSection: 'hero', // active section ID
  scrollProgress: 0, // 0–1 overall page progress
  isMenuOpen: false,
  isLoading: true, // intro/loader gate — starts true
  loadingProgress: 0, // 0–100
  activeProject: null, // project ID currently focused, or null
  isMobile: typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches,
  heroExit: 0, // 0→1 progress of the Hero pin/exit transition (Phase 5.3)

  // --- Actions ---
  setCurrentSection: (currentSection) => set({ currentSection }),
  setScrollProgress: (scrollProgress) => set({ scrollProgress }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setLoadingProgress: (loadingProgress) => set({ loadingProgress }),
  setActiveProject: (activeProject) => set({ activeProject }),
  setIsMobile: (isMobile) => set({ isMobile }),
  setHeroExit: (heroExit) => set({ heroExit }),
}));

export default useStore;
