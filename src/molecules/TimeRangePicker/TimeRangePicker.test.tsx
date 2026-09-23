import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import { TimeRangePicker, type TimeRangePickerProps } from "./TimeRangePicker";

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function setup(props: Partial<TimeRangePickerProps> = {}) {
  const onChange = vi.fn();
  const utils = render(<TimeRangePicker startTime="" endTime="" onChange={onChange} {...props} />);
  return { onChange, ...utils };
}

const startTrigger = () => screen.getByRole("button", { name: /Hora inicio/ });
const endTrigger = () => screen.getByRole("button", { name: /Hora fin/ });
const hours = () => screen.getByRole("listbox", { name: "Horas" });
const minutes = () => screen.getByRole("listbox", { name: "Minutos" });
const hourOpt = (name: string) => within(hours()).getByRole("option", { name });
const minuteOpt = (name: string) => within(minutes()).getByRole("option", { name });

describe("TimeRangePicker - trigger", () => {
  it("shows the labels and the placeholder when empty", () => {
    setup();
    expect(startTrigger()).toHaveTextContent("Selecciona");
    expect(endTrigger()).toHaveTextContent("Selecciona");
  });

  it("shows values as 24 h by default, including midnight", () => {
    setup({ startTime: "00:00", endTime: "12:43" });
    expect(startTrigger()).toHaveTextContent("00:00");
    expect(endTrigger()).toHaveTextContent("12:43");
  });

  it("displays am/pm with hour12 (display only)", () => {
    setup({ startTime: "00:00", endTime: "15:30", hour12: true });
    expect(startTrigger()).toHaveTextContent("12:00 am");
    expect(endTrigger()).toHaveTextContent("3:30 pm");
  });

  it("treats an invalid value as empty", () => {
    setup({ startTime: "25:99" });
    expect(startTrigger()).toHaveTextContent("Selecciona");
  });

  it("supports custom labels and className on the wrapper", () => {
    const { container } = setup({ startLabel: "Desde", endLabel: "Hasta", placeholder: "Elige", className: "w-80" });
    expect(screen.getByRole("button", { name: /Desde/ })).toHaveTextContent("Elige");
    expect(screen.getByRole("button", { name: /Hasta/ })).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("w-80");
  });

  it("exposes haspopup/expanded and opens one labelled dialog per field", () => {
    setup();
    expect(startTrigger()).toHaveAttribute("aria-haspopup", "dialog");
    expect(startTrigger()).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(startTrigger());
    expect(screen.getByRole("dialog", { name: "Seleccionar hora de inicio" })).toBeInTheDocument();
    expect(startTrigger()).toHaveAttribute("aria-expanded", "true");
    expect(startTrigger()).toHaveAttribute("aria-controls", screen.getByRole("dialog").id);
    expect(endTrigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("closes when the open trigger is clicked again, and switches when the other one is clicked", () => {
    setup();
    fireEvent.click(startTrigger());
    fireEvent.click(endTrigger());
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
    expect(screen.getByRole("dialog", { name: "Seleccionar hora de fin" })).toBeInTheDocument();
    fireEvent.click(endTrigger());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("raises the wrapper z-index only while open", () => {
    const { container } = setup();
    expect(container.firstChild).not.toHaveClass("z-50");
    fireEvent.click(startTrigger());
    expect(container.firstChild).toHaveClass("z-50");
  });
});

describe("TimeRangePicker - lists", () => {
  it("renders 24 hours and a 5-minute grid by default, in listboxes", () => {
    setup();
    fireEvent.click(startTrigger());
    expect(within(hours()).getAllByRole("option")).toHaveLength(24);
    expect(within(minutes()).getAllByRole("option")).toHaveLength(12);
    expect(hourOpt("00")).toBeInTheDocument();
    expect(hourOpt("23")).toBeInTheDocument();
  });

  it("honours minuteStep", () => {
    setup({ minuteStep: 15 });
    fireEvent.click(startTrigger());
    expect(within(minutes()).getAllByRole("option").map((o) => o.textContent)).toEqual(["00", "15", "30", "45"]);
  });

  it("marks the current value as selected with the brand style", () => {
    setup({ startTime: "09:30" });
    fireEvent.click(startTrigger());
    expect(hourOpt("09")).toHaveAttribute("aria-selected", "true");
    expect(hourOpt("09")).toHaveClass("bg-brand-primary", "text-white");
    expect(hourOpt("10")).toHaveAttribute("aria-selected", "false");
    expect(minuteOpt("30")).toHaveAttribute("aria-selected", "true");
  });

  it("lists and selects an off-step current minute (12:43)", () => {
    setup({ startTime: "12:43" });
    fireEvent.click(startTrigger());
    expect(minuteOpt("43")).toHaveAttribute("aria-selected", "true");
    expect(within(minutes()).getAllByRole("option")).toHaveLength(13);
  });

  it("shows am/pm hour labels with hour12", () => {
    setup({ hour12: true });
    fireEvent.click(startTrigger());
    expect(hourOpt("12 am")).toBeInTheDocument();
    expect(hourOpt("12 pm")).toBeInTheDocument();
    expect(hourOpt("3 pm")).toBeInTheDocument();
  });

  it("scrolls the selected option into view on open (centers it in the list)", () => {
    // jsdom has no layout: fake the geometry the centering reads.
    vi.spyOn(HTMLElement.prototype, "offsetTop", "get").mockImplementation(function (this: HTMLElement) {
      return this.getAttribute("role") === "option" ? 400 : 0;
    });
    vi.spyOn(HTMLElement.prototype, "clientHeight", "get").mockReturnValue(200);
    vi.spyOn(HTMLElement.prototype, "offsetHeight", "get").mockReturnValue(36);
    setup({ startTime: "09:30" });
    fireEvent.click(startTrigger());
    expect(hours().scrollTop).toBe(400 - (200 - 36) / 2);
  });

  it("gives each column one tabbable option (the selected one)", () => {
    setup({ startTime: "09:30" });
    fireEvent.click(startTrigger());
    const tabbable = (list: HTMLElement) => within(list).getAllByRole("option").filter((o) => o.getAttribute("tabindex") === "0");
    expect(tabbable(hours())).toEqual([hourOpt("09")]);
    expect(tabbable(minutes())).toEqual([minuteOpt("30")]);
  });

  it("uses the first option as tab stop when nothing is selected", () => {
    setup();
    fireEvent.click(startTrigger());
    expect(hourOpt("00")).toHaveAttribute("tabindex", "0");
  });
});

describe("TimeRangePicker - picking", () => {
  it("focuses the selected hour on open", () => {
    setup({ startTime: "14:15" });
    fireEvent.click(startTrigger());
    expect(hourOpt("14")).toHaveFocus();
  });

  it("an hour pick moves focus to the minutes without confirming; a minute pick confirms and closes", () => {
    const { onChange } = setup({ startTime: "08:00", endTime: "18:00" });
    fireEvent.click(startTrigger());
    fireEvent.click(hourOpt("09"));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(minuteOpt("00")).toHaveFocus(); // the current minute is kept and focused
    expect(hourOpt("09")).toHaveAttribute("aria-selected", "true");

    fireEvent.click(minuteOpt("30"));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith({ startTime: "09:30", endTime: "18:00" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(startTrigger()).toHaveFocus();
  });

  it("confirming the end keeps the start", () => {
    const { onChange } = setup({ startTime: "08:00", endTime: "18:00" });
    fireEvent.click(endTrigger());
    fireEvent.click(hourOpt("20"));
    fireEvent.click(minuteOpt("45"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "08:00", endTime: "20:45" });
    expect(endTrigger()).toHaveFocus();
  });

  it("opens the end popover automatically after confirming a start when the end is empty", () => {
    const { onChange } = setup();
    fireEvent.click(startTrigger());
    fireEvent.click(hourOpt("09"));
    fireEvent.click(minuteOpt("30"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "09:30", endTime: "" });
    expect(screen.getByRole("dialog", { name: "Seleccionar hora de fin" })).toBeInTheDocument();
    expect(endTrigger()).toHaveAttribute("aria-expanded", "true");
    expect(hourOpt("00")).toHaveFocus();
  });

  it("does not chain to the end when the end already has a value", () => {
    setup({ endTime: "18:00" });
    fireEvent.click(startTrigger());
    fireEvent.click(hourOpt("09"));
    fireEvent.click(minuteOpt("30"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("does not chain from the end", () => {
    setup({ startTime: "08:00" });
    fireEvent.click(endTrigger());
    fireEvent.click(hourOpt("10"));
    fireEvent.click(minuteOpt("00"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("a minute picked first does not confirm: it asks for the hour, then the minutes", () => {
    const { onChange } = setup();
    fireEvent.click(startTrigger());
    minuteOpt("30").focus(); // a real click focuses the option first
    fireEvent.click(minuteOpt("30"));
    expect(onChange).not.toHaveBeenCalled();
    expect(hourOpt("00")).toHaveFocus();
    fireEvent.click(hourOpt("09"));
    expect(onChange).not.toHaveBeenCalled();
    expect(minuteOpt("30")).toHaveFocus();
    fireEvent.click(minuteOpt("30"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "09:30", endTime: "" });
  });

  it("keeps an off-step minute when only the hour changes (12:43 -> 14:43)", () => {
    const { onChange } = setup({ startTime: "12:43", endTime: "18:00" });
    fireEvent.click(startTrigger());
    fireEvent.click(hourOpt("14"));
    expect(minuteOpt("43")).toHaveFocus();
    fireEvent.click(minuteOpt("43"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "14:43", endTime: "18:00" });
  });

  it("can pick midnight", () => {
    const { onChange } = setup({ endTime: "18:00" });
    fireEvent.click(startTrigger());
    fireEvent.click(hourOpt("00"));
    fireEvent.click(minuteOpt("00"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "00:00", endTime: "18:00" });
  });

  it("always reports 24 h values even with hour12", () => {
    const { onChange } = setup({ hour12: true, endTime: "23:00" });
    fireEvent.click(startTrigger());
    fireEvent.click(hourOpt("3 pm"));
    fireEvent.click(minuteOpt("30"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "15:30", endTime: "23:00" });
  });

  it("re-picking the same value still confirms (controlled: parent decides)", () => {
    const { onChange } = setup({ startTime: "09:30", endTime: "18:00" });
    fireEvent.click(startTrigger());
    fireEvent.click(hourOpt("09"));
    fireEvent.click(minuteOpt("30"));
    expect(onChange).toHaveBeenCalledWith({ startTime: "09:30", endTime: "18:00" });
  });
});

describe("TimeRangePicker - closing", () => {
  it("Escape discards the draft, closes and returns focus to the trigger", () => {
    const { onChange } = setup({ startTime: "08:00", endTime: "18:00" });
    fireEvent.click(endTrigger());
    fireEvent.click(hourOpt("20"));
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(endTrigger()).toHaveFocus();
    expect(endTrigger()).toHaveTextContent("18:00");
    // reopening starts from the committed value, not the discarded draft
    fireEvent.click(endTrigger());
    expect(hourOpt("18")).toHaveAttribute("aria-selected", "true");
    expect(hourOpt("20")).toHaveAttribute("aria-selected", "false");
  });

  it("closes on a click outside (discarding) but not on a click inside", () => {
    const { onChange } = setup({ startTime: "08:00", endTime: "18:00" });
    fireEvent.click(startTrigger());
    fireEvent.mouseDown(screen.getByRole("dialog"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.click(hourOpt("10"));
    fireEvent.mouseDown(document.body);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  });
});

describe("TimeRangePicker - keyboard", () => {
  const press = (key: string) => fireEvent.keyDown(document.activeElement as Element, { key });

  it("ArrowUp/ArrowDown move focus (without selecting) and clamp at the ends", () => {
    setup({ startTime: "09:00" });
    fireEvent.click(startTrigger());
    press("ArrowDown");
    expect(hourOpt("10")).toHaveFocus();
    expect(hourOpt("10")).toHaveAttribute("aria-selected", "false");
    press("ArrowUp");
    press("ArrowUp");
    expect(hourOpt("08")).toHaveFocus();
  });

  it("Home and End jump to the first and last option", () => {
    setup({ startTime: "09:00" });
    fireEvent.click(startTrigger());
    press("End");
    expect(hourOpt("23")).toHaveFocus();
    press("ArrowDown");
    expect(hourOpt("23")).toHaveFocus();
    press("Home");
    expect(hourOpt("00")).toHaveFocus();
    press("ArrowUp");
    expect(hourOpt("00")).toHaveFocus();
  });

  it("the roving tab stop follows the focused option", () => {
    setup({ startTime: "09:00" });
    fireEvent.click(startTrigger());
    press("ArrowDown");
    expect(hourOpt("10")).toHaveAttribute("tabindex", "0");
    expect(hourOpt("09")).toHaveAttribute("tabindex", "-1");
  });

  it("Enter/Space are the native button click: a full keyboard pick works", () => {
    const { onChange } = setup({ startTime: "09:00", endTime: "18:00" });
    fireEvent.click(startTrigger());
    press("ArrowDown");
    fireEvent.click(document.activeElement as Element); // Enter on hour 10
    expect(minuteOpt("00")).toHaveFocus();
    press("ArrowDown");
    fireEvent.click(document.activeElement as Element); // Enter on minute 05
    expect(onChange).toHaveBeenCalledWith({ startTime: "10:05", endTime: "18:00" });
  });

  it("ignores unrelated keys", () => {
    setup({ startTime: "09:00" });
    fireEvent.click(startTrigger());
    press("a");
    expect(hourOpt("09")).toHaveFocus();
  });
});

describe("TimeRangePicker - labels", () => {
  it("lets the caller override any subset of the strings", () => {
    setup({
      startTime: "15:00",
      hour12: true,
      labels: { hours: "Hours", minutes: "Minutes", startDialog: "Pick start", am: "AM", pm: "PM" },
    });
    expect(startTrigger()).toHaveTextContent("3:00 PM");
    fireEvent.click(startTrigger());
    expect(screen.getByRole("dialog", { name: "Pick start" })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: "Hours" })).toBeInTheDocument();
    expect(screen.getByRole("listbox", { name: "Minutes" })).toBeInTheDocument();
    expect(within(screen.getByRole("listbox", { name: "Hours" })).getByRole("option", { name: "3 PM" })).toBeInTheDocument();
    fireEvent.click(endTrigger());
    expect(screen.getByRole("dialog", { name: "Seleccionar hora de fin" })).toBeInTheDocument(); // not overridden -> default
  });
});
