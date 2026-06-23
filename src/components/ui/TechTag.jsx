import styles from './TechTag.module.css';

/**
 * TechTag — Phase 2.2.
 *
 * Pill-shaped tag pairing an optional icon with a label; lifts and glows in the
 * given accent color on hover.
 *
 * Props:
 *   - label   text content
 *   - icon    optional React node (e.g. a react-icons element)
 *   - color   accent color string for icon + glow (default: --accent-cyan)
 */
export default function TechTag({
  label,
  icon,
  color = 'var(--accent-cyan)',
  className = '',
  ...rest
}) {
  return (
    <span
      className={[styles.tag, className].filter(Boolean).join(' ')}
      style={{ '--tag-color': color }}
      {...rest}
    >
      {icon && (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </span>
  );
}
