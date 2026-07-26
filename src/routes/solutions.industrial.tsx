import { Activity, Building2, Factory, Settings } from "lucide-react";

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
import { ROUTE_PATHS } from "~/constants/routePaths";
import { buildMetaTags, ROUTE_SEO } from "~/constants/seo";
import { buildBreadcrumbJsonLd, buildServiceJsonLd } from "~/utils/structuredData";

import type { Route } from "./+types/solutions.industrial";

// MASTER.md §23, combined to 4 to respect §79's benefit-count cap.
const CAPABILITIES = [
  { icon: Building2, title: "Large Rooftops", description: "Engineered for the scale of industrial and warehouse roof structures." },
  { icon: Factory, title: "Factory Integration", description: "Systems designed around existing factory electrical infrastructure and load profiles." },
  { icon: Settings, title: "Custom Engineering", description: "Every installation is engineered to the site, not adapted from a standard template." },
  { icon: Activity, title: "Monitoring & Maintenance", description: "Ongoing monitoring and annual maintenance keep the system performing as designed." },
];

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("solutionsIndustrial");
}

export default function SolutionsIndustrial() {
  return (
    <>
      <JsonLd
        data={[
          buildServiceJsonLd({
            name: "Industrial Solar",
            description: ROUTE_SEO.solutionsIndustrial.description,
            path: ROUTE_PATHS.solutionsIndustrial,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: ROUTE_PATHS.home },
            { name: "Solutions", path: ROUTE_PATHS.solutions },
            { name: "Industrial", path: ROUTE_PATHS.solutionsIndustrial },
          ]),
        ]}
      />
      <Section>
        <Container>
          <SectionHeader
            id="solutions-industrial-heading"
            headingLevel="h1"
            eyebrow="Industrial"
            title="Industrial Scale Energy Solutions"
            description="Large rooftops, factory integration, custom engineering — built for industrial scale from the start."
          />

          <ScrollReveal variants={scaleIn} className="mt-12">
            <ParallaxImage className="aspect-video w-full rounded-[var(--radius-image)]">
              <ResponsiveImage
                basePath="/media/solutions/industrial"
                widths={[640, 960, 1280, 1600, 1920]}
                alt="An industrial site with a large-scale rooftop solar installation"
                className="h-full w-full object-cover"
              />
            </ParallaxImage>
          </ScrollReveal>
        </Container>
      </Section>

      <Section background="elevated">
        <Container width="content">
          <StaggerGroup className="grid gap-6 md:grid-cols-2">
            {CAPABILITIES.map((capability) => (
              <StaggerItem key={capability.title}>
                <FeatureCard icon={capability.icon} title={capability.title} description={capability.description} />
              </StaggerItem>
            ))}
          </StaggerGroup>
        </Container>
      </Section>

      <Section>
        <Container width="content" className="flex justify-center">
          <Button to={ROUTE_PATHS.contact}>Book Industrial Consultation</Button>
        </Container>
      </Section>
    </>
  );
}
