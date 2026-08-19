import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

export interface AccordionItem {
  title: string;
  /** Plain text (e.g. an FAQ answer) or richer JSX (e.g. a description plus a bullet list). */
  content: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
}

/**
 * MASTER.md §29/§85: only one item open at a time, height + opacity
 * transition, rotating chevron, keyboard accessible. The height animation
 * uses the CSS grid-template-rows 0fr/1fr technique so it never needs to
 * measure DOM heights in JS.
 *
 * Generic over `content` (ReactNode, not just a string) so this same
 * interaction pattern serves both the FAQ page's plain-text answers and
 * richer panels elsewhere (e.g. a description plus a bullet list) without
 * a second accordion implementation.
 */
export function Accordion({ items }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `accordion-panel-${index}`;
        const buttonId = `accordion-button-${index}`;

        return (
          <div key={item.title}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => {
                  setOpenIndex(isOpen ? null : index);
                }}
                className="flex w-full items-center justify-between gap-4 py-6 text-left"
              >
                <span className="text-subheading">{item.title}</span>
                <ChevronDown
                  aria-hidden="true"
                  className={`shrink-0 text-ink-muted transition-transform duration-normal ${isOpen ? "rotate-180" : ""}`}
                  size={24}
                  strokeWidth={1.75}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              className={`grid transition-[grid-template-rows] duration-normal ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            >
              <div className="overflow-hidden">
                <div
                  className={`pb-6 text-body text-ink-muted transition-opacity duration-normal ${
                    isOpen ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.content}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
