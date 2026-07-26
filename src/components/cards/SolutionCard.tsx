import type { LucideIcon } from "lucide-react";
import { Link } from "react-router";

import { ResponsiveImage } from "~/components/media/ResponsiveImage";

interface SolutionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  imageBasePath: string;
  imageAlt: string;
  /** Defaults to h3 (card sits under a section h2). Pass h2 when the card
   * is the next heading level down from the page's own h1. */
  headingLevel?: "h2" | "h3";
}

const CARD_WIDTHS = [640, 960, 1280];

/**
 * Editorial, photography-led version of the plain icon+text solution
 * teaser: the actual residential/commercial/industrial renders (docs/
 * DECISIONS.md — Phase 4) now do the work of differentiating the three
 * cards at a glance, with the icon reduced to a small supporting badge.
 * Shared between the homepage teaser grid and the Solutions hub page so
 * the two never drift out of sync with each other.
 */
export function SolutionCard({
  icon: Icon,
  title,
  description,
  path,
  imageBasePath,
  imageAlt,
  headingLevel = "h3",
}: SolutionCardProps) {
  const Heading = headingLevel;

  return (
    <Link
      to={path}
      className="group block h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-elevated transition-all duration-normal hover:-translate-y-1 hover:border-mercury hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <ResponsiveImage
          basePath={imageBasePath}
          widths={CARD_WIDTHS}
          alt={imageAlt}
          sizes="(min-width: 768px) 33vw, 100vw"
          className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
        />
      </div>

      <div className="p-8">
        <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-surface">
          <Icon aria-hidden="true" className="text-ink" size={22} strokeWidth={1.75} />
        </span>
        <Heading className="mt-4 text-subheading">{title}</Heading>
        <p className="mt-2 text-body text-ink-muted">{description}</p>
        <span className="mt-4 inline-block text-body font-medium underline decoration-transparent underline-offset-4 transition-colors duration-fast group-hover:decoration-current">
          Learn more
        </span>
      </div>
    </Link>
  );
}
