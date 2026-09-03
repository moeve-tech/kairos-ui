import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatTile } from "./StatTile";

describe("StatTile", () => {
  it("always renders label and value", () => {
    render(<StatTile icon={<span>ico</span>} label="MARGEN BRUTO PROY." value="15.0%" />);
    expect(screen.getByText("MARGEN BRUTO PROY.")).toBeInTheDocument();
    expect(screen.getByText("15.0%")).toBeInTheDocument();
  });

  it("only shows the delta badge when 'delta' is passed", () => {
    const { rerender } = render(<StatTile icon={<span>ico</span>} label="VOLUMEN" value="14.2k" />);
    expect(screen.queryByText("-800L")).not.toBeInTheDocument();

    rerender(<StatTile icon={<span>ico</span>} label="VOLUMEN" value="14.2k" delta="-800L" />);
    expect(screen.getByText("-800L")).toBeInTheDocument();
  });

  it("only draws the progress bar when 'progressValue' is passed (0 counts as defined)", () => {
    const { container, rerender } = render(<StatTile icon={<span>ico</span>} label="X" value="1" />);
    expect(container.querySelector(".rounded-full.bg-border")).not.toBeInTheDocument();

    rerender(<StatTile icon={<span>ico</span>} label="X" value="1" progressValue={0} />);
    expect(container.querySelector(".rounded-full.bg-border")).toBeInTheDocument();
  });
});
