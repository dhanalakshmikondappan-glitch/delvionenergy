import { Accordion } from "~/components/layout/Accordion";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { JsonLd } from "~/components/seo/JsonLd";
import { buildMetaTags } from "~/constants/seo";
import { buildFaqPageJsonLd } from "~/utils/structuredData";

import type { Route } from "./+types/faq";

// MASTER.md §29 example questions, verbatim. Answers state general,
// defensible solar-industry facts rather than specific company policy
// figures (exact warranty terms, exact timelines) that would need to come
// from the client to be accurate.
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
