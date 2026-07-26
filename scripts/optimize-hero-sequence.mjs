// Turns the sampled hero frame sequence (60 frames, evenly picked from the
// original 240-frame extraction in assets/hero/hero-frames/) into the sized,
// web-ready files the scroll-scrubbed cinematic section serves. Run with
// `npm run optimize-hero-sequence`.
//
// Source frames are staged as assets/hero-sequence/src-001.jpg..src-060.jpg
// (see docs/DECISIONS.md for how they were sampled). Output is committed to
// public/media/hero-sequence/ for the same reason as the other optimize-*
// scripts: production builds never depend on sharp being present on the
// deploy machine.

import { existsSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC_DIR = path.join(ROOT, "assets", "hero-sequence");
const OUT_DIR = path.join(ROOT, "public", "media", "hero-sequence");

const FRAME_COUNT = 60;
const WIDTH = 1280;

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (let i = 1; i <= FRAME_COUNT; i++) {
    const n = String(i).padStart(3, "0");
    const source = path.join(SRC_DIR, `src-${n}.jpg`);
    if (!existsSync(source)) {
      throw new Error(`Missing source frame: ${source}`);
    }
    const out = path.join(OUT_DIR, `frame-${n}.webp`);
    await sharp(source).resize({ width: WIDTH }).webp({ quality: 68 }).toFile(out);
    console.log(`  ${out}`);
  }

  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
