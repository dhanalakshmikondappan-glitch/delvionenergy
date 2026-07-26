import { Home, PanelTop, Router, Sun, TrendingDown, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRef } from "react";

import { Button } from "~/components/buttons/Button";
import { ScrollIndicator } from "~/components/layout/ScrollIndicator";
import { TrustIndicators } from "~/components/layout/TrustIndicators";
import { HeroOverlay } from "~/components/media/HeroOverlay";
import { ROUTE_PATHS } from "~/constants/routePaths";
import { cinematicFrameSrc, useHeroCinematic } from "~/hooks/useHeroCinematic";
import { HERO_SENTINEL_ID } from "~/hooks/useHeroOverlap";
import { useHeroTimeline } from "~/hooks/useHeroTimeline";
import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";

// MASTER.md §12, verbatim.
const HEADLINE = "Powering Tomorrow with Smarter Solar Energy";
const SUBTITLE =
  "From homes to industries, Delvion Energy designs and installs intelligent solar systems that reduce electricity costs while building a cleaner future.";

const HEADLINE_WORDS = HEADLINE.split(" ");

interface Phase {
  icon: LucideIcon;
  label: string;
  description: string;
}

// Same six stages as EnergyFlow/HowSolarWorksPreview (MASTER.md §19) — the
// journey half of this section is a cinematic retelling of the same
// narrative, not a new one.
const PHASES: Phase[] = [
  {
    icon: Sun,
    label: "Sunlight",
    description: "Every system starts with what's already free — sunlight on your roof.",
  },
  {
    icon: PanelTop,
    label: "Solar Panels",
    description: "Panels convert that sunlight directly into DC electricity.",
  },
  {
    icon: Zap,
    label: "Inverter",
    description: "The inverter turns DC power into the AC electricity your building runs on.",
  },
  {
    icon: Home,
    label: "Home / Business",
    description:
      "Power flows straight into your home or business, offsetting what you'd otherwise buy.",
  },
  {
    icon: Router,
    label: "Grid",
    description: "Surplus power can flow back to the grid, depending on your connection type.",
  },
  {
    icon: TrendingDown,
    label: "Savings",
    description: "Less drawn from the grid means a smaller bill, month after month.",
  },
];

/**
 * MASTER.md §16/§17/§74, extended by docs/DECISIONS.md — Phase 7: the hero
 * no longer autoplays a video. Frame 1 of the same 60-frame sequence used
 * for the (now-merged) journey section renders as a plain `<img>` for
 * first paint; once the entrance timeline settles, scrolling scrubs the
 * canvas through the sequence while the headline/CTA crossfade into the
 * six-phase energy-journey story.
 *
 * The visual section is `position: sticky`, not GSAP-pinned — an outer
 * wrapper (`wrapperRef`) reserves the scroll distance via plain responsive
 * CSS height, and the section sticks to the top of the viewport for as
 * long as the wrapper is being scrolled through, exactly like a pin would
 * look, but without GSAP ever touching the DOM structure. See the long
 * comment in `useHeroCinematic.ts` for why: GSAP's `pin: true` reparents
 * the pinned element under a "pin-spacer" div it inserts directly, which
 * conflicts with React's own idea of the tree and caused a real crash on
 * navigating away mid-pin.
 *
 * The word-by-word h1 reveal still carries the full headline via
 * aria-label on the heading itself; the animated per-word spans are
 * aria-hidden, so screen readers announce the complete string once rather
 * than fragmenting it into six separate words.
 */
export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useHeroTimeline(sectionRef, { enabled: !prefersReducedMotion });
  const { loadProgress, isReady } = useHeroCinematic(wrapperRef, sectionRef, canvasRef, {
    enabled: !prefersReducedMotion,
    phaseCount: PHASES.length,
  });

  return (
    <div ref={wrapperRef} className="relative h-[270vh] md:h-[340vh] lg:h-[420vh]">
      <section
        ref={sectionRef}
        className="sticky top-0 flex h-screen min-h-[100svh] w-full flex-col justify-end overflow-hidden bg-surface-dark"
      >
        <img
          src={cinematicFrameSrc(1)}
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

        <HeroOverlay />

        {!isReady && !prefersReducedMotion ? (
          <div className="absolute top-24 right-6 z-20 flex items-center gap-3 md:right-12 lg:right-20">
            <span className="text-caption font-medium text-ink-inverse/70">
              Preparing the journey — {loadProgress}%
            </span>
            <span className="h-1 w-16 overflow-hidden rounded-full bg-ink-inverse/20">
              <span
                className="block h-full bg-dawn transition-[width] duration-200"
                style={{ width: `${loadProgress}%` }}
              />
            </span>
          </div>
        ) : null}

        {/* Hero pitch — visible at rest, crossfades out as the section pins
          and scrolls (useHeroCinematic). Stays in normal flow (not
          absolutely positioned) so its own content still determines the
          section's natural bottom-aligned layout. */}
        {/* The content is bottom-aligned (justify-end on the section), so its
            headline sits at `viewport height − stack height` from the top:
            if the full stack — headline, subtitle, CTAs, trust row — is
            taller than the viewport, that number goes negative and the
            headline slides up off the top, under the logo/nav. The fix is
            purely keeping the stack shorter than the viewport on a phone
            (compact trust chips + tighter mobile spacing here), which keeps
            the headline both fully visible and clear of the 80px navbar —
            verified down to a 667px-tall screen. Reduced bottom padding on
            mobile buys a little more of that headroom; full spacing returns
            from md up, where the viewport dwarfs the content anyway. */}
        <div
          data-cinematic="hero-content"
          className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-4 pb-10 sm:px-6 md:pb-16 lg:px-8 lg:pb-24"
        >
          <h1 aria-label={HEADLINE} className="max-w-3xl text-hero text-ink-inverse">
            {HEADLINE_WORDS.map((word, index) => (
              <span
                key={index}
                aria-hidden="true"
                data-hero="word"
                className="mr-[0.25em] inline-block translate-y-[10px] opacity-0"
              >
                {word}
              </span>
            ))}
          </h1>

          <p
            data-hero="subtitle"
            className="mt-4 max-w-xl translate-y-[10px] text-body-lg text-ink-inverse/85 opacity-0 md:mt-6"
          >
            {SUBTITLE}
          </p>

          <div
            data-hero="cta"
            className="mt-6 flex translate-y-[10px] flex-col gap-3 opacity-0 md:mt-8 md:flex-row md:gap-4"
          >
            <Button to={ROUTE_PATHS.contact}>Get Free Consultation</Button>
            <Button to={ROUTE_PATHS.solutions} variant="secondary" inverse>
              Explore Solutions
            </Button>
          </div>

          <div className="mt-6 md:mt-10">
            <TrustIndicators />
          </div>
        </div>

        {/* Journey — hidden at rest, crossfades in as the hero pitch fades
          out. Absolutely positioned over the same bottom-aligned area. */}
        <div
          data-cinematic="journey-content"
          className="absolute inset-0 z-10 flex h-full flex-col justify-end px-6 pb-16 opacity-0 md:px-12 md:pb-20 lg:px-20"
        >
          <div className="max-w-2xl">
            <p className="text-caption font-medium tracking-[0.08em] text-dawn uppercase">
              The Journey
            </p>
            <h2 className="mt-3 text-section text-ink-inverse">
              From sunlight to savings, step by step
            </h2>

            <ol className="mt-8 space-y-4">
              {PHASES.map((phase, index) => (
                <li
                  key={phase.label}
                  data-cinematic-phase={index}
                  className="flex items-start gap-4 opacity-100 transition-opacity duration-500 data-[active=false]:opacity-40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink-inverse/25 bg-ink-inverse/10">
                    <phase.icon
                      aria-hidden="true"
                      className="text-dawn"
                      size={18}
                      strokeWidth={1.75}
                    />
                  </span>
                  <span>
                    <span className="block text-body font-medium text-ink-inverse">
                      {phase.label}
                    </span>
                    <span className="block text-caption text-ink-inverse/70">
                      {phase.description}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div data-cinematic="hero-content" className="absolute inset-x-0 bottom-0 z-10">
          <ScrollIndicator />
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 h-1 bg-ink-inverse/10">
          <div data-cinematic="progress" className="h-full w-0 bg-dawn" />
        </div>

        {/* Marks where the hero ends, for the navbar's transparent -> solid
            transition (see useHeroOverlap). Sits at the sticky section's own
            bottom edge, so it stays at the viewport bottom for as long as
            the section is stuck and only scrolls away once it unsticks. */}
        <div id={HERO_SENTINEL_ID} aria-hidden="true" className="absolute bottom-0 h-px w-full" />
      </section>
    </div>
  );
}
