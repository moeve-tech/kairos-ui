import type { ReactNode } from "react";
import { Button } from "../../atoms/Button/Button";
import { WalletIcon, XIcon } from "../../icons";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  productLabel: string;
  description: ReactNode;
  currentPrice: string;
  newPrice: string;
  marginImpactLabel: string;
  volumeImpactLabel: string;
  confirming?: boolean;
}

/**
 * The "Aplicar precio recomendado" / "Confirmar y aplicar" modal. Fully
 * controlled by `open` - it has no state of its own, so the screen that
 * uses it decides when to show it (e.g. after a successful /simulate
 * response) and what happens on confirm (calling /prices/apply).
 */
export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  productLabel,
  description,
  currentPrice,
  newPrice,
  marginImpactLabel,
  volumeImpactLabel,
  confirming = false,
}: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-modal">
        <div className="relative flex items-center justify-center bg-gradient-to-r from-brand-primary to-info-dark py-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="absolute right-4 top-4 text-white/80 hover:text-white"
          >
            <XIcon className="size-5" />
          </button>
          <div className="flex size-14 items-center justify-center rounded-full bg-white text-brand-primary">
            <WalletIcon className="size-6" />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 px-8 py-6 text-center">
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
          <span className="rounded-full bg-surface-muted px-3 py-1 text-xs font-semibold text-text-secondary">
            {productLabel}
          </span>
          <p className="text-sm text-text-secondary">{description}</p>

          <div className="mt-2 flex w-full items-center justify-between rounded-xl bg-surface-subtle p-4">
            <div className="text-left">
              <p className="text-xs uppercase text-text-secondary">Actual</p>
              <p className="text-lg font-semibold text-text-tertiary line-through">{currentPrice}</p>
            </div>
            <span className="text-text-secondary">→</span>
            <div className="text-right">
              <p className="text-xs uppercase text-success-dark">Recomendado</p>
              <p className="text-lg font-semibold text-brand-primary">{newPrice}</p>
            </div>
          </div>

          <div className="flex w-full items-center justify-between text-sm">
            <div className="text-left">
              <p className="text-xs text-text-secondary">Impacto en Margen</p>
              <p className="font-semibold text-success-dark">{marginImpactLabel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-text-secondary">Volumen Estimado</p>
              <p className="font-semibold text-success-dark">{volumeImpactLabel}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 border-t border-border px-8 py-4">
          <Button variant="text" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={onConfirm} disabled={confirming}>
            {confirming ? "Aplicando..." : "Confirmar y aplicar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
