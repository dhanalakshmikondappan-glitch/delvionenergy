import { Building2, Factory, Home as HomeIcon, ImageOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useState } from "react";

import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { Modal } from "~/components/ui/Modal";
import { buildMetaTags } from "~/constants/seo";

import type { Route } from "./+types/projects";

interface ProjectEntry {
  icon: LucideIcon;
  propertyType: string;
  location: string;
  capacity: string;
  description: string;
}

// Honest placeholders, not fabricated case studies — real photography and
// project details (§27) replace these entries as installations complete.
const PROJECTS: ProjectEntry[] = [
  {
    icon: HomeIcon,
    propertyType: "Residential",
    location: "Location to be added",
    capacity: "Capacity to be added",
    description: "Real project photos, capacity and customer story land here as residential installations are completed.",
  },
  {
    icon: Building2,
    propertyType: "Commercial",
    location: "Location to be added",
    capacity: "Capacity to be added",
    description: "Real project photos, capacity and customer story land here as commercial installations are completed.",
  },
  {
    icon: Factory,
    propertyType: "Industrial",
    location: "Location to be added",
    capacity: "Capacity to be added",
    description: "Real project photos, capacity and customer story land here as industrial installations are completed.",
  },
];

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("projects");
}

export default function Projects() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const openProject = openIndex !== null ? PROJECTS[openIndex] : null;

  return (
    <Section>
      <Container>
        <SectionHeader
          id="projects-heading"
          headingLevel="h1"
          title="Our Projects"
          description="Completed installations across homes, businesses and industry — real photography and case studies are added as projects go live."
        />

        <StaggerGroup className="mt-12 grid gap-8 md:grid-cols-3">
          {PROJECTS.map((project, index) => (
            <StaggerItem key={project.propertyType}>
              <button
                type="button"
                onClick={() => {
                  setOpenIndex(index);
                }}
                className="group block w-full rounded-[var(--radius-card)] border border-line bg-surface-elevated text-left transition-all duration-normal hover:-translate-y-1 hover:border-mercury hover:shadow-md"
              >
                <div className="flex aspect-video items-center justify-center rounded-t-[var(--radius-card)] bg-surface">
                  <project.icon aria-hidden="true" className="text-ink-muted" size={40} strokeWidth={1.5} />
                </div>
                <div className="p-6">
                  <span className="flex items-center gap-1.5 text-caption text-ink-muted">
                    <ImageOff aria-hidden="true" size={14} strokeWidth={1.75} />
                    Photo pending
                  </span>
                  <h3 className="mt-2 text-subheading">{project.propertyType} Project</h3>
                  <span className="mt-3 inline-block text-body font-medium underline decoration-transparent underline-offset-4 transition-colors duration-fast group-hover:decoration-current">
                    View details
                  </span>
                </div>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>

      <Modal
        open={openProject !== null}
        onClose={() => {
          setOpenIndex(null);
        }}
        title={openProject ? `${openProject.propertyType} project details` : "Project details"}
      >
        {openProject ? (
          <div>
            <h3 className="text-subheading">{openProject.propertyType} Project</h3>
            <dl className="mt-4 space-y-2 text-body text-ink-muted">
              <div className="flex justify-between gap-4">
                <dt>Location</dt>
                <dd>{openProject.location}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Capacity</dt>
                <dd>{openProject.capacity}</dd>
              </div>
            </dl>
            <p className="mt-4 text-body text-ink-muted">{openProject.description}</p>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}
