import type { ReactNode } from "react";

type ContainerWidth = "max" | "content" | "reading" | "form" | "calculator";

interface ContainerProps {
  children: ReactNode;
  className?: string;
  /** MASTER.md §112 named widths — defaults to the standard content width. */
  width?: ContainerWidth;
}

const WIDTH_CLASS: Record<ContainerWidth, string> = {
  max: "max-w-[var(--container-max)]",
  content: "max-w-[var(--container-content)]",
  reading: "max-w-[var(--container-reading)]",
  form: "max-w-[var(--container-form)]",
  calculator: "max-w-[var(--container-calculator)]",
};

export function Container({ children, className, width = "content" }: ContainerProps) {
  const classes = ["mx-auto w-full px-4 sm:px-6 lg:px-8", WIDTH_CLASS[width], className]
    .filter(Boolean)
    .join(" ");

  return <div className={classes}>{children}</div>;
}
