import { Outlet } from "react-router";

import { SiteLayout } from "~/layouts/SiteLayout";

/**
 * The one place SiteLayout (skip link, navbar, footer) is rendered — every
 * route is its child via <Outlet/>, so Navbar/Footer mount once and persist
 * across client-side navigation instead of remounting per route.
 */
export default function RootLayout() {
  return (
    <SiteLayout>
      <Outlet />
    </SiteLayout>
  );
}
