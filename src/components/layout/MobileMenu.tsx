import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
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
 *
 * The portal only renders once `mounted` (set in an effect, after
 * hydration commits) — not merely once `document` exists. `createPortal`
 * has no server output at all, so rendering it unconditionally on the
 * client's first render (the old guard was just `typeof document ===
 * "undefined"`) made that first render insert a brand-new subtree
 * straight into `document.body` — the exact container hydration is
 * walking to match the rest of the tree against the server HTML — which
 * is a real, confirmed hydration mismatch (React error #418) on every
 * route, not a theoretical one. Gating on `mounted` makes the client's
 * first render identical to the server's (null), matching the pattern
 * SplashScreen already uses correctly.
 */
export function MobileMenu({ open, onClose, id }: MobileMenuProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);

  useEffect(() => {
    // Mount-gate for the portal below, not a data sync — the render output
    // is identical (null) on the server and the client's first render, so
    // there's no hydration-mismatch risk, just the exact pattern this lint
    // rule can't distinguish from one. Matches SplashScreen's same call.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

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

  if (!mounted) return null;

  return createPortal(
    <div
      id={id}
      ref={panelRef}
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label="Site menu"
      inert={!open}
      className={`fixed inset-0 z-[var(--z-mobile-menu)] flex flex-col overflow-y-auto bg-surface-dark/95 text-ink-inverse backdrop-blur-sm transition-all duration-normal ${
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
            {item.badge ? (
              <span className="ml-2 inline-flex items-center rounded-full bg-mercury/20 px-2 py-0.5 text-fine font-semibold text-mercury">
                {item.badge}
              </span>
            ) : null}
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
