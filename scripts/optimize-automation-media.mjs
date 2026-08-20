// Turns the raw Industrial Automation photo masters into the sized, web-ready
// files the site actually serves. Run with `npm run optimize-automation-media`.
// Output is committed to public/media/automation/ for the same reason as the
// other optimize-* scripts: production builds never depend on sharp being
// present on the deploy machine.
//
// The 26 masters are the equipment renders supplied for the Industrial
// Automation business line, one per system we build, grouped by the same four
// categories the homepage Automation accordion and the /what-we-build gallery
// use. Every master is 1376x768.

import { existsSync } from "node:fs";
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import { WATERMARK_FREE_CROP, generateVariants } from "./lib/media.mjs";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS_DIR = path.join(ROOT, "assets", "automation");
const OUT_DIR = path.join(ROOT, "public", "media", "automation");

const CATEGORIES = ["spm", "conveyors", "robotic", "gantry"];

async function main() {
  for (const category of CATEGORIES) {
    const sourceDir = path.join(ASSETS_DIR, category);
    if (!existsSync(sourceDir)) {
      throw new Error(`Missing source directory: ${sourceDir}`);
    }

    const outDir = path.join(OUT_DIR, category);
    await mkdir(outDir, { recursive: true });

    const files = (await readdir(sourceDir)).filter((file) => file.endsWith(".png")).sort();
    console.log(`Generating ${category} variants (AVIF + WebP) from ${files.length} masters...`);

    for (const file of files) {
      const name = path.basename(file, ".png");
      const base = sharp(path.join(sourceDir, file)).extract(WATERMARK_FREE_CROP);
      for (const out of await generateVariants(base, outDir, name)) {
        console.log(`  ${out}`);
      }
    }
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
