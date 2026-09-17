import { useRef, useState, type DragEvent, type KeyboardEvent } from "react";
import { UploadIcon } from "../../icons";

export interface FileDropzoneProps {
  accept?: string;
  onFileSelected: (file: File | null) => void;
  /** Name of the currently-selected file, if any - the caller owns the File itself, this component is stateless about it. */
  selectedFileName?: string | null;
  label?: string;
  hint?: string;
  className?: string;
}

/**
 * Restyled file picker: a dashed dropzone (click or drag-and-drop) instead
 * of a bare `<input type="file">`. The native input still does the actual
 * work (hidden, triggered via the visible box) - this only changes how it
 * looks, not the underlying file-selection contract.
 */
export function FileDropzone({
  accept,
  onFileSelected,
  selectedFileName,
  label = "Arrastra tu archivo aquí, o haz clic para elegirlo",
  hint,
  className = "",
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  function openPicker() {
    inputRef.current?.click();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragActive(false);
    onFileSelected(e.dataTransfer.files?.[0] ?? null);
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={openPicker}
      onKeyDown={handleKeyDown}
      onDragOver={(e) => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={() => setDragActive(false)}
      onDrop={handleDrop}
      className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
        dragActive ? "border-brand-primary bg-brand-primary/5" : "border-border hover:border-brand-primary/60"
      } ${className}`.trim()}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFileSelected(e.target.files?.[0] ?? null)}
      />
      <UploadIcon className={`size-6 ${dragActive ? "text-brand-primary" : "text-text-tertiary"}`} />
      {selectedFileName ? (
        <p className="text-sm font-medium text-text-primary">{selectedFileName}</p>
      ) : (
        <>
          <p className="text-sm font-medium text-text-primary">{label}</p>
          {hint && <p className="text-xs text-text-tertiary">{hint}</p>}
        </>
      )}
    </div>
  );
}
