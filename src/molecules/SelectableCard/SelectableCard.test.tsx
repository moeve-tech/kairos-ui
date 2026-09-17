import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectableCard } from "./SelectableCard";

describe("SelectableCard", () => {
  it("renders the title and optional subtitle", () => {
    render(<SelectableCard title="Estación Norte" subtitle="Monterrey, NL" onClick={() => {}} />);
    expect(screen.getByText("Estación Norte")).toBeInTheDocument();
    expect(screen.getByText("Monterrey, NL")).toBeInTheDocument();
  });

  it("fires onClick when clicked", () => {
    const onClick = vi.fn();
    render(<SelectableCard title="Estación Norte" onClick={onClick} />);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("marks aria-pressed and the selected style when selected", () => {
    render(<SelectableCard title="Estación Norte" selected onClick={() => {}} />);
    const button = screen.getByRole("button");
    expect(button).toHaveAttribute("aria-pressed", "true");
    expect(button).toHaveClass("border-brand-primary");
  });

  it("is not selected by default", () => {
    render(<SelectableCard title="Estación Norte" onClick={() => {}} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });
});
