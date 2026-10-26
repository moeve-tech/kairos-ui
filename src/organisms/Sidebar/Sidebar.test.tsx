import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
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

  it("a long user.name gets truncate + a native title tooltip instead of overflowing the 260px panel", () => {
    const longName = "cesar.longaddress.advertiser.department@redinamicadvertising.example.com";
    render(<Sidebar navItems={NAV_ITEMS} user={{ name: longName, role: "Anunciante" }} />);
    const nameEl = screen.getByText(longName);
    expect(nameEl).toHaveClass("truncate");
    expect(nameEl).toHaveAttribute("title", longName);
  });

  it("a long user.role also gets truncate + title, same as user.name", () => {
    const longRole = "Supervisor Regional de Operaciones y Mantenimiento de Estaciones";
    render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Admin", role: longRole }} />);
    const roleEl = screen.getByText(longRole);
    expect(roleEl).toHaveClass("truncate");
    expect(roleEl).toHaveAttribute("title", longRole);
  });

  it("the name/role container has min-w-0 so flex doesn't let it push past the Avatar", () => {
    const { container } = render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Admin", role: "Supervisor" }} />);
    const nameEl = screen.getByText("Admin");
    expect(nameEl.parentElement).toHaveClass("min-w-0");
  });

  describe("mobile drawer", () => {
    it("starts closed: no close button and no backdrop in the document", () => {
      render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Admin", role: "Supervisor" }} />);
      expect(screen.queryByLabelText("Cerrar menú")).not.toBeInTheDocument();
      expect(screen.queryByTestId("sidebar-mobile-backdrop")).not.toBeInTheDocument();
    });

    it("clicking the hamburger button opens the drawer (backdrop + close button appear)", () => {
      render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Admin", role: "Supervisor" }} />);
      fireEvent.click(screen.getByLabelText("Abrir menú"));
      expect(screen.getByTestId("sidebar-mobile-backdrop")).toBeInTheDocument();
      expect(screen.getByLabelText("Cerrar menú")).toBeInTheDocument();
    });

    it("clicking the backdrop closes the drawer", () => {
      render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Admin", role: "Supervisor" }} />);
      fireEvent.click(screen.getByLabelText("Abrir menú"));
      fireEvent.click(screen.getByTestId("sidebar-mobile-backdrop"));
      expect(screen.queryByTestId("sidebar-mobile-backdrop")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Cerrar menú")).not.toBeInTheDocument();
    });

    it("clicking the X button closes the drawer", () => {
      render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Admin", role: "Supervisor" }} />);
      fireEvent.click(screen.getByLabelText("Abrir menú"));
      fireEvent.click(screen.getByLabelText("Cerrar menú"));
      expect(screen.queryByTestId("sidebar-mobile-backdrop")).not.toBeInTheDocument();
      expect(screen.queryByLabelText("Cerrar menú")).not.toBeInTheDocument();
    });

    it("clicking a nav item inside the open drawer closes it (navigate-away collapses the menu)", () => {
      render(<Sidebar navItems={NAV_ITEMS} user={{ name: "Admin", role: "Supervisor" }} />);
      fireEvent.click(screen.getByLabelText("Abrir menú"));
      const drawer = screen.getByTestId("sidebar-mobile-backdrop").parentElement as HTMLElement;
      fireEvent.click(within(drawer).getByText("Pricing"));
      expect(screen.queryByTestId("sidebar-mobile-backdrop")).not.toBeInTheDocument();
    });
  });
});
