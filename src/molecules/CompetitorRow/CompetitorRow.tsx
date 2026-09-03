import type { ReactNode } from "react";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { MapPinIcon, ArrowUpIcon, ArrowDownIcon } from "../../icons";

export type CompetitorTrend = "up" | "down" | "stable";

export interface CompetitorRowProps {
  name: string;
  /** initial shown in the avatar, e.g. "O" */
  avatarLetter: string;
  avatarBgClassName: string;
  avatarTextClassName: string;
  distanceKm: number;
  price: string;
  trend: CompetitorTrend;
  /** e.g. "Hace 2h" or "Sin cambios (24h)" */
  trendLabel: string;
}

const TREND_ICON: Record<CompetitorTrend, ReactNode | null> = {
  up: <ArrowUpIcon className="size-4" />,
  down: <ArrowDownIcon className="size-4" />,
  stable: null,
};

const TREND_TEXT_CLASS: Record<CompetitorTrend, string> = {
  up: "text-success-dark",
  down: "text-danger",
  stable: "text-text-secondary",
};

/**
 * A row in the "Nearby Competitors" panel. Designed to be populated
 * directly from the array returned by the backend's GET /competitors.
 */
export function CompetitorRow({
  name,
  avatarLetter,
  avatarBgClassName,
  avatarTextClassName,
  distanceKm,
  price,
  trend,
  trendLabel,
}: CompetitorRowProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg bg-surface-page p-4">
      <div className="flex items-center gap-4">
        <Avatar className={`${avatarBgClassName} ${avatarTextClassName}`}>{avatarLetter}</Avatar>
        <div>
          <p className="text-sm font-semibold text-text-primary">{name}</p>
          <div className="flex items-center gap-1 text-text-secondary">
            <MapPinIcon className="size-[18px]" />
            <span className="text-xs font-medium tracking-wide">{distanceKm} km</span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-2xl font-semibold text-text-primary">{price}</p>
        <div className={`flex items-center justify-end gap-1 text-xs font-medium ${TREND_TEXT_CLASS[trend]}`}>
          {TREND_ICON[trend]}
          <span>{trendLabel}</span>
        </div>
      </div>
    </div>
  );
}
