import { Link } from "react-router";

import { Container } from "~/components/layout/Container";
import { Logo } from "~/components/layout/Logo";
import { COMPANY } from "~/constants/company";
import { ROUTE_PATHS } from "~/constants/routePaths";

interface FooterColumn {
  title: string;
  links: { label: string; to: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "Home", to: ROUTE_PATHS.home },
      { label: "How Solar Works", to: ROUTE_PATHS.howSolarWorks },
      { label: "FAQ", to: ROUTE_PATHS.faq },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Residential", to: ROUTE_PATHS.solutionsResidential },
      { label: "Commercial", to: ROUTE_PATHS.solutionsCommercial },
      { label: "Industrial", to: ROUTE_PATHS.solutionsIndustrial },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Savings Calculator", to: ROUTE_PATHS.calculator },
      { label: "Our Projects", to: ROUTE_PATHS.projects },
    ],
  },
];

/** MASTER.md §31/§87: 4 columns, copyright, quick WhatsApp CTA. */
export function Footer() {
  return (
    <footer className="bg-surface-dark text-ink-inverse">
      <Container width="max" className="py-16">
        <Logo inverse />

        <div className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="text-caption font-medium tracking-[0.08em] text-ink-inverse/60 uppercase">
                {column.title}
              </h2>
              <ul className="mt-4 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-body text-ink-inverse/85 underline decoration-transparent underline-offset-4 transition-colors duration-fast hover:decoration-current"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h2 className="text-caption font-medium tracking-[0.08em] text-ink-inverse/60 uppercase">Contact</h2>
            <ul className="mt-4 flex flex-col gap-3 text-body text-ink-inverse/85">
              <li>
                <a
                  href={`tel:${COMPANY.phone}`}
                  className="underline decoration-transparent underline-offset-4 transition-colors duration-fast hover:decoration-current"
                >
                  {COMPANY.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="underline decoration-transparent underline-offset-4 transition-colors duration-fast hover:decoration-current"
                >
                  {COMPANY.email}
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${COMPANY.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-transparent underline-offset-4 transition-colors duration-fast hover:decoration-current"
                >
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ink-inverse/10 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-caption text-ink-inverse/60">
            © {__BUILD_YEAR__} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              to={ROUTE_PATHS.privacyPolicy}
              className="text-caption text-ink-inverse/60 underline decoration-transparent underline-offset-4 transition-colors duration-fast hover:decoration-current"
            >
              Privacy Policy
            </Link>
            <Link
              to={ROUTE_PATHS.terms}
              className="text-caption text-ink-inverse/60 underline decoration-transparent underline-offset-4 transition-colors duration-fast hover:decoration-current"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
