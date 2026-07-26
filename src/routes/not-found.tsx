import { Button } from "~/components/buttons/Button";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ROUTE_PATHS } from "~/constants/routePaths";

import type { Route } from "./+types/not-found";

export function meta(_args: Route.MetaArgs) {
  return [{ title: "Page Not Found — Delvion Energy" }, { name: "robots", content: "noindex" }];
}

export default function NotFound() {
  return (
    <Section>
      <Container width="reading">
        <SectionHeader
          id="not-found-heading"
          headingLevel="h1"
          title="Page not found"
          description="The page you're looking for doesn't exist."
          cta={<Button to={ROUTE_PATHS.home}>Back to home</Button>}
        />
      </Container>
    </Section>
  );
}
