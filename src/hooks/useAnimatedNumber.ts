import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";

/**
 * Smoothly interpolates the displayed number toward `target` whenever it
 * changes — MASTER.md §25: "numbers count upward... never flash, never
 * jump." Self-contained rAF interpolation rather than a Framer Motion
 * spring, so its behavior doesn't depend on a specific animation-library
 * API surface.
 *
 * Under reduced motion, `target` is returned directly rather than synced
 * into `display` via an effect — an effect calling setState synchronously
 * on every dependency change causes an avoidable extra render.
 */
export function useAnimatedNumber(target: number, duration = 500): number {
  const [display, setDisplay] = useState(target);
  const prefersReducedMotion = useReducedMotion();
  const fromRef = useRef(target);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const from = fromRef.current;
    const start = performance.now();
    let frame: number;

    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(from + (target - from) * eased);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else {
        fromRef.current = target;
      }
    }
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [target, duration, prefersReducedMotion]);

  return prefersReducedMotion ? target : display;
}
