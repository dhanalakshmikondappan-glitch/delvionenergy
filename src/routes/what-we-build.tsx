import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router";

import { Button } from "~/components/buttons/Button";
import { Container } from "~/components/layout/Container";
import { Section } from "~/components/layout/Section";
import { SectionHeader } from "~/components/layout/SectionHeader";
import { ResponsiveImage } from "~/components/media/ResponsiveImage";
import { StaggerGroup, StaggerItem } from "~/components/motion/StaggerGroup";
import { Modal } from "~/components/ui/Modal";
import { AUTOMATION_CATEGORIES, GALLERY_ITEMS } from "~/constants/media";
import type { AutomationCategoryId, GalleryItem } from "~/constants/media";
import { ROUTE_PATHS } from "~/constants/routePaths";
import { buildMetaTags } from "~/constants/seo";
import { useHydrated } from "~/hooks/useHydrated";

import type { Route } from "./+types/what-we-build";

const ALL = "all";
type Filter = AutomationCategoryId | typeof ALL;

const CATEGORY_IDS = new Set(AUTOMATION_CATEGORIES.map((category) => category.id));

function isFilter(value: string | null): value is AutomationCategoryId {
  return value !== null && CATEGORY_IDS.has(value as AutomationCategoryId);
}

/** The item `delta` steps away from `index`, wrapping around both ends. */
function neighbour(list: GalleryItem[], index: number, delta: number): GalleryItem | undefined {
  return list[(index + delta + list.length) % list.length];
}

export function meta(_args: Route.MetaArgs) {
  return buildMetaTags("whatWeBuild");
}

/**
 * Equipment gallery: every machine, handling system and installation we
 * design and build, filterable by business line and openable full-size.
 *
 * Deliberately *not* a case-study page — nothing here claims a completed
 * customer project, a location or a capacity, because those details don't
 * exist yet. It shows capability, which is what the photography actually
 * evidences.
 *
 * The active filter lives in the URL (`?category=spm`) so the homepage
 * Automation accordion can deep-link straight into a business line and so a
 * filtered view is shareable and survives the back button.
 */
export default function WhatWeBuild() {
  const [searchParams, setSearchParams] = useSearchParams();
  const hydrated = useHydrated();

  // Before hydration completes the prerendered HTML knows nothing about the
  // query string, so the unfiltered view is the only render that matches it.
  const requested = searchParams.get("category");
  const active: Filter = hydrated && isFilter(requested) ? requested : ALL;

  // Memoised so the arrow-key listener below re-subscribes only when the
  // visible set actually changes, not on every render.
  const items = useMemo(
    () => (active === ALL ? GALLERY_ITEMS : GALLERY_ITEMS.filter((item) => item.category === active)),
    [active],
  );

  // Tracked by id rather than index so that changing the filter out from
  // under an open lightbox simply closes it, instead of leaving a stale index
  // pointing at whatever now occupies that slot.
  const [openId, setOpenId] = useState<string | null>(null);
  const openIndex = items.findIndex((item) => item.id === openId);
  const openItem = openIndex === -1 ? null : items[openIndex];

  function selectFilter(next: Filter) {
    const params = new URLSearchParams(searchParams);
    if (next === ALL) {
      params.delete("category");
    } else {
      params.set("category", next);
    }
    setSearchParams(params, { replace: true, preventScrollReset: true });
  }

  function step(delta: number) {
    if (openIndex === -1) return;
    const next = neighbour(items, openIndex, delta);
    if (next) setOpenId(next.id);
  }

  // Listening on the document, not on the lightbox markup: focus sits on the
  // dialog's own close button (Modal traps it there), which is a *parent* of
  // anything this route renders, so a keydown handler on the content below it
  // never sees the event.
  useEffect(() => {
    if (openIndex === -1 || items.length < 2) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      event.preventDefault();
      const next = neighbour(items, openIndex, event.key === "ArrowRight" ? 1 : -1);
      if (next) setOpenId(next.id);
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [openIndex, items]);

  return (
    <Section>
      <Container>
        <SectionHeader
          id="what-we-build-heading"
          headingLevel="h1"
          eyebrow="Our Capability"
          title="What We Build"
          description="Special-purpose machines, material handling, robotic and gantry automation, and rooftop solar — the systems we design, fabricate and commission."
        />

        <div
          role="group"
          aria-label="Filter by category"
          className="mt-10 flex flex-wrap justify-center gap-2 md:mt-12 md:gap-3"
        >
          {[{ id: ALL, label: "All" }, ...AUTOMATION_CATEGORIES].map((category) => {
            const selected = category.id === active;
            return (
              <button
                key={category.id}
                type="button"
                aria-pressed={selected}
                onClick={() => {
                  selectFilter(category.id as Filter);
                }}
                className={`min-h-11 rounded-[var(--radius-button)] border px-4 py-2.5 text-body font-medium transition-colors duration-fast ${
                  selected
                    ? "border-ink bg-ink text-ink-inverse"
                    : "border-line bg-surface-elevated text-ink hover:border-ink-muted"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </div>

        <StaggerGroup
          key={active}
          className="mt-10 grid gap-6 md:mt-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item) => (
            <StaggerItem key={item.id}>
              <button
                type="button"
                onClick={() => {
                  setOpenId(item.id);
                }}
                className="group block h-full w-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-surface-elevated text-left transition-all duration-normal hover:-translate-y-1 hover:border-mercury hover:shadow-md"
              >
                <span className="block aspect-video overflow-hidden">
                  <ResponsiveImage
                    basePath={item.basePath}
                    widths={item.widths}
                    alt={item.alt}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    className="h-full w-full object-cover transition-transform duration-slow group-hover:scale-105"
                  />
                </span>
                <span className="block p-6">
                  <span className="block text-subheading">{item.title}</span>
                  <span className="mt-3 inline-block text-body font-medium underline decoration-transparent underline-offset-4 transition-colors duration-fast group-hover:decoration-current">
                    View full size
                  </span>
                </span>
              </button>
            </StaggerItem>
          ))}
        </StaggerGroup>

        <div className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="text-body text-ink-muted">
            Building something that isn&apos;t here? Most of what we make is one-off.
          </p>
          <Button to={ROUTE_PATHS.contact}>Discuss Your Requirement</Button>
        </div>
      </Container>

      <Modal
        open={openItem !== null}
        onClose={() => {
          setOpenId(null);
        }}
        title={openItem ? openItem.title : "Equipment photo"}
        size="wide"
      >
        {openItem ? (
          <div>
            <div className="relative">
              <ResponsiveImage
                basePath={openItem.basePath}
                widths={openItem.widths}
                alt={openItem.alt}
                sizes="(min-width: 1024px) 60rem, 90vw"
                loading="eager"
                className="mx-auto max-h-[65vh] w-full rounded-[var(--radius-image)] object-contain"
              />

              {items.length > 1 ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      step(-1);
                    }}
                    aria-label="Previous photo"
                    className="absolute top-1/2 left-1 -translate-y-1/2 rounded-full bg-surface-elevated/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors duration-fast hover:bg-surface-elevated md:left-3 md:p-3"
                  >
                    <ChevronLeft aria-hidden="true" size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      step(1);
                    }}
                    aria-label="Next photo"
                    className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full bg-surface-elevated/85 p-2 text-ink shadow-sm backdrop-blur-sm transition-colors duration-fast hover:bg-surface-elevated md:right-3 md:p-3"
                  >
                    <ChevronRight aria-hidden="true" size={22} />
                  </button>
                </>
              ) : null}
            </div>

            <h2 className="mt-6 text-subheading">{openItem.title}</h2>
            <p aria-live="polite" className="mt-1 text-caption text-ink-muted">
              {`${String(openIndex + 1)} of ${String(items.length)}`}
            </p>
          </div>
        ) : null}
      </Modal>
    </Section>
  );
}
