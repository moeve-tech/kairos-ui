import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SegmentedTabs } from "./SegmentedTabs";

const OPTIONS = [
  { value: "MAGNA", label: "Regular" },
  { value: "PREMIUM", label: "Premium" },
  { value: "DIESEL", label: "Diesel" },
];

describe("SegmentedTabs", () => {
  it("renders one tab per option, with role='tab'", () => {
    render(<SegmentedTabs options={OPTIONS} value="MAGNA" onChange={() => {}} />);
    expect(screen.getAllByRole("tab")).toHaveLength(3);
  });

  it("marks aria-selected on the active tab, and not on the others", () => {
    render(<SegmentedTabs options={OPTIONS} value="PREMIUM" onChange={() => {}} />);
    expect(screen.getByText("Premium")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Regular")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByText("Diesel")).toHaveAttribute("aria-selected", "false");
  });

  it("calls onChange with the value of the clicked option, not the active one", () => {
    const onChange = vi.fn();
    render(<SegmentedTabs options={OPTIONS} value="MAGNA" onChange={onChange} />);
    fireEvent.click(screen.getByText("Diesel"));
    expect(onChange).toHaveBeenCalledWith("DIESEL");
  });
});
