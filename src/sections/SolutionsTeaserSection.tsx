import { Building2, Factory, Home as HomeIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { SolutionCard } from "~/components/cards/SolutionCard";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { SOLUTION_MEDIA } from "~/constants/media";
import type { ImageAsset } from "~/constants/media";
import { ROUTE_PATHS } from "~/constants/routePaths";

interface Teaser {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  image: ImageAsset;
}

const TEASERS: Teaser[] = [
  {
    icon: HomeIcon,
    title: "Residential",
    description: "Solar for your home.",
    path: ROUTE_PATHS.solutionsResidential,
    image: SOLUTION_MEDIA.residential,
  },
  {
    icon: Building2,
    title: "Commercial",
    description: "Power your business efficiently.",
    path: ROUTE_PATHS.solutionsCommercial,
    image: SOLUTION_MEDIA.commercial,
  },
  {
    icon: Factory,
    title: "Industrial",
    description: "Industrial scale energy solutions.",
    path: ROUTE_PATHS.solutionsIndustrial,
    image: SOLUTION_MEDIA.industrial,
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
                image={teaser.image}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </Section>
  );
}
