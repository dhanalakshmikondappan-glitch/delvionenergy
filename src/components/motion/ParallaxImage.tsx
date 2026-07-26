import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import { usePrefersReducedMotion } from "~/hooks/usePrefersReducedMotion";

interface ParallaxImageProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps an image so it drifts vertically within its own frame as the page
 * scrolls past it — depth with no layout risk to the surrounding page,
 * since the frame itself (this wrapper) never changes size, only the
 * image inside it moves. GSAP + ScrollTrigger are dynamically imported —
 * same reasoning as useHeroTimeline: keep this out of the initial bundle,
 * and register the plugin once it's actually needed rather than at module
 * load, since importing ScrollTrigger eagerly would defeat the point of
 * lazy-loading gsap in the first place.
 */
export function ParallaxImage({ children, className }: ParallaxImageProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const frame = frameRef.current;
    // ResponsiveImage renders <picture><source/>...<img/></picture> — target
    // the <img> itself, not the wrapping <picture>, regardless of markup depth.
    const target = frame?.querySelector("img, video");
    if (!frame || !target) return;

    let cancelled = false;
    let scrollTrigger: { kill: () => void } | null | undefined;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      gsap.set(target, { scale: 1.12, transformOrigin: "center center" });
      const tween = gsap.fromTo(
        target,
        { yPercent: -6 },
        {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: frame,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      scrollTrigger = tween.scrollTrigger;
    });

    return () => {
      cancelled = true;
      scrollTrigger?.kill();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={frameRef} className={`overflow-hidden ${className ?? ""}`}>
      {children}
    </div>
  );
}
