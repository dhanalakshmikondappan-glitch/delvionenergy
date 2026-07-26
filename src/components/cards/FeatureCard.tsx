import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * MASTER.md §49/§82: 32px padding, 20px radius, subtle shadow, hover
 * elevation + mercury border. Icon is dark ink, not an accent color — a flat
 * monochrome icon fits the minimal brand direction better than a colored
 * badge would anyway (§105: icons support meaning, never decorate).
 */
export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface-elevated p-8 shadow-sm transition-all duration-normal hover:-translate-y-1 hover:border-mercury hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(79,169,126,0.35)]">
      <Icon aria-hidden="true" className="text-ink" size={32} strokeWidth={1.75} />
      <h3 className="mt-4 text-subheading">{title}</h3>
      <p className="mt-2 text-body text-ink-muted">{description}</p>
    </div>
  );
}
