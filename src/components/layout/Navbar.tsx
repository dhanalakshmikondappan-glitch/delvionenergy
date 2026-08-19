import { Menu } from "lucide-react";
import { useState } from "react";

import { Container } from "~/components/layout/Container";
import { DesktopNav } from "~/components/layout/DesktopNav";
import { Logo } from "~/components/layout/Logo";
import { MobileMenu } from "~/components/layout/MobileMenu";
import { NavActions } from "~/components/layout/NavActions";
import { useHeroOverlap } from "~/hooks/useHeroOverlap";

interface NavbarProps {
  /** True only on routes with a full-bleed hero beneath the navbar (currently just "/"). */
  overHero: boolean;
}

const MOBILE_MENU_ID = "mobile-menu";

/**
 * MASTER.md §72: sticky, 80px, transparent over the hero and solid once
 * scrolled past it (§10) — only true on routes with a hero, everywhere
 * else it is solid from first paint (dark-on-dark text would otherwise be
 * unreadable for a frame on non-home routes).
 */
export function Navbar({ overHero }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isPastHero = useHeroOverlap(overHero);
  const isTransparent = overHero && !isPastHero;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[var(--z-sticky-nav)] h-20 transition-colors duration-normal ${
          isTransparent ? "bg-transparent" : "border-b border-line bg-surface-elevated/95 backdrop-blur-sm"
        }`}
      >
        <Container width="max" className="flex h-full items-center justify-between gap-4">
          <Logo inverse={isTransparent} />
          <DesktopNav inverse={isTransparent} />
          <div className="flex items-center gap-2">
            <NavActions inverse={isTransparent} />
            <button
              type="button"
              onClick={() => {
                setIsMenuOpen(true);
              }}
              aria-label="Open menu"
              aria-expanded={isMenuOpen}
              aria-controls={MOBILE_MENU_ID}
              className={`rounded-[var(--radius-button)] p-2 transition-colors duration-fast xl:hidden ${
                isTransparent ? "text-ink-inverse hover:bg-ink-inverse/10" : "text-ink hover:bg-surface"
              }`}
            >
              <Menu aria-hidden="true" size={28} />
            </button>
          </div>
        </Container>
      </header>
      <MobileMenu
        id={MOBILE_MENU_ID}
        open={isMenuOpen}
        onClose={() => {
          setIsMenuOpen(false);
        }}
      />
    </>
  );
}
