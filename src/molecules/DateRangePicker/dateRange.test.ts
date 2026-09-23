import { describe, expect, it } from "vitest";
import {
  addDays,
  addMonthsToDay,
  addMonthsToMonth,
  buildMonthGrid,
  clampDay,
  compareISO,
  daysInMonth,
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
  orderRange,
  parseISODate,
  pickDay,
  todayISO,
  toISODate,
  weekdayIndex,
} from "./dateRange";

const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const MONTHS_SHORT = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
const WEEKDAYS_LONG = ["lunes", "martes", "miércoles", "jueves", "viernes", "sábado", "domingo"];

describe("daysInMonth", () => {
  it.each([
    [2026, 0, 31],
    [2026, 1, 28],
    [2024, 1, 29], // leap year
    [2000, 1, 29], // divisible by 400
    [1900, 1, 28], // divisible by 100, not 400
    [2026, 3, 30],
    [2026, 11, 31],
  ])("%i month %i has %i days", (year, month, expected) => {
    expect(daysInMonth(year, month)).toBe(expected);
  });
});

describe("parseISODate / toISODate", () => {
  it("parses a valid date into numeric parts (month 0-based)", () => {
    expect(parseISODate("2026-11-12")).toEqual({ year: 2026, month: 10, day: 12 });
  });

  it("accepts Feb 29 only in leap years", () => {
    expect(parseISODate("2024-02-29")).not.toBeNull();
    expect(parseISODate("2026-02-29")).toBeNull();
  });

  it.each(["", "2026-02-30", "2026-13-01", "2026-00-10", "2026-11-00", "2026-4-5", "12/11/2026", "2026-11-12T00:00:00Z", "abc"])(
    "rejects %j",
    (input) => {
      expect(parseISODate(input)).toBeNull();
    },
  );

  it("rejects null and undefined", () => {
    expect(parseISODate(null)).toBeNull();
    expect(parseISODate(undefined)).toBeNull();
  });

  it("zero-pads and round-trips", () => {
    expect(toISODate(2026, 0, 5)).toBe("2026-01-05");
    expect(toISODate(2026, 11, 31)).toBe("2026-12-31");
    const p = parseISODate("2026-03-09");
    expect(p && toISODate(p.year, p.month, p.day)).toBe("2026-03-09");
  });
});

describe("todayISO", () => {
  it("uses the LOCAL calendar date, not the UTC one", () => {
    // Local 23:59 - in a zone behind UTC this instant is already "tomorrow" in UTC.
    expect(todayISO(new Date(2026, 10, 10, 23, 59, 59))).toBe("2026-11-10");
    expect(todayISO(new Date(2026, 10, 10, 0, 0, 1))).toBe("2026-11-10");
  });

  it("handles the year boundary", () => {
    expect(todayISO(new Date(2026, 11, 31, 23, 0))).toBe("2026-12-31");
    expect(todayISO(new Date(2027, 0, 1, 0, 0))).toBe("2027-01-01");
  });
});

describe("compareISO / orderRange", () => {
  it("orders chronologically, including across months and years", () => {
    expect(compareISO("2026-11-12", "2026-11-13")).toBe(-1);
    expect(compareISO("2026-11-12", "2026-11-12")).toBe(0);
    expect(compareISO("2027-01-01", "2026-12-31")).toBe(1);
    expect(compareISO("2026-10-31", "2026-11-01")).toBe(-1);
  });

  it("orderRange swaps an inverted pair", () => {
    expect(orderRange("2026-11-20", "2026-11-10")).toEqual(["2026-11-10", "2026-11-20"]);
    expect(orderRange("2026-11-10", "2026-11-20")).toEqual(["2026-11-10", "2026-11-20"]);
  });
});

describe("weekdayIndex (Monday = 0)", () => {
  it.each([
    ["2026-11-02", 0], // Monday
    ["2026-11-08", 6], // Sunday
    ["2026-11-12", 3], // Thursday
    ["2024-02-29", 3], // Thursday
    ["2026-01-01", 3], // Thursday
  ])("%s -> %i", (iso, expected) => {
    expect(weekdayIndex(iso)).toBe(expected);
  });

  it("throws on an invalid date", () => {
    expect(() => weekdayIndex("nope")).toThrow();
  });
});

describe("addDays / addMonthsToMonth / addMonthsToDay", () => {
  it("adds days across month and year boundaries", () => {
    expect(addDays("2026-01-31", 1)).toBe("2026-02-01");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2027-01-01", -1)).toBe("2026-12-31");
    expect(addDays("2024-02-28", 1)).toBe("2024-02-29");
    expect(addDays("2026-02-28", 1)).toBe("2026-03-01");
    expect(addDays("2026-11-12", -7)).toBe("2026-11-05");
  });

  it("navigates months across the year boundary in both directions", () => {
    expect(addMonthsToMonth({ year: 2026, month: 11 }, 1)).toEqual({ year: 2027, month: 0 });
    expect(addMonthsToMonth({ year: 2026, month: 0 }, -1)).toEqual({ year: 2025, month: 11 });
    expect(addMonthsToMonth({ year: 2026, month: 5 }, 0)).toEqual({ year: 2026, month: 5 });
    expect(addMonthsToMonth({ year: 2026, month: 10 }, 14)).toEqual({ year: 2028, month: 0 });
    expect(addMonthsToMonth({ year: 2026, month: 1 }, -14)).toEqual({ year: 2024, month: 11 });
  });

  it("clamps the day when the target month is shorter", () => {
    expect(addMonthsToDay("2026-01-31", 1)).toBe("2026-02-28");
    expect(addMonthsToDay("2024-01-31", 1)).toBe("2024-02-29");
    expect(addMonthsToDay("2026-03-31", -1)).toBe("2026-02-28");
    expect(addMonthsToDay("2026-12-15", 1)).toBe("2027-01-15");
  });
});

describe("monthOf / firstDayOfMonth / lastDayOfMonth", () => {
  it("extracts the month reference", () => {
    expect(monthOf("2026-11-12")).toEqual({ year: 2026, month: 10 });
    expect(monthOf("bad")).toBeNull();
  });

  it("gives month edges, including leap February", () => {
    expect(firstDayOfMonth({ year: 2026, month: 10 })).toBe("2026-11-01");
    expect(lastDayOfMonth({ year: 2026, month: 10 })).toBe("2026-11-30");
    expect(lastDayOfMonth({ year: 2024, month: 1 })).toBe("2024-02-29");
    expect(lastDayOfMonth({ year: 2026, month: 1 })).toBe("2026-02-28");
  });
});

describe("buildMonthGrid (Monday-first)", () => {
  const flat = (weeks: (string | null)[][]) => weeks.flat();
  const days = (weeks: (string | null)[][]) => flat(weeks).filter((d): d is string => d !== null);

  it("always returns full weeks of 7 cells", () => {
    for (let month = 0; month < 12; month++) {
      const weeks = buildMonthGrid(2026, month);
      expect(weeks.every((w) => w.length === 7)).toBe(true);
    }
  });

  it("contains exactly the days of the month, in order, for 28/29/30/31-day months", () => {
    for (const [year, month, total] of [
      [2026, 1, 28],
      [2024, 1, 29],
      [2026, 3, 30],
      [2026, 0, 31],
    ] as const) {
      const d = days(buildMonthGrid(year, month));
      expect(d).toHaveLength(total);
      expect(d[0]).toBe(toISODate(year, month, 1));
      expect(d[total - 1]).toBe(toISODate(year, month, total));
    }
  });

  it("month starting on Monday has no leading padding (Feb 2027 = 4 weeks)", () => {
    const weeks = buildMonthGrid(2027, 1);
    expect(weeks[0][0]).toBe("2027-02-01");
    expect(weeks).toHaveLength(4);
    expect(flat(weeks).includes(null)).toBe(false);
  });

  it("month starting on Sunday has 6 leading nulls (Feb 2026 starts Sunday)", () => {
    const weeks = buildMonthGrid(2026, 1);
    expect(weekdayIndex("2026-02-01")).toBe(6);
    expect(weeks[0].slice(0, 6)).toEqual([null, null, null, null, null, null]);
    expect(weeks[0][6]).toBe("2026-02-01");
  });

  it("places day 1 under the right column (Nov 2026 starts Sunday, Oct 2026 Thursday)", () => {
    expect(buildMonthGrid(2026, 9)[0].indexOf("2026-10-01")).toBe(3);
    expect(buildMonthGrid(2026, 10)[0].indexOf("2026-11-01")).toBe(6);
  });

  it("needs 6 weeks for a 31-day month starting on Saturday/Sunday (Aug 2026 starts Saturday)", () => {
    const weeks = buildMonthGrid(2026, 7);
    expect(weeks).toHaveLength(6);
    expect(weeks[0][5]).toBe("2026-08-01");
  });

  it("pads the trailing week with nulls", () => {
    const weeks = buildMonthGrid(2026, 10);
    const last = weeks[weeks.length - 1];
    expect(last[0]).toBe("2026-11-30");
    expect(last.slice(1)).toEqual([null, null, null, null, null, null]);
  });

  it("every column matches the weekday of the day in it", () => {
    for (const week of buildMonthGrid(2024, 1)) {
      week.forEach((d, col) => {
        if (d) expect(weekdayIndex(d)).toBe(col);
      });
    }
  });
});

describe("isInRange", () => {
  it("is inclusive on both ends", () => {
    expect(isInRange("2026-11-10", "2026-11-10", "2026-11-20")).toBe(true);
    expect(isInRange("2026-11-15", "2026-11-10", "2026-11-20")).toBe(true);
    expect(isInRange("2026-11-20", "2026-11-10", "2026-11-20")).toBe(true);
  });

  it("excludes days outside", () => {
    expect(isInRange("2026-11-09", "2026-11-10", "2026-11-20")).toBe(false);
    expect(isInRange("2026-11-21", "2026-11-10", "2026-11-20")).toBe(false);
  });

  it("tolerates an inverted range", () => {
    expect(isInRange("2026-11-15", "2026-11-20", "2026-11-10")).toBe(true);
    expect(isInRange("2026-11-25", "2026-11-20", "2026-11-10")).toBe(false);
  });

  it("works across a year boundary and for a single-day range", () => {
    expect(isInRange("2027-01-01", "2026-12-30", "2027-01-02")).toBe(true);
    expect(isInRange("2026-11-10", "2026-11-10", "2026-11-10")).toBe(true);
    expect(isInRange("2026-11-11", "2026-11-10", "2026-11-10")).toBe(false);
  });
});

describe("isDayDisabled / clampDay", () => {
  it("disables days before min and after max, not the bounds themselves", () => {
    expect(isDayDisabled("2026-11-09", "2026-11-10", "2026-11-20")).toBe(true);
    expect(isDayDisabled("2026-11-10", "2026-11-10", "2026-11-20")).toBe(false);
    expect(isDayDisabled("2026-11-20", "2026-11-10", "2026-11-20")).toBe(false);
    expect(isDayDisabled("2026-11-21", "2026-11-10", "2026-11-20")).toBe(true);
  });

  it("ignores unset, empty and unparsable bounds", () => {
    expect(isDayDisabled("2026-11-09")).toBe(false);
    expect(isDayDisabled("2026-11-09", "", "")).toBe(false);
    expect(isDayDisabled("2026-11-09", "garbage", "garbage")).toBe(false);
    expect(isDayDisabled("2026-11-09", undefined, "2026-11-20")).toBe(false);
    expect(isDayDisabled("2026-11-25", undefined, "2026-11-20")).toBe(true);
  });

  it("clampDay pulls a day into the bounds", () => {
    expect(clampDay("2026-11-05", "2026-11-10", "2026-11-20")).toBe("2026-11-10");
    expect(clampDay("2026-11-25", "2026-11-10", "2026-11-20")).toBe("2026-11-20");
    expect(clampDay("2026-11-15", "2026-11-10", "2026-11-20")).toBe("2026-11-15");
    expect(clampDay("2026-11-15")).toBe("2026-11-15");
  });
});

describe("formatting", () => {
  it("formats the trigger text without a timezone shift", () => {
    expect(formatDisplayDate("2026-11-12", MONTHS_SHORT)).toBe("12 nov 2026");
    expect(formatDisplayDate("2026-01-01", MONTHS_SHORT)).toBe("1 ene 2026");
    expect(formatDisplayDate("2026-12-31", MONTHS_SHORT)).toBe("31 dic 2026");
  });

  it("returns an empty string for empty or invalid input", () => {
    expect(formatDisplayDate("", MONTHS_SHORT)).toBe("");
    expect(formatDisplayDate("2026-02-30", MONTHS_SHORT)).toBe("");
  });

  it("builds the accessible day name from the template", () => {
    expect(formatDayAriaLabel("2026-11-12", "{weekday} {day} de {month} de {year}", MONTHS, WEEKDAYS_LONG)).toBe(
      "jueves 12 de noviembre de 2026",
    );
    expect(formatDayAriaLabel("2024-02-29", "{weekday} {day} de {month} de {year}", MONTHS, WEEKDAYS_LONG)).toBe(
      "jueves 29 de febrero de 2024",
    );
    expect(formatDayAriaLabel("bad", "{day}", MONTHS, WEEKDAYS_LONG)).toBe("");
  });
});

describe("pickDay (two-click selection)", () => {
  it("first click becomes the pending start", () => {
    expect(pickDay(null, "2026-11-10")).toEqual({ kind: "pending", pendingStart: "2026-11-10" });
  });

  it("a later second click completes the range", () => {
    expect(pickDay("2026-11-10", "2026-11-15")).toEqual({ kind: "complete", startDate: "2026-11-10", endDate: "2026-11-15" });
  });

  it("the same day completes a one-day range", () => {
    expect(pickDay("2026-11-10", "2026-11-10")).toEqual({ kind: "complete", startDate: "2026-11-10", endDate: "2026-11-10" });
  });

  it("an earlier second click restarts with that day as the new start", () => {
    expect(pickDay("2026-11-10", "2026-11-05")).toEqual({ kind: "pending", pendingStart: "2026-11-05" });
  });

  it("works across a year boundary", () => {
    expect(pickDay("2026-12-30", "2027-01-02")).toEqual({ kind: "complete", startDate: "2026-12-30", endDate: "2027-01-02" });
  });
});

describe("keyboardTarget", () => {
  it("maps arrows to day/week moves", () => {
    expect(keyboardTarget("2026-11-12", "ArrowLeft")).toBe("2026-11-11");
    expect(keyboardTarget("2026-11-12", "ArrowRight")).toBe("2026-11-13");
    expect(keyboardTarget("2026-11-12", "ArrowUp")).toBe("2026-11-05");
    expect(keyboardTarget("2026-11-12", "ArrowDown")).toBe("2026-11-19");
  });

  it("crosses month and year edges", () => {
    expect(keyboardTarget("2026-12-31", "ArrowRight")).toBe("2027-01-01");
    expect(keyboardTarget("2026-03-01", "ArrowLeft")).toBe("2026-02-28");
  });

  it("Home/End go to Monday/Sunday of the week", () => {
    expect(keyboardTarget("2026-11-12", "Home")).toBe("2026-11-09");
    expect(keyboardTarget("2026-11-12", "End")).toBe("2026-11-15");
    expect(keyboardTarget("2026-11-09", "Home")).toBe("2026-11-09");
    expect(keyboardTarget("2026-11-15", "End")).toBe("2026-11-15");
  });

  it("PageUp/PageDown move by month with clamping", () => {
    expect(keyboardTarget("2026-01-31", "PageDown")).toBe("2026-02-28");
    expect(keyboardTarget("2026-03-15", "PageUp")).toBe("2026-02-15");
  });

  it("returns null for other keys", () => {
    expect(keyboardTarget("2026-11-12", "a")).toBeNull();
    expect(keyboardTarget("2026-11-12", "Enter")).toBeNull();
  });
});

describe("firstDisabledAfter", () => {
  const disabledSet = (...days: string[]) => (d: string) => days.includes(d);

  it("finds the first disabled day after the start, ignoring the start itself and earlier days", () => {
    const isDisabled = disabledSet("2026-11-05", "2026-11-12", "2026-11-18", "2026-11-25");
    expect(firstDisabledAfter("2026-11-12", "2026-12-31", isDisabled)).toBe("2026-11-18");
    expect(firstDisabledAfter("2026-11-06", "2026-12-31", isDisabled)).toBe("2026-11-12");
  });

  it("returns null when nothing is disabled within reach", () => {
    expect(firstDisabledAfter("2026-11-12", "2026-11-30", disabledSet("2026-12-02"))).toBeNull();
    expect(firstDisabledAfter("2026-11-12", "2026-11-12", disabledSet("2026-11-13"))).toBeNull();
  });

  it("treats `until` as inclusive and crosses month/year boundaries", () => {
    expect(firstDisabledAfter("2026-11-12", "2026-11-13", disabledSet("2026-11-13"))).toBe("2026-11-13");
    expect(firstDisabledAfter("2026-12-30", "2027-01-31", disabledSet("2027-01-02"))).toBe("2027-01-02");
  });

  it("returns null when the start is already at or past `until`", () => {
    expect(firstDisabledAfter("2026-11-20", "2026-11-10", () => true)).toBeNull();
  });
});

describe("keyboardTargetSkippingDisabled", () => {
  const blocked = (...days: string[]) => (d: string) => days.includes(d);

  it("behaves like keyboardTarget when nothing is disabled", () => {
    for (const key of ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "PageUp", "PageDown"]) {
      expect(keyboardTargetSkippingDisabled("2026-11-12", key, () => false)).toBe(keyboardTarget("2026-11-12", key));
    }
  });

  it("returns null for other keys", () => {
    expect(keyboardTargetSkippingDisabled("2026-11-12", "a", () => false)).toBeNull();
  });

  it("skips disabled days in the direction of travel", () => {
    expect(keyboardTargetSkippingDisabled("2026-11-10", "ArrowRight", blocked("2026-11-11"))).toBe("2026-11-12");
    expect(keyboardTargetSkippingDisabled("2026-11-10", "ArrowRight", blocked("2026-11-11", "2026-11-12"))).toBe("2026-11-13");
    expect(keyboardTargetSkippingDisabled("2026-11-10", "ArrowLeft", blocked("2026-11-09"))).toBe("2026-11-08");
    expect(keyboardTargetSkippingDisabled("2026-11-10", "ArrowDown", blocked("2026-11-17"))).toBe("2026-11-24");
    expect(keyboardTargetSkippingDisabled("2026-11-10", "ArrowUp", blocked("2026-11-03"))).toBe("2026-10-27");
  });

  it("skips across a month boundary", () => {
    expect(keyboardTargetSkippingDisabled("2026-11-29", "ArrowRight", blocked("2026-11-30", "2026-12-01"))).toBe("2026-12-02");
  });

  it("Home searches forward and End backward, inside the week", () => {
    // Week of Thu 2026-11-12: Mon 09 .. Sun 15
    expect(keyboardTargetSkippingDisabled("2026-11-12", "Home", blocked("2026-11-09", "2026-11-10"))).toBe("2026-11-11");
    expect(keyboardTargetSkippingDisabled("2026-11-12", "End", blocked("2026-11-15"))).toBe("2026-11-14");
    expect(keyboardTargetSkippingDisabled("2026-11-12", "Home", blocked("2026-11-09", "2026-11-10", "2026-11-11"))).toBe("2026-11-12");
  });

  it("PageDown/PageUp land on the nearest enabled day after the same-day-of-month target", () => {
    expect(keyboardTargetSkippingDisabled("2026-11-12", "PageDown", blocked("2026-12-12"))).toBe("2026-12-13");
    expect(keyboardTargetSkippingDisabled("2026-11-12", "PageUp", blocked("2026-10-12"))).toBe("2026-10-11");
  });

  it("returns null when every day in reach is disabled", () => {
    expect(keyboardTargetSkippingDisabled("2026-11-12", "ArrowRight", () => true)).toBeNull();
    expect(keyboardTargetSkippingDisabled("2026-11-12", "Home", () => true)).toBeNull();
    expect(keyboardTargetSkippingDisabled("2026-11-12", "ArrowRight", (d) => d > "2026-11-12")).toBeNull();
  });
});
