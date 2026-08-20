import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { COMPANY } from "~/constants/company";
import { buildMetaTags } from "~/constants/seo";

import type { Route } from "./+types/privacy-policy";

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("privacyPolicy");
}

export default function PrivacyPolicy() {
  return (
    <Section>
      <Container width="reading">
        <SectionHeader id="privacy-policy-heading" headingLevel="h1" title="Privacy Policy" align="left" />

        <div className="mt-12 flex flex-col gap-8 text-body text-ink-muted">
          <section>
            <h2 className="text-subheading text-ink">Information We Collect</h2>
            <p className="mt-2">
              We collect information you provide directly to us, such as your name, phone number, email address,
              location, property type and monthly electricity bill, when you use our contact form or savings
              calculator. We do not collect this information through any other means.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">How We Use Your Information</h2>
            <p className="mt-2">
              We use the information you provide to respond to your inquiry, prepare a consultation or quote, and
              communicate with you about your solar installation. We do not sell your information to third parties.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Third-Party Services</h2>
            <p className="mt-2">
              Our WhatsApp and email contact options hand off to those third-party platforms directly in your
              browser or device; their own privacy policies govern how they handle your message once sent.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Cookies</h2>
            <p className="mt-2">
              This website does not currently use analytics or advertising cookies. If that changes in the future,
              this policy will be updated to describe what is collected and why.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Data Retention</h2>
            <p className="mt-2">
              We retain the information you submit for as long as necessary to respond to your inquiry and, if you
              become a customer, for the duration of our business relationship and as required by law.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Your Rights</h2>
            <p className="mt-2">
              You may request access to, correction of, or deletion of the personal information you've shared with
              us at any time by contacting us using the details below.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Changes to This Policy</h2>
            <p className="mt-2">
              We may update this policy from time to time. Changes will be posted on this page.
            </p>
          </section>

          <section>
            <h2 className="text-subheading text-ink">Contact Us</h2>
            <p className="mt-2">
              Questions about this policy can be sent to{" "}
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
