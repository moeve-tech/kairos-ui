import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConfirmDialog } from "./ConfirmDialog";

// The confirm button ALWAYS says "Confirmar y aplicar" (fixed component
// text when confirming=false) - a test `title` different from that text is
// used on purpose to avoid colliding with it in the queries.
const BASE_PROPS = {
  onClose: () => {},
  onConfirm: () => {},
  title: "Aplicar precio recomendado",
  productLabel: "Regular",
  description: "Vas a actualizar el precio vigente.",
  currentPrice: "$23.69",
  newPrice: "$23.89",
  marginImpactLabel: "+$120.00",
  volumeImpactLabel: "+250L",
};

describe("ConfirmDialog", () => {
  it("with open=false renders nothing (fully controlled by the parent)", () => {
    const { container } = render(<ConfirmDialog {...BASE_PROPS} open={false} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("with open=true shows title, prices and impacts", () => {
    render(<ConfirmDialog {...BASE_PROPS} open />);
    expect(screen.getByText("Aplicar precio recomendado")).toBeInTheDocument();
    expect(screen.getByText("$23.69")).toBeInTheDocument();
    expect(screen.getByText("$23.89")).toBeInTheDocument();
    expect(screen.getByText("+$120.00")).toBeInTheDocument();
    expect(screen.getByText("+250L")).toBeInTheDocument();
  });

  it("'Cancelar' calls onClose, 'Confirmar y aplicar' calls onConfirm", () => {
    const onClose = vi.fn();
    const onConfirm = vi.fn();
    render(<ConfirmDialog {...BASE_PROPS} open onClose={onClose} onConfirm={onConfirm} />);

    fireEvent.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: "Confirmar y aplicar" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it("with confirming=true, the confirm button becomes disabled and its text changes", () => {
    render(<ConfirmDialog {...BASE_PROPS} open confirming />);
    expect(screen.getByRole("button", { name: "Aplicando..." })).toBeDisabled();
  });
});
