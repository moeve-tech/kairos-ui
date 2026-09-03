import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Card } from "./Card";

describe("Card", () => {
  it("has padding (p-6) by default", () => {
    render(<Card>contenido</Card>);
    expect(screen.getByText("contenido")).toHaveClass("p-6");
  });

  it("removes padding with noPadding", () => {
    render(<Card noPadding>contenido</Card>);
    expect(screen.getByText("contenido")).not.toHaveClass("p-6");
  });

  it("passes through normal HTML attributes (Single Responsibility: just the box, everything else via native props)", () => {
    render(<Card data-testid="mi-card">contenido</Card>);
    expect(screen.getByTestId("mi-card")).toBeInTheDocument();
  });
});
