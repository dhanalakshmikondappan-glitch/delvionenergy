import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { fadeUp } from "~/animations/fade";

interface ScrollRevealProps {
  children: ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
}

/**
 * MASTER.md §33: scroll reveals fade/slide/scale once and never repeat.
 *
 * Reduced motion changes the *duration*, never the markup. Swapping in a
 * plain `<div>` instead (the previous approach) shipped a real bug: the
 * prerender cannot know the preference, so it always emitted the animated
 * branch with `initial="hidden"` — `opacity:0` baked into the HTML — and a
 * reduced-motion client then hydrated a plain div with nothing left to drive
 * those elements back to visible. The whole page below the hero stayed
 * invisible. Keeping one motion component for both cases means the element
 * that owns the inline `opacity:0` is always the element that clears it.
 *
 * A zero-duration transition is still "no motion": the content appears
 * instantly, with no fade and no travel.
 */
export function ScrollReveal({ children, variants = fadeUp, className, delay = 0 }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={
        prefersReducedMotion ? { duration: 0 } : { duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
