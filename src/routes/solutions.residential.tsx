import { BatteryCharging, Landmark, ShieldCheck, TrendingDown } from "lucide-react";

import { scaleIn } from "~/animations/fade";
import { Button } from "~/components/buttons/Button";
import { FeatureCard } from "~/components/cards/FeatureCard";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ResponsiveImage } from "~/components/media/ResponsiveImage";
import { ParallaxImage } from "~/components/motion/ParallaxImage";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { JsonLd } from "~/components/seo/JsonLd";
import { SOLUTION_MEDIA } from "~/constants/media";
import { ROUTE_PATHS } from "~/constants/routePaths";
import { buildMetaTags, ROUTE_SEO } from "~/constants/seo";
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from "~/utils/structuredData";

import type { Route } from "./+types/solutions.residential";

// MASTER.md §21 benefits, max 4 (§79).
const BENEFITS = [
  { icon: TrendingDown, title: "Lower Bills", description: "Generate your own power and cut what you draw from the grid every month." },
  { icon: BatteryCharging, title: "Backup Power", description: "Pair with battery storage to keep essentials running during outages." },
  { icon: Landmark, title: "Government Subsidies", description: "Residential rooftop solar qualifies for applicable government subsidy schemes." },
  { icon: ShieldCheck, title: "25+ Year Lifespan", description: "Premium panels are built to perform reliably for decades." },
];

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("solutionsResidential");
}

export default function SolutionsResidential() {
  return (
    <>
      <JsonLd
        data={[
          buildServiceJsonLd({
            name: "Residential Solar",
            description: ROUTE_SEO.solutionsResidential.description,
            path: ROUTE_PATHS.solutionsResidential,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: ROUTE_PATHS.home },
            { name: "Solutions", path: ROUTE_PATHS.solutions },
            { name: "Residential", path: ROUTE_PATHS.solutionsResidential },
          ]),
        ]}
      />
      <Section>
        <Container>
          <SectionHeader
            id="solutions-residential-heading"
            headingLevel="h1"
            eyebrow="Residential"
            title="Solar for Your Home"
            description="Reduce electricity bills while increasing property value."
          />

          <ScrollReveal variants={scaleIn} className="mt-12">
            <ParallaxImage className="aspect-video w-full rounded-[var(--radius-image)]">
              <ResponsiveImage
                basePath={SOLUTION_MEDIA.residential.basePath}
                widths={SOLUTION_MEDIA.residential.widths}
                alt={SOLUTION_MEDIA.residential.alt}
                className="h-full w-full object-cover"
              />
            </ParallaxImage>
          </ScrollReveal>
        </Container>
      </Section>

      <Section background="elevated">
        <Container width="content">
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {BENEFITS.map((benefit) => (
              <StaggerItem key={benefit.title}>
                <FeatureCard icon={benefit.icon} title={benefit.title} description={benefit.description} />
              </StaggerItem>
            ))}
          </StaggerGroup>

          <div className="mt-16 flex justify-center">
            <Button to={ROUTE_PATHS.contact}>Book Home Consultation</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
