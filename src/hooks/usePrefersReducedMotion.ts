import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => {
    mediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

/**
 * Motion is allowed during prerendering — see the note below on why this
 * value, specifically, has to be the one the hydration render sees too.
 */
function getServerSnapshot(): boolean {
  return false;
}

/**
 * MASTER.md §37/§56: every animated experience must respect this setting.
 *
 * `useSyncExternalStore` rather than `useState` + `useEffect`, because the
 * hydration render is the subtle part. Reading `matchMedia` in a `useState`
 * initializer looks equivalent, but that initializer *does* run on the client
 * during hydration and returns the real preference — so a reduced-motion
 * visitor hydrated `true` against HTML prerendered with `false`, and
 * `HeroSection`'s loading-indicator branch (`!isReady && !prefersReducedMotion`)
 * rendered a div on the server and nothing on the client. That is a genuine
 * hydration mismatch (React error #418 on the homepage, reduced motion only):
 * React recovers by re-rendering the whole tree client-side, which costs a
 * beat on load and throws away the prerendered HTML the splash screen is
 * timed against.
 *
 * `getServerSnapshot` fixes it by pinning the hydration render to `false` —
 * matching the prerendered markup exactly — after which React immediately
 * re-renders with the real preference from `getSnapshot`. Defaulting to
 * "motion allowed" is also the right conservative choice on its own terms:
 * assuming reduced motion would flash a static page at every visitor who
 * hasn't asked for one.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
