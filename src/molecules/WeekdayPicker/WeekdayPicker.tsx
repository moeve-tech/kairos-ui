export interface WeekdayPickerProps {
  /** Exactly 7 short labels, in whatever order/language the caller uses (e.g. ["Lun", ..., "Dom"]). The index is the day value passed to onToggle/selected. */
  labels: readonly string[];
  /** Day indices currently toggled on. */
  selected: readonly number[];
  onToggle: (day: number) => void;
  className?: string;
}

/**
 * Circular day-of-week toggle row - previously hand-duplicated (with
 * slightly different styles) in redisplay-web's QuoteWizard and
 * RecurringPlansClient. Generic on purpose: the caller owns the labels
 * (language/order) and which days start selected.
 */
export function WeekdayPicker({ labels, selected, onToggle, className = "" }: WeekdayPickerProps) {
  return (
    <div role="group" className={`flex flex-wrap gap-2 ${className}`.trim()}>
      {labels.map((label, day) => {
        const active = selected.includes(day);
        return (
          <button
            key={day}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(day)}
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
              active ? "border-brand-primary bg-brand-primary text-white" : "border-border text-text-secondary hover:bg-surface-subtle"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
