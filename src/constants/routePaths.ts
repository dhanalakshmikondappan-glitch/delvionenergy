/**
 * The single source of truth for every URL the site serves.
 *
 * `src/routes.ts` (the route table), `react-router.config.ts` (the prerender
 * list) and `src/constants/seo.ts` (per-route metadata) all read from this
 * file so the three can never drift out of sync with each other.
 */
export const ROUTE_PATHS = {
  home: "/",
  solutions: "/solutions",
  solutionsResidential: "/solutions/residential",
  solutionsCommercial: "/solutions/commercial",
  solutionsIndustrial: "/solutions/industrial",
  whatWeBuild: "/what-we-build",
  calculator: "/calculator",
  faq: "/faq",
  contact: "/contact",
  privacyPolicy: "/privacy-policy",
  terms: "/terms",
} as const;

export type RouteKey = keyof typeof ROUTE_PATHS;
export type RoutePath = (typeof ROUTE_PATHS)[RouteKey];

/** Every path that must be prerendered to static HTML at build time. */
export const PRERENDER_PATHS: RoutePath[] = Object.values(ROUTE_PATHS);
