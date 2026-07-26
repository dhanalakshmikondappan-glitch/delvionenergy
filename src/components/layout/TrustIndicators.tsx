import { TrustCard } from "~/components/layout/TrustCard";
import { TRUST_ITEMS } from "~/constants/trust";

/**
 * MASTER.md §18: elegant trust indicators beneath the CTA row.
 *
 * On mobile these are compact single-line chips (icon beside label, see
 * TrustCard) that wrap to ~two short rows, rather than four full-width
 * stacked cards. The stacked version was ~390px tall and, combined with the
 * headline, subtitle and CTAs above it, pushed the whole bottom-aligned
 * hero stack taller than a phone viewport — the overflow went off the *top*,
 * sliding the headline up under the navbar. The compact row keeps the full
 * hero stack within the viewport (verified down to a 667px-tall screen) so
 * the headline stays visible and clear of the navbar. From md up it relaxes
 * into the original centered row of wider vertical cards.
 */
export function TrustIndicators() {
  return (
    <div
      data-hero="trust"
      className="flex flex-wrap items-center justify-center gap-2.5 opacity-0 md:items-stretch md:gap-4"
    >
      {TRUST_ITEMS.map((item) => (
        <TrustCard key={item.label} label={item.label} />
      ))}
    </div>
  );
}
