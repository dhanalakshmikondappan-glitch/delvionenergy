/**
 * Shared card shell: 32px padding, 20px radius, subtle shadow, hover
 * elevation (MASTER.md §49/§82). Used by both FeatureCard (monochrome
 * icon, mercury accent) and ServiceCard (tag badge, slate accent) so the
 * shell itself — padding, radius, shadow, elevation — only has one
 * definition; only the hover accent color differs per card variant.
 */
export const CARD_SHELL_BASE =
  "rounded-[var(--radius-card)] border border-line bg-surface-elevated p-5 shadow-sm transition-all duration-normal hover:-translate-y-1 sm:p-6 md:p-8";

export const CARD_SHELL_HOVER_ACCENT = {
  mercury: "hover:border-mercury hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(79,169,126,0.35)]",
  slate: "hover:border-slate hover:shadow-[0_4px_16px_rgba(0,0,0,0.06),0_12px_32px_-8px_rgba(59,74,99,0.35)]",
} as const;
