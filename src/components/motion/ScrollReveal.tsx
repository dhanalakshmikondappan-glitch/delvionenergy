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
 * Renders a plain div (no animation at all, not just an instant jump) under
 * reduced motion, since a wrapper div can't cheaply pre-know "hidden" vs
 * "visible" without also risking a hydration mismatch.
 */
export function ScrollReveal({ children, variants = fadeUp, className, delay = 0 }: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
