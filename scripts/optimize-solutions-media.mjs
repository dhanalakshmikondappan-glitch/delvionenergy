// Turns the raw Solutions-page banner masters into the sized, web-ready
// files the site actually serves. Run with `npm run optimize-solutions-media`.
// Output is committed to public/media/solutions/ for the same reason as
// scripts/optimize-media.mjs: production builds never depend on sharp being
// present on the deploy machine.
//
// Each of the 4 masters is a distinct AI-generated render (hub/residential/
// commercial/industrial) replacing the single hero-poster image that all 4
// Solutions pages previously reused as a placeholder banner.

import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS_DIR = path.join(ROOT, "assets", "solutions");
const OUT_DIR = path.join(ROOT, "public", "media", "solutions");

const WIDTHS = [640, 960, 1280, 1600, 1920];
const BANNERS = ["hub", "residential", "commercial", "industrial"];

async function generateVariants(name) {
  const source = path.join(ASSETS_DIR, `${name}.png`);
  const base = sharp(source);
  for (const width of WIDTHS) {
    const resized = base.clone().resize({ width });
    const avifOut = path.join(OUT_DIR, `${name}-${width}.avif`);
    const webpOut = path.join(OUT_DIR, `${name}-${width}.webp`);
    await resized.clone().avif({ quality: 55 }).toFile(avifOut);
    await resized.clone().webp({ quality: 70 }).toFile(webpOut);
    console.log(`  ${avifOut}`);
    console.log(`  ${webpOut}`);
  }
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const name of BANNERS) {
    const source = path.join(ASSETS_DIR, `${name}.png`);
    if (!existsSync(source)) {
      throw new Error(`Missing source: ${source}`);
    }
  }

  for (const name of BANNERS) {
    console.log(`Generating ${name} banner variants (AVIF + WebP)...`);
    await generateVariants(name);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
