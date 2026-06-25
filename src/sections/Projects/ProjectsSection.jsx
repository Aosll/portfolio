import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { PROJECTS } from '@/data/projects';
import IlterAkkeProject   from './IlterAkke/IlterAkkeProject';
import FakeIoTProject     from './FakeIoT/FakeIoTProject';
import CampusQuestProject from './CampusQuest/CampusQuestProject';

import styles from './ProjectsSection.module.css';

const PROJECT_COMPONENTS = {
  'ilter-akke':       IlterAkkeProject,
  'fakeiot-honeypot': FakeIoTProject,
  'campusquest':      CampusQuestProject,
};

gsap.registerPlugin(ScrollTrigger);

// ─── Pill nav ────────────────────────────────────────────────────────────────

function PillNav({ active, onChange }) {
  return (
    <nav className={styles.pillNav} aria-label="Project navigation">
      {PROJECTS.map((p, i) => (
        <button
          key={p.id}
          type="button"
          className={`${styles.pill} ${active === i ? styles.pillActive : ''}`}
          style={{ '--accent': p.accent }}
          onClick={() => onChange(i)}
          aria-current={active === i ? 'true' : undefined}
        >
          {p.title}
        </button>
      ))}
    </nav>
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ total, fillRef }) {
  // Shows the complete pinned-scroll journey through the project sequence.
  const segW = 100 / total;
  return (
    <div className={styles.progressTrack} aria-hidden="true">
      <div ref={fillRef} className={styles.progressFill} />
      {PROJECTS.map((p, i) => (
        <div
          key={p.id}
          className={styles.progressSeg}
          style={{ left: `${segW * i}%`, width: `${segW}%`, '--accent': p.accent }}
        />
      ))}
    </div>
  );
}

// ─── Project slide ────────────────────────────────────────────────────────────

function ProjectSlide({ project, index, registerSlide }) {
  const CustomComponent = PROJECT_COMPONENTS[project.id];

  return (
    <div
      ref={(el) => registerSlide(index, el)}
      className={`${styles.slide} ${CustomComponent ? styles.slideFull : ''}`}
      style={{
        '--accent': project.accent,
        opacity: index === 0 ? 1 : 0,
        visibility: index === 0 ? 'visible' : 'hidden',
        pointerEvents: index === 0 ? 'auto' : 'none',
        transform: `scale(${index === 0 ? 1 : 0.965})`,
        zIndex: index === 0 ? 2 : 0,
      }}
      aria-hidden={index === 0 ? undefined : 'true'}
    >
      {CustomComponent ? (
        // Full custom layout (content + 3D scene managed by the component)
        <CustomComponent />
      ) : (
        <>
          {/* 3D scene placeholder */}
          <div className={styles.scenePlaceholder} aria-hidden="true">
            <div
              className={styles.scenePlaceholderGlow}
              style={{ background: `radial-gradient(ellipse at center, ${project.accent}22 0%, transparent 70%)` }}
            />
            <svg className={styles.scenePlaceholderIcon} viewBox="0 0 80 80" fill="none">
              <polygon points="40,8 72,28 72,52 40,72 8,52 8,28" stroke={project.accent} strokeWidth="1.5" strokeOpacity="0.5" fill="none" />
              <circle cx="40" cy="40" r="6" fill={project.accent} fillOpacity="0.7" />
            </svg>
            <p className={styles.scenePlaceholderLabel} style={{ color: project.accent }}>3D scene — Phase 7.3+</p>
          </div>

          {/* Content */}
          <div className={styles.content}>
            <div className={styles.tagRow}>
              {project.tags.map(t => (
                <span key={t} className={styles.tag} style={{ '--accent': project.accent }}>{t}</span>
              ))}
            </div>
            <h2 className={styles.title} style={{ color: project.accent }}>{project.title}</h2>
            <p className={styles.subtitle}>{project.subtitle}</p>
            <p className={styles.summary}>{project.summary}</p>
            <a href={project.repo} target="_blank" rel="noopener noreferrer" className={styles.repoLink} style={{ '--accent': project.accent }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function ProjectsSection() {
  const rootRef        = useRef(null);
  const stickyRef      = useRef(null);
  const fillRef        = useRef(null);
  const slidesRef      = useRef([]);
  const activeRef      = useRef(0);
  const [active, setActive]           = useState(0);

  function registerSlide(index, el) {
    slidesRef.current[index] = el;
  }

  // Sticky scroll: pin the section, drive active project from scroll position.
  useEffect(() => {
    const sections = PROJECTS.length;
    const stops = Math.max(sections - 1, 1);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function renderProgress(progress) {
      const sequence = progress * stops;
      const idx = Math.min(Math.round(sequence), sections - 1);

      if (fillRef.current) {
        fillRef.current.style.width = `${progress * 100}%`;
      }

      slidesRef.current.forEach((slide, i) => {
        if (!slide) return;
        const distance = Math.abs(sequence - i);
        const opacity = reduce
          ? (idx === i ? 1 : 0)
          : Math.max(0, Math.min(1, 1 - distance));
        const isInteractive = idx === i;
        slide.style.opacity = String(opacity);
        slide.style.visibility = opacity > 0.02 ? 'visible' : 'hidden';
        slide.style.pointerEvents = isInteractive ? 'auto' : 'none';
        slide.style.transform = `scale(${0.965 + opacity * 0.035})`;
        slide.style.zIndex = isInteractive ? '2' : opacity > 0.02 ? '1' : '0';
        if (isInteractive) {
          slide.removeAttribute('aria-hidden');
        } else {
          slide.setAttribute('aria-hidden', 'true');
        }
      });

      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    }

    renderProgress(0);

    const trigger  = ScrollTrigger.create({
      trigger: rootRef.current,
      start: 'top top',
      // Each project gets 100vh of scroll travel (3 projects = 200vh extra).
      end: `+=${(sections - 1) * 100}%`,
      pin: stickyRef.current,
      scrub: 0.4,
      onUpdate(self) {
        renderProgress(self.progress);
      },
      onRefresh(self) {
        renderProgress(self.progress);
      },
    });

    return () => trigger.kill();
  }, []);

  // Manual pill tap: jump scroll position to that project's segment.
  function jumpToProject(i) {
    const el = rootRef.current;
    if (!el) return;
    const rect     = el.getBoundingClientRect();
    const totalH   = el.offsetHeight - window.innerHeight;
    const stops    = Math.max(PROJECTS.length - 1, 1);
    const segH     = totalH / stops;
    const target   = window.scrollY + rect.top + segH * i;
    if (window.lenis?.scrollTo) {
      window.lenis.scrollTo(target);
    } else {
      window.scrollTo({ top: target, behavior: 'smooth' });
    }
  }

  return (
    // Outer wrapper is tall enough for scroll travel (min-height per project).
    <section
      id="projects"
      ref={rootRef}
      className={`${styles.projects}`}
      aria-label="Projects"
      style={{ minHeight: `${PROJECTS.length * 100}vh` }}
    >
      {/* Sticky viewport — pinned by ScrollTrigger */}
      <div ref={stickyRef} className={styles.sticky}>
        {/* Top chrome */}
        <div className={styles.chrome}>
          <PillNav active={active} onChange={jumpToProject} />
          <ProgressBar total={PROJECTS.length} fillRef={fillRef} />
        </div>

        {/* Project slides — stacked, crossfade */}
        <div className={styles.slides}>
          {PROJECTS.map((p, i) => (
            <ProjectSlide
              key={p.id}
              project={p}
              index={i}
              registerSlide={registerSlide}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
