import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo } from "./Logo";

describe("Logo", () => {
  it("renders accent and text as separate spans", () => {
    render(<Logo accent="RED" text="DISPLAY" />);
    expect(screen.getByText("RED")).toBeInTheDocument();
    expect(screen.getByText("DISPLAY")).toBeInTheDocument();
  });

  it("colors the accent segment with the brand token by default", () => {
    render(<Logo accent="RED" text="DISPLAY" />);
    expect(screen.getByText("RED")).toHaveClass("text-brand-primary");
  });

  it("renders only `text` when accent is omitted", () => {
    render(<Logo text="FLUXER" />);
    expect(screen.getByText("FLUXER")).toBeInTheDocument();
    expect(screen.queryByText("RED")).not.toBeInTheDocument();
  });

  it("lets the caller override text color (e.g. for a dark background)", () => {
    render(<Logo accent="RED" text="DISPLAY" textClassName="text-white" />);
    expect(screen.getByText("DISPLAY")).toHaveClass("text-white");
  });
});
