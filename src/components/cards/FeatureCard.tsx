import type { LucideIcon } from "lucide-react";

import { CARD_SHELL_BASE, CARD_SHELL_HOVER_ACCENT } from "~/components/cards/cardShell";

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
    <div className={`${CARD_SHELL_BASE} ${CARD_SHELL_HOVER_ACCENT.mercury}`}>
      <Icon aria-hidden="true" className="text-ink" size={32} strokeWidth={1.75} />
      <h3 className="mt-4 text-subheading">{title}</h3>
      <p className="mt-2 text-body text-ink-muted">{description}</p>
    </div>
  );
}
