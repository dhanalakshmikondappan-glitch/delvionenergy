import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export const CINEMATIC_FRAME_COUNT = 60;
const FRAME_BASE = "/media/hero-sequence/frame";

export function cinematicFrameSrc(n: number): string {
  return `${FRAME_BASE}-${String(n).padStart(3, "0")}.webp`;
}

/**
 * The hero-pitch -> journey crossfade window, as a fraction of total scroll
 * progress through the wrapper. Deliberately a single shared window where
 * heroOpacity + journeyOpacity === 1 at every point — an earlier version
 * computed these two independently (hero fading out over one span, journey
 * fading in over a longer one starting where hero ended) which left a real
 * gap where *both* were at or near zero opacity around 14% progress: the
 * hero had already fully faded, but journey hadn't ramped back up yet, so
 * scrolling through that stretch showed no readable text at all. This
 * version can't produce that gap by construction.
 */
const CROSSFADE_START = 0.06;
const CROSSFADE_END = 0.18;

interface UseHeroCinematicOptions {
  enabled: boolean;
  phaseCount: number;
}

interface UseHeroCinematicResult {
  loadProgress: number;
  isReady: boolean;
}

/**
 * Drives the hero's scroll-scrubbed "journey" experience (docs/DECISIONS.md
 * — Phase 7): preloads the 60-frame sequence, then tracks scroll progress
 * through `wrapperRef` and maps it to the current canvas frame, the
 * hero-pitch -> journey content crossfade, and the active story-phase
 * caption. Per-scroll-tick work (frame draw, caption/content opacity,
 * progress bar) is imperative DOM manipulation rather than React state —
 * matching useHeroTimeline's approach, since re-rendering React on every
 * scroll tick would be needlessly expensive for something this
 * high-frequency.
 *
 * Deliberately does **not** use GSAP ScrollTrigger's `pin: true`. Pinning
 * reparents the pinned element under a "pin-spacer" div GSAP inserts
 * directly into the DOM — a change React's own fiber tree never learns
 * about. That caused a real, reproducible crash: navigating away from the
 * homepage while the hero was pinned threw "Failed to execute 'removeChild'
 * ... The node to be removed is not a child of this node", because React
 * still believed the section's parent was whatever it was at mount, not
 * the pin-spacer GSAP had inserted since. Wrapping the ScrollTrigger
 * creation in `gsap.context()` + calling `.revert()` on cleanup — GSAP's
 * own documented fix for exactly this class of bug — did *not* resolve it
 * in testing (confirmed by reproducing the crash again afterward). The
 * reliable fix is to never let GSAP mutate the DOM structure at all:
 * `sectionRef` is a plain CSS `position: sticky` element (owned entirely by
 * React/JSX, see `HeroSection.tsx`), `wrapperRef` is a taller ancestor whose
 * CSS height reserves the scroll distance, and ScrollTrigger is only used
 * to *observe* scroll progress through that wrapper (no `pin`) and drive
 * imperative style updates — nothing it does can conflict with how React
 * thinks the tree is shaped.
 *
 * Canvas sizing uses a `ResizeObserver` on `<html>` rather than a `window`
 * `resize` listener — browser zoom changes the rendered viewport without
 * reliably firing a `resize` event in every embedding context. Every
 * callback is coalesced through a single pending `requestAnimationFrame` so
 * a drag-resize or a run of zoom steps can't queue up redundant redraws.
 */
export function useHeroCinematic(
  wrapperRef: RefObject<HTMLElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { enabled, phaseCount }: UseHeroCinematicOptions,
): UseHeroCinematicResult {
  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const images: HTMLImageElement[] = [];

    for (let i = 1; i <= CINEMATIC_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = cinematicFrameSrc(i);
      img.onload = () => {
        if (cancelled) return;
        loaded += 1;
        setLoadProgress(Math.round((loaded / CINEMATIC_FRAME_COUNT) * 100));
        if (loaded === CINEMATIC_FRAME_COUNT) setIsReady(true);
      };
      images.push(img);
    }
    imagesRef.current = images;

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!enabled || !isReady) return;
    const wrapperEl = wrapperRef.current;
    const sectionEl = sectionRef.current;
    const canvasEl = canvasRef.current;
    if (!wrapperEl || !sectionEl || !canvasEl) return;

    const ctx = canvasEl.getContext("2d");
    if (!ctx) return;

    const images = imagesRef.current;
    let cancelled = false;
    let gsapContext: { revert: () => void } | undefined;
    const drawn = { frame: -1 };

    function resizeCanvas(canvas: HTMLCanvasElement) {
      const ratio = window.devicePixelRatio || 1;
      const width = Math.round(document.documentElement.clientWidth * ratio);
      const height = Math.round(document.documentElement.clientHeight * ratio);
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;
    }

    function drawFrame(
      canvas: HTMLCanvasElement,
      context: CanvasRenderingContext2D,
      index: number,
    ) {
      const img = images[index];
      if (!img?.complete) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
      const dw = img.naturalWidth * scale;
      const dh = img.naturalHeight * scale;
      context.clearRect(0, 0, cw, ch);
      context.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    resizeCanvas(canvasEl);
    drawFrame(canvasEl, ctx, 0);

    const phaseEls = Array.from(sectionEl.querySelectorAll<HTMLElement>("[data-cinematic-phase]"));
    const progressEl = sectionEl.querySelector<HTMLElement>('[data-cinematic="progress"]');
    // querySelectorAll, not querySelector — the hero-pitch content is split
    // across two sibling elements (the headline/CTA block and the scroll
    // indicator), both tagged the same way so they fade together.
    const heroContentEls = Array.from(
      sectionEl.querySelectorAll<HTMLElement>('[data-cinematic="hero-content"]'),
    );
    const journeyContentEl = sectionEl.querySelector<HTMLElement>(
      '[data-cinematic="journey-content"]',
    );

    let resizeObserver: ResizeObserver | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([{ gsap }, { ScrollTrigger }]) => {
        if (cancelled) return;
        gsap.registerPlugin(ScrollTrigger);

        gsapContext = gsap.context(() => {
          ScrollTrigger.create({
            trigger: wrapperEl,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.4,
            onUpdate: (self) => {
              const frameIndex = Math.min(
                CINEMATIC_FRAME_COUNT - 1,
                Math.round(self.progress * (CINEMATIC_FRAME_COUNT - 1)),
              );
              if (frameIndex !== drawn.frame) {
                drawn.frame = frameIndex;
                drawFrame(canvasEl, ctx, frameIndex);
              }

              // t goes 0 -> 1 across the crossfade window; hero and journey
              // opacity are exact complements of each other at every point, so
              // there is no scroll position where both are simultaneously dim.
              const t = Math.min(
                1,
                Math.max(0, (self.progress - CROSSFADE_START) / (CROSSFADE_END - CROSSFADE_START)),
              );
              const heroOpacity = 1 - t;
              const journeyOpacity = t;

              heroContentEls.forEach((el) => {
                el.style.opacity = String(heroOpacity);
                el.style.pointerEvents = heroOpacity < 0.05 ? "none" : "auto";
              });
              if (journeyContentEl) {
                journeyContentEl.style.opacity = String(journeyOpacity);
              }

              // Which of the six phases is highlighted is decoupled from the
              // opacity crossfade above — it only starts advancing once the
              // journey content is fully visible (t === 1), then progresses
              // across the rest of the scroll distance.
              const journeyProgress = Math.min(
                1,
                Math.max(0, (self.progress - CROSSFADE_END) / (1 - CROSSFADE_END)),
              );
              const phaseIndex = Math.min(phaseCount - 1, Math.floor(journeyProgress * phaseCount));
              phaseEls.forEach((el, i) => {
                el.dataset.active = String(i === phaseIndex);
              });

              if (progressEl) progressEl.style.width = `${self.progress * 100}%`;
            },
          });

          let resizeFrame = 0;
          resizeObserver = new ResizeObserver(() => {
            if (resizeFrame) return;
            resizeFrame = requestAnimationFrame(() => {
              resizeFrame = 0;
              ScrollTrigger.refresh();
              resizeCanvas(canvasEl);
              drawFrame(canvasEl, ctx, Math.max(0, drawn.frame));
            });
          });
          resizeObserver.observe(document.documentElement);
        }, wrapperEl);
      },
    );

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      gsapContext?.revert();
    };
  }, [enabled, isReady, wrapperRef, sectionRef, canvasRef, phaseCount]);

  return { loadProgress, isReady };
}
