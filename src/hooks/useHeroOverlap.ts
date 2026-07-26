import { useEffect, useState } from "react";

export const HERO_SENTINEL_ID = "hero-sentinel";

/**
 * Must return the identical value on the server and on the client's first
 * (hydrating) render — no `document` query here. Querying the DOM at this
 * point previously caused a real hydration mismatch (React error #418):
 * the server always sees no sentinel (no DOM exists yet) and rendered
 * "solid", while the client's first render found the sentinel already
 * present in the server-rendered HTML and computed "transparent" instead,
 * so React discarded and re-rendered the whole tree on every load —
 * measurably hurting LCP/FCP, not just a console warning.
 *
 * `enabled` reliably means "this route renders a HeroSection", which
 * always renders the sentinel, so a route with a hero can safely assume
 * it starts transparent — the effect below reconciles against the real
 * scroll position immediately after hydration.
 */
function computeInitialIsPastHero(enabled: boolean): boolean {
  return !enabled;
}

/**
 * Drives the navbar's transparent -> solid transition using an
 * IntersectionObserver against a sentinel element HeroSection renders at
 * its own bottom edge, instead of a window scroll listener (no per-frame
 * work; MASTER.md §32 "never flashy" pairs with "never janky").
 *
 * Because the Navbar persists across client-side navigation (it lives in
 * the shared layout route), `enabled` can flip on an already-mounted
 * instance — e.g. navigating home -> contact -> home again. State is reset
 * during render when `enabled` changes (React's documented pattern for
 * resetting derived state on a prop change) rather than in an effect, so a
 * stale "past hero" value from a previous visit can't leak into a fresh one.
 */
export function useHeroOverlap(enabled: boolean): boolean {
  const [isPastHero, setIsPastHero] = useState(() => computeInitialIsPastHero(enabled));
  const [prevEnabled, setPrevEnabled] = useState(enabled);

  if (enabled !== prevEnabled) {
    setPrevEnabled(enabled);
    setIsPastHero(computeInitialIsPastHero(enabled));
  }

  useEffect(() => {
    if (!enabled) return;

    const sentinel = document.getElementById(HERO_SENTINEL_ID);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsPastHero(entry ? !entry.isIntersecting : true);
      },
      // Offsets the 80px navbar height (§72) so the switch happens exactly
      // as the sentinel passes under the fixed navbar, not one viewport late.
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  return isPastHero;
}
