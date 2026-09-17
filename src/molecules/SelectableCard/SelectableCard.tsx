import type { ReactNode } from "react";

export interface SelectableCardProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
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
export function SelectableCard({ icon, title, subtitle, selected = false, onClick, className = "" }: SelectableCardProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-brand-primary bg-brand-primary/5" : "border-border hover:bg-surface-subtle"
      } ${className}`.trim()}
    >
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
