import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders its content", () => {
    render(<Badge>+0.7%</Badge>);
    expect(screen.getByText("+0.7%")).toBeInTheDocument();
  });

  it("uses the 'neutral' tone by default", () => {
    render(<Badge>N</Badge>);
    expect(screen.getByText("N")).toHaveClass("bg-surface-muted", "text-text-secondary");
  });

  it("applies the 'success' tone classes", () => {
    render(<Badge tone="success">+0.3%</Badge>);
    expect(screen.getByText("+0.3%")).toHaveClass("bg-success-bg", "text-success-dark");
  });

  it("applies the 'danger' tone classes", () => {
    render(<Badge tone="danger">-800L</Badge>);
    expect(screen.getByText("-800L")).toHaveClass("bg-danger-bg", "text-danger-dark");
  });
});
