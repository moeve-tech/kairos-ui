import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DecisionFactorRow } from "./DecisionFactorRow";

describe("DecisionFactorRow", () => {
  it("renders label, statusText and description", () => {
    render(
      <DecisionFactorRow
        label="Elasticidad Demanda"
        statusText="Alta"
        value={38.4}
        description="Sensibilidad del volumen a cambios de precio."
      />,
    );
    expect(screen.getByText("Elasticidad Demanda")).toBeInTheDocument();
    expect(screen.getByText("Alta")).toBeInTheDocument();
    expect(screen.getByText("Sensibilidad del volumen a cambios de precio.")).toBeInTheDocument();
  });

  it("applies statusClassName to statusText when passed", () => {
    render(
      <DecisionFactorRow
        label="Inventario Actual"
        statusText="12%"
        statusClassName="text-danger"
        value={65}
        description="Nivel bajo."
      />,
    );
    expect(screen.getByText("12%")).toHaveClass("text-danger");
  });
});
