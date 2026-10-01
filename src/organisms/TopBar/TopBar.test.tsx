import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("renders the last-updated label but no visible stationName text", () => {
    render(<TopBar stationName="CDMX - Estación Central" lastUpdatedLabel="Última actualización: hoy, 14:32" />);
    expect(screen.getByText("Última actualización: hoy, 14:32")).toBeInTheDocument();
    expect(screen.queryByText("CDMX - Estación Central")).not.toBeInTheDocument();
  });

  it("exposes stationName as the header's accessible name (aria-label)", () => {
    render(<TopBar stationName="CDMX - Estación Central" lastUpdatedLabel="Y" />);
    expect(screen.getByRole("banner", { name: "CDMX - Estación Central" })).toBeInTheDocument();
  });

  it("does not render an Avatar/identity element", () => {
    const { container } = render(<TopBar stationName="X" lastUpdatedLabel="Y" />);
    // Avatar renders a rounded-full circle distinct from the status dot (size-8/size-10 vs size-2).
    expect(container.querySelector(".size-8, .size-10")).not.toBeInTheDocument();
  });

  it("with onRefresh omitted, the 'Actualizar datos' button is not rendered", () => {
    render(<TopBar stationName="X" lastUpdatedLabel="Y" />);
    expect(screen.queryByText("Actualizar datos")).not.toBeInTheDocument();
  });

  it("with onRefresh provided, the 'Actualizar datos' button is rendered and calls it on click", () => {
    const onRefresh = vi.fn();
    render(<TopBar stationName="X" lastUpdatedLabel="Y" onRefresh={onRefresh} />);
    fireEvent.click(screen.getByText("Actualizar datos"));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("with onRefresh provided and refreshing=true, the button is rendered but disabled", () => {
    const onRefresh = vi.fn();
    render(<TopBar stationName="X" lastUpdatedLabel="Y" onRefresh={onRefresh} refreshing />);
    expect(screen.getByText("Actualizar datos").closest("button")).toBeDisabled();
  });

  it("with statusTone omitted, the status dot is success (green)", () => {
    const { container } = render(<TopBar stationName="X" lastUpdatedLabel="Y" />);
    const dot = container.querySelector("span.rounded-full.size-2");
    expect(dot).toHaveClass("bg-success-dark");
  });

  it("with statusTone='neutral', the status dot uses the neutral token", () => {
    const { container } = render(<TopBar stationName="X" lastUpdatedLabel="Y" statusTone="neutral" />);
    const dot = container.querySelector("span.rounded-full.size-2");
    expect(dot).toHaveClass("bg-text-tertiary");
    expect(dot).not.toHaveClass("bg-success-dark");
  });

  it("with lastUpdatedLabel omitted, renders no status dot/label", () => {
    const { container } = render(<TopBar stationName="X" />);
    expect(container.querySelector("span.rounded-full.size-2")).not.toBeInTheDocument();
  });

  it("renders middleContent alongside the status block and refresh button", () => {
    const onRefresh = vi.fn();
    render(
      <TopBar
        stationName="X"
        lastUpdatedLabel="Y"
        onRefresh={onRefresh}
        middleContent={<span data-testid="middle">tabs</span>}
      />,
    );
    expect(screen.getByTestId("middle")).toBeInTheDocument();
    expect(screen.getByText("Actualizar datos")).toBeInTheDocument();
  });

  it("the header is 56px tall (h-14)", () => {
    const { container } = render(<TopBar stationName="X" />);
    expect(container.querySelector("header")).toHaveClass("h-14");
  });
});
