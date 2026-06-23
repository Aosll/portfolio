import styles from './GlassPanel.module.css';

/**
 * GlassPanel — Phase 2.2.
 *
 * Glassmorphism surface, the base building block for cards/overlays across the
 * site. Visual styling lives in the CSS module; callers may layer inline tweaks
 * via `style` and extra classes via `className`.
 *
 * Props:
 *   - children
 *   - className   extra class names merged after the variant
 *   - variant     'default' | 'intense' | 'subtle'
 *   - style       inline overrides (forwarded)
 *   - ...rest     passthrough (onClick, role, aria-*, etc.)
 */
const VARIANT_CLASS = {
  default: '',
  intense: styles.intense,
  subtle: styles.subtle,
};

export default function GlassPanel({
  children,
  className = '',
  variant = 'default',
  style,
  ...rest
}) {
  const classes = [styles.panel, VARIANT_CLASS[variant] ?? '', className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} style={style} {...rest}>
      {children}
    </div>
  );
}
