// Turns the raw Solutions-page banner masters into the sized, web-ready files
// the site actually serves. Run with `npm run optimize-solutions-media`.
// Output is committed to public/media/solutions/ for the same reason as the
// other optimize-* scripts: production builds never depend on sharp being
// present on the deploy machine.
//
// Residential and Commercial are real rooftop photography of installations in
// Tamil Nadu (assets/solar/), which is what MASTER.md §28 asks for and what
// the earlier AI renders only approximated. They share the automation set's
// watermark crop, so they top out at 1200px wide.
//
// `hub` and `industrial` are still the Phase 4 renders. Their masters were
// never kept (assets/ is gitignored and predates this script), so this script
// deliberately does not regenerate them — their committed derivatives under
// public/media/solutions/ remain the only copy, at the original five widths.

import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import { WATERMARK_FREE_CROP, generateVariants } from "./lib/media.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS_DIR = path.join(ROOT, "assets", "solar");
const OUT_DIR = path.join(ROOT, "public", "media", "solutions");

/** Master basename in assets/solar/ -> banner name served from public/media/solutions/. */
const BANNERS = {
  "residential-rooftop": "residential",
  "commercial-rooftop": "commercial",
};

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const master of Object.keys(BANNERS)) {
    const source = path.join(ASSETS_DIR, `${master}.png`);
    if (!existsSync(source)) {
      throw new Error(`Missing source: ${source}`);
    }
  }

  for (const [master, banner] of Object.entries(BANNERS)) {
    console.log(`Generating ${banner} banner variants (AVIF + WebP)...`);
    const base = sharp(path.join(ASSETS_DIR, `${master}.png`)).extract(WATERMARK_FREE_CROP);
    for (const out of await generateVariants(base, OUT_DIR, banner)) {
      console.log(`  ${out}`);
    }
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
