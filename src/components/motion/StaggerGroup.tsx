import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { fadeUp } from "~/animations/fade";
import { staggerContainer } from "~/animations/stagger";

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
}

/**
 * Wraps a list of <StaggerItem>s so they reveal in sequence, once, on scroll
 * into view.
 *
 * Reduced motion drops the stagger to zero rather than rendering a plain
 * `<div>` — see the note in ScrollReveal for why the markup must not change
 * with the preference (the prerendered HTML carries `opacity:0`, and only a
 * motion component will clear it).
 */
export function StaggerGroup({ children, className, staggerChildren = 0.08 }: StaggerGroupProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={staggerContainer(prefersReducedMotion ? 0 : staggerChildren)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  variants?: Variants;
}

export function StaggerItem({ children, className, variants = fadeUp }: StaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      variants={variants}
      transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
