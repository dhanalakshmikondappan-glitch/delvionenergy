import type { Variants } from "motion/react";

/** Container variant for a staggered list — children provide their own fadeUp/etc. variant. */
export function staggerContainer(staggerChildren = 0.08, delayChildren = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: { staggerChildren, delayChildren },
    },
  };
}
