import { useEffect, Suspense, lazy } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLenis } from '@hooks/useLenis';
import { useScrollProgress } from '@hooks/useScrollProgress';
import { useStore } from '@/store/useStore';

import Navbar from '@components/navigation/Navbar';
import ScrollProgress from '@components/ui/ScrollProgress';
import LoadingScreen from '@components/ui/LoadingScreen';

// Hero stays eager — it's the first thing the user sees.
import HeroSection from '@sections/Hero/HeroSection';

// All other sections lazy-load so they don't block the initial bundle.
const AboutSection       = lazy(() => import('@sections/About/AboutSection'));
const SkillsSection      = lazy(() => import('@sections/Skills/SkillsSection'));
const ProjectsSection    = lazy(() => import('@sections/Projects/ProjectsSection'));
const ExperienceSection  = lazy(() => import('@sections/Experience/ExperienceSection'));
const CertsSection       = lazy(() => import('@sections/Certifications/CertsSection'));
const ContactSection     = lazy(() => import('@sections/Contact/ContactSection'));

gsap.registerPlugin(ScrollTrigger);

// Disable GSAP animations when user prefers reduced motion.
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.timeScale(0);
  ScrollTrigger.defaults({ toggleActions: 'play none none none' });
}

// Minimal inline fallback — invisible placeholder that holds section height.
function SectionFallback() {
  return <div style={{ minHeight: '100vh' }} aria-hidden="true" />;
}

export default function App() {
  const lenis = useLenis();
  useScrollProgress();
  const isLoading   = useStore((s) => s.isLoading);
  const setIsMobile = useStore((s) => s.setIsMobile);

  // Detect mobile and keep in sync with resize.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [setIsMobile]);

  // Drive ScrollTrigger from Lenis' scroll so pins/reveals stay frame-accurate.
  useEffect(() => {
    if (!lenis) return undefined;
    lenis.on('scroll', ScrollTrigger.update);
    ScrollTrigger.refresh();
    return () => lenis.off('scroll', ScrollTrigger.update);
  }, [lenis]);

  // GSAP context cleanup on unmount.
  useEffect(() => {
    const ctx = gsap.context(() => {});
    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* Skip-to-content — visible on focus for keyboard/screen-reader users */}
      <a href="#main-content" className="skip-link">Skip to content</a>

      {isLoading && <LoadingScreen />}
      <Navbar />
      <ScrollProgress />

      <main id="main-content">
        <HeroSection />
        <Suspense fallback={<SectionFallback />}>
          <AboutSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <SkillsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ProjectsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ExperienceSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <CertsSection />
        </Suspense>
        <Suspense fallback={<SectionFallback />}>
          <ContactSection />
        </Suspense>
      </main>
    </>
  );
}
