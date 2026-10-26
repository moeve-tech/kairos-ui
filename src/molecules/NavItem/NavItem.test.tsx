import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NavItem } from "./NavItem";

describe("NavItem", () => {
  it("renders the label as a link, with the given href", () => {
    render(<NavItem icon={<span>ico</span>} label="Pricing" href="/simulador" />);
    const link = screen.getByRole("link", { name: /Pricing/ });
    expect(link).toHaveAttribute("href", "/simulador");
  });

  it("uses href='#' by default", () => {
    render(<NavItem icon={<span>ico</span>} label="Pricing" />);
    expect(screen.getByRole("link")).toHaveAttribute("href", "#");
  });

  it("when active=true uses the accent background instead of the dim text", () => {
    render(<NavItem icon={<span>ico</span>} label="Pricing" active />);
    const link = screen.getByRole("link");
    expect(link).toHaveClass("bg-brand-accent");
    expect(link).not.toHaveClass("text-white/70");
  });

  it("when active=false (default) uses the dim text", () => {
    render(<NavItem icon={<span>ico</span>} label="Pricing" />);
    expect(screen.getByRole("link")).toHaveClass("text-white/70");
  });

  it("calls onClick when provided (e.g. to close a mobile nav drawer on navigate)", () => {
    const onClick = vi.fn();
    render(<NavItem icon={<span>ico</span>} label="Pricing" onClick={onClick} />);
    fireEvent.click(screen.getByRole("link"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renders fine with no onClick at all (it's optional)", () => {
    render(<NavItem icon={<span>ico</span>} label="Pricing" />);
    expect(() => fireEvent.click(screen.getByRole("link"))).not.toThrow();
  });
});
