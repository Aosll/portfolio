import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { useLenis } from '@hooks/useLenis';
import { useScrollProgress } from '@hooks/useScrollProgress';
import { useStore } from '@/store/useStore';

import Navbar from '@components/navigation/Navbar';
import ScrollProgress from '@components/ui/ScrollProgress';
import LoadingScreen from '@components/ui/LoadingScreen';

import HeroSection from '@sections/Hero/HeroSection';
import AboutSection from '@sections/About/AboutSection';
import SkillsSection from '@sections/Skills/SkillsSection';
import ProjectsSection from '@sections/Projects/ProjectsSection';
import ExperienceSection from '@sections/Experience/ExperienceSection';
import CertsSection from '@sections/Certifications/CertsSection';
import ContactSection from '@sections/Contact/ContactSection';

gsap.registerPlugin(ScrollTrigger);

/**
 * App — Phase 3.4 root layout.
 *
 * Boots the Lenis smooth-scroll engine, keeps ScrollTrigger in sync with it,
 * gates the experience behind the LoadingScreen, and lays out the navigation
 * chrome (Navbar, ScrollProgress) plus every section in order.
 */
export default function App() {
  const lenis = useLenis();
  useScrollProgress();
  const isLoading = useStore((s) => s.isLoading);

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
      {isLoading && <LoadingScreen />}
      <Navbar />
      <ScrollProgress />
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <CertsSection />
        <ContactSection />
      </main>
    </>
  );
}
