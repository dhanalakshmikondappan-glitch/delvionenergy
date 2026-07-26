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

          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <div className="mx-auto w-full max-w-[var(--container-form)]">
              <ContactForm />
            </div>

            <div className="flex flex-col gap-6">
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
