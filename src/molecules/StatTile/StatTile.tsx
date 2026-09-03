import type { ReactNode } from "react";
import { Badge, type BadgeTone } from "../../atoms/Badge/Badge";
import { ProgressBar } from "../../atoms/ProgressBar/ProgressBar";
import { TrendUpIcon, TrendDownIcon } from "../../icons";

export interface StatTileProps {
  icon: ReactNode;
  label: string;
  value: string;
  /** unit suffix rendered next to `value` in a lighter/smaller style, e.g. "L" */
  unit?: string;
  /** delta badge text, e.g. "+2.4% vs prom. diario" */
  delta?: string;
  deltaTone?: BadgeTone;
  /** optional 0-100 value for the mini bar below (not every tile has one) */
  progressValue?: number;
  progressClassName?: string;
}

// Same idea as TREND_ICON in CompetitorRow: the icon is picked from the
// tone via a Record, so adding/adjusting a tone doesn't touch the JSX
// (Open/Closed) - "neutral" has no obvious up/down direction, so it
// renders no icon, same as CompetitorRow's `stable: null`.
const DELTA_ICON: Record<BadgeTone, ReactNode | null> = {
  success: <TrendUpIcon className="size-4" />,
  danger: <TrendDownIcon className="size-4" />,
  neutral: null,
};

/**
 * One of the result cards ("Volumen Proyectado", "Margen Bruto Proy.",
 * "Ganancia Proyectada"). Purely presentational - it doesn't know where
 * the numbers come from, it just renders them (Dependency Inversion:
 * StatTile depends on props, not on the API or the model).
 */
export function StatTile({
  icon,
  label,
  value,
  unit,
  delta,
  deltaTone = "success",
  progressValue,
  progressClassName = "bg-info",
}: StatTileProps) {
  return (
    <div className="relative flex flex-1 flex-col gap-4 overflow-hidden rounded-2xl bg-surface-card p-6 shadow-card">
      <span className="pointer-events-none absolute right-5 top-5 text-border">{icon}</span>
      <h3 className="max-w-[80%] text-lg font-semibold text-text-secondary">{label}</h3>
      <p className="flex items-baseline gap-1.5">
        <span className="text-4xl font-bold text-text-primary">{value}</span>
        {unit && <span className="text-2xl font-medium text-text-tertiary">{unit}</span>}
      </p>
      {delta && (
        <Badge tone={deltaTone} className="w-fit gap-1">
          {DELTA_ICON[deltaTone]}
          {delta}
        </Badge>
      )}
      {progressValue !== undefined && (
        <ProgressBar value={progressValue} fillClassName={progressClassName} />
      )}
    </div>
  );
}
