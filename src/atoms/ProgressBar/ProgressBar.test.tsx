import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ProgressBar } from "./ProgressBar";

describe("ProgressBar", () => {
  it("draws a single bar filled up to 'value'%", () => {
    const { container } = render(<ProgressBar value={42} />);
    // ":scope" anchors the combinator to `container` itself - plain "div > div"
    // also matches the outer track div, because RTL's `container` is itself a
    // <div>, so it (wrongly) counts as a "div" parent too.
    const fill = container.querySelector<HTMLDivElement>(":scope > div > div");
    expect(fill).not.toBeNull();
    expect(fill?.style.width).toBe("42%");
  });

  it("clamps values outside of 0-100", () => {
    const { container } = render(<ProgressBar value={150} />);
    // ":scope" anchors the combinator to `container` itself - plain "div > div"
    // also matches the outer track div, because RTL's `container` is itself a
    // <div>, so it (wrongly) counts as a "div" parent too.
    const fill = container.querySelector<HTMLDivElement>(":scope > div > div");
    expect(fill?.style.width).toBe("100%");
  });

  it("with segments>1 draws that many segments, marking as 'dimmed' the ones that don't reach value", () => {
    // segments=3 -> breakpoints at 0%, 33.3%, 66.7%. With value=50, the first
    // 2 segments are "lit" (0% and 33.3% < 50) and the third one isn't.
    const { container } = render(<ProgressBar value={50} segments={3} fillClassName="bg-info" />);
    const segments = container.querySelectorAll(".flex-1");
    expect(segments).toHaveLength(3);
    const dimmed = container.querySelectorAll(".opacity-20");
    expect(dimmed).toHaveLength(1);
  });
});
