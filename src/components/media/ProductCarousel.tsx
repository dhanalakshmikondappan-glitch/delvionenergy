import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Modal } from "~/components/ui/Modal";
import { ResponsiveImage } from "~/components/media/ResponsiveImage";

export interface ProductSlide {
  /** Path prefix without the "-{width}.{ext}" suffix, e.g. "/media/products/acdb-three-phase". */
  basePath: string;
  caption: string;
  alt: string;
}

interface ProductCarouselProps {
  slides: ProductSlide[];
}

const WIDTHS = [640, 960, 1280];
const EASE = [0.22, 1, 0.36, 1] as const;
const SWIPE_OFFSET = 60;
const SWIPE_VELOCITY = 400;

const slideVariants = {
  enter: (direction: number) => ({ x: direction >= 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction >= 0 ? "-100%" : "100%", opacity: 0 }),
};

/**
 * From-scratch, accessible product carousel (no slider library exists in the
 * project — built on `motion`, matching StaggerGroup's reduced-motion pattern).
 * One large slide at a time with arrows, dots, drag/swipe and keyboard, plus a
 * click-to-enlarge lightbox that reuses the shared <Modal> primitive.
 */
export function ProductCarousel({ slides }: ProductCarouselProps) {
  const prefersReducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const count = slides.length;
  const active = slides[index];

  function paginate(delta: number) {
    if (count < 1) return;
    setDirection(delta);
    setIndex((current) => (current + delta + count) % count);
  }

  function goTo(target: number) {
    setDirection(target > index ? 1 : -1);
    setIndex(target);
  }

  if (!active) return null;

  const transition = prefersReducedMotion
    ? { duration: 0 }
    : { x: { duration: 0.45, ease: EASE }, opacity: { duration: 0.3, ease: EASE } };

  return (
    <div>
      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Product photos"
        tabIndex={0}
        onKeyDown={(event) => {
          if (count < 2) return;
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            paginate(-1);
          } else if (event.key === "ArrowRight") {
            event.preventDefault();
            paginate(1);
          }
        }}
        className="group relative rounded-[var(--radius-image)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-mercury)]"
      >
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-image)] border border-line bg-surface"
          aria-roledescription="slide"
          aria-label={`${index + 1} of ${count}: ${active.caption}`}
        >
          <AnimatePresence custom={direction} initial={false}>
            <motion.div
              key={index}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={transition}
              drag={count > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.15}
              onDragEnd={(_event, info) => {
                if (info.offset.x < -SWIPE_OFFSET || info.velocity.x < -SWIPE_VELOCITY) {
                  paginate(1);
                } else if (info.offset.x > SWIPE_OFFSET || info.velocity.x > SWIPE_VELOCITY) {
                  paginate(-1);
                }
              }}
              className="absolute inset-0 cursor-grab active:cursor-grabbing"
            >
              <ResponsiveImage
                basePath={active.basePath}
                widths={WIDTHS}
                alt={active.alt}
                sizes="(min-width: 768px) 720px, 100vw"
                loading="lazy"
                className="pointer-events-none h-full w-full select-none object-cover"
              />
            </motion.div>
          </AnimatePresence>

          {/* Caption chip over a legibility scrim */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-surface-dark/70 to-transparent p-4 pt-12">
            <span className="rounded-[var(--radius-button)] bg-surface-dark/70 px-3 py-1.5 text-fine font-medium text-ink-inverse backdrop-blur-sm">
              {active.caption}
            </span>
          </div>

          {/* Enlarge affordance */}
          <button
            type="button"
            onClick={() => {
              setLightboxOpen(true);
            }}
            aria-label={`View "${active.caption}" full size`}
            className="absolute top-3 right-3 rounded-[var(--radius-button)] bg-surface-elevated/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors duration-fast hover:bg-surface-elevated"
          >
            <Maximize2 aria-hidden="true" size={18} />
          </button>

          {count > 1 ? (
            <>
              <button
                type="button"
                onClick={() => {
                  paginate(-1);
                }}
                aria-label="Previous product"
                className="absolute top-1/2 left-2 -translate-y-1/2 rounded-full bg-surface-elevated/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors duration-fast hover:bg-surface-elevated md:left-3"
              >
                <ChevronLeft aria-hidden="true" size={22} />
              </button>
              <button
                type="button"
                onClick={() => {
                  paginate(1);
                }}
                aria-label="Next product"
                className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-surface-elevated/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors duration-fast hover:bg-surface-elevated md:right-3"
              >
                <ChevronRight aria-hidden="true" size={22} />
              </button>
            </>
          ) : null}
        </div>

        {count > 1 ? (
          <div className="mt-5 flex items-center justify-center gap-2.5">
            {slides.map((slide, dotIndex) => (
              <button
                key={slide.basePath}
                type="button"
                onClick={() => {
                  goTo(dotIndex);
                }}
                aria-label={`Go to slide ${dotIndex + 1}: ${slide.caption}`}
                aria-current={dotIndex === index ? "true" : undefined}
                className={`h-2.5 rounded-full transition-all duration-normal ${
                  dotIndex === index ? "w-6 bg-mercury" : "w-2.5 bg-line-strong hover:bg-ink-muted"
                }`}
              />
            ))}
          </div>
        ) : null}

        <p aria-live="polite" className="sr-only">
          {`Slide ${index + 1} of ${count}: ${active.caption}`}
        </p>
      </div>

      <Modal
        open={lightboxOpen}
        onClose={() => {
          setLightboxOpen(false);
        }}
        title={active.caption}
      >
        <ResponsiveImage
          basePath={active.basePath}
          widths={WIDTHS}
          alt={active.alt}
          sizes="90vw"
          loading="eager"
          className="mx-auto max-h-[80vh] w-auto rounded-[var(--radius-image)] object-contain"
        />
        <p className="mt-4 text-center text-body text-ink-muted">{active.caption}</p>
      </Modal>
    </div>
  );
}
