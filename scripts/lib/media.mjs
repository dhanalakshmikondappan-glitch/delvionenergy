// Shared image-derivative helpers for the optimize-*-media scripts, so the
// crop geometry and the encoder settings can only ever be defined once.

/**
 * Every master supplied for the automation and solar sets is 1376x768 and
 * carries the generator's sparkle watermark in the bottom-right corner. A
 * vote across all 28 masters (each pixel's deviation from its own local blur,
 * counted in how many images it recurs) put the mark at x 1232-1278,
 * y 624-671, so any crop ending left of x=1228 clears it with margin.
 *
 * Width is therefore capped at 1228, and the height is cut to match so the
 * source's 1.792 aspect ratio survives — the layout slots these fill are
 * `aspect-video`, so a crop that drifted off 16:9 would start cropping
 * subjects a second time under `object-cover`. The vertical cut is centred
 * (the masters have headroom above and floor below) while the horizontal one
 * must start at 0, since x=1228 is already the rightmost usable column.
 */
export const WATERMARK_FREE_CROP = { left: 0, top: 41, width: 1228, height: 685 };

/** Post-crop masters are 1228px wide, so 1200 is the largest honest width. */
export const WIDTHS = [640, 960, 1200];

/**
 * Emits `{name}-{width}.avif` and `{name}-{width}.webp` into `outDir` at every
 * width, at the quality settings the rest of the site's media already uses.
 * Returns the paths written, for logging.
 */
export async function generateVariants(base, outDir, name, widths = WIDTHS) {
  const written = [];
  for (const width of widths) {
    const resized = base.clone().resize({ width, withoutEnlargement: true });
    const avifOut = `${outDir}/${name}-${width}.avif`;
    const webpOut = `${outDir}/${name}-${width}.webp`;
    await resized.clone().avif({ quality: 55 }).toFile(avifOut);
    await resized.clone().webp({ quality: 70 }).toFile(webpOut);
    written.push(avifOut, webpOut);
  }
  return written;
}
