import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { PriceRangeSlider } from "./PriceRangeSlider";

const fmt = (v: number) => `$${v.toFixed(2)}`;

// value is deliberately kept different from currentPrice/recommendedPrice: the
// component also renders currencyFormatter(value) in the floating tooltip,
// so if two props share a number the text is duplicated in the DOM and
// screen.getByText blows up with "multiple elements found".
describe("PriceRangeSlider", () => {
  it("shows the current and recommended price, formatted with currencyFormatter", () => {
    render(
      <PriceRangeSlider
        min={22.19}
        max={25.19}
        value={24.1}
        onChange={() => {}}
        currentPrice={23.69}
        recommendedPrice={23.89}
        currencyFormatter={fmt}
      />,
    );
    expect(screen.getByText("$23.69")).toBeInTheDocument();
    expect(screen.getByText("$23.89")).toBeInTheDocument();
  });

  it("is a fully controlled control: moving the input calls onChange with the number, it doesn't change on its own", () => {
    const onChange = vi.fn();
    render(
      <PriceRangeSlider
        min={22.19}
        max={25.19}
        value={24.1}
        onChange={onChange}
        currentPrice={23.69}
        recommendedPrice={23.89}
        currencyFormatter={fmt}
      />,
    );
    const input = screen.getByLabelText("Precio a evaluar");
    fireEvent.change(input, { target: { value: "24.50" } });
    expect(onChange).toHaveBeenCalledWith(24.5);
  });

  it("shows the min/max endpoints formatted", () => {
    render(
      <PriceRangeSlider
        min={22.19}
        max={25.19}
        value={24.1}
        onChange={() => {}}
        currentPrice={23.69}
        recommendedPrice={23.89}
        currencyFormatter={fmt}
      />,
    );
    expect(screen.getByText("$22.19")).toBeInTheDocument();
    expect(screen.getByText("$25.19")).toBeInTheDocument();
  });
});
