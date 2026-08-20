import { TrustCard } from "~/components/layout/TrustCard";
import { TRUST_ITEMS } from "~/constants/trust";

/**
 * MASTER.md §18: elegant trust indicators beneath the CTA row.
 *
 * On mobile these are compact single-line chips (icon beside label, see
 * TrustCard) rather than four full-width stacked cards, because the stacked
 * version was ~390px tall and pushed the bottom-anchored hero stack past the
 * viewport — the overflow goes off the *top*, sliding the headline under the
 * navbar. From md up it relaxes into the original centered row of wider
 * vertical cards.
 *
 * Chips alone were not enough on a short screen: once the labels outgrew half
 * the viewport width each one claimed its own row again (four rows, 186px).
 * The height-gated rules at the end of styles/base.css hold them to a
 * two-column grid below 700px of viewport height, and drop them entirely
 * below 520px (landscape phones), which is what actually keeps the headline
 * clear of the navbar down to a 360x640 screen.
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
