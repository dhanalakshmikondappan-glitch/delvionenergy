import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";

import type { Route } from "./+types/root";

import { JsonLd } from "~/components/seo/JsonLd";
import { buildOrganizationJsonLd, buildWebsiteJsonLd } from "~/utils/structuredData";

import "./styles/global.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#F6F5F1" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <Meta />
        <Links />
        <JsonLd data={[buildOrganizationJsonLd(), buildWebsiteJsonLd()]} />
        {/* Synchronous, runs before the body is parsed — sets data-splash-seen
            on <html> so the [data-splash-seen="true"] rule in base.css can hide
            the splash screen via pure CSS with zero flash on a repeat visit
            within the same tab session. Kept tiny and inline deliberately: a
            separate script file would arrive too late to prevent the flash it
            exists to prevent. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(sessionStorage.getItem('delvion-splash-seen')==='1'){document.documentElement.setAttribute('data-splash-seen','true');}}catch(e){}",
          }}
        />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function Root() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <main style={{ padding: "4rem 1.5rem", textAlign: "center", fontFamily: "system-ui" }}>
      <h1>Something went wrong</h1>
      <p>{message}</p>
    </main>
  );
}
