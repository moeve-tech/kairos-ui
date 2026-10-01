import type { ReactNode } from "react";
import { Button } from "../../atoms/Button/Button";
import { RefreshIcon } from "../../icons";

export type TopBarStatusTone = "success" | "neutral";

const STATUS_DOT_CLASSES: Record<TopBarStatusTone, string> = {
  success: "bg-success-dark",
  // same token RealtimeStatusBadge (redisplay-superadmin) uses for its
  // "Conectando..." dot, so both components agree on what "neutral" looks like.
  neutral: "bg-text-tertiary",
};

export interface TopBarProps {
  /**
   * Not rendered as visible text anymore - the screen's own `<h1>` is the
   * single source of the visible title. Used only as the `aria-label` of
   * this `<header>`, so the bar keeps an accessible name for screen readers.
   */
  stationName: string;
  /** Omitted: no status dot/label is rendered at all (most screens have no real "live" data to report - a fixed decorative "En vivo" is misleading). Pass a string only when it reflects something real (e.g. an actual WebSocket connection state). */
  lastUpdatedLabel?: string;
  /** Omitted: the "Actualizar datos" button is not rendered at all (no screen today refreshes anything through it - a button that does nothing on click is worse than no button). Pass a handler only when it actually refreshes real data. */
  onRefresh?: () => void;
  refreshing?: boolean;
  /** optional content rendered between the station info and the refresh button - e.g. product tabs. */
  middleContent?: ReactNode;
  /** Tone of the "last updated" status dot. Omitted (default) is "success" - today's fixed green dot. */
  statusTone?: TopBarStatusTone;
}

/**
 * The fixed top bar (56px, with blur), to the right of the sidebar. It no
 * longer renders a visible title or an identity avatar - the screen's own
 * `<h1>` is the single source of the title, and the Sidebar is the single
 * source of session identity. The only real content this bar renders is the
 * "last updated" status (when passed) and the optional refresh button.
 */
export function TopBar({
  stationName,
  lastUpdatedLabel,
  onRefresh,
  refreshing = false,
  middleContent,
  statusTone = "success",
}: TopBarProps) {
  return (
    <header
      aria-label={stationName}
      className="fixed left-[260px] right-0 top-0 z-10 flex h-14 items-center justify-between gap-4 bg-surface-page/80 px-6 shadow-header backdrop-blur-md"
    >
      <div className="shrink-0">
        {lastUpdatedLabel !== undefined && (
          <div className="flex items-center gap-2">
            <span className={`size-2 rounded-full ${STATUS_DOT_CLASSES[statusTone]}`} />
            <span className="text-xs font-medium text-text-secondary">{lastUpdatedLabel}</span>
          </div>
        )}
      </div>

      {middleContent}

      <div className="flex shrink-0 items-center gap-4">
        {onRefresh && (
          <Button
            variant="primary"
            icon={<RefreshIcon className={`size-4 ${refreshing ? "animate-spin" : ""}`} />}
            onClick={onRefresh}
            disabled={refreshing}
          >
            Actualizar datos
          </Button>
        )}
      </div>
    </header>
  );
}
