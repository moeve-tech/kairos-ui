/**
 * Pure time helpers for TimeRangePicker. No React, no `Date`, no Intl.
 *
 * The committed value is ALWAYS a 24-hour "HH:MM" string (what a native
 * <input type="time"> yields, and the contract apps send to their backend).
 * 12-hour am/pm exists only as a display concern.
 */

export interface TimeParts {
  /** 0-23 */
  hour: number;
  /** 0-59 */
  minute: number;
}

/** A half-made value: either part may still be missing. */
export interface TimeDraft {
  hour: number | null;
  minute: number | null;
}

export type TimeColumn = "hour" | "minute";

export interface TimeOption {
  /** Hour 0-23 or minute 0-59. */
  value: number;
  label: string;
}

export interface MeridiemLabels {
  am: string;
  pm: string;
}

export const DEFAULT_MINUTE_STEP = 5;

const TIME_PATTERN = /^(\d{2}):(\d{2})$/;

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Strict "HH:MM" (00:00-23:59). Anything else - including "24:00", "9:05", "12:00:00", "" - is null. */
export function parseTime(value: string | null | undefined): TimeParts | null {
  if (!value) return null;
  const match = TIME_PATTERN.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 23 || minute > 59) return null;
  return { hour, minute };
}

export function formatTime(hour: number, minute: number): string {
  return `${pad2(hour)}:${pad2(minute)}`;
}

/** 0 -> 12 am, 1-11 -> am, 12 -> 12 pm, 13-23 -> 1-11 pm. */
export function to12Hour(hour: number): { hour: number; period: "am" | "pm" } {
  return { hour: hour % 12 === 0 ? 12 : hour % 12, period: hour < 12 ? "am" : "pm" };
}

/** Text of a committed value for the trigger: "14:05" or "2:05 pm". Empty string when the value is empty or invalid. */
export function formatDisplayTime(value: string, hour12: boolean, meridiem: MeridiemLabels): string {
  const parts = parseTime(value);
  if (!parts) return "";
  if (!hour12) return formatTime(parts.hour, parts.minute);
  const h = to12Hour(parts.hour);
  return `${h.hour}:${pad2(parts.minute)} ${meridiem[h.period]}`;
}

/** Steps that are not an integer in 1..59 fall back to the default. */
export function normalizeMinuteStep(step: number | undefined): number {
  return typeof step === "number" && Number.isInteger(step) && step >= 1 && step <= 59 ? step : DEFAULT_MINUTE_STEP;
}

/** The 24 hours, in order. Labels are "00".."23", or "12 am", "1 am" ... "12 pm" ... "11 pm" in 12 h mode. */
export function hourOptions(hour12: boolean, meridiem: MeridiemLabels): TimeOption[] {
  return Array.from({ length: 24 }, (_, hour) => {
    if (!hour12) return { value: hour, label: pad2(hour) };
    const h = to12Hour(hour);
    return { value: hour, label: `${h.hour} ${meridiem[h.period]}` };
  });
}

/**
 * Minutes 0, step, 2*step ... (< 60). If `current` is not on the step grid
 * (e.g. 43 with step 5) it is inserted in order, so an existing value is
 * always shown and can be kept.
 */
export function minuteOptions(step: number, current: number | null): TimeOption[] {
  const size = normalizeMinuteStep(step);
  const values: number[] = [];
  for (let m = 0; m < 60; m += size) values.push(m);
  if (current !== null && current >= 0 && current <= 59 && !values.includes(current)) {
    values.push(current);
    values.sort((a, b) => a - b);
  }
  return values.map((value) => ({ value, label: pad2(value) }));
}

/** Where a listbox key moves the focus (no wrap-around). Null for other keys. */
export function moveIndex(index: number, length: number, key: string): number | null {
  if (length <= 0) return null;
  switch (key) {
    case "ArrowUp":
      return Math.max(0, index - 1);
    case "ArrowDown":
      return Math.min(length - 1, index + 1);
    case "Home":
      return 0;
    case "End":
      return length - 1;
    default:
      return null;
  }
}

export type PickNext = "hour" | "minute" | "confirm";

/**
 * One pick in the popover. Choosing an hour sends focus to the minutes;
 * choosing a minute confirms - unless there is still no hour, in which case
 * focus goes to the hours.
 */
export function applyPick(draft: TimeDraft, column: TimeColumn, value: number): { draft: TimeDraft; next: PickNext } {
  if (column === "hour") return { draft: { ...draft, hour: value }, next: "minute" };
  const updated = { ...draft, minute: value };
  return { draft: updated, next: updated.hour === null ? "hour" : "confirm" };
}

/** "HH:MM" for a complete draft, null while a part is missing. */
export function draftToValue(draft: TimeDraft): string | null {
  return draft.hour === null || draft.minute === null ? null : formatTime(draft.hour, draft.minute);
}

/**
 * Like `moveIndex`, but only lands on enabled options. Up/Down go to the
 * nearest enabled option in that direction, Home/End to the first/last
 * enabled one. Null when the key is not handled or there is nowhere to go
 * (the focus then stays put).
 */
export function moveIndexSkipping(
  index: number,
  length: number,
  key: string,
  isDisabledAt: (index: number) => boolean,
): number | null {
  if (length <= 0) return null;
  const search = (from: number, step: 1 | -1): number | null => {
    for (let i = from; i >= 0 && i < length; i += step) if (!isDisabledAt(i)) return i;
    return null;
  };
  switch (key) {
    case "ArrowUp":
      return search(index - 1, -1);
    case "ArrowDown":
      return search(index + 1, 1);
    case "Home":
      return search(0, 1);
    case "End":
      return search(length - 1, -1);
    default:
      return null;
  }
}
