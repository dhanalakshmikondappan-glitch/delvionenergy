import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * MASTER.md §37/§56: every animated experience must respect this setting.
 * Defaults to `false` (motion allowed) during prerendering and on first
 * paint — the correct conservative default, since the alternative (assuming
 * reduced motion) would show every non-reduced-motion visitor a static page
 * for one frame. Corrects itself via the media query listener immediately
 * after mount for users who do prefer reduced motion.
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() =>
    typeof window === "undefined" ? false : window.matchMedia(QUERY).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(QUERY);

    function handleChange(event: MediaQueryListEvent) {
      setPrefersReduced(event.matches);
    }

    mediaQuery.addEventListener("change", handleChange);
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);

  return prefersReduced;
}
