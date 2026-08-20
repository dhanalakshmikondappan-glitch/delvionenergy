import { COMPANY } from "./company";
import { ROUTE_PATHS, type RouteKey } from "./routePaths";

export interface RouteSeo {
  title: string;
  description: string;
  /** MASTER.md §41 primary/supporting keyword this route targets. */
  keywords: string[];
}

/**
 * One entry per route in ROUTE_PATHS — the single table every route's
 * `meta()` export reads from, so title/description/OG/canonical/keywords
 * never get duplicated or drift between route files (MASTER.md §42).
 */
export const ROUTE_SEO: Record<RouteKey, RouteSeo> = {
  home: {
    title: "Delvion Energy — Solar & Industrial Automation",
    description:
      "Delvion Energy designs intelligent solar systems for homes and industries, and builds custom automation that makes manufacturing units smarter and more efficient.",
    keywords: [
      "Solar Installation",
      "Rooftop Solar",
      "Solar Company Trichy",
      "Industrial Automation",
      "Special Purpose Machines",
      "Robotic Automation",
    ],
  },
  solutions: {
    title: "Solar Solutions for Every Scale — Delvion Energy",
    description:
      "Residential, commercial and industrial solar solutions engineered for long-term savings and reliability.",
    keywords: ["Residential Solar", "Commercial Solar", "Industrial Solar"],
  },
  solutionsResidential: {
    title: "Residential Solar — Delvion Energy",
    description: "Reduce electricity bills while increasing property value with home solar.",
    keywords: ["Residential Solar", "Solar Subsidy", "Rooftop Solar"],
  },
  solutionsCommercial: {
    title: "Commercial Solar — Delvion Energy",
    description: "Offset daytime energy usage and lower operating costs with commercial solar.",
    keywords: ["Commercial Solar", "Solar EPC"],
  },
  solutionsIndustrial: {
    title: "Industrial Solar — Delvion Energy",
    description: "Custom-engineered, large-scale solar for factories and industrial rooftops.",
    keywords: ["Industrial Solar", "Solar Panels Tamil Nadu"],
  },
  whatWeBuild: {
    title: "What We Build — Delvion Energy",
    description:
      "The special-purpose machines, conveyors, robotic and gantry automation, and rooftop solar systems Delvion Energy designs and builds.",
    keywords: ["Industrial Automation", "Special Purpose Machines", "Solar Installation"],
  },
  calculator: {
    title: "Solar Savings Calculator — Delvion Energy",
    description: "Estimate your system size, monthly savings and payback period in seconds.",
    keywords: ["Solar Subsidy", "Rooftop Solar"],
  },
  faq: {
    title: "Frequently Asked Questions — Delvion Energy",
    description: "Answers to common questions about installation, maintenance and warranty.",
    keywords: ["Solar Maintenance", "Solar EPC"],
  },
  contact: {
    title: "Contact Delvion Energy",
    description: "Schedule a free site visit or reach us by phone, WhatsApp or email.",
    keywords: ["Solar Company Trichy", "Clean Energy"],
  },
  privacyPolicy: {
    title: "Privacy Policy — Delvion Energy",
    description: "How Delvion Energy collects, uses and protects information submitted through this website.",
    keywords: [],
  },
  terms: {
    title: "Terms of Service — Delvion Energy",
    description: "The terms governing use of the Delvion Energy website.",
    keywords: [],
  },
};

/** Absolute canonical URL for a given route path. */
export function canonicalFor(path: string): string {
  return new URL(path, COMPANY.siteUrl).toString();
}

/** Standard meta tag array a route's `meta()` export returns. */
export function buildMetaTags(routeKey: RouteKey) {
  const seo = ROUTE_SEO[routeKey];
  const path = ROUTE_PATHS[routeKey];
  const canonical = canonicalFor(path);

  return [
    { title: seo.title },
    { name: "description", content: seo.description },
    { name: "keywords", content: seo.keywords.join(", ") },
    { tagName: "link", rel: "canonical", href: canonical },
    { property: "og:type", content: "website" },
    { property: "og:title", content: seo.title },
    { property: "og:description", content: seo.description },
    { property: "og:url", content: canonical },
    { property: "og:image", content: canonicalFor("/og/og-default.jpg") },
    { property: "og:site_name", content: COMPANY.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: seo.title },
    { name: "twitter:description", content: seo.description },
  ];
}
