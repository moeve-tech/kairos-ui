/**
 * Pure calendar helpers for DateRangePicker. No React, no Intl, no `Date`
 * parsing of strings.
 *
 * Days are plain ISO strings ("YYYY-MM-DD"). We NEVER call
 * `new Date("YYYY-MM-DD")`: that form is parsed as UTC midnight, so in a
 * negative-offset zone (Mexico) it becomes the previous day when read with
 * local getters. Everything here derives from numeric year/month/day, and
 * uses `Date.UTC` + UTC getters only as a timezone-independent calendar
 * calculator (no DST, no local offset involved). The only place the local
 * clock is read is `todayISO`, on purpose ("today" = the user's local date).
 *
 * Months are 0-based (0 = January) like the JS Date API; weekday indices are
 * Monday-first (0 = Monday ... 6 = Sunday).
 */

export interface ParsedDay {
  year: number;
  /** 0-11 */
  month: number;
  day: number;
}

export interface MonthRef {
  year: number;
  /** 0-11 */
  month: number;
}

const ISO_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const pad = (n: number, width: number) => String(n).padStart(width, "0");

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}

/** Builds an ISO string from numeric parts. Month is 0-based. */
export function toISODate(year: number, month: number, day: number): string {
  return `${pad(year, 4)}-${pad(month + 1, 2)}-${pad(day, 2)}`;
}

/**
 * Parses "YYYY-MM-DD". Returns null for anything else, including
 * well-formed but impossible dates ("2026-02-30", "2026-13-01").
 */
export function parseISODate(iso: string | null | undefined): ParsedDay | null {
  if (!iso) return null;
  const match = ISO_PATTERN.exec(iso);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  if (month < 0 || month > 11 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

/** Local calendar date of `now` as ISO. Uses local getters on purpose. */
export function todayISO(now: Date = new Date()): string {
  return toISODate(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Lexicographic order equals chronological order for zero-padded ISO. */
export function compareISO(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0;
}

/** Monday-first weekday index (0 = Monday ... 6 = Sunday) of a valid ISO day. */
export function weekdayIndex(iso: string): number {
  const p = parseISODate(iso);
  if (!p) throw new Error(`Invalid ISO date: ${iso}`);
  const sundayFirst = new Date(Date.UTC(p.year, p.month, p.day)).getUTCDay();
  return (sundayFirst + 6) % 7;
}

export function addDays(iso: string, delta: number): string {
  const p = parseISODate(iso);
  if (!p) throw new Error(`Invalid ISO date: ${iso}`);
  const d = new Date(Date.UTC(p.year, p.month, p.day + delta));
  return toISODate(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export function addMonthsToMonth(ref: MonthRef, delta: number): MonthRef {
  const index = ref.year * 12 + ref.month + delta;
  return { year: Math.floor(index / 12), month: ((index % 12) + 12) % 12 };
}

/** Same day-of-month `delta` months away, clamped to the target month's length (Jan 31 + 1 = Feb 28/29). */
export function addMonthsToDay(iso: string, delta: number): string {
  const p = parseISODate(iso);
  if (!p) throw new Error(`Invalid ISO date: ${iso}`);
  const target = addMonthsToMonth(p, delta);
  return toISODate(target.year, target.month, Math.min(p.day, daysInMonth(target.year, target.month)));
}

export function monthOf(iso: string): MonthRef | null {
  const p = parseISODate(iso);
  return p ? { year: p.year, month: p.month } : null;
}

export function firstDayOfMonth(ref: MonthRef): string {
  return toISODate(ref.year, ref.month, 1);
}

export function lastDayOfMonth(ref: MonthRef): string {
  return toISODate(ref.year, ref.month, daysInMonth(ref.year, ref.month));
}

/**
 * Weeks of a month, Monday-first. Each week has exactly 7 cells: an ISO
 * string for days of the month, null for the leading/trailing padding.
 */
export function buildMonthGrid(year: number, month: number): (string | null)[][] {
  const total = daysInMonth(year, month);
  const offset = weekdayIndex(toISODate(year, month, 1));
  const cells: (string | null)[] = [];
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= total; d++) cells.push(toISODate(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (string | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

/** Orders two days; the result is always [earlier, later]. */
export function orderRange(a: string, b: string): [string, string] {
  return compareISO(a, b) <= 0 ? [a, b] : [b, a];
}

/** Inclusive on both ends; tolerant of an inverted range. */
export function isInRange(day: string, a: string, b: string): boolean {
  const [from, to] = orderRange(a, b);
  return compareISO(day, from) >= 0 && compareISO(day, to) <= 0;
}

/** True if `day` is before `min` or after `max`. Unset or unparsable bounds are ignored. */
export function isDayDisabled(day: string, min?: string, max?: string): boolean {
  if (parseISODate(min) && compareISO(day, min as string) < 0) return true;
  if (parseISODate(max) && compareISO(day, max as string) > 0) return true;
  return false;
}

/** "12 nov 2026" - `monthsShort` has 12 entries, January first. Empty string if `iso` is invalid. */
export function formatDisplayDate(iso: string, monthsShort: readonly string[]): string {
  const p = parseISODate(iso);
  if (!p) return "";
  return `${p.day} ${monthsShort[p.month]} ${p.year}`;
}

/**
 * Accessible name of a day cell. `template` uses the placeholders
 * {weekday} {day} {month} {year}, e.g. "{weekday} {day} de {month} de {year}".
 */
export function formatDayAriaLabel(
  iso: string,
  template: string,
  months: readonly string[],
  weekdaysLong: readonly string[],
): string {
  const p = parseISODate(iso);
  if (!p) return "";
  return template
    .replace("{weekday}", weekdaysLong[weekdayIndex(iso)])
    .replace("{day}", String(p.day))
    .replace("{month}", months[p.month])
    .replace("{year}", String(p.year));
}

export type PickResult =
  | { kind: "pending"; pendingStart: string }
  | { kind: "complete"; startDate: string; endDate: string };

/**
 * Two-click range selection. With no pending start the day becomes the
 * start. With a pending start: a later (or same) day completes the range;
 * an earlier day replaces the start and we keep waiting for the end.
 */
export function pickDay(pendingStart: string | null, day: string): PickResult {
  if (pendingStart === null || compareISO(day, pendingStart) < 0) {
    return { kind: "pending", pendingStart: day };
  }
  return { kind: "complete", startDate: pendingStart, endDate: day };
}

/** Pulls `day` into [min, max]. Unset or unparsable bounds are ignored. */
export function clampDay(day: string, min?: string, max?: string): string {
  if (parseISODate(min) && compareISO(day, min as string) < 0) return min as string;
  if (parseISODate(max) && compareISO(day, max as string) > 0) return max as string;
  return day;
}

/**
 * Where a keyboard key moves the focused day (WAI-ARIA date picker keys):
 * arrows = +-1 day / +-1 week, Home/End = Monday/Sunday of that week,
 * PageUp/PageDown = -1/+1 month. Null for any other key.
 */
export function keyboardTarget(day: string, key: string): string | null {
  switch (key) {
    case "ArrowLeft":
      return addDays(day, -1);
    case "ArrowRight":
      return addDays(day, 1);
    case "ArrowUp":
      return addDays(day, -7);
    case "ArrowDown":
      return addDays(day, 7);
    case "Home":
      return addDays(day, -weekdayIndex(day));
    case "End":
      return addDays(day, 6 - weekdayIndex(day));
    case "PageUp":
      return addMonthsToDay(day, -1);
    case "PageDown":
      return addMonthsToDay(day, 1);
    default:
      return null;
  }
}
