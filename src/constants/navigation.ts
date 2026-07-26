import { ROUTE_PATHS } from "./routePaths";

export interface NavItem {
  label: string;
  path: string;
}

/**
 * MASTER.md §10 menu, minus "Home" — the logo already links to "/", so a
 * second text link to the same place would be a redundant element
 * (docs/DECISIONS.md #7).
 */
export const NAV_ITEMS: NavItem[] = [
  { label: "How Solar Works", path: ROUTE_PATHS.howSolarWorks },
  { label: "Solutions", path: ROUTE_PATHS.solutions },
  { label: "Projects", path: ROUTE_PATHS.projects },
  { label: "Calculator", path: ROUTE_PATHS.calculator },
  { label: "FAQ", path: ROUTE_PATHS.faq },
  { label: "Contact", path: ROUTE_PATHS.contact },
];
