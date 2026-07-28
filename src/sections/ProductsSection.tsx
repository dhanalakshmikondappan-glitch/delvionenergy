import { Box, Cable, PanelTop, ShieldCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "~/components/buttons/Button";
import { FeatureCard } from "~/components/cards/FeatureCard";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ProductCarousel, type ProductSlide } from "~/components/media/ProductCarousel";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { ROUTE_PATHS } from "~/constants/routePaths";

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
  { icon: PanelTop, title: "Solar Panels", description: "Mono PERC and bifacial modules, sourced across multiple brands." },
  { icon: Zap, title: "Inverters", description: "On-grid, off-grid and hybrid inverters, sourced across multiple brands." },
  { icon: Box, title: "AC / DC Distribution Box", description: "Panel-side and load-side protection, isolation and safe combination." },
  { icon: Cable, title: "Solar Cables", description: "UV and weather-resistant cables, sized to string length and rating." },
  { icon: ShieldCheck, title: "Earthing Kit", description: "Chemical or pipe earthing kits for structure and inverter grounding." },
];

/**
 * Homepage Products section: certified PV accessories supplied to vendors and
 * installers. Real distribution-box photography in a carousel + lightbox, the
 * full accessory catalogue as category cards, and a vendor enquiry CTA. The
 * `id="products"` is the anchor target for the "Products" nav link; the
 * `scroll-mt` offsets the fixed navbar so the heading isn't hidden.
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
          eyebrow="PV Accessories · Vendor Supply"
          title="Everything between the panel and the socket"
          description="Delvion Energy also supplies certified PV accessories to installers and vendors across Tamil Nadu — panels and inverters sourced across multiple brands, plus balance-of-system components."
        />

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
            <h3 className="text-subheading text-ink-inverse">Supplying vendors across Tamil Nadu</h3>
            <p className="mt-2 text-body text-ink-inverse/85">
              Dealer, EPC contractor, or local electrical vendor — enquire for volume pricing.
            </p>
          </div>
          <Button to={ROUTE_PATHS.contact} className="w-full shrink-0 md:w-auto">Enquire as a Vendor</Button>
        </div>
      </Container>
    </Section>
  );
}
