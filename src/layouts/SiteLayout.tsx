import type { ReactNode } from "react";
import { useLocation } from "react-router";

import { Footer } from "~/components/layout/Footer";
import { Navbar } from "~/components/layout/Navbar";
import { SkipLink } from "~/components/layout/SkipLink";
import { SplashScreen } from "~/components/layout/SplashScreen";
import { WhatsAppButton } from "~/components/layout/WhatsAppButton";
import { ROUTE_PATHS } from "~/constants/routePaths";

interface SiteLayoutProps {
  children: ReactNode;
}

/**
 * The shared shell every route renders inside: skip link, navbar, main
 * landmark, footer. `overHero` is derived from the matched route (only "/"
 * has a full-bleed hero) rather than tracked as scroll state, so it's
 * correct on first paint.
 */
export function SiteLayout({ children }: SiteLayoutProps) {
  const location = useLocation();
  const overHero = location.pathname === ROUTE_PATHS.home;

  return (
    <>
      <SplashScreen />
      <SkipLink />
      <Navbar overHero={overHero} />
      {/* tabIndex={-1}: makes the skip link's fragment navigation actually
          move keyboard focus here, not just scroll — without it, browsers
          scroll to #main but leave focus on <body>, so the next Tab press
          starts back at the top instead of continuing past the nav. */}
      <main id="main" tabIndex={-1} className={`focus:outline-none ${overHero ? "" : "pt-20"}`}>
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}
