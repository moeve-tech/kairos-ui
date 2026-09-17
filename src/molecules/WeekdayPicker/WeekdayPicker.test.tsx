import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { WeekdayPicker } from "./WeekdayPicker";

const LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

describe("WeekdayPicker", () => {
  it("renders one button per label", () => {
    render(<WeekdayPicker labels={LABELS} selected={[]} onToggle={() => {}} />);
    expect(screen.getAllByRole("button")).toHaveLength(7);
  });

  it("marks selected days as pressed with the active style", () => {
    render(<WeekdayPicker labels={LABELS} selected={[1, 3]} onToggle={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(buttons[1]).toHaveAttribute("aria-pressed", "true");
    expect(buttons[1]).toHaveClass("bg-brand-primary");
    expect(buttons[0]).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onToggle with the day index when clicked", () => {
    const onToggle = vi.fn();
    render(<WeekdayPicker labels={LABELS} selected={[]} onToggle={onToggle} />);
    fireEvent.click(screen.getByRole("button", { name: "Jue" }));
    expect(onToggle).toHaveBeenCalledWith(3);
  });
});
