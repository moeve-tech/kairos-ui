import { describe, expect, it } from "vitest";
import {
  applyPick,
  draftToValue,
  formatDisplayTime,
  formatTime,
  hourOptions,
  minuteOptions,
  moveIndex,
  moveIndexSkipping,
  normalizeMinuteStep,
  parseTime,
  to12Hour,
} from "./timeRange";

const MER = { am: "am", pm: "pm" };

describe("parseTime", () => {
  it("parses valid 24 h values", () => {
    expect(parseTime("00:00")).toEqual({ hour: 0, minute: 0 });
    expect(parseTime("12:43")).toEqual({ hour: 12, minute: 43 });
    expect(parseTime("23:59")).toEqual({ hour: 23, minute: 59 });
    expect(parseTime("09:05")).toEqual({ hour: 9, minute: 5 });
  });

  it.each(["", "24:00", "12:60", "99:99", "9:05", "12:5", "12:00:00", "12-00", "ab:cd", " 12:00", "12:00 pm"])("rejects %j", (input) => {
    expect(parseTime(input)).toBeNull();
  });

  it("rejects null and undefined", () => {
    expect(parseTime(null)).toBeNull();
    expect(parseTime(undefined)).toBeNull();
  });
});

describe("formatTime", () => {
  it("zero-pads and round-trips", () => {
    expect(formatTime(0, 0)).toBe("00:00");
    expect(formatTime(9, 5)).toBe("09:05");
    expect(formatTime(23, 59)).toBe("23:59");
    const p = parseTime("07:08");
    expect(p && formatTime(p.hour, p.minute)).toBe("07:08");
  });
});

describe("to12Hour", () => {
  it.each([
    [0, 12, "am"],
    [1, 1, "am"],
    [11, 11, "am"],
    [12, 12, "pm"],
    [13, 1, "pm"],
    [23, 11, "pm"],
  ])("%i -> %i %s", (h, expectedHour, period) => {
    expect(to12Hour(h)).toEqual({ hour: expectedHour, period });
  });
});

describe("formatDisplayTime", () => {
  it("24 h keeps the padded HH:MM", () => {
    expect(formatDisplayTime("09:05", false, MER)).toBe("09:05");
    expect(formatDisplayTime("00:00", false, MER)).toBe("00:00");
    expect(formatDisplayTime("12:43", false, MER)).toBe("12:43");
  });

  it("12 h handles midnight and noon", () => {
    expect(formatDisplayTime("00:00", true, MER)).toBe("12:00 am");
    expect(formatDisplayTime("00:05", true, MER)).toBe("12:05 am");
    expect(formatDisplayTime("12:00", true, MER)).toBe("12:00 pm");
    expect(formatDisplayTime("12:43", true, MER)).toBe("12:43 pm");
    expect(formatDisplayTime("13:05", true, MER)).toBe("1:05 pm");
    expect(formatDisplayTime("23:59", true, MER)).toBe("11:59 pm");
    expect(formatDisplayTime("09:30", true, MER)).toBe("9:30 am");
  });

  it("uses the given am/pm labels", () => {
    expect(formatDisplayTime("15:00", true, { am: "a. m.", pm: "p. m." })).toBe("3:00 p. m.");
  });

  it("returns an empty string for empty or invalid values", () => {
    expect(formatDisplayTime("", false, MER)).toBe("");
    expect(formatDisplayTime("25:00", true, MER)).toBe("");
  });
});

describe("normalizeMinuteStep", () => {
  it("keeps integers in 1..59", () => {
    expect(normalizeMinuteStep(1)).toBe(1);
    expect(normalizeMinuteStep(15)).toBe(15);
    expect(normalizeMinuteStep(59)).toBe(59);
  });

  it.each([0, -5, 1.5, 60, Number.NaN, undefined])("falls back to 5 for %s", (step) => {
    expect(normalizeMinuteStep(step)).toBe(5);
  });
});

describe("hourOptions", () => {
  it("lists 24 hours in 24 h mode", () => {
    const opts = hourOptions(false, MER);
    expect(opts).toHaveLength(24);
    expect(opts[0]).toEqual({ value: 0, label: "00" });
    expect(opts[9]).toEqual({ value: 9, label: "09" });
    expect(opts[23]).toEqual({ value: 23, label: "23" });
  });

  it("keeps the 24 h values but shows am/pm labels in 12 h mode", () => {
    const opts = hourOptions(true, MER);
    expect(opts).toHaveLength(24);
    expect(opts.map((o) => o.value)).toEqual(Array.from({ length: 24 }, (_, i) => i));
    expect(opts[0].label).toBe("12 am");
    expect(opts[1].label).toBe("1 am");
    expect(opts[11].label).toBe("11 am");
    expect(opts[12].label).toBe("12 pm");
    expect(opts[13]).toEqual({ value: 13, label: "1 pm" });
    expect(opts[23].label).toBe("11 pm");
  });
});

describe("minuteOptions", () => {
  it("generates the step grid", () => {
    expect(minuteOptions(5, null).map((o) => o.value)).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55]);
    expect(minuteOptions(15, null).map((o) => o.value)).toEqual([0, 15, 30, 45]);
    expect(minuteOptions(1, null)).toHaveLength(60);
    expect(minuteOptions(7, null).map((o) => o.value)).toEqual([0, 7, 14, 21, 28, 35, 42, 49, 56]);
  });

  it("pads labels", () => {
    expect(minuteOptions(5, null)[1].label).toBe("05");
    expect(minuteOptions(5, null)[0].label).toBe("00");
  });

  it("inserts an off-step current value in order (12:43 with step 5)", () => {
    const values = minuteOptions(5, 43).map((o) => o.value);
    expect(values).toContain(43);
    expect(values).toEqual([0, 5, 10, 15, 20, 25, 30, 35, 40, 43, 45, 50, 55]);
  });

  it("inserts off-step values at the edges (1 and 59)", () => {
    const withEdge = minuteOptions(5, 59);
    expect(withEdge[withEdge.length - 1]).toEqual({ value: 59, label: "59" });
    expect(minuteOptions(5, 1)[1]).toEqual({ value: 1, label: "01" });
  });

  it("does not duplicate an on-step current value", () => {
    expect(minuteOptions(5, 45)).toHaveLength(12);
  });

  it("ignores out-of-range current values and falls back on a bad step", () => {
    expect(minuteOptions(5, 75)).toHaveLength(12);
    expect(minuteOptions(0, null)).toHaveLength(12);
  });
});

describe("moveIndex", () => {
  it("moves and clamps without wrapping", () => {
    expect(moveIndex(3, 10, "ArrowDown")).toBe(4);
    expect(moveIndex(3, 10, "ArrowUp")).toBe(2);
    expect(moveIndex(0, 10, "ArrowUp")).toBe(0);
    expect(moveIndex(9, 10, "ArrowDown")).toBe(9);
    expect(moveIndex(4, 10, "Home")).toBe(0);
    expect(moveIndex(4, 10, "End")).toBe(9);
  });

  it("returns null for other keys or an empty list", () => {
    expect(moveIndex(3, 10, "a")).toBeNull();
    expect(moveIndex(0, 0, "ArrowDown")).toBeNull();
  });
});

describe("applyPick / draftToValue", () => {
  it("an hour pick sends focus to the minutes", () => {
    expect(applyPick({ hour: null, minute: null }, "hour", 9)).toEqual({ draft: { hour: 9, minute: null }, next: "minute" });
  });

  it("a minute pick with an hour confirms", () => {
    expect(applyPick({ hour: 9, minute: null }, "minute", 30)).toEqual({ draft: { hour: 9, minute: 30 }, next: "confirm" });
  });

  it("a minute pick without an hour asks for the hour", () => {
    expect(applyPick({ hour: null, minute: null }, "minute", 30)).toEqual({ draft: { hour: null, minute: 30 }, next: "hour" });
  });

  it("keeps an off-step minute when only the hour changes", () => {
    expect(applyPick({ hour: 12, minute: 43 }, "hour", 14).draft).toEqual({ hour: 14, minute: 43 });
  });

  it("midnight is a valid pick", () => {
    const r = applyPick({ hour: 0, minute: null }, "minute", 0);
    expect(r.next).toBe("confirm");
    expect(draftToValue(r.draft)).toBe("00:00");
  });

  it("draftToValue is null while incomplete", () => {
    expect(draftToValue({ hour: 9, minute: null })).toBeNull();
    expect(draftToValue({ hour: null, minute: 0 })).toBeNull();
    expect(draftToValue({ hour: 9, minute: 5 })).toBe("09:05");
  });
});

describe("moveIndexSkipping", () => {
  const off = (...idx: number[]) => (i: number) => idx.includes(i);

  it("behaves like moveIndex when nothing is disabled", () => {
    for (const key of ["ArrowUp", "ArrowDown", "Home", "End"]) {
      expect(moveIndexSkipping(4, 10, key, () => false)).toBe(moveIndex(4, 10, key));
    }
  });

  it("jumps over disabled options in the direction of travel", () => {
    expect(moveIndexSkipping(3, 10, "ArrowDown", off(4))).toBe(5);
    expect(moveIndexSkipping(3, 10, "ArrowDown", off(4, 5, 6))).toBe(7);
    expect(moveIndexSkipping(5, 10, "ArrowUp", off(4, 3))).toBe(2);
  });

  it("stays put (null) when there is no enabled option that way", () => {
    expect(moveIndexSkipping(7, 10, "ArrowDown", off(8, 9))).toBeNull();
    expect(moveIndexSkipping(2, 10, "ArrowUp", off(0, 1))).toBeNull();
    expect(moveIndexSkipping(9, 10, "ArrowDown", () => false)).toBeNull();
    expect(moveIndexSkipping(0, 10, "ArrowUp", () => false)).toBeNull();
  });

  it("Home/End go to the first/last ENABLED option", () => {
    expect(moveIndexSkipping(5, 10, "Home", off(0, 1))).toBe(2);
    expect(moveIndexSkipping(5, 10, "End", off(9))).toBe(8);
    expect(moveIndexSkipping(5, 10, "Home", () => true)).toBeNull();
  });

  it("returns null for other keys or an empty list", () => {
    expect(moveIndexSkipping(3, 10, "a", () => false)).toBeNull();
    expect(moveIndexSkipping(0, 0, "ArrowDown", () => false)).toBeNull();
  });
});
