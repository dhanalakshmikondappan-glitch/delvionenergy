import { ChevronDown } from "lucide-react";

/** Purely decorative scroll affordance — scrolling is discoverable natively, so this is aria-hidden. */
export function ScrollIndicator() {
  return (
    <div aria-hidden="true" className="absolute inset-x-0 bottom-8 z-10 flex justify-center">
      <ChevronDown className="animate-scroll-hint text-ink-inverse/70" size={28} strokeWidth={1.5} />
    </div>
  );
}
