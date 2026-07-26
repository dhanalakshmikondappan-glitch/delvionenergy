import { TrustCard } from "~/components/layout/TrustCard";
import { TRUST_ITEMS } from "~/constants/trust";

/** MASTER.md §18: elegant horizontal row of trust cards beneath the CTA row. */
export function TrustIndicators() {
  return (
    <div
      data-hero="trust"
      className="flex flex-wrap items-stretch justify-center gap-4 opacity-0"
    >
      {TRUST_ITEMS.map((item) => (
        <TrustCard key={item.label} label={item.label} />
      ))}
    </div>
  );
}
