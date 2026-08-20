import { ArrowRight } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/buttons/Button";
import { FlowDiagram } from "~/components/diagrams/FlowDiagram";
import { Accordion } from "~/components/layout/Accordion";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ResponsiveImage } from "~/components/media/ResponsiveImage";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { AUTOMATION_CATEGORIES, galleryItemsFor } from "~/constants/media";
import type { AutomationCategoryId } from "~/constants/media";
import { ROUTE_PATHS } from "~/constants/routePaths";

const PROCESS_STEPS = [
  "Understand Process",
  "Machine Design",
  "Fabrication",
  "Control Panel",
  "Install & Commission",
];

interface AutomationCategory {
  name: string;
  description: string;
  /**
   * Which gallery category this line's photography lives under. Omitted by
   * Customized Industrial Automation, which is a scoping service rather than a
   * catalogue of machines and so has no equipment photography of its own.
   */
  galleryId?: AutomationCategoryId;
  /** Defaults to "Our Solutions"; the last category lists industries served instead. */
  listLabel?: string;
  items: string[];
}

const CATEGORIES: AutomationCategory[] = [
  {
    name: "Special Purpose Machines (SPM)",
    description: "Machines built from the ground up around one production step — not adapted from a catalogue.",
    galleryId: "spm",
    items: [
      "Assembly Line & Station",
      "Leak Testing Machines",
      "Pressing Machines",
      "Tightening Systems",
      "Jigs & Fixtures (Machining & Assembly)",
      "Drill & Tap Machine",
      "Zero Gravity Balancer for Part Loading",
      "Auto Part Loaders for CNC Machines",
    ],
  },
  {
    name: "Conveyors And Handling Systems",
    description: "Material handling equipment sized to your load capacity, speed, and layout, with sensors and tracking where you need them.",
    galleryId: "conveyors",
    items: [
      "Pallet Conveyor",
      "Slat Conveyor",
      "Roller Conveyor",
      "Belt Conveyor",
      "Modular Belt Conveyor",
      "Chain Conveyor",
      "Bucket Elevator",
      "Gravity Conveyor",
      "Trollies",
      "Manipulators",
    ],
  },
  {
    name: "Robotic Automation",
    description: "Robotic cells that take over repetitive tasks — built for accuracy, safety, and lower cost per part.",
    galleryId: "robotic",
    items: [
      "CNC Auto Loading Cell (Machine Tending)",
      "Robotic Palletizing & Depalletizing",
      "EOAT",
      "Inspection & Testing",
      "Gantry Robots",
      "Aluminum Ladling",
      "PDC & GDC Extraction (Core Handling Robot)",
      "Deburring Cell",
    ],
  },
  {
    name: "Gantry Automation",
    description: "Cartesian robots for precise handling over a large area — ideal for large or heavy parts.",
    galleryId: "gantry",
    items: [
      "CNC/VMC Auto Loading Cell (Machine Tending)",
      "Dispensing & Gluing",
      "Inspection & Testing",
      "Autoloading On Washing Machine",
      "Aluminum Ladling",
      "PDC & GDC Extraction (Core Handling Robots)",
      "Palletizing And Depalletizing",
    ],
  },
  {
    name: "Customized Industrial Automation",
    description: "A solution scoped and engineered around your process, after we understand exactly how your line runs.",
    listLabel: "Industries We Serve",
    items: [
      "Automotive",
      "Foundry & Metal Processing",
      "Electronics & Electrical Industry",
      "Consumer Goods & Appliances",
      "Aerospace",
      "Food & Beverages",
      "General Manufacturing",
    ],
  },
];

/** The gallery's short chip label for a category, for use mid-sentence. */
function shortLabel(galleryId: AutomationCategoryId): string {
  return AUTOMATION_CATEGORIES.find((entry) => entry.id === galleryId)?.label ?? "";
}

/**
 * The lead photo for a category is simply the first gallery entry under it, so
 * reordering the catalogue in constants/media.ts changes what the accordion
 * previews without a second list to keep in sync.
 */
function leadImage(galleryId: AutomationCategoryId) {
  const [lead] = galleryItemsFor(galleryId);
  if (!lead) return null;

  return (
    <ResponsiveImage
      basePath={lead.basePath}
      widths={lead.widths}
      alt=""
      sizes="112px"
      className="h-16 w-28 object-cover"
    />
  );
}

const ACCORDION_ITEMS = CATEGORIES.map((category) => {
  const photos = category.galleryId ? galleryItemsFor(category.galleryId) : [];

  return {
    title: category.name,
    // Decorative here: the title beside it already names the category, and the
    // gallery link below carries the same images with real alt text.
    media: category.galleryId ? leadImage(category.galleryId) : undefined,
    content: (
      <>
        <p>{category.description}</p>
        <p className="mt-4 text-fine font-semibold tracking-wider text-ink-muted uppercase">
          {category.listLabel ?? "Our Solutions"}
        </p>
        <ul className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2 md:grid-cols-2">
          {category.items.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-slate" />
              {item}
            </li>
          ))}
        </ul>
        {category.galleryId && photos.length > 0 ? (
          <Link
            to={`${ROUTE_PATHS.whatWeBuild}?category=${category.galleryId}`}
            className="mt-6 inline-flex items-center gap-2 text-body font-medium text-ink underline decoration-transparent underline-offset-4 transition-colors duration-fast hover:decoration-current"
          >
            {`See all ${String(photos.length)} ${shortLabel(category.galleryId)} systems`}
            <ArrowRight aria-hidden="true" size={18} strokeWidth={1.75} />
          </Link>
        ) : null}
      </>
    ),
  };
});

/**
 * Homepage Industrial Automation section: five real automation business
 * lines (SPM, conveyors & handling, robotic, gantry, and customized
 * automation), each expandable via Accordion to show its solutions list —
 * too much content per category (6-10 items) for a flat card grid. Each
 * category previews one photo in its header and links through to the full
 * set on /what-we-build, which keeps this section's image weight to five
 * lazy thumbnails while still making the business line look like something
 * we actually build. Uses the slate-blue accent to visually distinguish this
 * business line from the solar (mercury) segments. The `id="automation"` is
 * the anchor target for the "Automation" nav link; `scroll-mt` offsets the
 * fixed navbar.
 */
export function AutomationSection() {
  return (
    <Section
      id="automation"
      background="surface"
      ariaLabelledBy="automation-heading"
      className="scroll-mt-24"
    >
      <Container width="content">
        <SectionHeader
          id="automation-heading"
          eyebrow="Industrial Automation"
          title="Automation built around your process"
          description="We build tailored automation across special-purpose machines, material handling, and robotics — engineered around your process, not a generic catalogue."
        />

        <ScrollReveal className="mt-8 md:mt-12">
          <FlowDiagram steps={PROCESS_STEPS} accentColor="slate" />
        </ScrollReveal>

        <ScrollReveal className="mt-10 md:mt-16">
          <Accordion items={ACCORDION_ITEMS} />
        </ScrollReveal>

        <div className="mt-8 md:mt-12 flex flex-col gap-4 rounded-[var(--radius-card)] bg-slate p-6 text-ink-inverse sm:gap-6 sm:p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div>
            <h3 className="text-subheading text-ink-inverse">
              Automation built one machine at a time
            </h3>
            <p className="mt-2 text-body text-ink-inverse/85">
              Tell us which process you want to automate — we&apos;ll scope, build, and install a
              machine sized for it.
            </p>
          </div>
          <Button to={ROUTE_PATHS.contact} className="w-full shrink-0 md:w-auto">
            Discuss Your Requirement
          </Button>
        </div>
      </Container>
    </Section>
  );
}
