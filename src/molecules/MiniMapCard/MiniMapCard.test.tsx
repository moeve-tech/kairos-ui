import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MiniMapCard } from "./MiniMapCard";

describe("MiniMapCard", () => {
  it("renders the overlay title", () => {
    render(<MiniMapCard overlayTitle="COMPETIDORES DIRECTOS" overlayLinkLabel="Basado en 3 competidores clave" competitorCount={3} />);
    expect(screen.getByText("COMPETIDORES DIRECTOS")).toBeInTheDocument();
  });

  it("doesn't duplicate the count in the visible text - overlayLinkLabel already includes it", () => {
    // Regression: an earlier version printed "{overlayLinkLabel} ({competitorCount})",
    // which showed "Basado en 3 competidores clave (3)" when the caller
    // already included the number in the label. Now the visible text is exactly
    // overlayLinkLabel, and competitorCount is only used in the aria-label.
    render(<MiniMapCard overlayTitle="COMPETIDORES DIRECTOS" overlayLinkLabel="Basado en 3 competidores clave" competitorCount={3} />);
    expect(screen.getByText("Basado en 3 competidores clave")).toBeInTheDocument();
    expect(screen.queryByText("Basado en 3 competidores clave (3)")).not.toBeInTheDocument();
  });
});
