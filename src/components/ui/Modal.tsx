import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

import { useFocusTrap } from "~/hooks/useFocusTrap";
import { useLockBodyScroll } from "~/hooks/useLockBodyScroll";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

/**
 * Generic dialog primitive (MASTER.md §47 component library). Same
 * always-mounted + `inert` + CSS-transition pattern as MobileMenu, for the
 * same reason: conditional mounting an AnimatePresence exit was unreliable
 * in this project's own testing (see docs/DECISIONS.md).
 */
export function Modal({ open, onClose, title, children }: ModalProps) {
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

  if (typeof document === "undefined") return null;

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
        className={`relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[var(--radius-card)] bg-surface-elevated p-8 shadow-lg transition-transform duration-normal ${
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
