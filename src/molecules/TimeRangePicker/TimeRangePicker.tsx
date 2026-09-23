import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import {
  applyPick,
  draftToValue,
  formatDisplayTime,
  formatTime,
  hourOptions,
  minuteOptions,
  moveIndexSkipping,
  normalizeMinuteStep,
  parseTime,
  type TimeColumn,
  type TimeDraft,
} from "./timeRange";

export interface TimeRangeValue {
  /** 24 h "HH:MM", or "" when empty. */
  startTime: string;
  /** 24 h "HH:MM", or "" when empty. */
  endTime: string;
}

/** Every user-visible string of the picker. Defaults are Spanish; override any subset via `labels`. */
/** Which of the two fields an option belongs to. */
export type TimeRangeField = "start" | "end";

export interface TimeRangePickerLabels {
  /** Accessible name of the hours list. */
  hours: string;
  /** Accessible name of the minutes list. */
  minutes: string;
  /** Accessible name of the start-time popover. */
  startDialog: string;
  /** Accessible name of the end-time popover. */
  endDialog: string;
  /** Suffixes used when `hour12` is on. */
  am: string;
  pm: string;
}

export interface TimeRangePickerProps {
  /** 24 h "HH:MM", "" = empty. */
  startTime: string;
  /** 24 h "HH:MM", "" = empty. */
  endTime: string;
  /** Fired once per confirmed pick, always with 24 h "HH:MM" strings (even when `hour12` is on). */
  onChange: (range: TimeRangeValue) => void;
  /** Minutes list granularity (default 5). A current value off the grid (12:43) is still listed and can be kept. */
  minuteStep?: number;
  /** Only changes how times are DISPLAYED (trigger and hour list); values stay 24 h. */
  hour12?: boolean;
  startLabel?: string;
  endLabel?: string;
  /** Shown in a field that has no time yet. */
  placeholder?: string;
  labels?: Partial<TimeRangePickerLabels>;
  /**
   * Marks options as unavailable (aria-disabled, dimmed, not selectable and
   * skipped by the arrow keys). Called for every minute option with the exact
   * "HH:MM" (using the hour already chosen in the draft; while no hour is
   * chosen, minutes are left enabled), and for every hour option, which is
   * disabled only when ALL of its minutes (the current list: `minuteStep` plus
   * an off-step current value) are disabled. `current` is the confirmed value
   * of both fields - for the end popover, `current.startTime` is the start
   * already chosen, so the app can reject ends that cross a busy interval.
   * A confirmed value that the predicate now rejects stays shown as selected.
   */
  isTimeDisabled?: (field: TimeRangeField, hhmm: string, current: TimeRangeValue) => boolean;
  className?: string;
}

const DEFAULT_LABELS: TimeRangePickerLabels = {
  hours: "Horas",
  minutes: "Minutos",
  startDialog: "Seleccionar hora de inicio",
  endDialog: "Seleccionar hora de fin",
  am: "am",
  pm: "pm",
};

type Field = TimeRangeField;

const EMPTY_DRAFT: TimeDraft = { hour: null, minute: null };

/** Scrolls a listbox (not the page) so its selected option sits in the middle. */
function centerSelected(listbox: HTMLElement) {
  const selected = listbox.querySelector<HTMLElement>('[role="option"][aria-selected="true"]');
  if (!selected) return;
  listbox.scrollTop = selected.offsetTop - (listbox.clientHeight - selected.offsetHeight) / 2;
}

/**
 * Time range picker: two side-by-side fields ("start" / "end"), each opening
 * its own popover with two scrollable columns (hours, minutes). Replaces a
 * pair of `<input type="time">`, whose native popup cannot be styled.
 *
 * Interaction: picking an hour moves focus to the minutes; picking a minute
 * confirms and closes. Confirming the start while the end is empty opens the
 * end popover right away. Escape / outside click close and discard the draft.
 * Keyboard: Tab between columns, ArrowUp/ArrowDown/Home/End inside one,
 * Enter/Space pick. The value is controlled and always 24 h "HH:MM"; `hour12`
 * is display only. No ordering rule between start and end is enforced (an
 * overnight range such as 22:00 - 06:00 is legal).
 *
 * Layout notes: like DateRangePicker, the wrapper takes `z-50` while open (a
 * neighbouring Leaflet map only stays below it if the map container is
 * `isolate`d - see CLAUDE.md "Known gotchas"). The start popover is anchored
 * to the left edge of its field and the end popover to the right edge, so
 * neither overflows a narrow screen. Uses hooks but no "use client"
 * directive (like the rest of the library): import it from a client component.
 */
export function TimeRangePicker({
  startTime,
  endTime,
  onChange,
  minuteStep,
  hour12 = false,
  startLabel = "Hora inicio",
  endLabel = "Hora fin",
  placeholder = "Selecciona",
  labels,
  isTimeDisabled,
  className = "",
}: TimeRangePickerProps) {
  const l: TimeRangePickerLabels = { ...DEFAULT_LABELS, ...labels };
  const meridiem = { am: l.am, pm: l.pm };
  const step = normalizeMinuteStep(minuteStep);
  const dialogId = useId();

  const [openField, setOpenField] = useState<Field | null>(null);
  const [draft, setDraft] = useState<TimeDraft>(EMPTY_DRAFT);
  // Option that currently holds the roving tabindex in each column (null = the selected / first one).
  const [active, setActive] = useState<{ hour: number | null; minute: number | null }>({ hour: null, minute: null });

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggerRefs = useRef<Record<Field, HTMLButtonElement | null>>({ start: null, end: null });
  const focusRequestRef = useRef<TimeColumn | null>(null);

  const valueOf = (field: Field) => (field === "start" ? startTime : endTime);

  const closePopover = useCallback(() => setOpenField(null), []);

  function openFor(field: Field) {
    const parts = parseTime(valueOf(field));
    setDraft(parts ? { hour: parts.hour, minute: parts.minute } : EMPTY_DRAFT);
    setActive({ hour: null, minute: null });
    focusRequestRef.current = "hour";
    setOpenField(field);
  }

  function handleTriggerClick(field: Field) {
    if (openField === field) closePopover();
    else openFor(field);
  }

  // Outside click + Escape (Escape hands focus back to the trigger). Both discard the draft.
  useEffect(() => {
    if (!openField) return;
    const onMouseDown = (event: globalThis.MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) closePopover();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePopover();
      triggerRefs.current[openField]?.focus();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [openField, closePopover]);

  // After opening / after an hour pick: center the selected options and focus the requested column.
  useEffect(() => {
    if (!openField || !focusRequestRef.current) return;
    const column = focusRequestRef.current;
    focusRequestRef.current = null;
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.querySelectorAll<HTMLElement>('[role="listbox"]').forEach(centerSelected);
    dialog.querySelector<HTMLElement>(`[data-column="${column}"] [role="option"][tabindex="0"]`)?.focus({ preventScroll: true });
  });

  function confirm(field: Field, finalDraft: TimeDraft) {
    const value = draftToValue(finalDraft);
    if (value === null) return;
    onChange(field === "start" ? { startTime: value, endTime } : { startTime, endTime: value });
    if (field === "start" && !parseTime(endTime)) {
      openFor("end"); // chain: the end is still empty, ask for it now
      return;
    }
    closePopover();
    triggerRefs.current[field]?.focus();
  }

  // Availability of the options of the open popover (see `isTimeDisabled`).
  const current: TimeRangeValue = { startTime, endTime };
  function isOptionDisabled(column: TimeColumn, value: number): boolean {
    if (!openField || !isTimeDisabled) return false;
    if (column === "minute") {
      return draft.hour !== null && isTimeDisabled(openField, formatTime(draft.hour, value), current);
    }
    return minuteOptions(step, draft.minute).every((m) => isTimeDisabled(openField, formatTime(value, m.value), current));
  }

  function handlePick(column: TimeColumn, value: number) {
    if (!openField || isOptionDisabled(column, value)) return;
    const result = applyPick(draft, column, value);
    setDraft(result.draft);
    if (result.next === "confirm") {
      confirm(openField, result.draft);
      return;
    }
    focusRequestRef.current = result.next;
    setActive((prev) => ({ ...prev, [result.next]: null }));
  }

  function handleOptionKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const options = Array.from(event.currentTarget.parentElement?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
    const target = moveIndexSkipping(index, options.length, event.key, (i) => options[i].getAttribute("aria-disabled") === "true");
    if (target === null) return;
    event.preventDefault();
    options[target]?.focus();
  }

  function renderColumn(column: TimeColumn, options: { value: number; label: string }[], name: string) {
    const selected = draft[column];
    const disabledOf = new Map(options.map((o) => [o.value, isOptionDisabled(column, o.value)]));
    // Roving tab stop: the remembered / selected / first option, but never a disabled one.
    const tabbable = [active[column], selected, options[0]?.value, ...options.map((o) => o.value)].find(
      (v) => v !== null && v !== undefined && disabledOf.get(v) === false,
    );
    return (
      <div
        role="listbox"
        aria-label={name}
        data-column={column}
        className={`relative h-56 w-20 overflow-y-auto overscroll-contain ${column === "minute" ? "border-l border-border" : ""}`}
      >
        <div className="flex flex-col gap-0.5 p-1">
          {options.map((option, index) => {
            const isSelected = option.value === selected;
            const disabled = disabledOf.get(option.value) === true;
            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                aria-disabled={disabled || undefined}
                tabIndex={option.value === tabbable ? 0 : -1}
                onClick={() => handlePick(column, option.value)}
                onFocus={() => setActive((prev) => ({ ...prev, [column]: option.value }))}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                className={`flex h-9 w-full shrink-0 items-center justify-center rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary ${
                  isSelected
                    ? "bg-brand-primary font-semibold text-white"
                    : disabled
                      ? "cursor-not-allowed text-text-tertiary opacity-40"
                      : "text-text-primary hover:bg-surface-subtle"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  function renderField(field: Field, fieldLabel: string) {
    const isOpen = openField === field;
    const text = formatDisplayTime(valueOf(field), hour12, meridiem);
    return (
      <div className="relative flex flex-1">
        <button
          ref={(node) => {
            triggerRefs.current[field] = node;
          }}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={isOpen}
          aria-controls={isOpen ? dialogId : undefined}
          onClick={() => handleTriggerClick(field)}
          className="flex-1 rounded-xl px-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary"
        >
          <span className="block text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">{fieldLabel}</span>
          <span className={`block text-sm ${text ? "text-text-primary" : "text-text-tertiary"}`}>{text || placeholder}</span>
        </button>

        {isOpen && (
          <div
            ref={dialogRef}
            id={dialogId}
            role="dialog"
            aria-label={field === "start" ? l.startDialog : l.endDialog}
            className={`absolute top-full z-50 mt-2 flex w-max rounded-xl border border-border bg-white shadow-modal ${
              field === "start" ? "left-0" : "right-0"
            }`}
          >
            {renderColumn("hour", hourOptions(hour12, meridiem), l.hours)}
            {renderColumn("minute", minuteOptions(step, draft.minute), l.minutes)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${openField ? "z-50" : ""} ${className}`.trim()}>
      <div
        className={`flex items-stretch rounded-xl border bg-white transition-colors ${
          openField ? "border-brand-primary" : "border-border"
        }`}
      >
        {renderField("start", startLabel)}
        <span aria-hidden="true" className="my-2 w-px bg-border" />
        {renderField("end", endLabel)}
      </div>
    </div>
  );
}
