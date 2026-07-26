import { useEffect } from "react";
import type { RefObject } from "react";

// gsap's ambient type declarations (gsap.core.Timeline below) are globally
// available once any file references the "gsap" module — the dynamic
// import() further down brings its types into scope, so no top-level
// import is needed here.

interface UseHeroTimelineOptions {
  enabled: boolean;
}

/**
 * MASTER.md §17's hero reveal timeline, expressed as a single GSAP
 * timeline — the one place GSAP is used at all (§55: everywhere else uses
 * Framer Motion). GSAP is dynamically imported so it never enters the
 * initial bundle.
 *
 * Targets elements inside `containerRef` via `[data-hero="..."]` attributes
 * rather than individual refs threaded through every child component.
 *
 * When `enabled` is false (reduced motion), every element is snapped
 * straight to its final revealed state instead — no timeline, no GSAP
 * import at all.
 */
export function useHeroTimeline(containerRef: RefObject<HTMLElement | null>, { enabled }: UseHeroTimelineOptions): void {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // On a repeat visit within the same tab the splash is skipped, so
    // replaying the theatrical reveal would just look like the hero loading
    // in from blank on every reload. Snap straight to the final state
    // instead — same as the reduced-motion branch — so a reload (or an
    // in-session return to the home route) is instant and seamless. base.css
    // already does this visually via pure CSS before this effect runs, so
    // there's no flash; skipping the timeline here also avoids importing
    // GSAP at all on a reload. Reads the same signals the splash uses: the
    // <html> data attribute (set on full reload) and sessionStorage (also
    // covers a client-side navigation back to home within the session).
    let splashSeen = document.documentElement.dataset.splashSeen === "true";
    try {
      splashSeen = splashSeen || sessionStorage.getItem("delvion-splash-seen") === "1";
    } catch {
      // sessionStorage unavailable (private mode) — fall back to the
      // data attribute alone, which still covers the full-reload case.
    }

    if (!enabled || splashSeen) {
      container.querySelectorAll<HTMLElement>("[data-hero]").forEach((el) => {
        el.style.opacity = "1";
        el.style.transform = "none";
      });
      return;
    }

    let timeline: gsap.core.Timeline | undefined;
    let cancelled = false;

    void import("gsap").then(({ gsap: gsapInstance }) => {
      if (cancelled) return;

      const overlay = container.querySelector<HTMLElement>('[data-hero="overlay"]');
      const words = container.querySelectorAll<HTMLElement>('[data-hero="word"]');
      const subtitle = container.querySelector<HTMLElement>('[data-hero="subtitle"]');
      const cta = container.querySelector<HTMLElement>('[data-hero="cta"]');
      const trust = container.querySelector<HTMLElement>('[data-hero="trust"]');
      const glow = container.querySelector<HTMLElement>('[data-hero="glow"]');

      timeline = gsapInstance.timeline();

      // Offsets are MASTER.md §17's exact timeline, in seconds.
      if (overlay) timeline.to(overlay, { opacity: 1, duration: 0.6, ease: "power2.out" }, 0.3);
      if (words.length > 0) {
        timeline.to(words, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.8);
      }
      if (subtitle) timeline.to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.1);
      if (cta) timeline.to(cta, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.4);
      if (trust) timeline.to(trust, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 1.8);
      if (glow) timeline.to(glow, { opacity: 1, duration: 0.8, ease: "power2.out" }, 2.2);
    });

    return () => {
      cancelled = true;
      timeline?.kill();
    };
  }, [containerRef, enabled]);
}
