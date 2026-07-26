import { BadgeCheck } from "lucide-react";

interface TrustCardProps {
  label: string;
}

/** MASTER.md §77: 240px wide, 16px radius, icon top, hover glow — never rotate. */
export function TrustCard({ label }: TrustCardProps) {
  return (
    <div className="flex w-full max-w-[240px] flex-col items-center gap-2 rounded-2xl border border-ink-inverse/15 bg-ink-inverse/5 px-4 py-4 text-center backdrop-blur-sm transition-all duration-normal hover:-translate-y-1 hover:border-dawn/40 hover:shadow-[0_8px_28px_-6px_rgba(232,169,74,0.4)]">
      <BadgeCheck aria-hidden="true" className="text-dawn" size={24} strokeWidth={1.75} />
      <span className="text-caption font-medium text-ink-inverse">{label}</span>
    </div>
  );
}
