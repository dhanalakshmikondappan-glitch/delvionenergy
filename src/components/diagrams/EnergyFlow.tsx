import { Home, PanelTop, Router, Sun, TrendingDown, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FlowStage {
  icon: LucideIcon;
  label: string;
}

// MASTER.md §19: Sunlight -> Solar Panels -> Inverter -> Home/Business -> Grid -> Savings.
const STAGES: FlowStage[] = [
  { icon: Sun, label: "Sunlight" },
  { icon: PanelTop, label: "Solar Panels" },
  { icon: Zap, label: "Inverter" },
  { icon: Home, label: "Home / Business" },
  { icon: Router, label: "Grid" },
  { icon: TrendingDown, label: "Savings" },
];

function Connector() {
  return (
    <div aria-hidden="true" className="relative mx-2 hidden h-px flex-1 bg-line lg:block">
      <span className="absolute top-1/2 left-0 h-2 w-2 -translate-y-1/2 rounded-full bg-mercury animate-energy-flow" />
    </div>
  );
}

/**
 * MASTER.md §19-20: the solar process as a flow of animated energy
 * particles rather than static arrows. Row layout only activates at lg+
 * (1024px) — six icon nodes plus connectors need real width to sit in one
 * row; at sm (375px) that overflowed the viewport. Below lg the stacked
 * order alone conveys the sequence, which is simpler and equally clear.
 */
export function EnergyFlow() {
  return (
    <div className="flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:justify-between lg:gap-0">
      {STAGES.map((stage, index) => (
        <div key={stage.label} className="flex items-center lg:contents">
          <div className="flex w-24 flex-col items-center gap-3 text-center">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-line bg-surface-elevated">
              <stage.icon aria-hidden="true" className="text-ink" size={28} strokeWidth={1.75} />
            </div>
            <span className="text-caption font-medium text-ink-muted">{stage.label}</span>
          </div>
          {index < STAGES.length - 1 ? <Connector /> : null}
        </div>
      ))}
    </div>
  );
}
