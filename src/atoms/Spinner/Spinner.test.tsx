import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Spinner } from "./Spinner";

describe("Spinner", () => {
  it("renders a status region", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("exposes the default 'Cargando' label for screen readers", () => {
    render(<Spinner />);
    expect(screen.getByText("Cargando")).toHaveClass("sr-only");
  });

  it("uses a custom label when provided", () => {
    render(<Spinner label="Guardando cambios" />);
    expect(screen.getByText("Guardando cambios")).toHaveClass("sr-only");
    expect(screen.queryByText("Cargando")).not.toBeInTheDocument();
  });

  it("hides the visual ring from assistive tech", () => {
    const { container } = render(<Spinner />);
    const ring = container.querySelector("[aria-hidden='true']");
    expect(ring).not.toBeNull();
    expect(ring).toHaveClass("animate-spin", "motion-reduce:animate-none");
  });

  it("applies the passed-through className to the wrapper", () => {
    render(<Spinner className="my-custom-class" />);
    expect(screen.getByRole("status")).toHaveClass("my-custom-class");
  });
});
