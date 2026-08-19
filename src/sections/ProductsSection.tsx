import { Box, Cable, PanelTop, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "~/components/buttons/Button";
import { FeatureCard } from "~/components/cards/FeatureCard";
import { FlowDiagram } from "~/components/diagrams/FlowDiagram";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ProductCarousel, type ProductSlide } from "~/components/media/ProductCarousel";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { ROUTE_PATHS } from "~/constants/routePaths";

const CIRCUIT_FLOW = [
  "Panels",
  "DC Distribution Box",
  "Solar Cables",
  "Inverter",
  "AC Distribution Box",
  "Earthing Kit",
];

// Real product photography (public/media/products/*) — every uploaded photo is
// an AC/DC distribution / combiner box, so the carousel is that product family.
const PRODUCT_SLIDES: ProductSlide[] = [
  {
    basePath: "/media/products/acdb-three-phase",
    caption: "Solar ACDB — Three Phase",
    alt: "Three-phase solar ACDB with a Havells four-pole MCB and surge arresters in a transparent enclosure",
  },
  {
    basePath: "/media/products/dcdb-2in-2out",
    caption: "Solar DCDB — 2 In / 2 Out",
    alt: "Solar DCDB combiner box labelled 2 in 2 out, with Havells PV surge arresters and fuse holders",
  },
  {
    basePath: "/media/products/acdb-three-phase-63a",
    caption: "Solar ACDB — Three Phase (63 A)",
    alt: "Three-phase solar ACDB with a Havells 63 amp MCB and surge arresters, enclosure closed",
  },
  {
    basePath: "/media/products/dc-combiner-open",
    caption: "Solar DCDB — Surge-Protected Combiner",
    alt: "Open DC combiner box with Phoenix Contact surge arresters, photovoltaic fuses and PV-IN / PV-OUT terminals",
  },
  {
    basePath: "/media/products/acdb-dcdb-combo",
    caption: "Solar ACDB + DCDB — Single-Phase Combo",
    alt: "Single-phase solar ACDB and a 1-in-1-out DCDB combiner box shown side by side",
  },
];

interface ProductCategory {
  icon: LucideIcon;
  title: string;
  description: string;
}

const CATEGORIES: ProductCategory[] = [
  {
    icon: PanelTop,
    title: "Solar Panels",
    description: "Mono PERC and bifacial modules from trusted manufacturers, matched to your project's needs.",
  },
  {
    icon: Zap,
    title: "Inverters",
    description: "On-grid, off-grid, and hybrid inverters, sized and sourced for the system you're building.",
  },
  {
    icon: Box,
    title: "AC / DC Distribution Box",
    description: "Protection and safe combination on both the panel side and the load side.",
  },
  {
    icon: Cable,
    title: "Solar Cables",
    description: "Weather-resistant cabling sized correctly for string length and current rating.",
  },
  {
    icon: ShieldCheck,
    title: "Earthing Kit",
    description: "Chemical or pipe earthing for safe structure and inverter grounding.",
  },
];

/**
 * Homepage Products section: certified PV accessories supplied to vendors and
 * installers. A circuit-flow diagram of the component chain, real
 * distribution-box photography in a carousel + lightbox, the full accessory
 * catalogue as category cards, and a vendor enquiry CTA. The `id="products"`
 * is the anchor target for the "Products" nav link; the `scroll-mt` offsets
 * the fixed navbar so the heading isn't hidden.
 */
export function ProductsSection() {
  return (
    <Section
      id="products"
      background="elevated"
      ariaLabelledBy="products-heading"
      className="scroll-mt-24"
    >
      <Container width="content">
        <SectionHeader
          id="products-heading"
          eyebrow="PV Accessories"
          title="Every component your system depends on"
          description="Beyond installations, we supply the certified hardware that goes into every solar system — panels, inverters, and the components that connect them — to vendors and installers across Tamil Nadu."
        />

        <ScrollReveal className="mt-8 md:mt-12">
          <FlowDiagram steps={CIRCUIT_FLOW} accentColor="mercury" ariaLabel="Component flow" />
        </ScrollReveal>

        <div className="mx-auto mt-8 md:mt-12 max-w-[var(--container-reading)]">
          <ProductCarousel slides={PRODUCT_SLIDES} />
        </div>

        <StaggerGroup className="mt-10 md:mt-16 grid gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((category) => (
            <StaggerItem key={category.title}>
              <FeatureCard
                icon={category.icon}
                title={category.title}
                description={category.description}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-8 md:mt-12 flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface-dark p-6 text-ink-inverse sm:gap-6 sm:p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h3 className="text-subheading text-ink-inverse">Supplying installers across Tamil Nadu</h3>
            <p className="mt-2 text-body text-ink-inverse/85">
              Dealer, EPC contractor, or electrical vendor — get in touch for volume pricing.
            </p>
          </div>
          <Button to={ROUTE_PATHS.contact} className="w-full shrink-0 md:w-auto">Enquire About Supply</Button>
        </div>
      </Container>
    </Section>
  );
}
