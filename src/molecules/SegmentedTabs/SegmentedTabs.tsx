export interface SegmentedTabOption {
  value: string;
  label: string;
}

export interface SegmentedTabsProps {
  options: SegmentedTabOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * The Simulator's "Regular | Premium | Diesel" control. It receives the
 * options via props instead of having them fixed - the same component
 * works for any list of tabs, in any future screen.
 */
export function SegmentedTabs({ options, value, onChange, className = "" }: SegmentedTabsProps) {
  return (
    <div
      role="tablist"
      className={`inline-flex items-start gap-0 rounded-lg bg-surface-muted p-1 ${className}`.trim()}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option.value)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              active
                ? "bg-white text-text-primary shadow-tab"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
