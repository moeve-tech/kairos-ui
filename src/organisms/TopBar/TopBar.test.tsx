import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("renders the station name and the last-updated label", () => {
    render(<TopBar stationName="CDMX - Estación Central" lastUpdatedLabel="Última actualización: hoy, 14:32" />);
    expect(screen.getByText("CDMX - Estación Central")).toBeInTheDocument();
    expect(screen.getByText("Última actualización: hoy, 14:32")).toBeInTheDocument();
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

  it("with icon omitted, renders the default map pin icon", () => {
    render(<TopBar stationName="X" lastUpdatedLabel="Y" />);
    const stationRow = screen.getByText("X").parentElement;
    expect(stationRow?.querySelector("svg")).toBeInTheDocument();
  });

  it("with icon=null, renders no icon", () => {
    render(<TopBar stationName="X" lastUpdatedLabel="Y" icon={null} />);
    const stationRow = screen.getByText("X").parentElement;
    expect(stationRow?.querySelector("svg")).not.toBeInTheDocument();
  });

  it("with a custom icon, renders it instead of the map pin", () => {
    render(
      <TopBar
        stationName="X"
        lastUpdatedLabel="Y"
        icon={<span data-testid="custom-icon">★</span>}
      />,
    );
    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
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
});
