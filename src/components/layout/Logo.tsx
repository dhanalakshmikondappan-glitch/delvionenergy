import { Link } from "react-router";

import { ROUTE_PATHS } from "~/constants/routePaths";

interface LogoProps {
  /** True while the navbar sits transparent over the dark hero overlay. */
  inverse?: boolean;
}

/**
 * Two concentric arcs — dawn outer, mercury inner, a sun behind a solar
 * array — plus a baseline that flips between ink and ink-inverse for
 * contrast. The accent arcs themselves stay fixed in both navbar states;
 * only the baseline and wordmark respond to `inverse`, matching the light/
 * dark lockup pair in the brand concept (docs/DECISIONS.md — Phase 6).
 */
function Mark({ inverse }: { inverse: boolean }) {
  return (
    <svg viewBox="0 0 64 64" width="28" height="28" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M8 40 A24 24 0 0 1 56 40" stroke="var(--color-dawn)" strokeWidth="5" strokeLinecap="round" />
      <path d="M14 40 A18 18 0 0 1 50 40" stroke="var(--color-mercury)" strokeWidth="5" strokeLinecap="round" />
      <line
        x1="6"
        y1="48"
        x2="58"
        y2="48"
        stroke={inverse ? "var(--color-ink-inverse)" : "var(--color-ink)"}
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * The "o" in "Delvion" carries the one accent letter of the wordmark, per
 * the brand concept — mercury on the light navbar state, dawn on the dark/
 * transparent state (over the hero), exactly mirroring which accent reads
 * better against each background. Logotypes are exempt from WCAG 1.4.3's
 * text-contrast minimum, so this is a deliberate brand choice, not an
 * oversight — Delvion still reads fine from the other five ink-colored
 * letters regardless of how the accent letter renders.
 */
export function Logo({ inverse = false }: LogoProps) {
  return (
    <Link
      to={ROUTE_PATHS.home}
      aria-label="Delvion Energy — home"
      className={`flex items-center gap-2.5 font-heading transition-colors duration-fast ${
        inverse ? "text-ink-inverse" : "text-ink"
      }`}
    >
      <Mark inverse={inverse} />
      <span className="text-subheading font-semibold tracking-tight">
        Delvi<span className={inverse ? "text-dawn" : "text-mercury"}>o</span>n
      </span>
    </Link>
  );
}
