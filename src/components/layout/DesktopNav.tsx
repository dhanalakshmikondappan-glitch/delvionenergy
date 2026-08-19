import { NavLink } from "react-router";

import { NAV_ITEMS } from "~/constants/navigation";

interface DesktopNavProps {
  inverse?: boolean;
}

export function DesktopNav({ inverse = false }: DesktopNavProps) {
  return (
    <nav aria-label="Primary" className="hidden items-center gap-5 xl:flex">
      {NAV_ITEMS.map((item) => {
        // NavLink's `isActive` matches on pathname alone, ignoring any
        // `#hash` — the "Products"/"Automation" links both point to "/",
        // so both would register as active (and get styled that way)
        // simultaneously on the homepage. A route-only match (no hash
        // links in NAV_ITEMS point anywhere but "/") sidesteps that: it
        // only lights up for items whose path is a real route, not a
        // same-page anchor.
        const isHashLink = item.path.includes("#");
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              [
                "whitespace-nowrap text-body font-medium transition-colors duration-fast",
                isActive && !isHashLink ? "font-semibold" : "",
                inverse
                  ? `text-ink-inverse/85 hover:text-ink-inverse ${isActive && !isHashLink ? "text-ink-inverse" : ""}`
                  : `text-ink-muted hover:text-ink ${isActive && !isHashLink ? "text-ink" : ""}`,
              ].join(" ")
            }
          >
            {item.label}
          </NavLink>
        );
      })}
    </nav>
  );
}
