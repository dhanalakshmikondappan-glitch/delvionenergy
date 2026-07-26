import { Button } from "~/components/buttons/Button";
import { EnergyFlow } from "~/components/diagrams/EnergyFlow";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { ROUTE_PATHS } from "~/constants/routePaths";

export function HowSolarWorksPreview() {
  return (
    <Section background="elevated">
      <Container>
        <SectionHeader
          id="how-solar-works-preview-heading"
          eyebrow="How Solar Works"
          title="Solar energy is simpler than you think"
          description="Sunlight becomes savings in six straightforward steps."
        />

        <ScrollReveal className="mt-16">
          <EnergyFlow />
        </ScrollReveal>

        <div className="mt-16 flex justify-center">
          <Button to={ROUTE_PATHS.howSolarWorks} variant="secondary">
            See the Full Process
          </Button>
        </div>
      </Container>
    </Section>
  );
}
