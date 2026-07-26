import { useEffect, useState } from "react";

const SESSION_KEY = "delvion-splash-seen";
const MIN_DISPLAY_MS = 500;
const MAX_WAIT_MS = 1800;
const REVEAL_MS = 900;

/**
 * Site-entry splash (docs/DECISIONS.md — Phase 7): solid deep-green panel,
 * the logo mark centered and pulsing while critical assets (fonts, the
 * hero's first frame) load, then an iris-style clip-path reveal exposes the
 * hero underneath. Shown once per tab session — a synchronous inline
 * script in root.tsx plus the `[data-splash-seen="true"]` rule in base.css
 * hide it via pure CSS with zero flash on repeat visits, before this
 * component's own JS even runs. Reduced-motion visitors never see it
 * either way (same base.css rule, plus the JS check below skips the wait).
 *
 * Renders identically on the server and the client's first render (always
 * "showing, not yet revealing") — the decision to skip is made in an
 * effect, after hydration, never during render, so there's no hydration
 * mismatch risk.
 */
export function SplashScreen() {
  const [isRevealing, setIsRevealing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const start = performance.now();

    const alreadySeen = document.documentElement.dataset.splashSeen === "true";
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (alreadySeen || prefersReducedMotion) {
      // Client-only capability check, resolved synchronously on mount —
      // matches useHeroTimeline's reduced-motion branch. The render output
      // is identical either way until this effect runs (see the component
      // doc comment above), so there's no hydration-mismatch risk here,
      // just the exact pattern this lint rule can't distinguish from one.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsDone(true);
      return;
    }

    let cancelled = false;
    const timeouts: number[] = [];

    function reveal() {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
      timeouts.push(
        window.setTimeout(() => {
          if (cancelled) return;
          setIsRevealing(true);
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // Private browsing / storage disabled — the splash just replays
            // next time, which is a harmless degradation, not a bug.
          }
          timeouts.push(
            window.setTimeout(() => {
              if (!cancelled) setIsDone(true);
            }, REVEAL_MS),
          );
        }, remaining),
      );
    }

    const posterImg = new Image();
    posterImg.src = "/media/hero-sequence/frame-001.webp";

    const fontsReady = document.fonts.ready;
    const posterReady = new Promise<void>((resolve) => {
      posterImg.onload = () => {
        resolve();
      };
      posterImg.onerror = () => {
        resolve();
      };
    });
    const maxWait = new Promise<void>((resolve) => {
      timeouts.push(window.setTimeout(resolve, MAX_WAIT_MS));
    });

    void Promise.race([Promise.all([fontsReady, posterReady]), maxWait]).then(reveal);

    return () => {
      cancelled = true;
      timeouts.forEach((handle) => {
        window.clearTimeout(handle);
      });
    };
  }, []);

  if (isDone) return null;

  return (
    <div
      id="splash-screen"
      aria-hidden="true"
      style={{
        clipPath: isRevealing ? "circle(0vmax at 50% 50%)" : "circle(150vmax at 50% 50%)",
        transition: `clip-path ${REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
      }}
      className="fixed inset-0 z-[var(--z-splash)] flex items-center justify-center bg-surface-dark"
    >
      <svg
        viewBox="0 0 64 64"
        width="72"
        height="72"
        fill="none"
        style={{
          transform: isRevealing ? "scale(1.4)" : "scale(1)",
          opacity: isRevealing ? 0 : 1,
          transition: `transform ${REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1), opacity ${REVEAL_MS}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
        className={isRevealing ? "" : "animate-pulse"}
      >
        <path d="M8 40 A24 24 0 0 1 56 40" stroke="var(--color-dawn)" strokeWidth="5" strokeLinecap="round" />
        <path d="M14 40 A18 18 0 0 1 50 40" stroke="var(--color-mercury)" strokeWidth="5" strokeLinecap="round" />
        <line x1="6" y1="48" x2="58" y2="48" stroke="var(--color-ink-inverse)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
