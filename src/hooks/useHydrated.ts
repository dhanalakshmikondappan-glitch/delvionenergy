import { useSyncExternalStore } from "react";

/** Never fires: whether the app has hydrated only ever changes once, at hydration. */
function subscribe() {
  return () => {
    // no-op
  };
}

/**
 * False during server render and during the hydration pass, true afterwards.
 *
 * The site prerenders to static HTML (`ssr: false` + prerender), so one HTML
 * file answers every query string for a route. Any UI whose first render
 * depends on `location.search` would therefore hydrate against markup that
 * assumed no query string at all. Gating that read on this hook keeps the
 * hydration render byte-identical to the prerendered HTML and lets React
 * re-render with the real value immediately after — the same problem the
 * `mounted` gate in Modal solves, without a state update inside an effect.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
