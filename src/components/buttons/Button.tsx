import type { MouseEventHandler, ReactNode } from "react";
import { Link } from "react-router";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
  variant?: ButtonVariant;
  /** True when rendered on a dark surface (e.g. over the hero) — swaps the
   * secondary variant's border/text so it stays legible. Doesn't affect
   * primary: mercury-fill + dark text already works on any background. */
  inverse?: boolean;
  children: ReactNode;
  className?: string;
  /** Internal route — renders a react-router <Link>. */
  to?: string;
  /** External URL / tel: / mailto: / wa.me — renders a plain <a>. */
  href?: string;
  target?: string;
  rel?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit";
  "aria-label"?: string;
  "aria-expanded"?: boolean;
  "aria-controls"?: string;
}

/**
 * MASTER.md §48: primary = mercury fill, dark text, lift + shadow on hover;
 * secondary = outline, hover mercury border + elevated background. 56px
 * minimum height (§76), 250ms transition.
 *
 * Variants are looked up as [variant][inverse] rather than composed via a
 * separate className override — Tailwind v4's utility precedence is
 * decided by its own generated stylesheet order, not by where a class sits
 * in the JSX class string, so appending an "override" class after a
 * variant class is not guaranteed to win.
 *
 * Inverse-secondary (dark hero backgrounds) uses the dawn accent instead of
 * mercury — the one deliberate place amber shows up beyond the logo mark,
 * per the brand's "sparingly, small details only" rule for that color.
 */
const MERCURY_GLOW = "hover:shadow-[0_10px_32px_-6px_rgba(79,169,126,0.45)]";
const DAWN_GLOW = "hover:shadow-[0_10px_28px_-8px_rgba(232,169,74,0.4)]";

const VARIANT_CLASS: Record<ButtonVariant, { normal: string; inverse: string }> = {
  primary: {
    normal: `bg-mercury text-ink hover:-translate-y-0.5 ${MERCURY_GLOW}`,
    inverse: `bg-mercury text-ink hover:-translate-y-0.5 ${MERCURY_GLOW}`,
  },
  secondary: {
    normal: `border border-line text-ink hover:-translate-y-0.5 hover:border-mercury hover:bg-surface-elevated ${MERCURY_GLOW}`,
    inverse: `border border-ink-inverse/40 text-ink-inverse hover:-translate-y-0.5 hover:border-dawn hover:bg-ink-inverse/10 ${DAWN_GLOW}`,
  },
};

const BASE_CLASS =
  "inline-flex min-h-[56px] items-center justify-center rounded-[var(--radius-button)] px-6 font-medium transition-all duration-fast";

export function Button({
  variant = "primary",
  inverse = false,
  children,
  className,
  to,
  href,
  ...rest
}: ButtonProps) {
  const variantClass = VARIANT_CLASS[variant][inverse ? "inverse" : "normal"];
  const classes = [BASE_CLASS, variantClass, className].filter(Boolean).join(" ");

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={rest["aria-label"]} onClick={rest.onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a
        href={href}
        target={rest.target}
        rel={rest.rel}
        className={classes}
        aria-label={rest["aria-label"]}
        onClick={rest.onClick}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={rest.type ?? "button"}
      className={classes}
      onClick={rest.onClick}
      aria-label={rest["aria-label"]}
      aria-expanded={rest["aria-expanded"]}
      aria-controls={rest["aria-controls"]}
    >
      {children}
    </button>
  );
}
