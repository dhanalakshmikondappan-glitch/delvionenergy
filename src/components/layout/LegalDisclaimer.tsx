import { AlertTriangle } from "lucide-react";

/**
 * Every legal page carries this — the copy below it is generic template
 * boilerplate, not reviewed by a lawyer for Delvion specifically. Shipping
 * it without this notice would misrepresent it as real, vetted policy.
 */
export function LegalDisclaimer() {
  return (
    <div className="mb-12 flex gap-3 rounded-[var(--radius-card)] border border-warning bg-surface-elevated p-6">
      <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-ink" size={20} strokeWidth={1.75} />
      <p className="text-body text-ink">
        <strong className="font-semibold">Draft placeholder — not yet reviewed by a lawyer.</strong> This page uses
        generic template language so the site isn't shipped with no policy at all. Replace it with copy reviewed by
        qualified legal counsel for your jurisdiction before this site goes live.
      </p>
    </div>
  );
}
