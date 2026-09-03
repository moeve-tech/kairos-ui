import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Snackbar } from "./Snackbar";

describe("Snackbar", () => {
  it("renders the message", () => {
    render(<Snackbar message="Datos de mercado actualizados correctamente" />);
    expect(screen.getByText("Datos de mercado actualizados correctamente")).toBeInTheDocument();
  });

  it("uses the success background by default", () => {
    render(<Snackbar message="OK" />);
    expect(screen.getByRole("status")).toHaveClass("bg-success");
  });

  it("uses the danger background for tone='danger'", () => {
    render(<Snackbar message="Error" tone="danger" />);
    expect(screen.getByRole("status")).toHaveClass("bg-danger");
  });

  it("tone='neutral' renders no leading icon (only the close button's icon remains)", () => {
    const { container } = render(<Snackbar message="Aviso" tone="neutral" />);
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });

  it("clicking the close button calls onClose", () => {
    const onClose = vi.fn();
    render(<Snackbar message="OK" onClose={onClose} />);
    fireEvent.click(screen.getByRole("button", { name: "Cerrar" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
