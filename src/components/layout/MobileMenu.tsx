import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { NavLink } from "react-router";

import { Button } from "~/components/buttons/Button";
import { COMPANY } from "~/constants/company";
import { NAV_ITEMS } from "~/constants/navigation";
import { useFocusTrap } from "~/hooks/useFocusTrap";
import { useLockBodyScroll } from "~/hooks/useLockBodyScroll";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  id: string;
}

/**
 * MASTER.md §73: fullscreen dark-blur overlay, large typography items,
 * bottom CTAs (Call Now / WhatsApp), closing animation reverse of opening.
 * Rendered via a portal so it sits above everything regardless of where
 * the toggle button lives in the tree.
 *
 * Always mounted, toggled with `inert` + CSS transitions rather than
 * conditional mounting — native `inert` correctly removes the closed panel
 * from the tab order and the accessibility tree with no extra wiring, and
 * `prefers-reduced-motion` is already handled globally (src/styles/base.css
 * forces all transition durations to ~0 under that media query), so no
 * separate reduced-motion branch is needed here either.
 */
export function MobileMenu({ open, onClose, id }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);

  useEffect(() => {
    if (!open) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  // Guards the createPortal(..., document.body) call below — this
  // component's render body runs in Node during prerendering, where
  // `document` does not exist.
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label="Site menu"
      inert={!open}
      className={`fixed inset-0 z-[var(--z-mobile-menu)] flex flex-col bg-surface-dark/95 text-ink-inverse backdrop-blur-sm transition-all duration-normal ${
        open ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-4">
        <span className="font-heading text-subheading font-semibold">Delvion Energy</span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="rounded-[var(--radius-button)] p-2 transition-colors duration-fast hover:bg-ink-inverse/10"
        >
          <X aria-hidden="true" size={28} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center justify-center gap-6" aria-label="Mobile">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className="text-section font-heading font-semibold"
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-3 px-6 pb-10">
        <Button href={`tel:${COMPANY.phone}`} variant="secondary" inverse>
          Call Now
        </Button>
        <Button href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noopener noreferrer">
          WhatsApp
        </Button>
      </div>
    </div>,
    document.body,
  );
}
