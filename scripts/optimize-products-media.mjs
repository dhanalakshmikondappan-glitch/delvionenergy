// Turns the raw Products-carousel photo masters into the sized, web-ready
// files the site actually serves. Run with `npm run optimize-products-media`.
// Output is committed to public/media/products/ for the same reason as
// scripts/optimize-solutions-media.mjs: production builds never depend on
// sharp being present on the deploy machine.
//
// The 5 masters are real product photographs of AC/DC distribution boxes
// supplied to vendors, shown in the homepage Products carousel. They cap at
// ~1280px on the long edge, so we only emit up to 1280 (no upscaling).

import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const ASSETS_DIR = path.join(ROOT, "assets", "products");
const OUT_DIR = path.join(ROOT, "public", "media", "products");

const WIDTHS = [640, 960, 1280];
const NAMES = [
  "dc-combiner-open",
  "dcdb-2in-2out",
  "acdb-three-phase",
  "acdb-three-phase-63a",
  "acdb-dcdb-combo",
];

async function generateVariants(name) {
  const source = path.join(ASSETS_DIR, `${name}.jpeg`);
  const base = sharp(source);
  for (const width of WIDTHS) {
    const resized = base.clone().resize({ width, withoutEnlargement: true });
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

  for (const name of NAMES) {
    const source = path.join(ASSETS_DIR, `${name}.jpeg`);
    if (!existsSync(source)) {
      throw new Error(`Missing source: ${source}`);
    }
  }

  for (const name of NAMES) {
    console.log(`Generating ${name} product variants (AVIF + WebP)...`);
    await generateVariants(name);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
