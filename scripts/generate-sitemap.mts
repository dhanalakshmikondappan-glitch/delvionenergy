// Generates public/sitemap.xml and public/robots.txt from the same route
// table and COMPANY.siteUrl the app itself renders from, so neither file can
// drift out of sync with the real routes or domain (docs plan §6 SEO
// strategy). Runs automatically before `npm run build` via package.json's
// "prebuild" script, so the files exist in public/ before Vite copies it.

import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { COMPANY } from "../src/constants/company.ts";
import { PRERENDER_PATHS } from "../src/constants/routePaths.ts";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITEMAP_FILE = path.join(ROOT, "public", "sitemap.xml");
const ROBOTS_FILE = path.join(ROOT, "public", "robots.txt");

function buildSitemapXml(): string {
  const urls = PRERENDER_PATHS.map((routePath) => {
    const loc = new URL(routePath, COMPANY.siteUrl).toString();
    const priority = routePath === "/" ? "1.0" : "0.8";
    return `  <url>\n    <loc>${loc}</loc>\n    <priority>${priority}</priority>\n  </url>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

function buildRobotsTxt(): string {
  const sitemapUrl = new URL("/sitemap.xml", COMPANY.siteUrl).toString();
  return `User-agent: *\nAllow: /\n\nSitemap: ${sitemapUrl}\n`;
}

async function main() {
  await writeFile(SITEMAP_FILE, buildSitemapXml(), "utf8");
  console.log(`Wrote ${PRERENDER_PATHS.length} URLs to ${SITEMAP_FILE}`);

  await writeFile(ROBOTS_FILE, buildRobotsTxt(), "utf8");
  console.log(`Wrote ${ROBOTS_FILE}`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
