export interface ProgressBarProps {
  /** 0 to 100 */
  value: number;
  /** color of the filled bar - Tailwind class, e.g. "bg-info" */
  fillClassName?: string;
  /** bar height in px (the design uses 4px in stat tiles and 6px in Decision Factors) */
  heightClassName?: string;
  /** number of equal segments the bar is divided into (the design uses 3 in "Supply Cost") */
  segments?: number;
  className?: string;
}

/**
 * Simple progress bar. It knows nothing about "what" it represents
 * (elasticity, margin, inventory...) - that's decided by whoever uses it
 * via `value` and `fillClassName`. Keeping it "dumb" is what allows it to
 * be reused in the stat tiles AND in the Decision Factors panel without
 * duplicating code.
 */
export function ProgressBar({
  value,
  fillClassName = "bg-info",
  heightClassName = "h-1",
  segments = 1,
  className = "",
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  if (segments > 1) {
    return (
      <div className={`flex w-full gap-0.5 overflow-hidden rounded-full bg-border ${heightClassName} ${className}`.trim()}>
        {Array.from({ length: segments }).map((_, i) => {
          const segmentStart = (i / segments) * 100;
          const filled = clamped > segmentStart;
          return (
            <div
              key={i}
              className={`h-full flex-1 ${filled ? fillClassName : "opacity-20 " + fillClassName}`}
            />
          );
        })}
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden rounded-full bg-border ${heightClassName} ${className}`.trim()}>
      <div className={`h-full rounded-full ${fillClassName}`} style={{ width: `${clamped}%` }} />
    </div>
  );
}
