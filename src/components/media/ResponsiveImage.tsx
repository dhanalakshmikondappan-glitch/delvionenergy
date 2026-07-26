interface ResponsiveImageProps {
  /** Path prefix without the "-{width}.{ext}" suffix, e.g. "/media/solutions/hub". */
  basePath: string;
  widths: number[];
  alt: string;
  sizes?: string;
  className?: string;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "eager" | "lazy";
}

/**
 * AVIF-first, WebP-fallback responsive image (MASTER.md §39). Reused for
 * the hero poster/rest stills now and project photography later — every
 * consumer just needs its files to follow the "{basePath}-{width}.{ext}"
 * naming convention that scripts/optimize-media.mjs already produces.
 */
export function ResponsiveImage({
  basePath,
  widths,
  alt,
  sizes = "100vw",
  className,
  fetchPriority = "auto",
  loading = "lazy",
}: ResponsiveImageProps) {
  const avifSrcSet = widths.map((width) => `${basePath}-${width}.avif ${width}w`).join(", ");
  const webpSrcSet = widths.map((width) => `${basePath}-${width}.webp ${width}w`).join(", ");
  const largest = widths[widths.length - 1];

  return (
    <picture>
      <source type="image/avif" srcSet={avifSrcSet} sizes={sizes} />
      <source type="image/webp" srcSet={webpSrcSet} sizes={sizes} />
      <img
        src={`${basePath}-${largest}.webp`}
        alt={alt}
        className={className}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
      />
    </picture>
  );
}
