import { Award, MessageCircle, Receipt, ShieldCheck, Wrench } from "lucide-react";

import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { FeatureCard } from "~/components/cards/FeatureCard";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";

// MASTER.md §26, verbatim.
const REASONS = [
  { icon: Award, title: "Engineering Expertise", description: "Every system is designed by engineers, not sold off a template." },
  { icon: ShieldCheck, title: "Premium Components", description: "We install premium panels and inverters built to last for decades." },
  { icon: Wrench, title: "Professional Installation", description: "Trained installation teams follow a consistent, documented process." },
  { icon: Receipt, title: "Transparent Pricing", description: "One clear quote, no hidden costs added after the fact." },
  { icon: MessageCircle, title: "Dedicated Support", description: "A direct point of contact from consultation through installation." },
  { icon: ShieldCheck, title: "Warranty Assistance", description: "We help manage warranty claims for as long as your system is covered." },
];

/** MASTER.md §26: differentiate from local competitors. */
export function WhyDelvionSection() {
  return (
    <Section background="elevated">
      <Container width="content">
        <SectionHeader id="why-delvion-heading" eyebrow="Why Delvion" title="Engineering You Can Trust" />

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => (
            <StaggerItem key={reason.title}>
              <FeatureCard icon={reason.icon} title={reason.title} description={reason.description} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
