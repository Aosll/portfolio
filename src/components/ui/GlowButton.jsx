import { useState, forwardRef } from 'react';
import styles from './GlowButton.module.css';

/**
 * GlowButton — Phase 2.2.
 *
 * Button with three looks and a material-style ripple on click.
 *
 * Props:
 *   - children
 *   - as        element/component to render ('button' default, e.g. 'a' for links)
 *   - variant   'primary' | 'outline' | 'ghost'
 *   - onClick   forwarded; called after the ripple is queued
 *   - ...rest   passthrough (type, href, download, disabled, aria-*, etc.)
 */
const VARIANT_CLASS = {
  primary: 'primary',
  outline: 'outline',
  ghost: 'ghost',
};

const GlowButton = forwardRef(function GlowButton({
  children,
  as: Component = 'button',
  variant = 'primary',
  className = '',
  onClick,
  ...rest
}, ref) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const ripple = {
      id: Date.now() + Math.random(),
      x: e.clientX - rect.left - size / 2,
      y: e.clientY - rect.top - size / 2,
      size,
    };
    setRipples((list) => [...list, ripple]);
    onClick?.(e);
  };

  const variantClass = styles[VARIANT_CLASS[variant]] ?? styles.primary;

  return (
    <Component
      ref={ref}
      className={[styles.btn, variantClass, className].filter(Boolean).join(' ')}
      onClick={handleClick}
      {...rest}
    >
      <span className={styles.label}>{children}</span>
      {ripples.map((r) => (
        <span
          key={r.id}
          className={styles.ripple}
          style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          onAnimationEnd={() =>
            setRipples((list) => list.filter((it) => it.id !== r.id))
          }
        />
      ))}
    </Component>
  );
});

export default GlowButton;
