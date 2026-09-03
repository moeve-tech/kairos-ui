import type { ChangeEvent } from "react";

export interface PriceRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  /** the value the user is currently dragging */
  value: number;
  onChange: (value: number) => void;
  /** reference "current" price, shown at the top left */
  currentPrice: number;
  /** price suggested by the model, shown at the top right */
  recommendedPrice: number;
  currencyFormatter: (value: number) => string;
}

/**
 * The Simulator's "Adjust the price to evaluate the projected impact"
 * slider. Fully controlled (value/onChange come from the parent) - it
 * holds no state of its own, so it doesn't need "use client" by itself:
 * it inherits it from the screen component that does manage the state.
 */
export function PriceRangeSlider({
  min,
  max,
  step = 0.01,
  value,
  onChange,
  currentPrice,
  recommendedPrice,
  currencyFormatter,
}: PriceRangeSliderProps) {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative h-[250px] w-full rounded-xl border border-border/30 bg-surface-page p-6 shadow-tab">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary">PRECIO ACTUAL</p>
          <p className="text-2xl font-semibold text-text-primary">
            {currencyFormatter(currentPrice)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-brand-primary">RECOMENDADO</p>
          <p className="text-2xl font-semibold text-brand-primary">
            {currencyFormatter(recommendedPrice)}
          </p>
        </div>
      </div>

      <div className="absolute left-6 right-6 top-[100px] flex h-24 items-center justify-center">
        <div
          className="pointer-events-none absolute -top-16 -translate-x-1/2 rounded-lg bg-[#2b3134] px-4 py-2 text-sm font-semibold text-white shadow-tooltip"
          style={{ left: `${percent}%` }}
        >
          {currencyFormatter(value)}
          <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-8 border-t-8 border-x-transparent border-t-[#2b3134]" />
        </div>

        <div className="relative h-2 w-full rounded-full bg-border">
          <div
            className="h-full rounded-full bg-brand-primary"
            style={{ width: `${percent}%` }}
          />
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(Number(event.target.value))}
            aria-label="Precio a evaluar"
            className="range-thumb absolute inset-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-6 right-6 flex items-start justify-between text-sm text-text-secondary">
        <span>{currencyFormatter(min)}</span>
        <span>{currencyFormatter(max)}</span>
      </div>
    </div>
  );
}
