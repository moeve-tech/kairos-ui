import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TopBar } from "./TopBar";

describe("TopBar", () => {
  it("renders the station name and the last-updated label", () => {
    render(<TopBar stationName="CDMX - Estación Central" lastUpdatedLabel="Última actualización: hoy, 14:32" />);
    expect(screen.getByText("CDMX - Estación Central")).toBeInTheDocument();
    expect(screen.getByText("Última actualización: hoy, 14:32")).toBeInTheDocument();
  });

  it("the 'Actualizar datos' button calls onRefresh", () => {
    const onRefresh = vi.fn();
    render(<TopBar stationName="X" lastUpdatedLabel="Y" onRefresh={onRefresh} />);
    fireEvent.click(screen.getByText("Actualizar datos"));
    expect(onRefresh).toHaveBeenCalledTimes(1);
  });

  it("with refreshing=true, the button becomes disabled", () => {
    render(<TopBar stationName="X" lastUpdatedLabel="Y" refreshing />);
    expect(screen.getByText("Actualizar datos").closest("button")).toBeDisabled();
  });
});
