import { useEffect, useRef, useCallback, useState } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import GlassPanel from '@components/ui/GlassPanel';
import GlowButton from '@components/ui/GlowButton';

import styles from './ContactSection.module.css';

gsap.registerPlugin(ScrollTrigger);

// ─── Constellation background ──────────────────────────────────────────────────

const STAR_COUNT = 48;
const EDGE_DIST  = 120;

function seededRand(seed) {
  let s = seed;
  return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
}

function Constellation() {
  const svgRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const W = svg.clientWidth  || 1200;
    const H = svg.clientHeight || 600;
    const rand = seededRand(42);

    const stars = Array.from({ length: STAR_COUNT }, (_, i) => ({
      x: rand() * W,
      y: rand() * H,
      r: rand() * 1.5 + 0.5,
      vx: (rand() - 0.5) * 0.18,
      vy: (rand() - 0.5) * 0.10,
      op: rand() * 0.5 + 0.3,
    }));

    const dotsG  = svg.querySelector('#cDots');
    const edgesG = svg.querySelector('#cEdges');

    const dotEls = stars.map(s => {
      const c = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      c.setAttribute('r', s.r);
      c.setAttribute('fill', '#00d4ff');
      c.setAttribute('opacity', s.op);
      dotsG.appendChild(c);
      return c;
    });

    function tick() {
      stars.forEach((s, i) => {
        s.x += s.vx;
        s.y += s.vy;
        if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
        if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
        dotEls[i].setAttribute('cx', s.x);
        dotEls[i].setAttribute('cy', s.y);
      });

      // Build edges
      while (edgesG.firstChild) edgesG.removeChild(edgesG.firstChild);
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const d  = Math.sqrt(dx * dx + dy * dy);
          if (d < EDGE_DIST) {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.setAttribute('x1', stars[i].x); line.setAttribute('y1', stars[i].y);
            line.setAttribute('x2', stars[j].x); line.setAttribute('y2', stars[j].y);
            line.setAttribute('stroke', '#00d4ff');
            line.setAttribute('stroke-opacity', (1 - d / EDGE_DIST) * 0.18);
            line.setAttribute('stroke-width', '0.6');
            edgesG.appendChild(line);
          }
        }
      }

      animRef.current = requestAnimationFrame(tick);
    }

    animRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animRef.current);
  }, []);

  return (
    <svg ref={svgRef} className={styles.constellation} aria-hidden="true">
      <g id="cEdges" />
      <g id="cDots"  />
    </svg>
  );
}

// ─── Contact cards ─────────────────────────────────────────────────────────────

const CARDS = [
  {
    id: 'email',
    label: 'Email',
    value: 'dikiciomer@outlook.com',
    display: 'dikiciomer@outlook.com',
    action: 'copy',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    ),
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    value: 'https://linkedin.com/in/omerdikici',
    display: 'linkedin.com/in/omerdikici',
    action: 'open',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    id: 'github',
    label: 'GitHub',
    value: 'https://github.com/Aosll',
    display: 'github.com/Aosll',
    action: 'open',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
];

function ContactCard({ card, index }) {
  const ref  = useRef(null);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0, y: 24 });
    const t = ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter() {
        gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.55, ease: 'power3.out', delay: index * 0.1 });
      },
    });
    return () => t.kill();
  }, [index]);

  function handleClick() {
    if (card.action === 'copy') {
      navigator.clipboard.writeText(card.value).then(() => {
        setToast('Copied!');
        setTimeout(() => setToast(''), 2000);
      });
    } else {
      window.open(card.value, '_blank', 'noopener,noreferrer');
    }
  }

  return (
    <GlassPanel ref={ref} className={styles.contactCard} onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && handleClick()}
      aria-label={card.action === 'copy' ? `Copy ${card.label}` : `Open ${card.label}`}>
      <span className={styles.cardIcon}>{card.icon}</span>
      <div className={styles.cardBody}>
        <span className={styles.cardLabel}>{card.label}</span>
        <span className={styles.cardValue}>{card.display}</span>
      </div>
      <span className={styles.cardAction}>
        {toast
          ? <span className={styles.toastBadge}>{toast}</span>
          : card.action === 'copy'
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15,3 21,3 21,9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        }
      </span>
    </GlassPanel>
  );
}

// ─── Confetti burst ────────────────────────────────────────────────────────────

function spawnConfetti(originEl) {
  if (!originEl) return;
  const rect = originEl.getBoundingClientRect();
  const ox = rect.left + rect.width / 2;
  const oy = rect.top + rect.height / 2;
  const COLORS = ['#00d4ff', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981'];

  Array.from({ length: 28 }).forEach((_, i) => {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; pointer-events:none; z-index:9999;
      width:${4 + Math.random() * 6}px; height:${4 + Math.random() * 6}px;
      border-radius:${Math.random() > 0.5 ? '50%' : '0'};
      background:${COLORS[i % COLORS.length]};
      left:${ox}px; top:${oy}px;
    `;
    document.body.appendChild(el);
    const angle  = (i / 28) * Math.PI * 2;
    const spread = 80 + Math.random() * 120;
    gsap.to(el, {
      x: Math.cos(angle) * spread, y: Math.sin(angle) * spread - 60,
      opacity: 0, duration: 0.9 + Math.random() * 0.4,
      ease: 'power2.out',
      onComplete() { el.remove(); },
    });
  });
}

// ─── Contact form ──────────────────────────────────────────────────────────────

function ContactForm() {
  const ref    = useRef(null);
  const btnRef = useRef(null);
  const [state, handleSubmit] = useForm('xlgygkqr');

  // Scroll-reveal animation
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.set(el, { autoAlpha: 0, y: 30 });
    const t = ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter() { gsap.to(el, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }); },
    });
    return () => t.kill();
  }, []);

  // Confetti on success
  useEffect(() => {
    if (state.succeeded) spawnConfetti(btnRef.current);
  }, [state.succeeded]);

  if (state.succeeded) {
    return (
      <GlassPanel ref={ref} variant="intense" className={styles.form}>
        <div className={styles.successState}>
          <span className={styles.successIcon}>✓</span>
          <h3 className={styles.formTitle}>Message Sent!</h3>
          <p className={styles.directNote}>Thanks for reaching out — I'll get back to you soon.</p>
        </div>
      </GlassPanel>
    );
  }

  return (
    <GlassPanel ref={ref} variant="intense" className={styles.form}>
      <h3 className={styles.formTitle}>Send a Message</h3>

      <form onSubmit={handleSubmit} className={styles.formGrid}>
        <label className={styles.field}>
          <span className={styles.fieldLabel}>Name</span>
          <input
            id="name" name="name" type="text" required
            placeholder="Your name"
            className={styles.input}
          />
          <ValidationError field="name" errors={state.errors} className={styles.fieldError} />
        </label>

        <label className={styles.field}>
          <span className={styles.fieldLabel}>Email</span>
          <input
            id="email" name="email" type="email" required
            placeholder="your@email.com"
            className={styles.input}
          />
          <ValidationError field="email" errors={state.errors} className={styles.fieldError} />
        </label>

        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.fieldLabel}>Subject</span>
          <input
            id="subject" name="subject" type="text" required
            placeholder="What's it about?"
            className={styles.input}
          />
          <ValidationError field="subject" errors={state.errors} className={styles.fieldError} />
        </label>

        <label className={`${styles.field} ${styles.fieldFull}`}>
          <span className={styles.fieldLabel}>Message</span>
          <textarea
            id="message" name="message" required
            placeholder="Tell me more..."
            rows={5}
            className={`${styles.input} ${styles.textarea}`}
          />
          <ValidationError field="message" errors={state.errors} className={styles.fieldError} />
        </label>

        <div className={`${styles.field} ${styles.fieldFull} ${styles.submitRow}`}>
          <GlowButton
            ref={btnRef}
            type="submit"
            variant="primary"
            disabled={state.submitting}
            className={styles.submitBtn}
          >
            {state.submitting ? 'Sending…' : 'Send Message →'}
          </GlowButton>

          <p className={styles.directNote}>
            Or email directly at{' '}
            <a href="mailto:dikiciomer@outlook.com" className={styles.directLink}>
              dikiciomer@outlook.com
            </a>
          </p>
        </div>
      </form>
    </GlassPanel>
  );
}

// ─── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerInner}>
        <p className={styles.copyright}>© 2026 Ömer Efe Dikici</p>

        <div className={styles.footerLinks}>
          <a href="https://github.com/Aosll" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            GitHub
          </a>
          <span className={styles.footerDivider} aria-hidden="true">·</span>
          <a href="https://linkedin.com/in/omerdikici" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>
            LinkedIn
          </a>
          <span className={styles.footerDivider} aria-hidden="true">·</span>
          <a href="/cv.pdf" download className={styles.footerLink}>
            CV Download
          </a>
        </div>

        <p className={styles.tagline}>Built with Three.js · GSAP · React · Passion</p>
      </div>
    </footer>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function ContactSection() {
  const rootRef    = useRef(null);
  const headRef    = useRef(null);
  const accentRef  = useRef(null);
  const subRef     = useRef(null);

  useEffect(() => {
    [headRef, accentRef, subRef].forEach((r, i) => {
      if (!r.current) return;
      gsap.set(r.current, { autoAlpha: 0, y: 30 });
      ScrollTrigger.create({
        trigger: r.current, start: 'top 88%', once: true,
        onEnter() {
          gsap.to(r.current, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: i * 0.1 });
        },
      });
    });
  }, []);

  return (
    <section
      id="contact"
      ref={rootRef}
      className={`section ${styles.contact}`}
      aria-label="Contact"
    >
      <Constellation />

      <div className={styles.inner}>
        {/* ── Heading ── */}
        <div className={styles.headingBlock}>
          <h2 ref={headRef} className={styles.heading}>
            LET&rsquo;S BUILD SOMETHING
          </h2>
          <span ref={accentRef} className={styles.headingAccent}>EXTRAORDINARY</span>
          <p ref={subRef} className={styles.sub}>
            Open to internships, collaborations and full-time roles.
          </p>
        </div>

        {/* ── Contact cards ── */}
        <div className={styles.cardsRow}>
          {CARDS.map((card, i) => (
            <ContactCard key={card.id} card={card} index={i} />
          ))}
        </div>

        {/* ── Form ── */}
        <ContactForm />
      </div>

      <Footer />
    </section>
  );
}
