import { CARD_SHELL_BASE, CARD_SHELL_HOVER_ACCENT } from "~/components/cards/cardShell";

interface ServiceCardProps {
  tag: string;
  title: string;
  description: string;
}

/**
 * Card variant for the Industrial Automation section — uses a coloured tag
 * badge (e.g. "Build", "Retrofit") instead of a Lucide icon. Visually
 * related to FeatureCard but intentionally separate: FeatureCard's design
 * is tied to flat monochrome icons (§105), while this component signals a
 * different business line with its slate-blue accent. Shares the card
 * shell (padding/radius/shadow) with FeatureCard via cardShell.ts — only
 * the hover accent color differs.
 */
export function ServiceCard({ tag, title, description }: ServiceCardProps) {
  return (
    <div className={`${CARD_SHELL_BASE} ${CARD_SHELL_HOVER_ACCENT.slate}`}>
      <span className="inline-block rounded-full bg-slate/10 px-3 py-1 text-fine font-semibold uppercase tracking-wider text-slate">
        {tag}
      </span>
      <h3 className="mt-4 text-subheading">{title}</h3>
      <p className="mt-2 text-body text-ink-muted">{description}</p>
    </div>
  );
}
