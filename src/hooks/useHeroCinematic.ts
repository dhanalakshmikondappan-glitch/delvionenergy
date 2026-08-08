import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";

export const CINEMATIC_FRAME_COUNT = 60;
const FRAME_BASE = "/media/hero-sequence/frame";

export function cinematicFrameSrc(n: number): string {
  return `${FRAME_BASE}-${String(n).padStart(3, "0")}.webp`;
}

interface UseHeroCinematicOptions {
  enabled: boolean;
}

interface UseHeroCinematicResult {
  loadProgress: number;
  isReady: boolean;
}

/**
 * Drives the hero's scroll-scrubbed cinematic: preloads the 60-frame
 * WebP sequence, then tracks scroll progress through `wrapperRef` and
 * maps it to the current canvas frame and the progress bar. Per-scroll-tick
 * work is imperative DOM manipulation rather than React state — re-rendering
 * on every scroll tick would be needlessly expensive.
 *
 * Uses CSS `position: sticky` on the section, not GSAP's `pin: true`,
 * to avoid GSAP reparenting the pinned element (which conflicts with React's
 * fiber tree). ScrollTrigger only observes scroll progress — it never
 * mutates the DOM structure.
 */
export function useHeroCinematic(
  wrapperRef: RefObject<HTMLElement | null>,
  sectionRef: RefObject<HTMLElement | null>,
  canvasRef: RefObject<HTMLCanvasElement | null>,
  { enabled }: UseHeroCinematicOptions,
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

    const progressEl = sectionEl.querySelector<HTMLElement>('[data-cinematic="progress"]');

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
  }, [enabled, isReady, wrapperRef, sectionRef, canvasRef]);

  return { loadProgress, isReady };
}
