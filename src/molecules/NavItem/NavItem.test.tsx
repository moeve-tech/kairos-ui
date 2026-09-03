import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
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
});
