import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

import { fadeUp } from "~/animations/fade";
import { staggerContainer } from "~/animations/stagger";

interface StaggerGroupProps {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
}

/** Wraps a list of <StaggerItem>s so they reveal in sequence, once, on scroll into view. */
export function StaggerGroup({ children, className, staggerChildren = 0.08 }: StaggerGroupProps) {
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
      variants={staggerContainer(staggerChildren)}
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
  return (
    <motion.div className={className} variants={variants} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>
      {children}
    </motion.div>
  );
}
