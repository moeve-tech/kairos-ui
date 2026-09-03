import { ProgressBar } from "../../atoms/ProgressBar/ProgressBar";

export interface DecisionFactorRowProps {
  label: string;
  /** the short value on the right, e.g. "Alta", "Estable", "65%" */
  statusText: string;
  statusClassName?: string;
  /** 0-100, the weight/strength of this factor */
  value: number;
  fillClassName?: string;
  segments?: number;
  description: string;
}

/**
 * A row in the "Decision Factors" panel (Elasticity, Supply Cost,
 * Inventory...). Designed to be populated directly from the `factors`
 * array returned by the backend's POST /predict - each factor from the
 * API maps 1 to 1 to one of these rows.
 */
export function DecisionFactorRow({
  label,
  statusText,
  statusClassName = "text-brand-primary",
  value,
  fillClassName = "bg-brand-primary",
  segments = 1,
  description,
}: DecisionFactorRowProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-text-primary">{label}</span>
        <span className={`text-sm font-semibold ${statusClassName}`}>{statusText}</span>
      </div>
      <ProgressBar value={value} fillClassName={fillClassName} heightClassName="h-1.5" segments={segments} />
      <p className="text-xs leading-relaxed text-text-secondary">{description}</p>
    </div>
  );
}
