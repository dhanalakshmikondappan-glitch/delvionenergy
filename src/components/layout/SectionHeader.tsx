import type { ReactNode } from "react";

interface SectionHeaderProps {
  /** Heading id — lets the parent <Section> point aria-labelledby at it. */
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;
  cta?: ReactNode;
  /** "h1" is only for the one section standing in as a route's page title. */
  headingLevel?: "h1" | "h2" | "h3";
  align?: "center" | "left";
}

/**
 * MASTER.md §71: small label, heading, supporting paragraph, optional CTA,
 * capped at 700px, centered by default.
 */
export function SectionHeader({
  id,
  eyebrow,
  title,
  description,
  cta,
  headingLevel = "h2",
  align = "center",
}: SectionHeaderProps) {
  const Heading = headingLevel;
  const alignClass = align === "center" ? "mx-auto text-center" : "text-left";

  return (
    <div className={`max-w-[var(--container-reading)] ${alignClass}`}>
      {eyebrow ? (
        // DESIGN_SYSTEM.md §2: energy-blue fails AA as text on a light
        // surface (2.82:1) — the eyebrow gets emphasis from letter-spacing
        // and weight, not brand-accent color.
        <p className="mb-3 text-fine font-medium uppercase tracking-[0.08em] text-ink-muted">
          {eyebrow}
        </p>
      ) : null}
      <Heading id={id} className="text-section">
        {title}
      </Heading>
      {description ? <p className="mt-4 text-body-lg text-ink-muted">{description}</p> : null}
      {cta ? <div className="mt-8">{cta}</div> : null}
    </div>
  );
}
