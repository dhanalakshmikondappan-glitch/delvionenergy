import { Container } from "~/components/layout/Container";
import { LegalDisclaimer } from "~/components/layout/LegalDisclaimer";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { COMPANY } from "~/constants/company";
import { buildMetaTags } from "~/constants/seo";

import type { Route } from "./+types/terms";

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("terms");
}

export default function Terms() {
  return (
    <Section>
      <Container width="reading">
        <SectionHeader id="terms-heading" headingLevel="h1" title="Terms of Service" align="left" />

        <div className="mt-12">
          <LegalDisclaimer />
        </div>

        <div className="flex flex-col gap-8 text-body text-ink-muted">
          <section>
            <h2 className="text-subheading text-ink">Acceptance of Terms</h2>
            <p className="mt-2">
              By using this website, you agree to these terms. If you do not agree, please do not use the site.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Use of This Website</h2>
            <p className="mt-2">
              This website is provided to share information about Delvion Energy's solar solutions and to let
              visitors request a consultation. You agree to use it only for lawful purposes.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Savings Calculator Is an Estimate, Not a Quote</h2>
            <p className="mt-2">
              The savings calculator uses stated, illustrative assumptions about tariffs, generation and installed
              cost — not your specific utility rate or a verified site survey. Results are estimates for planning
              purposes only, and do not constitute a guarantee of savings or a binding quote. A final proposal
              requires a site visit.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Intellectual Property</h2>
            <p className="mt-2">
              The content, design and branding on this website belong to {COMPANY.legalName} unless otherwise noted,
              and may not be reproduced without permission.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">No Warranty</h2>
            <p className="mt-2">
              This website is provided "as is" without warranties of any kind, express or implied, regarding its
              accuracy, completeness or availability.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Limitation of Liability</h2>
            <p className="mt-2">
              To the extent permitted by law, {COMPANY.legalName} is not liable for any indirect, incidental or
              consequential damages arising from your use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Third-Party Links</h2>
            <p className="mt-2">
              Links to WhatsApp, email or other third-party services are provided for convenience; we are not
              responsible for the content or practices of those third parties.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Governing Law</h2>
            <p className="mt-2">These terms are governed by the laws of India.</p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Changes to These Terms</h2>
            <p className="mt-2">We may update these terms from time to time. Changes will be posted on this page.</p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Contact Us</h2>
            <p className="mt-2">
              Questions about these terms can be sent to{" "}
              <a href={`mailto:${COMPANY.email}`} className="underline decoration-current underline-offset-4">
                {COMPANY.email}
              </a>
              .
            </p>
          </section>
        </div>
      </Container>
    </Section>
  );
}
