import { useRef } from 'react';
import styles from './HolographicCard.module.css';

/**
 * HolographicCard — Phase 2.2.
 *
 * A card framed by an animated rainbow conic-gradient border, reacting to the
 * cursor with a subtle 3D tilt (max 8°). Inner content sits on a glass surface
 * tinted by `accent`.
 *
 * Props:
 *   - children   inner content
 *   - title      optional heading (rendered in the accent color)
 *   - accent     CSS color string for the tint (default: --accent-cyan)
 */
const MAX_TILT = 8; // degrees

export default function HolographicCard({
  children,
  title,
  accent = 'var(--accent-cyan)',
  className = '',
  ...rest
}) {
  const ref = useRef(null);

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width; // 0..1
    const py = (e.clientY - rect.top) / rect.height; // 0..1
    const rotateY = (px - 0.5) * 2 * MAX_TILT; // -8..8
    const rotateX = -(py - 0.5) * 2 * MAX_TILT; // -8..8
    el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleLeave = () => {
    const el = ref.current;
    if (el) el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  };

  return (
    <div
      ref={ref}
      className={[styles.card, className].filter(Boolean).join(' ')}
      style={{ '--card-accent': accent }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      {...rest}
    >
      <div className={styles.content}>
        {title && <h3 className={styles.title}>{title}</h3>}
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
