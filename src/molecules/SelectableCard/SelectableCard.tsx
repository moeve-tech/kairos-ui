import type { ReactNode } from "react";

export interface SelectableCardProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  /**
   * Optional visual header (a map, an illustration, anything) rendered in a
   * fixed-height rounded-top slot above the title - switches the card from
   * the default horizontal "icon + text" row into a vertical "listing card"
   * layout (media on top, text below), the same shape a photo-card grid
   * needs. The caller owns what goes in it - this component has no opinion
   * on images vs. maps vs. anything else.
   */
  media?: ReactNode;
  selected?: boolean;
  onClick: () => void;
  className?: string;
}

/**
 * Generic clickable "pick one of these" card: an icon chip, a title, an
 * optional subtitle, and a selected state. Not tied to any domain (not
 * "StationCard") - meant for any picker across the 3 apps (redisplay-web's
 * station picker today, any future list-of-options screen tomorrow).
 */
export function SelectableCard({ icon, title, subtitle, media, selected = false, onClick, className = "" }: SelectableCardProps) {
  const base = `w-full rounded-xl border text-left transition-colors ${
    selected ? "border-brand-primary bg-brand-primary/5" : "border-border hover:bg-surface-subtle"
  } ${className}`.trim();

  if (media) {
    return (
      <button type="button" aria-pressed={selected} onClick={onClick} className={`overflow-hidden ${base}`}>
        <div className="h-36 w-full overflow-hidden">{media}</div>
        <div className="flex items-center gap-3 p-4">
          {icon && (
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                selected ? "bg-brand-primary text-white" : "bg-surface-muted text-text-secondary"
              }`}
            >
              {icon}
            </span>
          )}
          <span className="flex flex-col">
            <span className="font-medium text-text-primary">{title}</span>
            {subtitle && <span className="text-sm text-text-tertiary">{subtitle}</span>}
          </span>
        </div>
      </button>
    );
  }

  return (
    <button type="button" aria-pressed={selected} onClick={onClick} className={`flex items-center gap-3 p-4 ${base}`}>
      {icon && (
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
            selected ? "bg-brand-primary text-white" : "bg-surface-muted text-text-secondary"
          }`}
        >
          {icon}
        </span>
      )}
      <span className="flex flex-col">
        <span className="font-medium text-text-primary">{title}</span>
        {subtitle && <span className="text-sm text-text-tertiary">{subtitle}</span>}
      </span>
    </button>
  );
}
