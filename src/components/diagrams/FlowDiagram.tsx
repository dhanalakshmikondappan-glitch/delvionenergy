/**
 * Reusable horizontal flow diagram — a chain of labelled nodes connected
 * by dashed lines. Used by both the Products section (PV component path)
 * and the Automation section (process steps).
 *
 * Horizontal at lg+ (6 nodes need real width, matching EnergyFlow's
 * choice); stacks vertically on smaller viewports.
 */

const ACCENT_CLASSES = {
  mercury: { dot: "bg-mercury", border: "border-mercury/40" },
  slate: { dot: "bg-slate", border: "border-slate/40" },
} as const;

type AccentColor = keyof typeof ACCENT_CLASSES;

interface FlowDiagramProps {
  steps: string[];
  accentColor?: AccentColor;
  className?: string;
  /** Overrides the default "Process flow" label — e.g. "Component flow" for a wiring chain that isn't a sequence of steps over time. */
  ariaLabel?: string;
}

function Connector({ accent }: { accent: AccentColor }) {
  const { dot, border } = ACCENT_CLASSES[accent];
  return (
    <>
      {/* Horizontal connector — visible at lg+ */}
      <div
        aria-hidden="true"
        className={`relative mx-2 hidden h-px flex-1 border-t-2 border-dashed lg:block ${border}`}
      >
        <span className={`absolute -left-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${dot}`} />
        <span className={`absolute -right-1 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${dot}`} />
      </div>

      {/* Vertical connector — visible below lg */}
      <div
        aria-hidden="true"
        className={`mx-auto h-6 w-px border-l-2 border-dashed lg:hidden ${border}`}
      />
    </>
  );
}

export function FlowDiagram({
  steps,
  accentColor = "mercury",
  className,
  ariaLabel = "Process flow",
}: FlowDiagramProps) {
  const { dot } = ACCENT_CLASSES[accentColor];

  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={`flex flex-col items-center gap-0 lg:flex-row lg:items-center lg:justify-between lg:gap-0 ${className ?? ""}`}
    >
      {steps.map((step, index) => (
        <div key={step} className="flex flex-col items-center lg:contents">
          <div role="listitem" className="flex flex-col items-center gap-2 text-center">
            <span className={`h-2 w-2 rounded-full ${dot}`} />
            <span className="text-caption font-medium text-ink-muted">{step}</span>
          </div>
          {index < steps.length - 1 ? <Connector accent={accentColor} /> : null}
        </div>
      ))}
    </div>
  );
}
