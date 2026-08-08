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

/**
 * Scroll-driven cinematic hero: frame 1 of a 60-frame WebP sequence
 * renders as a plain `<img>` for first paint; scrolling scrubs the canvas
 * through the full sequence while the headline, CTAs, and trust indicators
 * stay visible over the animation.
 *
 * The visual section is `position: sticky`, not GSAP-pinned — an outer
 * wrapper (`wrapperRef`) reserves the scroll distance via plain responsive
 * CSS height, and the section sticks to the top of the viewport for as
 * long as the wrapper is being scrolled through.
 *
 * The word-by-word h1 reveal carries the full headline via aria-label on
 * the heading itself; the animated per-word spans are aria-hidden, so
 * screen readers announce the complete string once.
 */
export function HeroSection() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useHeroTimeline(sectionRef, { enabled: !prefersReducedMotion });
  const { loadProgress, isReady } = useHeroCinematic(wrapperRef, sectionRef, canvasRef, {
    enabled: !prefersReducedMotion,
  });

  return (
    <div ref={wrapperRef} className="relative h-[180vh] md:h-[220vh] lg:h-[280vh]">
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
        <div className="relative z-10 mx-auto w-full max-w-[var(--container-content)] px-4 pb-10 sm:px-6 md:pb-16 lg:px-8 lg:pb-24">
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

        <div className="absolute inset-x-0 bottom-0 z-10">
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
