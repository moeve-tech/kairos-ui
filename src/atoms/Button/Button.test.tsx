import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its text and fires onClick on click", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Aplicar precio</Button>);
    fireEvent.click(screen.getByText("Aplicar precio"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not fire onClick when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Aplicar este precio
      </Button>,
    );
    fireEvent.click(screen.getByText("Aplicar este precio"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("the 'text' variant does not have the pill shape (rounded-full)", () => {
    render(<Button variant="text">Restablecer a Actual</Button>);
    expect(screen.getByText("Restablecer a Actual")).not.toHaveClass("rounded-full");
  });

  it("the 'primary' variant (default) does have rounded-full", () => {
    render(<Button>Actualizar datos</Button>);
    expect(screen.getByText("Actualizar datos")).toHaveClass("rounded-full");
  });
});
