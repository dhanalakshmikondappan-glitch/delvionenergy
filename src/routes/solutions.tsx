import { Building2, Factory, Home as HomeIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { scaleIn } from "~/animations/fade";
import { SolutionCard } from "~/components/cards/SolutionCard";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ResponsiveImage } from "~/components/media/ResponsiveImage";
import { ParallaxImage } from "~/components/motion/ParallaxImage";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { SOLUTION_MEDIA } from "~/constants/media";
import type { ImageAsset } from "~/constants/media";
import { ROUTE_PATHS } from "~/constants/routePaths";
import { buildMetaTags } from "~/constants/seo";

import type { Route } from "./+types/solutions";

interface SolutionTeaser {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  image: ImageAsset;
}

const SOLUTIONS: SolutionTeaser[] = [
  {
    icon: HomeIcon,
    title: "Residential",
    description: "Reduce electricity bills while increasing property value.",
    path: ROUTE_PATHS.solutionsResidential,
    image: SOLUTION_MEDIA.residential,
  },
  {
    icon: Building2,
    title: "Commercial",
    description: "Offset daytime energy usage with predictable, lower operating costs.",
    path: ROUTE_PATHS.solutionsCommercial,
    image: SOLUTION_MEDIA.commercial,
  },
  {
    icon: Factory,
    title: "Industrial",
    description: "Custom-engineered, large-scale solar for factories and industrial rooftops.",
    path: ROUTE_PATHS.solutionsIndustrial,
    image: SOLUTION_MEDIA.industrial,
  },
];

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("solutions");
}

export default function Solutions() {
  return (
    <>
      <Section>
        <Container>
          <SectionHeader
            id="solutions-heading"
            headingLevel="h1"
            title="Solar Solutions for Every Scale"
            description="Residential, commercial and industrial solutions — each engineered around how the building actually uses power."
          />

          <ScrollReveal variants={scaleIn} className="mt-12">
            <ParallaxImage className="aspect-video w-full rounded-[var(--radius-image)]">
              <ResponsiveImage
                basePath={SOLUTION_MEDIA.hub.basePath}
                widths={SOLUTION_MEDIA.hub.widths}
                alt={SOLUTION_MEDIA.hub.alt}
                className="h-full w-full object-cover"
              />
            </ParallaxImage>
          </ScrollReveal>
        </Container>
      </Section>

      <Section background="elevated">
        <Container width="content">
          <StaggerGroup className="grid gap-8 md:grid-cols-3">
            {SOLUTIONS.map((solution) => (
              <StaggerItem key={solution.title}>
                <SolutionCard
                  icon={solution.icon}
                  title={solution.title}
                  description={solution.description}
                  path={solution.path}
                  image={solution.image}
                  headingLevel="h2"
                />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </Section>
    </>
  );
}
