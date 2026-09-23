import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { DateRangePicker, type DateRangePickerProps } from "./DateRangePicker";

// "Today" is pinned to Tuesday 2026-11-10 (local time) so the calendar is deterministic.
beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date(2026, 10, 10, 12, 0, 0));
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});

function setup(props: Partial<DateRangePickerProps> = {}) {
  const onChange = vi.fn();
  const utils = render(<DateRangePicker startDate="" endDate="" onChange={onChange} {...props} />);
  return { onChange, ...utils };
}

const startTrigger = () => screen.getByRole("button", { name: /Fecha inicio/ });
const endTrigger = () => screen.getByRole("button", { name: /Fecha fin/ });
const openPicker = () => fireEvent.click(startTrigger());
const day = (iso: string) => document.querySelector(`button[data-date="${iso}"]`) as HTMLButtonElement;
const clickDay = (iso: string) => fireEvent.click(day(iso));

describe("DateRangePicker - trigger", () => {
  it("shows the labels and the placeholder when empty", () => {
    setup();
    expect(startTrigger()).toHaveTextContent("Selecciona");
    expect(endTrigger()).toHaveTextContent("Selecciona");
  });

  it("formats the values without a timezone shift", () => {
    setup({ startDate: "2026-11-12", endDate: "2026-12-01" });
    expect(startTrigger()).toHaveTextContent("12 nov 2026");
    expect(endTrigger()).toHaveTextContent("1 dic 2026");
  });

  it("treats an unparsable value as empty", () => {
    setup({ startDate: "2026-02-30" });
    expect(startTrigger()).toHaveTextContent("Selecciona");
  });

  it("supports custom labels and placeholder, and passes className to the wrapper", () => {
    const { container } = setup({ startLabel: "Desde", endLabel: "Hasta", placeholder: "Elige", className: "w-80" });
    expect(screen.getByRole("button", { name: /Desde/ })).toHaveTextContent("Elige");
    expect(screen.getByRole("button", { name: /Hasta/ })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("w-80");
  });

  it("exposes haspopup/expanded and opens a labelled dialog from either field", () => {
    setup();
    expect(startTrigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(startTrigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(endTrigger());
    expect(screen.getByRole("dialog", { name: "Seleccionar rango de fechas" })).toBeInTheDocument();
    expect(startTrigger()).toHaveAttribute("aria-expanded", "true");
    expect(endTrigger()).toHaveAttribute("aria-controls", screen.getByRole("dialog").id);
  });

  it("closes when the open trigger is clicked again", () => {
    setup();
    openPicker();
    fireEvent.click(startTrigger());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("DateRangePicker - calendar", () => {
  it("opens on the month of today with two months side by side", () => {
    setup();
    openPicker();
    expect(screen.getByRole("group", { name: "noviembre 2026" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "diciembre 2026" })).toBeInTheDocument();
  });

  it("opens on the month of an existing start date", () => {
    setup({ startDate: "2027-02-14", endDate: "2027-02-20" });
    openPicker();
    expect(screen.getByRole("group", { name: "febrero 2027" })).toBeInTheDocument();
  });

  it("starts the week on Monday (Nov 1 2026 is a Sunday: 7th column)", () => {
    setup();
    openPicker();
    const nov = screen.getByRole("group", { name: "noviembre 2026" });
    const cells = Array.from(nov.querySelectorAll(".grid-cols-7")[1].children);
    expect(cells.indexOf(day("2026-11-01").parentElement as Element)).toBe(6);
    expect(within(nov).getAllByText(/^(Lu|Ma|Mi|Ju|Vi|Sá|Do)$/).map((n) => n.textContent)).toEqual([
      "Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do",
    ]);
  });

  it("gives each day a full accessible name", () => {
    setup();
    openPicker();
    expect(screen.getByRole("button", { name: "jueves 12 de noviembre de 2026" })).toBeInTheDocument();
  });

  it("marks today with aria-current", () => {
    setup();
    openPicker();
    expect(day("2026-11-10")).toHaveAttribute("aria-current", "date");
    expect(day("2026-11-11")).not.toHaveAttribute("aria-current");
  });

  it("navigates months, across the year boundary", () => {
    setup();
    openPicker();
    fireEvent.click(screen.getByRole("button", { name: "Mes siguiente" }));
    expect(screen.getByRole("group", { name: "diciembre 2026" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "enero 2027" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    fireEvent.click(screen.getByRole("button", { name: "Mes anterior" }));
    expect(screen.getByRole("group", { name: "octubre 2026" })).toBeInTheDocument();
  });

  it("renders a single month when the viewport is below the sm breakpoint", () => {
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    setup();
    openPicker();
    expect(screen.getAllByRole("group")).toHaveLength(1);
    expect(screen.getByRole("group", { name: "noviembre 2026" })).toBeInTheDocument();
  });
});

describe("DateRangePicker - range selection", () => {
  it("first click sets the start, second click completes the range and closes", () => {
    const { onChange } = setup();
    openPicker();
    clickDay("2026-11-12");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    clickDay("2026-11-20");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-11-20" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("returns focus to the trigger after completing a range", () => {
    setup();
    openPicker();
    clickDay("2026-11-12");
    clickDay("2026-11-20");
    expect(startTrigger()).toHaveFocus();
  });

  it("an earlier second click becomes the new start and keeps waiting", () => {
    const { onChange } = setup();
    openPicker();
    clickDay("2026-11-20");
    clickDay("2026-11-12");
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(day("2026-11-12")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-20")).toHaveAttribute("aria-pressed", "false");

    clickDay("2026-11-25");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-11-25" });
  });

  it("clicking the same day twice makes a one-day range", () => {
    const { onChange } = setup();
    openPicker();
    clickDay("2026-11-12");
    clickDay("2026-11-12");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-11-12" });
  });

  it("can pick a range that spans two months", () => {
    const { onChange } = setup();
    openPicker();
    clickDay("2026-11-28");
    clickDay("2026-12-03");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-28", endDate: "2026-12-03" });
  });

  it("shows the draft start in the trigger and blanks the end while waiting", () => {
    setup({ startDate: "2026-11-01", endDate: "2026-11-05" });
    openPicker();
    clickDay("2026-11-12");
    expect(startTrigger()).toHaveTextContent("12 nov 2026");
    expect(endTrigger()).toHaveTextContent("Selecciona");
  });

  it("discards a half-made selection when closed with Escape", () => {
    const { onChange } = setup({ startDate: "2026-11-01", endDate: "2026-11-05" });
    openPicker();
    clickDay("2026-11-12");
    fireEvent.keyDown(document, { key: "Escape" });
    expect(onChange).not.toHaveBeenCalled();
    expect(startTrigger()).toHaveTextContent("1 nov 2026");
    expect(endTrigger()).toHaveTextContent("5 nov 2026");
  });

  it("highlights the selected edges and the days in between", () => {
    setup({ startDate: "2026-11-12", endDate: "2026-11-16" });
    openPicker();
    expect(day("2026-11-12")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-12")).toHaveClass("bg-brand-primary", "text-white");
    expect(day("2026-11-16")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-14").parentElement).toHaveClass("bg-brand-primary/10");
    expect(day("2026-11-14")).toHaveAttribute("aria-pressed", "false");
    expect(day("2026-11-17").parentElement).not.toHaveClass("bg-brand-primary/10");
  });

  it("previews the range while hovering the end candidate", () => {
    setup();
    openPicker();
    clickDay("2026-11-12");
    fireEvent.mouseEnter(day("2026-11-18"));
    expect(day("2026-11-15").parentElement).toHaveClass("bg-brand-primary/10");
    expect(day("2026-11-18")).toHaveClass("bg-brand-primary");
    expect(day("2026-11-18")).toHaveAttribute("aria-pressed", "false"); // preview, not selected
    // hovering before the start previews nothing
    fireEvent.mouseEnter(day("2026-11-11"));
    expect(day("2026-11-15").parentElement).not.toHaveClass("bg-brand-primary/10");
  });

  it("tolerates an inverted range coming from props", () => {
    setup({ startDate: "2026-11-16", endDate: "2026-11-12" });
    openPicker();
    expect(day("2026-11-14").parentElement).toHaveClass("bg-brand-primary/10");
  });
});

describe("DateRangePicker - min / max", () => {
  it("disables days before min and does not select them", () => {
    const { onChange } = setup({ min: "2026-11-12" });
    openPicker();
    expect(day("2026-11-11")).toBeDisabled();
    expect(day("2026-11-12")).toBeEnabled();
    clickDay("2026-11-11");
    clickDay("2026-11-13");
    clickDay("2026-11-14");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-13", endDate: "2026-11-14" });
  });

  it("disables days after max", () => {
    setup({ max: "2026-11-20" });
    openPicker();
    expect(day("2026-11-20")).toBeEnabled();
    expect(day("2026-11-21")).toBeDisabled();
    expect(day("2026-12-05")).toBeDisabled();
  });

  it("opens on min when today is before it", () => {
    setup({ min: "2027-03-05" });
    openPicker();
    expect(screen.getByRole("group", { name: "marzo 2027" })).toBeInTheDocument();
  });

  it("disables the previous-month arrow when nothing earlier is selectable", () => {
    setup({ min: "2026-11-01" });
    openPicker();
    expect(screen.getByRole("button", { name: "Mes anterior" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeEnabled();
  });

  it("disables the next-month arrow once max is already on screen", () => {
    setup({ max: "2026-12-15" });
    openPicker();
    expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Mes anterior" })).toBeEnabled();
  });
});

describe("DateRangePicker - closing and focus", () => {
  it("Escape closes and returns focus to the trigger that opened it", () => {
    setup();
    fireEvent.click(endTrigger());
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(endTrigger()).toHaveFocus();
  });

  it("closes on a click outside but not on a click inside", () => {
    setup();
    openPicker();
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("puts focus on today's button when opened", () => {
    setup();
    openPicker();
    expect(day("2026-11-10")).toHaveFocus();
  });

  it("puts focus on the start date when there is one", () => {
    setup({ startDate: "2026-11-18", endDate: "2026-11-20" });
    openPicker();
    expect(day("2026-11-18")).toHaveFocus();
  });

  it("uses a roving tabindex: exactly one day is tabbable", () => {
    setup();
    openPicker();
    const tabbable = Array.from(document.querySelectorAll("button[data-date]")).filter((b) => b.getAttribute("tabindex") === "0");
    expect(tabbable).toHaveLength(1);
    expect(tabbable[0]).toBe(day("2026-11-10"));
  });
});

describe("DateRangePicker - keyboard navigation", () => {
  const press = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });

  it("arrows move by day and week", () => {
    setup();
    openPicker();
    press("ArrowRight");
    expect(day("2026-11-11")).toHaveFocus();
    press("ArrowDown");
    expect(day("2026-11-18")).toHaveFocus();
    press("ArrowLeft");
    expect(day("2026-11-17")).toHaveFocus();
    press("ArrowUp");
    expect(day("2026-11-10")).toHaveFocus();
  });

  it("Home/End jump to Monday/Sunday of the week", () => {
    setup();
    openPicker();
    press("End");
    expect(day("2026-11-15")).toHaveFocus();
    press("Home");
    expect(day("2026-11-09")).toHaveFocus();
  });

  it("scrolls the view when focus leaves the visible months (forward and back)", () => {
    setup();
    openPicker();
    press("PageDown"); // Dec 10 - already visible, no scroll
    expect(day("2026-12-10")).toHaveFocus();
    expect(screen.getByRole("group", { name: "noviembre 2026" })).toBeInTheDocument();
    press("PageDown"); // Jan 10 2027 - new right-hand month
    expect(day("2027-01-10")).toHaveFocus();
    expect(screen.getByRole("group", { name: "enero 2027" })).toBeInTheDocument();
    expect(screen.queryByRole("group", { name: "noviembre 2026" })).not.toBeInTheDocument();
    press("PageUp");
    press("PageUp");
    press("PageUp");
    expect(day("2026-10-10")).toHaveFocus();
    expect(screen.getByRole("group", { name: "octubre 2026" })).toBeInTheDocument();
  });

  it("does not move onto disabled days", () => {
    setup({ min: "2026-11-10" });
    openPicker();
    press("ArrowLeft");
    expect(day("2026-11-10")).toHaveFocus();
  });

  it("supports a full keyboard selection (focus moves, activation is the native button click)", () => {
    const { onChange } = setup();
    openPicker();
    fireEvent.click(document.activeElement as Element); // Enter/Space on a button = click
    press("ArrowDown");
    fireEvent.click(document.activeElement as Element);
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-10", endDate: "2026-11-17" });
  });

  it("ignores unrelated keys", () => {
    setup();
    openPicker();
    press("a");
    expect(day("2026-11-10")).toHaveFocus();
  });
});

describe("DateRangePicker - clear and labels", () => {
  it("only offers Limpiar when there is something to clear", () => {
    setup();
    openPicker();
    expect(screen.queryByRole("button", { name: "Limpiar" })).not.toBeInTheDocument();
  });

  it("clears the range through the single onChange callback and closes", () => {
    const { onChange } = setup({ startDate: "2026-11-12", endDate: "2026-11-16" });
    openPicker();
    fireEvent.click(screen.getByRole("button", { name: "Limpiar" }));
    expect(onChange).toHaveBeenCalledWith({ startDate: "", endDate: "" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("lets the caller override any subset of the strings", () => {
    setup({
      startDate: "2026-11-12",
      endDate: "2026-11-16",
      labels: {
        months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        monthsShort: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
        weekdaysLong: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        dayAriaTemplate: "{weekday}, {month} {day}, {year}",
        nextMonth: "Next month",
        clear: "Clear",
        dialog: "Pick dates",
      },
    });
    expect(startTrigger()).toHaveTextContent("12 nov 2026");
    openPicker();
    expect(screen.getByRole("dialog", { name: "Pick dates" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "Nov 2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Thursday, Nov 12, 2026" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next month" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Mes anterior" })).toBeInTheDocument(); // not overridden -> default
    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument();
  });
});

describe("DateRangePicker - unavailable days (isDateDisabled)", () => {
  it("disables and dims the flagged days, and they cannot be selected", () => {
    const { onChange } = setup({ isDateDisabled: (iso) => iso === "2026-11-14" });
    openPicker();
    expect(day("2026-11-14")).toBeDisabled();
    expect(day("2026-11-14")).toHaveClass("opacity-40", "cursor-not-allowed");
    expect(day("2026-11-13")).toBeEnabled();
    clickDay("2026-11-14");
    clickDay("2026-11-12");
    clickDay("2026-11-14");
    expect(onChange).not.toHaveBeenCalled();
    clickDay("2026-11-13");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-11-13" });
  });

  it("combines with min and max", () => {
    setup({ min: "2026-11-12", max: "2026-11-20", isDateDisabled: (iso) => iso === "2026-11-15" });
    openPicker();
    expect(day("2026-11-11")).toBeDisabled(); // min
    expect(day("2026-11-15")).toBeDisabled(); // predicate
    expect(day("2026-11-21")).toBeDisabled(); // max
    expect(day("2026-11-16")).toBeEnabled();
  });

  it("calls the predicate with ISO strings", () => {
    const isDateDisabled = vi.fn(() => false);
    setup({ isDateDisabled });
    openPicker();
    expect(isDateDisabled).toHaveBeenCalledWith("2026-11-10");
    for (const [iso] of isDateDisabled.mock.calls as unknown as string[][]) expect(iso).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("never focuses a disabled day on open (today flagged -> another enabled day is the tab stop)", () => {
    setup({ isDateDisabled: (iso) => iso === "2026-11-10" });
    openPicker();
    expect(day("2026-11-10")).toBeDisabled();
    expect(day("2026-11-10")).not.toHaveFocus();
    expect(document.activeElement).toBe(day("2026-11-01"));
  });

  it("does not validate the confirmed range from props: edges stay selected, days between are dimmed", () => {
    const { onChange } = setup({
      startDate: "2026-11-12",
      endDate: "2026-11-16",
      isDateDisabled: (iso) => iso >= "2026-11-12" && iso <= "2026-11-16",
    });
    openPicker();
    expect(onChange).not.toHaveBeenCalled();
    expect(day("2026-11-12")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-12")).toHaveClass("bg-brand-primary", "text-white");
    expect(day("2026-11-12")).not.toHaveClass("opacity-40");
    expect(day("2026-11-16")).toHaveClass("bg-brand-primary");
    expect(day("2026-11-14")).toHaveClass("opacity-40");
    expect(day("2026-11-14").parentElement).toHaveClass("bg-brand-primary/10");
  });
});

describe("DateRangePicker - partially unavailable days (isDatePartial)", () => {
  it("shows a dot and adds the label to the accessible name, keeping the day selectable", () => {
    const { onChange } = setup({ isDatePartial: (iso) => iso === "2026-11-14" });
    openPicker();
    const partial = screen.getByRole("button", { name: "sábado 14 de noviembre de 2026, parcialmente ocupado" });
    expect(partial).toBe(day("2026-11-14"));
    expect(partial).toBeEnabled();
    expect(partial.querySelector("span.rounded-full")).toBeInTheDocument();
    expect(day("2026-11-13").querySelector("span.rounded-full")).toBeNull();
    expect(screen.getByRole("button", { name: "viernes 13 de noviembre de 2026" })).toBeInTheDocument();

    clickDay("2026-11-12");
    clickDay("2026-11-14");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-11-14" });
  });

  it("lets the caller override the label", () => {
    setup({ isDatePartial: (iso) => iso === "2026-11-14", labels: { partialDay: "partly booked" } });
    openPicker();
    expect(screen.getByRole("button", { name: "sábado 14 de noviembre de 2026, partly booked" })).toBeInTheDocument();
  });

  it("uses a white dot on a selected edge and no dot on a disabled day", () => {
    setup({
      startDate: "2026-11-14",
      endDate: "2026-11-18",
      isDatePartial: () => true,
      isDateDisabled: (iso) => iso === "2026-11-20",
    });
    openPicker();
    expect(day("2026-11-14").querySelector("span.rounded-full")).toHaveClass("bg-white");
    expect(day("2026-11-16").querySelector("span.rounded-full")).toHaveClass("bg-brand-primary");
    expect(day("2026-11-20").querySelector("span.rounded-full")).toBeNull();
    expect(day("2026-11-20")).not.toHaveAccessibleName(/parcialmente/);
  });
});

describe("DateRangePicker - allowRangeOverDisabled", () => {
  const busy = (...days: string[]) => (iso: string) => days.includes(iso);

  it("by default, after choosing the start, days past the first disabled day are disabled too", () => {
    const { onChange } = setup({ isDateDisabled: busy("2026-11-18") });
    openPicker();
    expect(day("2026-11-19")).toBeEnabled(); // before choosing a start, nothing extra is blocked
    clickDay("2026-11-12");
    expect(day("2026-11-17")).toBeEnabled();
    expect(day("2026-11-18")).toBeDisabled();
    expect(day("2026-11-19")).toBeDisabled();
    expect(day("2026-11-19")).toHaveClass("opacity-40");
    expect(day("2026-12-05")).toBeDisabled(); // the second visible month too
    clickDay("2026-11-19");
    expect(onChange).not.toHaveBeenCalled();
    clickDay("2026-11-17");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-11-17" });
  });

  it("days before the start stay selectable (they restart the range)", () => {
    setup({ isDateDisabled: busy("2026-11-18") });
    openPicker();
    clickDay("2026-11-12");
    expect(day("2026-11-11")).toBeEnabled();
    expect(day("2026-11-01")).toBeEnabled();
  });

  it("a disabled day BEFORE the start does not affect anything", () => {
    const { onChange } = setup({ isDateDisabled: busy("2026-11-08") });
    openPicker();
    clickDay("2026-11-12");
    expect(day("2026-11-13")).toBeEnabled();
    expect(day("2026-12-20")).toBeEnabled();
    clickDay("2026-12-20");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-12-20" });
  });

  it("recomputes the limit when an earlier click restarts the range", () => {
    setup({ isDateDisabled: busy("2026-11-08", "2026-11-18") });
    openPicker();
    clickDay("2026-11-12");
    clickDay("2026-11-09"); // earlier -> new start; the busy 8th is now BEFORE the start
    expect(day("2026-11-09")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-17")).toBeEnabled();
    expect(day("2026-11-19")).toBeDisabled();
    clickDay("2026-11-05"); // restart earlier than the busy day
    expect(day("2026-11-07")).toBeEnabled();
    expect(day("2026-11-09")).toBeDisabled(); // past the busy 8th
    expect(day("2026-11-12")).toBeDisabled();
  });

  it("blocks days across the month boundary when the first disabled day is in the next month", () => {
    setup({ isDateDisabled: busy("2026-12-03") });
    openPicker();
    clickDay("2026-11-28");
    expect(day("2026-12-02")).toBeEnabled();
    expect(day("2026-12-04")).toBeDisabled();
  });

  it("does not let the confirmed range in props influence the blocking", () => {
    setup({ startDate: "2026-11-12", endDate: "2026-11-25", isDateDisabled: busy("2026-11-18") });
    openPicker();
    expect(day("2026-11-25")).toHaveAttribute("aria-pressed", "true");
    expect(day("2026-11-22")).toBeEnabled(); // no pending start yet -> nothing extra blocked
  });

  it("allowRangeOverDisabled lets the range cross a disabled day (current behaviour)", () => {
    const { onChange } = setup({ isDateDisabled: busy("2026-11-18"), allowRangeOverDisabled: true });
    openPicker();
    clickDay("2026-11-12");
    expect(day("2026-11-18")).toBeDisabled(); // itself still not pickable
    expect(day("2026-11-19")).toBeEnabled();
    clickDay("2026-11-19");
    expect(onChange).toHaveBeenCalledWith({ startDate: "2026-11-12", endDate: "2026-11-19" });
  });

  it("hover preview never covers a blocked day", () => {
    setup({ isDateDisabled: busy("2026-11-18") });
    openPicker();
    clickDay("2026-11-12");
    fireEvent.mouseEnter(day("2026-11-17"));
    expect(day("2026-11-15").parentElement).toHaveClass("bg-brand-primary/10");
    fireEvent.mouseEnter(day("2026-11-19")); // blocked: hovering it must not extend the preview
    expect(day("2026-11-19")).not.toHaveClass("bg-brand-primary");
  });

  it("with the override on, hovering past a disabled day previews the whole span", () => {
    setup({ isDateDisabled: busy("2026-11-18"), allowRangeOverDisabled: true });
    openPicker();
    clickDay("2026-11-12");
    fireEvent.mouseEnter(day("2026-11-20"));
    expect(day("2026-11-15").parentElement).toHaveClass("bg-brand-primary/10");
    expect(day("2026-11-20")).toHaveClass("bg-brand-primary");
  });
});

describe("DateRangePicker - keyboard with unavailable days", () => {
  const press = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });
  const busy = (...days: string[]) => (iso: string) => days.includes(iso);

  it("arrows skip flagged days instead of getting stuck", () => {
    setup({ isDateDisabled: busy("2026-11-11", "2026-11-17") });
    openPicker(); // focus on today, the 10th
    press("ArrowRight");
    expect(day("2026-11-12")).toHaveFocus();
    press("ArrowLeft");
    expect(day("2026-11-10")).toHaveFocus();
    press("ArrowDown"); // the 17th is flagged -> 24th
    expect(day("2026-11-24")).toHaveFocus();
  });

  it("Home/End skip flagged edges of the week", () => {
    setup({ isDateDisabled: busy("2026-11-09", "2026-11-15") });
    openPicker();
    press("Home");
    expect(day("2026-11-10")).toHaveFocus(); // Monday 9th flagged, Tuesday is the first enabled
    press("End");
    expect(day("2026-11-14")).toHaveFocus();
  });

  it("never lands on days blocked by the range rule", () => {
    setup({ isDateDisabled: busy("2026-11-14") });
    openPicker();
    fireEvent.click(document.activeElement as Element); // start = 10th
    press("ArrowRight");
    press("ArrowRight");
    press("ArrowRight");
    expect(day("2026-11-13")).toHaveFocus();
    press("ArrowRight"); // 14th flagged, everything after it blocked: focus stays
    expect(day("2026-11-13")).toHaveFocus();
    press("ArrowDown"); // 20th blocked
    press("PageDown"); // Dec 13 blocked
    expect(day("2026-11-13")).toHaveFocus();
    press("ArrowLeft"); // going back is fine
    expect(day("2026-11-12")).toHaveFocus();
  });

  it("judges targets in months that are not on screen against the range rule", () => {
    setup({ isDateDisabled: busy("2027-01-05") });
    openPicker(); // shows Nov + Dec 2026
    fireEvent.click(document.activeElement as Element); // start = Nov 10
    press("PageDown");
    expect(day("2026-12-10")).toHaveFocus();
    press("PageDown"); // Jan 10 2027 is not on screen and lies past the busy Jan 5: blocked, view does not move
    expect(day("2026-12-10")).toHaveFocus();
    expect(screen.queryByRole("group", { name: "enero 2027" })).not.toBeInTheDocument();
  });

  it("with allowRangeOverDisabled, arrows step over the flagged day", () => {
    setup({ isDateDisabled: busy("2026-11-14"), allowRangeOverDisabled: true });
    openPicker();
    fireEvent.click(document.activeElement as Element);
    press("ArrowRight");
    press("ArrowRight");
    press("ArrowRight");
    expect(day("2026-11-13")).toHaveFocus();
    press("ArrowRight");
    expect(day("2026-11-15")).toHaveFocus();
  });
});
