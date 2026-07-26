import { NavLink } from "react-router";

import { NAV_ITEMS } from "~/constants/navigation";

interface DesktopNavProps {
  inverse?: boolean;
}

export function DesktopNav({ inverse = false }: DesktopNavProps) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            [
              "text-body font-medium transition-colors duration-fast",
              "underline decoration-2 underline-offset-4",
              isActive ? "decoration-current" : "decoration-transparent",
              inverse ? "text-ink-inverse hover:decoration-current" : "text-ink hover:decoration-current",
            ].join(" ")
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
