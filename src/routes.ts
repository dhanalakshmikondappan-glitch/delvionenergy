import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Every page is a child of this one layout route, so SiteLayout (skip
  // link, navbar, footer) mounts once and persists across navigation
  // instead of remounting per route.
  layout("routes/layout.tsx", [
    index("routes/home.tsx"),
    route("how-solar-works", "routes/how-solar-works.tsx"),
    route("solutions", "routes/solutions.tsx"),
    route("solutions/residential", "routes/solutions.residential.tsx"),
    route("solutions/commercial", "routes/solutions.commercial.tsx"),
    route("solutions/industrial", "routes/solutions.industrial.tsx"),
    route("projects", "routes/projects.tsx"),
    route("calculator", "routes/calculator.tsx"),
    route("faq", "routes/faq.tsx"),
    route("contact", "routes/contact.tsx"),
    route("privacy-policy", "routes/privacy-policy.tsx"),
    route("terms", "routes/terms.tsx"),
    // Catch-all: with ssr:false + prerender, any path outside the list
    // above falls back to the client SPA shell. Without this route that
    // fallback renders blank; this renders a real 404 with correct
    // semantics.
    route("*", "routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
