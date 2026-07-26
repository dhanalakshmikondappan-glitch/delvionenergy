/**
 * MASTER.md §16/§74: dark gradient over the hero media, ensuring the
 * headline/CTA and (docs/DECISIONS.md — Phase 7) the journey captions stay
 * readable regardless of the footage beneath. Bottom-weighted since both
 * content states are bottom-aligned. Fades in once during the entrance
 * timeline and then simply stays — it doesn't need to change again once
 * scrolling starts scrubbing the frame sequence underneath it.
 *
 * Explicit gradient stops (not Tailwind's from/via/to, whose `via` sits at
 * a fixed 50%) — an earlier version's `via` stop was only 15% dark, which
 * left the upper lines of a wrapped headline sitting against a
 * barely-darkened, bright golden-hour sky with poor contrast. This stays
 * at least 65% dark through the middle of the frame — comfortably covering
 * both the hero headline and the journey captions, which occupy overlapping
 * bottom-to-middle space — and only lightens near the very top, where
 * neither content state ever puts text.
 */
export function HeroOverlay() {
  return (
    <div
      aria-hidden="true"
      data-hero="overlay"
      className="absolute inset-0 bg-[linear-gradient(to_top,rgba(22,60,46,0.9)_0%,rgba(22,60,46,0.68)_50%,rgba(22,60,46,0.22)_100%)] opacity-0"
    />
  );
}
