import { MessageCircle } from "lucide-react";

import { COMPANY } from "~/constants/company";

/**
 * MASTER.md §86: floating WhatsApp CTA, visible throughout the site. Uses
 * the site's own dawn accent rather than WhatsApp's brand green — with the
 * rebrand's primary accent (mercury) now itself a green, a green FAB here
 * would risk reading as WhatsApp's own styling rather than the site's;
 * amber sidesteps that ambiguity entirely while staying restrained (§7),
 * a small-scale use consistent with dawn's "sparingly, small details"
 * rule. Sits below the mobile menu's z-index so the full-screen menu
 * correctly covers it instead of floating on top.
 */
export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${COMPANY.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-6 bottom-6 z-[var(--z-overlay)] flex h-14 w-14 items-center justify-center rounded-full bg-dawn text-ink shadow-lg transition-transform duration-fast hover:-translate-y-1"
    >
      <MessageCircle aria-hidden="true" size={26} strokeWidth={2} />
    </a>
  );
}
