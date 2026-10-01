import type { ReactNode } from "react";
import { Button } from "../../atoms/Button/Button";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { MapPinIcon, RefreshIcon, UserCircleIcon } from "../../icons";

export type TopBarStatusTone = "success" | "neutral";

const STATUS_DOT_CLASSES: Record<TopBarStatusTone, string> = {
  success: "bg-success-dark",
  // same token RealtimeStatusBadge (redisplay-superadmin) uses for its
  // "Conectando..." dot, so both components agree on what "neutral" looks like.
  neutral: "bg-text-tertiary",
};

export interface TopBarProps {
  stationName: string;
  lastUpdatedLabel: string;
  onRefresh?: () => void;
  refreshing?: boolean;
  /** optional content rendered between the station info and the refresh button - e.g. product tabs. */
  middleContent?: ReactNode;
  /**
   * Icon rendered next to `stationName`. Omitted (default) keeps today's
   * `MapPinIcon`; pass `null` to render no icon at all (e.g. when
   * `stationName` is a generic screen title, not an actual station); pass
   * any other node to render that instead - bring your own size/color
   * (e.g. `className="size-4 text-text-primary"`), same convention as
   * `Button`'s `icon` prop.
   */
  icon?: ReactNode | null;
  /** Tone of the "last updated" status dot. Omitted (default) is "success" - today's fixed green dot. */
  statusTone?: TopBarStatusTone;
}

/**
 * The fixed top bar (80px, with blur), to the right of the sidebar.
 * It only knows the active station's name and the "last updated"
 * state - the concrete data comes from the screen that uses it.
 */
export function TopBar({
  stationName,
  lastUpdatedLabel,
  onRefresh,
  refreshing = false,
  middleContent,
  icon,
  statusTone = "success",
}: TopBarProps) {
  const resolvedIcon = icon === undefined ? <MapPinIcon className="size-4 text-text-primary" /> : icon;

  return (
    <header className="fixed left-[260px] right-0 top-0 z-10 flex h-20 items-center justify-between gap-4 bg-surface-page/80 px-6 shadow-header backdrop-blur-md">
      <div className="shrink-0">
        <div className={`flex items-center ${resolvedIcon ? "gap-2" : ""}`}>
          {resolvedIcon}
          <span className="text-sm font-semibold text-text-primary">{stationName}</span>
        </div>
        <div className="mt-1 flex items-center gap-2">
          <span className={`size-2 rounded-full ${STATUS_DOT_CLASSES[statusTone]}`} />
          <span className="text-xs font-medium text-text-secondary">{lastUpdatedLabel}</span>
        </div>
      </div>

      {middleContent}

      <div className="flex shrink-0 items-center gap-4">
        <Button
          variant="primary"
          icon={<RefreshIcon className={`size-4 ${refreshing ? "animate-spin" : ""}`} />}
          onClick={onRefresh}
          disabled={refreshing}
        >
          Actualizar datos
        </Button>
        <Avatar className="bg-brand-primary text-white" size="sm">
          <UserCircleIcon className="size-4" />
        </Avatar>
      </div>
    </header>
  );
}
