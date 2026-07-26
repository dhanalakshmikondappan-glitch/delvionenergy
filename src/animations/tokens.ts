/**
 * Mirrors the motion tokens declared in src/styles/theme.css so GSAP/Framer
 * timing can never drift out of sync with the CSS. Falls back to the same
 * literal values during prerendering, where `document` does not exist.
 */

const FALLBACK_MS = {
  fast: 200,
  normal: 350,
  slow: 600,
  hero: 2200,
} as const;

const FALLBACK_EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

function readMs(cssVar: string, fallback: number): number {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  const parsed = Number.parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readEase(cssVar: string, fallback: string): string {
  if (typeof document === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
  return raw.length > 0 ? raw : fallback;
}

export interface MotionTokens {
  durationFast: number;
  durationNormal: number;
  durationSlow: number;
  durationHero: number;
  easeCalm: string;
}

/** Reads --duration-* (declared in ms) and --ease-calm from the live document. */
export function getMotionTokens(): MotionTokens {
  return {
    durationFast: readMs("--duration-fast", FALLBACK_MS.fast),
    durationNormal: readMs("--duration-normal", FALLBACK_MS.normal),
    durationSlow: readMs("--duration-slow", FALLBACK_MS.slow),
    durationHero: readMs("--duration-hero", FALLBACK_MS.hero),
    easeCalm: readEase("--ease-calm", FALLBACK_EASE),
  };
}
