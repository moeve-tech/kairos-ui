import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Sidebar } from "./Sidebar";

const STATIONS = [
  { id: "EST-001", label: "Monterrey - Estación Central" },
  { id: "EST-002", label: "Guadalajara - Estación Central" },
];

const NAV_ITEMS = [{ key: "pricing", label: "Pricing", icon: <span>ico</span>, active: true }];

describe("Sidebar", () => {
  it("has no hardcoded data at all: renders exactly what's passed via props", () => {
    render(
      <Sidebar
        stations={STATIONS}
        selectedStationId="EST-001"
        onSelectStation={() => {}}
        navItems={NAV_ITEMS}
        user={{ name: "Admin User", role: "Supervisor" }}
      />,
    );
    expect(screen.getByText("Redinamic")).toBeInTheDocument(); // brandName default
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Admin User")).toBeInTheDocument();
    expect(screen.getByText("Supervisor")).toBeInTheDocument();
  });

  it("allows changing the brand name via props (multiple users/future projects)", () => {
    render(
      <Sidebar
        brandName="Redinamic"
        stations={STATIONS}
        selectedStationId="EST-001"
        onSelectStation={() => {}}
        navItems={NAV_ITEMS}
        user={{ name: "Admin User", role: "Supervisor" }}
      />,
    );
    expect(screen.getByText("Redinamic")).toBeInTheDocument();
  });

  it("when choosing another station in the <select>, calls onSelectStation with its id", () => {
    const onSelectStation = vi.fn();
    render(
      <Sidebar
        stations={STATIONS}
        selectedStationId="EST-001"
        onSelectStation={onSelectStation}
        navItems={NAV_ITEMS}
        user={{ name: "Admin User", role: "Supervisor" }}
      />,
    );
    fireEvent.change(screen.getByDisplayValue("Monterrey - Estación Central"), {
      target: { value: "EST-002" },
    });
    expect(onSelectStation).toHaveBeenCalledWith("EST-002");
  });

  it("the Cerrar Sesión button calls onLogout", () => {
    const onLogout = vi.fn();
    render(
      <Sidebar
        stations={STATIONS}
        selectedStationId="EST-001"
        onSelectStation={() => {}}
        navItems={NAV_ITEMS}
        user={{ name: "Admin User", role: "Supervisor" }}
        onLogout={onLogout}
      />,
    );
    fireEvent.click(screen.getByText("Cerrar Sesión"));
    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it("renders the logo chip by default and omits it with showLogoMark={false}", () => {
    const { container, rerender } = render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Cliente", role: "Anunciante" }} />);
    expect(container.querySelectorAll(".bg-brand-logo").length).toBe(1);
    rerender(<Sidebar showLogoMark={false} navItems={[{ key: "pricing", label: "Pricing", icon: <span>ico</span> }]} user={{ name: "Cliente", role: "Anunciante" }} />);
    expect(container.querySelectorAll(".bg-brand-logo").length).toBe(0);
  });

  it("omits the station selector entirely when stations is not passed (e.g. a consumer with no station concept)", () => {
    render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Cliente", role: "Anunciante" }} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });

  it("also omits it when stations is explicitly an empty array", () => {
    render(<Sidebar stations={[]} navItems={NAV_ITEMS} user={{ name: "Cliente", role: "Anunciante" }} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
