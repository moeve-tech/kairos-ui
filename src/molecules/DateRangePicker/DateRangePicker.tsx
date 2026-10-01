import { useCallback, useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { ChevronDownIcon } from "../../icons";
import {
  addDays,
  addMonthsToMonth,
  buildMonthGrid,
  clampDay,
  compareISO,
  firstDayOfMonth,
  firstDisabledAfter,
  formatDayAriaLabel,
  formatDisplayDate,
  isDayDisabled,
  isInRange,
  keyboardTarget,
  keyboardTargetSkippingDisabled,
  lastDayOfMonth,
  monthOf,
  parseISODate,
  pickDay,
  todayISO,
  type MonthRef,
} from "./dateRange";

export interface DateRangeValue {
  /** ISO "YYYY-MM-DD", or "" when empty. */
  startDate: string;
  /** ISO "YYYY-MM-DD", or "" when empty. */
  endDate: string;
}

/** Every user-visible string of the picker. Defaults are Spanish; override any subset via `labels`. */
export interface DateRangePickerLabels {
  /** 12 names, January first. */
  months: readonly string[];
  /** 12 abbreviations, January first (shown in the trigger: "12 nov 2026"). */
  monthsShort: readonly string[];
  /** 7 short names, MONDAY first (column headers). */
  weekdays: readonly string[];
  /** 7 full names, MONDAY first (used in each day's accessible name). */
  weekdaysLong: readonly string[];
  /** Accessible name of a day; placeholders {weekday} {day} {month} {year}. */
  dayAriaTemplate: string;
  previousMonth: string;
  nextMonth: string;
  clear: string;
  /** Accessible name of the popover dialog. */
  dialog: string;
  /** Appended to the accessible name of a day flagged by `isDatePartial`. */
  partialDay: string;
}

export interface DateRangePickerProps {
  /** ISO "YYYY-MM-DD", "" = empty. */
  startDate: string;
  /** ISO "YYYY-MM-DD", "" = empty. */
  endDate: string;
  /** Fired once per completed range (or with two empty strings on "clear"). */
  onChange: (range: DateRangeValue) => void;
  /** ISO; days before it are disabled. */
  min?: string;
  /** ISO; days after it are disabled. */
  max?: string;
  startLabel?: string;
  endLabel?: string;
  /** Shown in a field that has no date yet. */
  placeholder?: string;
  labels?: Partial<DateRangePickerLabels>;
  /**
   * Extra "not available" days, combined with `min`/`max`: the day is dimmed,
   * disabled and cannot be selected. The app owns what "unavailable" means.
   * The range already confirmed in `startDate`/`endDate` is never checked
   * against it (that value belongs to the parent).
   */
  isDateDisabled?: (iso: string) => boolean;
  /**
   * Marks a day as partially unavailable: a subtle dot plus `labels.partialDay`
   * in its accessible name. The day stays selectable.
   */
  isDatePartial?: (iso: string) => boolean;
  /**
   * For a range that only runs on some weekdays (e.g. "every Monday"): marks
   * which days strictly BETWEEN the two edges actually count. Days inside the
   * range for which this returns false render like an ordinary day outside
   * it (no tint), instead of the uniform "every day in this span is selected"
   * band - a continuous highlight is misleading when only 2 of 14 days will
   * really happen. The two edge days (the exact start/end picked) always
   * stay fully highlighted regardless, since they are explicit choices, not
   * inferred from weekday. Omitted (default): every inside day counts, same
   * as before this prop existed.
   */
  isDateActive?: (iso: string) => boolean;
  /**
   * Default false. While waiting for the END day, every day after the first
   * disabled day that follows the chosen start is also disabled (a booking is
   * one continuous range, so crossing an unavailable day would collide).
   * Disabled days BEFORE the start do not matter. true = ranges may cross them.
   */
  allowRangeOverDisabled?: boolean;
  className?: string;
}

const DEFAULT_LABELS: DateRangePickerLabels = {
  months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
  monthsShort: ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"],
  weekdays: ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"],
  weekdaysLong: ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"],
  dayAriaTemplate: "{weekday} {day} de {month} de {year}",
  previousMonth: "Mes anterior",
  nextMonth: "Mes siguiente",
  clear: "Limpiar",
  dialog: "Seleccionar rango de fechas",
  partialDay: "parcialmente ocupado",
};

// Tailwind's `sm` breakpoint: two months side by side from here up.
const TWO_MONTHS_QUERY = "(min-width: 640px)";
const WEEKS_SHOWN = 6; // fixed, so the popover doesn't jump in height between months

const CELL_SIZE = "aspect-square w-full max-w-[2.5rem] sm:max-w-[2.25rem]";

function readShowTwoMonths(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return true;
  return window.matchMedia(TWO_MONTHS_QUERY).matches;
}

const monthIndex = (m: MonthRef) => m.year * 12 + m.month;

/**
 * Range date picker: two side-by-side fields ("start" / "end") that open one
 * calendar popover. Replaces `<input type="date">`, whose native popup cannot
 * be styled. Generic: values are plain ISO strings, all text is overridable,
 * and it has no dependency beyond React (calendar math lives in ./dateRange).
 *
 * Interaction: 1st click = start, 2nd click = end (an earlier 2nd click
 * becomes the new start); the popover closes when the range completes. Escape
 * / outside click close it. Keyboard: arrows move by day/week, Home/End by
 * week edge, PageUp/PageDown by month, Enter/Space select.
 *
 * Layout notes: the popover is `absolute` under the trigger and the wrapper
 * takes `z-50` (and so forms a stacking context) while open. A neighbouring
 * Leaflet map only stays below it if the map's own container is `isolate`d
 * (its panes go up to z-index 700) - see this repo's CLAUDE.md, "Known gotchas".
 * Uses hooks but no "use client" directive (like the rest of the library):
 * import it from a client component in Next.js App Router.
 */
export function DateRangePicker({
  startDate,
  endDate,
  onChange,
  min,
  max,
  startLabel = "Fecha inicio",
  endLabel = "Fecha fin",
  placeholder = "Selecciona",
  labels,
  isDateDisabled,
  isDatePartial,
  isDateActive,
  allowRangeOverDisabled = false,
  className = "",
}: DateRangePickerProps) {
  const l: DateRangePickerLabels = { ...DEFAULT_LABELS, ...labels };
  const dialogId = useId();

  const [open, setOpen] = useState(false);
  const [view, setView] = useState<MonthRef>({ year: 1970, month: 0 }); // left-most visible month
  const [pendingStart, setPendingStart] = useState<string | null>(null); // 1st click done, waiting for the end
  const [previewDay, setPreviewDay] = useState<string | null>(null); // hovered / focused day
  const [focusedDay, setFocusedDay] = useState<string | null>(null);
  const [showTwo, setShowTwo] = useState(true);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);
  const focusRequestRef = useRef(false);

  const closePopover = useCallback(() => {
    setOpen(false);
    setPendingStart(null);
    setPreviewDay(null);
  }, []);

  function openPopover() {
    const today = todayISO();
    const start = parseISODate(startDate) && !isDayDisabled(startDate, min, max) ? startDate : null;
    const anchor = start ?? clampDay(today, min, max);
    setView(monthOf(anchor) as MonthRef);
    setFocusedDay(anchor);
    setPendingStart(null);
    setPreviewDay(null);
    setShowTwo(readShowTwoMonths());
    focusRequestRef.current = true;
    setOpen(true);
  }

  function handleTriggerClick(event: MouseEvent<HTMLButtonElement>) {
    lastTriggerRef.current = event.currentTarget;
    if (open) closePopover();
    else openPopover();
  }

  // Outside click + Escape (Escape hands focus back to the trigger).
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: globalThis.MouseEvent) => {
      if (!wrapperRef.current?.contains(event.target as Node)) closePopover();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      closePopover();
      lastTriggerRef.current?.focus();
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, closePopover]);

  // Follow the breakpoint while open (the initial value is read on open, so no flash).
  useEffect(() => {
    if (!open || typeof window.matchMedia !== "function") return;
    const query = window.matchMedia(TWO_MONTHS_QUERY);
    const update = () => setShowTwo(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [open]);

  // Move DOM focus onto the roving-tabindex day after open / keyboard moves.
  useEffect(() => {
    if (!open || !focusRequestRef.current) return;
    focusRequestRef.current = false;
    dialogRef.current?.querySelector<HTMLButtonElement>('button[data-date][tabindex="0"]')?.focus();
  });

  // What the fields and the calendar show. While waiting for the end, the
  // draft start replaces the committed value and the end is blank.
  const shownStart = pendingStart ?? startDate;
  const shownEnd = pendingStart ? "" : endDate;

  let rangeFrom: string | null = parseISODate(shownStart) ? shownStart : null;
  let rangeTo: string | null = parseISODate(shownEnd) ? shownEnd : null;
  const months: MonthRef[] = showTwo ? [view, addMonthsToMonth(view, 1)] : [view];
  const today = todayISO();

  // Disabled = outside min/max, or flagged by the app. While choosing the END
  // (unless allowRangeOverDisabled), everything past the first disabled day
  // after the start is disabled too: `limit` is that first day.
  const isBaseDisabled = (day: string) => isDayDisabled(day, min, max) || (isDateDisabled?.(day) ?? false);
  const limitUntil = (until: string) =>
    pendingStart && !allowRangeOverDisabled ? firstDisabledAfter(pendingStart, until, isBaseDisabled) : null;
  const disabledWithLimit = (limit: string | null) => (day: string) =>
    isBaseDisabled(day) || (limit !== null && compareISO(day, limit) > 0);
  const isDisabled = disabledWithLimit(limitUntil(lastDayOfMonth(months[months.length - 1])));

  if (pendingStart && previewDay && compareISO(previewDay, pendingStart) >= 0 && !isDisabled(previewDay)) rangeTo = previewDay;

  const grids = open
    ? months.map((m) => {
        const weeks = buildMonthGrid(m.year, m.month);
        while (weeks.length < WEEKS_SHOWN) weeks.push(new Array<string | null>(7).fill(null));
        return weeks;
      })
    : [];
  const isShown = (iso: string) => {
    const m = monthOf(iso);
    return !!m && months.some((v) => monthIndex(v) === monthIndex(m));
  };
  const tabbableDay =
    focusedDay && isShown(focusedDay) && !isDisabled(focusedDay)
      ? focusedDay
      : (grids.flat(2).find((d): d is string => d !== null && !isDisabled(d)) ?? null);

  const prevDisabled = !!parseISODate(min) && compareISO(lastDayOfMonth(addMonthsToMonth(view, -1)), min as string) < 0;
  const nextDisabled =
    !!parseISODate(max) && compareISO(firstDayOfMonth(addMonthsToMonth(view, showTwo ? 2 : 1)), max as string) > 0;

  function handleDayClick(day: string) {
    if (isDisabled(day)) return;
    const result = pickDay(pendingStart, day);
    if (result.kind === "pending") {
      setPendingStart(result.pendingStart);
      return;
    }
    closePopover();
    lastTriggerRef.current?.focus();
    onChange({ startDate: result.startDate, endDate: result.endDate });
  }

  function handleDayKeyDown(event: KeyboardEvent<HTMLButtonElement>, day: string) {
    if (!keyboardTarget(day, event.key)) return;
    event.preventDefault();
    // The limit is recomputed far enough ahead to judge targets outside the visible months.
    const target = keyboardTargetSkippingDisabled(day, event.key, disabledWithLimit(limitUntil(addDays(day, 400))));
    if (!target) return;
    setFocusedDay(target);
    if (!isShown(target)) {
      const m = monthOf(target) as MonthRef;
      const backwards = monthIndex(m) < monthIndex(view);
      setView(backwards || !showTwo ? m : addMonthsToMonth(m, -1));
    }
    focusRequestRef.current = true;
  }

  function handleClear() {
    closePopover();
    lastTriggerRef.current?.focus();
    onChange({ startDate: "", endDate: "" });
  }

  function renderField(fieldLabel: string, value: string) {
    const text = formatDisplayDate(value, l.monthsShort);
    return (
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={handleTriggerClick}
        className="flex-1 rounded-xl px-4 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-primary"
      >
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-text-tertiary">{fieldLabel}</span>
        <span className={`block text-sm ${text ? "text-text-primary" : "text-text-tertiary"}`}>{text || placeholder}</span>
      </button>
    );
  }

  return (
    <div ref={wrapperRef} className={`relative ${open ? "z-50" : ""} ${className}`.trim()}>
      <div
        className={`flex items-stretch rounded-xl border bg-white transition-colors ${
          open ? "border-brand-primary" : "border-border"
        }`}
      >
        {renderField(startLabel, shownStart)}
        <span aria-hidden="true" className="my-2 w-px bg-border" />
        {renderField(endLabel, shownEnd)}
      </div>

      {open && (
        <div
          ref={dialogRef}
          id={dialogId}
          role="dialog"
          aria-label={l.dialog}
          className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-border bg-white p-4 shadow-modal sm:right-auto sm:w-max"
        >
          <div className="flex gap-6" onMouseLeave={() => setPreviewDay(null)}>
            {months.map((m, monthPos) => (
              <div key={monthIndex(m)} role="group" aria-label={`${l.months[m.month]} ${m.year}`} className="w-full sm:w-[15.75rem]">
                <div className="mb-2 flex h-8 items-center justify-between">
                  {monthPos === 0 ? (
                    <button
                      type="button"
                      aria-label={l.previousMonth}
                      disabled={prevDisabled}
                      onClick={() => setView(addMonthsToMonth(view, -1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronDownIcon className="h-4 w-4 rotate-90" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="h-8 w-8" />
                  )}
                  <span aria-live="polite" className="text-sm font-semibold capitalize text-text-primary">
                    {l.months[m.month]} {m.year}
                  </span>
                  {monthPos === months.length - 1 ? (
                    <button
                      type="button"
                      aria-label={l.nextMonth}
                      disabled={nextDisabled}
                      onClick={() => setView(addMonthsToMonth(view, 1))}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-surface-subtle disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
                    >
                      <ChevronDownIcon className="h-4 w-4 -rotate-90" aria-hidden="true" />
                    </button>
                  ) : (
                    <span className="h-8 w-8" />
                  )}
                </div>

                <div aria-hidden="true" className="grid grid-cols-7 pb-1 text-center text-xs font-medium text-text-tertiary">
                  {l.weekdays.map((w) => (
                    <span key={w}>{w}</span>
                  ))}
                </div>

                <div className="grid grid-cols-7">
                  {grids[monthPos].flat().map((day, cellPos) => {
                    if (day === null) return <div key={`empty-${cellPos}`} className={CELL_SIZE} />;

                    const disabled = isDisabled(day);
                    const partial = !disabled && (isDatePartial?.(day) ?? false);
                    const isFrom = day === rangeFrom;
                    const isTo = day === rangeTo;
                    const isEdge = isFrom || isTo;
                    const hasSpan = rangeFrom !== null && rangeTo !== null && rangeFrom !== rangeTo;
                    const inside = hasSpan && isInRange(day, rangeFrom as string, rangeTo as string);
                    const active = inside && (isDateActive ? isDateActive(day) : true);
                    const isToday = day === today;
                    // A confirmed edge that the app's predicate now flags still shows as selected (it is the parent's value).
                    const dimmed = disabled && !(isEdge && !isDayDisabled(day, min, max));
                    // Which side of the edge circle the tinted band continues to. Inverted
                    // props (start > end) are tolerated: "from" is then the later day.
                    const bandOnRight = hasSpan && isEdge && (compareISO(rangeFrom as string, rangeTo as string) < 0 ? isFrom : isTo);
                    const bandOnLeft = hasSpan && isEdge && !bandOnRight;

                    return (
                      <div key={day} className={`relative flex justify-center ${active && !isEdge ? "bg-brand-primary/10" : ""}`}>
                        {bandOnRight && <span aria-hidden="true" className="absolute inset-y-0 right-0 w-1/2 bg-brand-primary/10" />}
                        {bandOnLeft && <span aria-hidden="true" className="absolute inset-y-0 left-0 w-1/2 bg-brand-primary/10" />}
                        <button
                          type="button"
                          data-date={day}
                          tabIndex={day === tabbableDay ? 0 : -1}
                          disabled={disabled}
                          aria-label={`${formatDayAriaLabel(day, l.dayAriaTemplate, l.months, l.weekdaysLong)}${partial ? `, ${l.partialDay}` : ""}`}
                          aria-pressed={day === shownStart || day === shownEnd}
                          aria-current={isToday ? "date" : undefined}
                          onClick={() => handleDayClick(day)}
                          onKeyDown={(event) => handleDayKeyDown(event, day)}
                          onMouseEnter={() => !disabled && setPreviewDay(day)}
                          onFocus={() => {
                            setFocusedDay(day);
                            setPreviewDay(day);
                          }}
                          className={`relative ${CELL_SIZE} rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-1 ${
                            dimmed
                              ? "cursor-not-allowed text-text-tertiary opacity-40"
                              : isEdge
                                ? "bg-brand-primary font-semibold text-white"
                                : `text-text-primary ${active ? "hover:bg-brand-primary/20" : "hover:bg-surface-subtle"}`
                          } ${isToday && !isEdge ? "font-semibold ring-1 ring-inset ring-brand-primary/60" : ""}`}
                        >
                          {parseISODate(day)?.day}
                          {partial && (
                            <span
                              aria-hidden="true"
                              className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${isEdge ? "bg-white" : "bg-brand-primary"}`}
                            />
                          )}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {(startDate || endDate || pendingStart) && (
            <div className="mt-3 flex justify-end border-t border-border pt-3">
              <button
                type="button"
                onClick={handleClear}
                className="rounded-md px-3 py-1.5 text-sm font-medium text-brand-primary transition-colors hover:bg-brand-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary"
              >
                {l.clear}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
