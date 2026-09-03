import type { HTMLAttributes, ReactNode } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** removes the default padding, for when the content manages its own */
  noPadding?: boolean;
}

/**
 * Base white, rounded container with a soft shadow - the same pattern
 * that wraps every dashboard block in the design (Simulator Panel,
 * Decision Factors, Nearby Competitors, etc.). Anything specific to a
 * given block goes through composition (children), not new props here -
 * single responsibility principle: Card only knows how to be "the white box".
 */
export function Card({ children, className = "", noPadding = false, ...rest }: CardProps) {
  const padding = noPadding ? "" : "p-6";
  return (
    <div
      className={`bg-surface-card rounded-xl shadow-card ${padding} ${className}`.trim()}
      {...rest}
    >
      {children}
    </div>
  );
}
