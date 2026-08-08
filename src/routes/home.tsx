import { Button } from "~/components/buttons/Button";
import { EnergyFlow } from "~/components/diagrams/EnergyFlow";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { buildMetaTags } from "~/constants/seo";
import { ROUTE_PATHS } from "~/constants/routePaths";
import { AutomationSection } from "~/sections/AutomationSection";
import { HeroSection } from "~/sections/HeroSection";
import { ProductsSection } from "~/sections/ProductsSection";
import { SolutionsTeaserSection } from "~/sections/SolutionsTeaserSection";
import { WhyDelvionSection } from "~/sections/WhyDelvionSection";
import { WhySolarSection } from "~/sections/WhySolarSection";

import type { Route } from "./+types/home";

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("home");
}

export default function Home() {
  return (
    <>
      <HeroSection />

      <Section background="elevated">
        <Container>
          <ScrollReveal>
            <EnergyFlow />
          </ScrollReveal>
        </Container>
      </Section>

      <WhySolarSection />
      <SolutionsTeaserSection />

      <ProductsSection />
      <AutomationSection />

      <WhyDelvionSection />

      <Section background="dark">
        <Container width="reading" className="text-center">
          <h2 className="text-section text-ink-inverse">Ready to start saving?</h2>
          <p className="mt-4 text-body-lg text-ink-inverse/85">
            Get a free consultation and a clear, transparent proposal for your property.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 md:flex-row">
            <Button to={ROUTE_PATHS.contact}>Get Free Consultation</Button>
            <Button to={ROUTE_PATHS.calculator} variant="secondary" inverse>
              Calculate Savings
            </Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
