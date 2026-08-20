import { Gauge, Receipt, TrendingUp } from "lucide-react";

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

import type { Route } from "./+types/solutions.commercial";

// MASTER.md §22 highlights, max 4 (§79).
const BENEFITS = [
  { icon: TrendingUp, title: "ROI", description: "Businesses consume electricity all day — solar offsets daytime usage directly." },
  { icon: Receipt, title: "Tax Benefits", description: "Commercial solar installations can qualify for applicable depreciation and tax benefits." },
  { icon: Gauge, title: "Operational Savings", description: "Lower daytime energy costs feed straight into operating margins." },
  { icon: TrendingUp, title: "Predictable Energy Costs", description: "Generate a known share of your own power instead of riding tariff increases." },
];

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("solutionsCommercial");
}

export default function SolutionsCommercial() {
  return (
    <>
      <JsonLd
        data={[
          buildServiceJsonLd({
            name: "Commercial Solar",
            description: ROUTE_SEO.solutionsCommercial.description,
            path: ROUTE_PATHS.solutionsCommercial,
          }),
          buildBreadcrumbJsonLd([
            { name: "Home", path: ROUTE_PATHS.home },
            { name: "Solutions", path: ROUTE_PATHS.solutions },
            { name: "Commercial", path: ROUTE_PATHS.solutionsCommercial },
          ]),
        ]}
      />
      <Section>
        <Container>
          <SectionHeader
            id="solutions-commercial-heading"
            headingLevel="h1"
            eyebrow="Commercial"
            title="Power Your Business Efficiently"
            description="Solar directly offsets the daytime energy usage that drives most commercial electricity bills."
          />

          <ScrollReveal variants={scaleIn} className="mt-12">
            <ParallaxImage className="aspect-video w-full rounded-[var(--radius-image)]">
              <ResponsiveImage
                basePath={SOLUTION_MEDIA.commercial.basePath}
                widths={SOLUTION_MEDIA.commercial.widths}
                alt={SOLUTION_MEDIA.commercial.alt}
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
            <Button to={ROUTE_PATHS.contact}>Book Business Consultation</Button>
          </div>
        </Container>
      </Section>
    </>
  );
}
