/**
 * MASTER.md §37: first focusable element on every page. Invisible until
 * keyboard focus lands on it, then jumps straight to <main id="main">.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-4 focus-visible:left-4 focus-visible:z-[var(--z-toast)] focus-visible:rounded-[var(--radius-button)] focus-visible:bg-surface-elevated focus-visible:px-4 focus-visible:py-3 focus-visible:font-medium focus-visible:text-ink focus-visible:shadow-lg"
    >
      Skip to content
    </a>
  );
}
