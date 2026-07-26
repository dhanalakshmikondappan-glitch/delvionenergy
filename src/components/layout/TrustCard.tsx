import { BadgeCheck } from "lucide-react";

interface TrustCardProps {
  label: string;
}

/**
 * MASTER.md §77: 16px radius, icon + label, hover glow — never rotate.
 *
 * Compact horizontal chip on mobile (icon beside label, tight padding) so
 * four fit in a short 2-column grid without dominating the hero; from md up
 * it becomes the original 240px-wide vertical card (icon above label) for
 * the centered horizontal row.
 */
export function TrustCard({ label }: TrustCardProps) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-ink-inverse/15 bg-ink-inverse/5 px-3 py-2 text-center backdrop-blur-sm transition-all duration-normal hover:-translate-y-1 hover:border-dawn/40 hover:shadow-[0_8px_28px_-6px_rgba(232,169,74,0.4)] md:w-full md:max-w-[240px] md:flex-col md:px-4 md:py-4">
      <BadgeCheck aria-hidden="true" className="shrink-0 text-dawn" size={20} strokeWidth={1.75} />
      <span className="text-caption font-medium text-ink-inverse">{label}</span>
    </div>
  );
}
