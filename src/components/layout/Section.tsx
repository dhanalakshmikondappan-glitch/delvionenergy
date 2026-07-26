import type { ReactNode } from "react";

type SectionBackground = "surface" | "elevated" | "dark";

interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
  background?: SectionBackground;
  /** Points to the section's own heading id for an accessible landmark name. */
  ariaLabelledBy?: string;
}

const BACKGROUND_CLASS: Record<SectionBackground, string> = {
  surface: "bg-surface text-ink",
  elevated: "bg-surface-elevated text-ink",
  dark: "bg-surface-dark text-ink-inverse",
};

/**
 * MASTER.md §70/§111: every section shares the same vertical rhythm
 * (72/96/120px) and one of three background tones — no section invents its
 * own layout.
 */
export function Section({
  children,
  id,
  className,
  background = "surface",
  ariaLabelledBy,
}: SectionProps) {
  const classes = [
    "py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section-tablet)] lg:py-[var(--spacing-section-desktop)]",
    BACKGROUND_CLASS[background],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} aria-labelledby={ariaLabelledBy} className={classes}>
      {children}
    </section>
  );
}
