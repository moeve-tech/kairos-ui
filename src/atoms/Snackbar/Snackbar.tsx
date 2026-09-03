import type { ReactNode } from "react";
import { CheckCircleIcon, XIcon } from "../../icons";

export type SnackbarTone = "success" | "danger" | "neutral";

export interface SnackbarProps {
  message: string;
  tone?: SnackbarTone;
  onClose?: () => void;
  className?: string;
}

const TONE_CLASSES: Record<SnackbarTone, string> = {
  success: "bg-success",
  danger: "bg-danger",
  neutral: "bg-text-secondary",
};

// Same idea as TREND_ICON in CompetitorRow and DELTA_ICON in StatTile: the
// leading icon is picked from `tone` via a Record, not a branch in the JSX
// (Open/Closed) - "neutral" has no obvious icon, so it renders none.
const TONE_ICON: Record<SnackbarTone, ReactNode | null> = {
  success: <CheckCircleIcon className="size-5" />,
  danger: <XIcon className="size-5" />,
  neutral: null,
};

/**
 * Toast/confirmation bar (e.g. "Datos de mercado actualizados
 * correctamente" after a refresh). Fully controlled - it has no timer
 * or visibility state of its own; whoever uses it decides when it's on
 * screen (mount/unmount it, or drive a boolean) and for how long, same
 * philosophy as ConfirmDialog's `open`.
 */
export function Snackbar({ message, tone = "success", onClose, className = "" }: SnackbarProps) {
  return (
    <div
      role="status"
      className={`flex w-full items-center gap-2 rounded-lg px-6 py-3 text-white shadow-card ${TONE_CLASSES[tone]} ${className}`.trim()}
    >
      {TONE_ICON[tone]}
      <p className="flex-1 text-sm font-semibold">{message}</p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="text-white/80 transition-colors hover:text-white"
      >
        <XIcon className="size-4" />
      </button>
    </div>
  );
}
