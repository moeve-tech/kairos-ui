import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompetitorRow } from "./CompetitorRow";

const BASE_PROPS = {
  name: "Oxxo Gas - Suc. Madero",
  avatarLetter: "O",
  avatarBgClassName: "bg-danger-bg",
  avatarTextClassName: "text-danger-dark",
  distanceKm: 0.8,
  price: "$23.55",
};

describe("CompetitorRow", () => {
  it("renders name, distance and price", () => {
    render(<CompetitorRow {...BASE_PROPS} trend="down" trendLabel="Hace 2h" />);
    expect(screen.getByText("Oxxo Gas - Suc. Madero")).toBeInTheDocument();
    expect(screen.getByText("0.8 km")).toBeInTheDocument();
    expect(screen.getByText("$23.55")).toBeInTheDocument();
    expect(screen.getByText("Hace 2h")).toBeInTheDocument();
  });

  it("uses the success color for trend='up' (see TREND_TEXT_CLASS in CompetitorRow.tsx)", () => {
    render(<CompetitorRow {...BASE_PROPS} trend="up" trendLabel="Hace 5h" />);
    // The color class lives on the wrapping <div>, not on the <span> that
    // holds the text itself.
    expect(screen.getByText("Hace 5h").closest("div")).toHaveClass("text-success-dark");
  });

  it("uses the danger color for trend='down'", () => {
    render(<CompetitorRow {...BASE_PROPS} trend="down" trendLabel="Hace 2h" />);
    // Same as above: the color class is on the parent <div>, not the <span>.
    expect(screen.getByText("Hace 2h").closest("div")).toHaveClass("text-danger");
  });

  it("trend='stable' doesn't render an arrow icon", () => {
    const { container } = render(
      <CompetitorRow {...BASE_PROPS} trend="stable" trendLabel="Sin cambios (24h)" />,
    );
    // Only the MapPin icon (always present) should remain - no ArrowUp/ArrowDown.
    expect(container.querySelectorAll("svg")).toHaveLength(1);
  });
});
