import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FileDropzone } from "./FileDropzone";

function makeFile(name: string) {
  return new File(["contenido"], name, { type: "video/mp4" });
}

describe("FileDropzone", () => {
  it("renders the default label when nothing is selected", () => {
    render(<FileDropzone onFileSelected={() => {}} />);
    expect(screen.getByText(/Arrastra tu archivo/)).toBeInTheDocument();
  });

  it("renders the selected file name instead of the label", () => {
    render(<FileDropzone onFileSelected={() => {}} selectedFileName="spot.mp4" />);
    expect(screen.getByText("spot.mp4")).toBeInTheDocument();
    expect(screen.queryByText(/Arrastra tu archivo/)).not.toBeInTheDocument();
  });

  it("calls onFileSelected with the file chosen via the native input", () => {
    const onFileSelected = vi.fn();
    const { container } = render(<FileDropzone onFileSelected={onFileSelected} />);
    const input = container.querySelector("input[type=file]") as HTMLInputElement;
    const file = makeFile("spot.mp4");
    fireEvent.change(input, { target: { files: [file] } });
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("calls onFileSelected with the dropped file", () => {
    const onFileSelected = vi.fn();
    render(<FileDropzone onFileSelected={onFileSelected} />);
    const file = makeFile("spot.mp4");
    fireEvent.drop(screen.getByRole("button"), { dataTransfer: { files: [file] } });
    expect(onFileSelected).toHaveBeenCalledWith(file);
  });

  it("opens the native picker when clicked", () => {
    render(<FileDropzone onFileSelected={() => {}} />);
    const input = screen.getByRole("button").querySelector("input") as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    fireEvent.click(screen.getByRole("button"));
    expect(clickSpy).toHaveBeenCalled();
  });
});
