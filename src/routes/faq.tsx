import { Accordion } from "~/components/layout/Accordion";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { JsonLd } from "~/components/seo/JsonLd";
import { buildMetaTags } from "~/constants/seo";
import { buildFaqPageJsonLd } from "~/utils/structuredData";

import type { Route } from "./+types/faq";

// The five solar questions are MASTER.md §29's, verbatim; the automation
// questions below them were added once the automation business line went
// live, because this page emits FAQPage structured data and a solar-only
// question set was telling search engines the company only does solar.
//
// Answers state general, defensible facts rather than specific company policy
// figures (exact warranty terms, exact timelines) that would need to come from
// the client to be accurate. The automation answers claim nothing the site
// does not already say elsewhere — the categories and industries below are
// the ones listed in AutomationSection.
const FAQ_ITEMS = [
  {
    question: "How long does installation take?",
    answer:
      "Most residential installations are completed within a few days once the site survey and approvals are in place. Exact timelines depend on system size and paperwork — we'll give you a firm schedule after the site visit.",
  },
  {
    question: "How much maintenance is required?",
    answer:
      "Solar panels need very little upkeep — periodic cleaning and an annual inspection are typically enough to keep a system performing well.",
  },
  {
    question: "Will solar work during rain?",
    answer:
      "Yes, panels still generate some power in overcast or rainy conditions, though output is lower than on clear, sunny days.",
  },
  {
    question: "What warranty is included?",
    answer:
      "Panels and inverters carry manufacturer warranties, and we support you with installation workmanship and warranty claims. Exact terms depend on the components selected for your system — we'll confirm these in your proposal.",
  },
  {
    question: "Can I expand later?",
    answer:
      "In most cases, yes — systems can often be expanded later if your usage grows, subject to available roof space and inverter capacity.",
  },
  {
    question: "Does Delvion Energy do more than solar?",
    answer:
      "Yes. We run two engineering lines: rooftop solar for homes, businesses and industry, and custom industrial automation. The automation side covers special purpose machines, conveyors and material handling, robotic cells and gantry systems — each built around a specific production step rather than sold from a catalogue.",
  },
  {
    question: "What is a special purpose machine?",
    answer:
      "A special purpose machine is built for one step of your process rather than adapted from a standard product — an assembly line station, a leak testing machine, a pressing or tightening system, or a drill and tap machine, for example. Because it is designed around how your line actually runs, every project starts by understanding that process before anything is designed.",
  },
  {
    question: "Which industries do you build automation for?",
    answer:
      "Automotive, foundry and metal processing, electronics and electrical, consumer goods and appliances, aerospace, food and beverages, and general manufacturing. If your process isn't on that list it's still worth a conversation — most of what we build is one-off.",
  },
];

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("faq");
}

export default function Faq() {
  return (
    <>
      <JsonLd data={buildFaqPageJsonLd(FAQ_ITEMS)} />
      <Section>
        <Container width="reading">
          <SectionHeader id="faq-heading" headingLevel="h1" title="Frequently Asked Questions" />
          <div className="mt-12">
            <Accordion
              items={FAQ_ITEMS.map((item) => ({ title: item.question, content: item.answer }))}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
