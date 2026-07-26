import { Button } from "~/components/buttons/Button";
import { EnergyFlow } from "~/components/diagrams/EnergyFlow";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { ROUTE_PATHS } from "~/constants/routePaths";
import { buildMetaTags } from "~/constants/seo";

import type { Route } from "./+types/how-solar-works";

const STEPS = [
  {
    title: "Sunlight",
    description: "Sunlight reaches the panels installed on your rooftop throughout the day.",
  },
  {
    title: "Solar Panels",
    description: "Photovoltaic cells inside each panel convert that sunlight directly into DC electricity.",
  },
  {
    title: "Inverter",
    description: "The inverter converts DC electricity into the AC power your home or business actually uses.",
  },
  {
    title: "Home / Business",
    description: "Your appliances and equipment draw on this clean, self-generated power first.",
  },
  {
    title: "Grid",
    description: "Surplus power exports to the grid; the grid supplies power when your system needs more than it generates.",
  },
  {
    title: "Savings",
    description: "Net metering measures the difference between what you generate and what you draw, cutting your bill.",
  },
];

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("howSolarWorks");
}

export default function HowSolarWorks() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            id="how-solar-works-heading"
            headingLevel="h1"
            eyebrow="How Solar Works"
            title="Solar energy is simpler than you think"
            description="Six steps take sunlight from your rooftop to a lower electricity bill."
          />

          <ScrollReveal className="mt-16">
            <EnergyFlow />
          </ScrollReveal>
        </Container>
      </Section>

      <Section background="elevated">
        <Container width="content">
          <StaggerGroup className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((step, index) => (
              <StaggerItem key={step.title} className="rounded-[var(--radius-card)] border border-line bg-surface p-8">
                <span className="font-numeric text-caption font-medium text-ink-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 text-subheading">{step.title}</h3>
                <p className="mt-2 text-body text-ink-muted">{step.description}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-16 flex justify-center">
            <Button to={ROUTE_PATHS.calculator}>Calculate Your Savings</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
