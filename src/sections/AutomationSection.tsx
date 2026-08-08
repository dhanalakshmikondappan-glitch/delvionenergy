import { Button } from "~/components/buttons/Button";
import { ServiceCard } from "~/components/cards/ServiceCard";
import { FlowDiagram } from "~/components/diagrams/FlowDiagram";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ScrollReveal } from "~/components/motion/ScrollReveal";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { ROUTE_PATHS } from "~/constants/routePaths";

const PROCESS_STEPS = [
  "Understand Process",
  "Machine Design",
  "Fabrication",
  "Control Panel",
  "Install & Commission",
];

interface AutomationService {
  tag: string;
  title: string;
  description: string;
}

const SERVICES: AutomationService[] = [
  {
    tag: "Build",
    title: "Custom Machine Building",
    description:
      "A machine engineered for one task on your line — sorting, feeding, assembly, or packing.",
  },
  {
    tag: "Retrofit",
    title: "Machine Retrofit & Automation",
    description: "Sensors, actuators, and basic controls added to your existing manual machines.",
  },
  {
    tag: "Control",
    title: "Control Panels",
    description: "Relay logic or basic PLC panels, sized to the machine, not the plant.",
  },
  {
    tag: "Fabrication",
    title: "Mechanical Fabrication",
    description: "Frames, conveyors, and fixtures fabricated in-house for your shop floor.",
  },
  {
    tag: "Support",
    title: "On-site Support",
    description: "Installation, commissioning, and after-sales support for what we build.",
  },
];

/**
 * Homepage Industrial Automation section: custom machine building and
 * retrofit services for manufacturing units. Uses the slate-blue accent
 * to visually distinguish this business line from the solar (mercury)
 * segments. The `id="automation"` is the anchor target for the
 * "Automation" nav link; `scroll-mt` offsets the fixed navbar.
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
          description="We design and build focused automation machines for manufacturing units — equipment and control panels engineered around one production step, not a full plant overhaul."
        />

        <ScrollReveal className="mt-8 md:mt-12">
          <FlowDiagram steps={PROCESS_STEPS} accentColor="slate" />
        </ScrollReveal>

        <StaggerGroup className="mt-10 md:mt-16 grid gap-4 md:gap-6 md:grid-cols-3 lg:grid-cols-5">
          {SERVICES.map((service) => (
            <StaggerItem key={service.title}>
              <ServiceCard
                tag={service.tag}
                title={service.title}
                description={service.description}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>

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
