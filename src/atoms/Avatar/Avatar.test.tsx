import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("renders its children (letter or icon) inside the circle", () => {
    render(<Avatar>O</Avatar>);
    expect(screen.getByText("O")).toBeInTheDocument();
  });

  it("uses size 'md' by default (size-10)", () => {
    render(<Avatar>P</Avatar>);
    expect(screen.getByText("P")).toHaveClass("size-10");
  });

  it("changes size with size='sm' (size-8)", () => {
    render(<Avatar size="sm">S</Avatar>);
    expect(screen.getByText("S")).toHaveClass("size-8");
  });

  it("does not decide the color - applies it as-is from className", () => {
    render(<Avatar className="bg-danger-bg text-danger-dark">G</Avatar>);
    const el = screen.getByText("G");
    expect(el).toHaveClass("bg-danger-bg");
    expect(el).toHaveClass("text-danger-dark");
  });
});
