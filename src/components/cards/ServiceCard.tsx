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
 * different business line with its slate-blue accent.
 */
export function ServiceCard({ tag, title, description }: ServiceCardProps) {
  return (
    <div className="rounded-[var(--radius-card)] border border-line bg-surface-elevated p-5 shadow-sm transition-all duration-normal hover:-translate-y-1 hover:border-slate hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(59,74,99,0.35)] sm:p-6 md:p-8">
      <span className="inline-block rounded-full bg-slate/10 px-3 py-1 text-fine font-semibold uppercase tracking-wider text-slate">
        {tag}
      </span>
      <h3 className="mt-4 text-subheading">{title}</h3>
      <p className="mt-2 text-body text-ink-muted">{description}</p>
    </div>
  );
}
