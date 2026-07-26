import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { ContactForm } from "~/components/forms/ContactForm";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { JsonLd } from "~/components/seo/JsonLd";
import { COMPANY } from "~/constants/company";
import { buildMetaTags } from "~/constants/seo";
import { buildLocalBusinessJsonLd } from "~/utils/structuredData";

import type { Route } from "./+types/contact";

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("contact");
}

export default function Contact() {
  return (
    <>
      <JsonLd data={buildLocalBusinessJsonLd()} />
      <Section>
        <Container width="max">
          <SectionHeader
            id="contact-heading"
            headingLevel="h1"
            title="Contact Delvion Energy"
            description="Schedule a free site visit, or reach us directly. Business details below are placeholders — see docs/DECISIONS.md."
          />

          {/* pr-20: clears the fixed WhatsAppButton (right-6 bottom-6, 56px,
              ~80px collision zone below lg:) — confirmed directly, the
              message textarea's corner and the submit button sat behind it
              at 320-375px. Both stacked mobile columns (form, then contact
              cards) share this one wrapper, so a single fix here covers
              both. Not needed at lg:+, where this becomes a column in a
              centered, wide-margined layout far from the viewport edge. */}
          <div className="mt-12 grid gap-12 pr-20 lg:grid-cols-2 lg:pr-0">
            {/* min-w-0: grid items default to min-width: auto, so without
                this the column refused to shrink below its content's
                intrinsic width and overflowed straight past the pr-20
                clearance above — confirmed directly (the form measured
                13.6px wider than its own track). */}
            <div className="mx-auto w-full min-w-0 max-w-[var(--container-form)]">
              <ContactForm />
            </div>

            <div className="flex min-w-0 flex-col gap-6">
              <a
                href={`tel:${COMPANY.phone}`}
                className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface-elevated p-6 transition-colors duration-fast hover:border-mercury"
              >
                <Phone aria-hidden="true" className="shrink-0 text-ink" size={24} strokeWidth={1.75} />
                <div>
                  <p className="text-caption text-ink-muted">Call us</p>
                  <p className="text-body font-medium text-ink">{COMPANY.phoneDisplay}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/${COMPANY.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface-elevated p-6 transition-colors duration-fast hover:border-mercury"
              >
                <MessageCircle aria-hidden="true" className="shrink-0 text-ink" size={24} strokeWidth={1.75} />
                <div>
                  <p className="text-caption text-ink-muted">WhatsApp</p>
                  <p className="text-body font-medium text-ink">Message us</p>
                </div>
              </a>

              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface-elevated p-6 transition-colors duration-fast hover:border-mercury"
              >
                <Mail aria-hidden="true" className="shrink-0 text-ink" size={24} strokeWidth={1.75} />
                <div>
                  <p className="text-caption text-ink-muted">Email</p>
                  <p className="text-body font-medium text-ink">{COMPANY.email}</p>
                </div>
              </a>

              <div className="flex items-center gap-4 rounded-[var(--radius-card)] border border-line bg-surface-elevated p-6">
                <MapPin aria-hidden="true" className="shrink-0 text-ink" size={24} strokeWidth={1.75} />
                <div>
                  <p className="text-caption text-ink-muted">Office</p>
                  <p className="text-body font-medium text-ink">
                    {COMPANY.address.addressLocality}, {COMPANY.address.addressRegion}
                  </p>
                </div>
              </div>

              {/* No Google Maps API key exists yet — a static "office info"
                  card is honest; a fabricated embed would silently fail or
                  need a key we don't have. Swap for a real embed once one
                  is available. */}
              <div className="flex aspect-video w-full items-center justify-center rounded-[var(--radius-image)] border border-dashed border-line bg-surface text-center">
                <p className="px-6 text-caption text-ink-muted">Map embed pending office address confirmation.</p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
