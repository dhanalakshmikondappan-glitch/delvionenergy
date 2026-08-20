import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useFocusTrap } from "~/hooks/useFocusTrap";
import { useLockBodyScroll } from "~/hooks/useLockBodyScroll";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /**
   * "wide" gives image-led dialogs (the /what-we-build lightbox) room to show
   * a 16:9 photo at a useful size; "default" keeps the reading-width panel the
   * text dialogs want.
   */
  size?: "default" | "wide";
}

const SIZE_CLASS: Record<NonNullable<ModalProps["size"]>, string> = {
  default: "max-w-2xl",
  wide: "max-w-5xl",
};

/**
 * Generic dialog primitive (MASTER.md §47 component library). Same
 * always-mounted + `inert` + CSS-transition pattern as MobileMenu, for the
 * same reason: conditional mounting an AnimatePresence exit was unreliable
 * in this project's own testing (see docs/DECISIONS.md).
 *
 * Same `mounted` gate as MobileMenu, for the same confirmed reason: the
 * portal has no server output at all, so rendering it unconditionally on
 * the client's first render (guarded only by `typeof document ===
 * "undefined"`, true only on the server) inserted a new subtree straight
 * into document.body during hydration and produced a real React error
 * #418 on every route that mounts a Modal.
 */
export function Modal({ open, onClose, title, children, size = "default" }: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useFocusTrap(panelRef, open);
  useLockBodyScroll(open);

  useEffect(() => {
    // Mount-gate for the portal below, not a data sync — see MobileMenu's
    // identical call for the full explanation.
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
      role="dialog"
      aria-modal={open}
      aria-hidden={!open}
      aria-label={title}
      inert={!open}
      className={`fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4 transition-opacity duration-normal ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-surface-dark/70" />
      <div
        ref={panelRef}
        className={`relative max-h-[90vh] w-full ${SIZE_CLASS[size]} overflow-y-auto rounded-[var(--radius-card)] bg-surface-elevated p-6 shadow-lg transition-transform duration-normal sm:p-8 ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-[var(--radius-button)] p-2 text-ink transition-colors duration-fast hover:bg-surface"
        >
          <X aria-hidden="true" size={22} />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
