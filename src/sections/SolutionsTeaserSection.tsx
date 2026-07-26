import { Building2, Factory, Home as HomeIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SolutionCard } from "~/components/cards/SolutionCard";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { ROUTE_PATHS } from "~/constants/routePaths";

interface Teaser {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  imageBasePath: string;
  imageAlt: string;
}

const TEASERS: Teaser[] = [
  {
    icon: HomeIcon,
    title: "Residential",
    description: "Solar for your home.",
    path: ROUTE_PATHS.solutionsResidential,
    imageBasePath: "/media/solutions/residential",
    imageAlt: "A modern home with rooftop solar panels",
  },
  {
    icon: Building2,
    title: "Commercial",
    description: "Power your business efficiently.",
    path: ROUTE_PATHS.solutionsCommercial,
    imageBasePath: "/media/solutions/commercial",
    imageAlt: "A commercial building with rooftop solar panels",
  },
  {
    icon: Factory,
    title: "Industrial",
    description: "Industrial scale energy solutions.",
    path: ROUTE_PATHS.solutionsIndustrial,
    imageBasePath: "/media/solutions/industrial",
    imageAlt: "An industrial site with a large-scale rooftop solar installation",
  },
];

export function SolutionsTeaserSection() {
  return (
    <Section>
      <Container width="content">
        <SectionHeader id="solutions-teaser-heading" eyebrow="Solutions" title="Built for how you actually use power" />

        <StaggerGroup className="mt-12 grid gap-6 md:grid-cols-3">
          {TEASERS.map((teaser) => (
            <StaggerItem key={teaser.title}>
              <SolutionCard
                icon={teaser.icon}
                title={teaser.title}
                description={teaser.description}
                path={teaser.path}
                imageBasePath={teaser.imageBasePath}
                imageAlt={teaser.imageAlt}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
