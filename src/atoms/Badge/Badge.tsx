import type { ReactNode } from "react";

export type BadgeTone = "success" | "danger" | "neutral";

export interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const TONE_CLASSES: Record<BadgeTone, string> = {
  success: "bg-success-bg text-success-dark",
  danger: "bg-danger-bg text-danger-dark",
  neutral: "bg-surface-muted text-text-secondary",
};

/**
 * Small pill for deltas ("+0.7%", "-800L") and status labels. The set of
 * variants ("tone") is the only extension point - adding a new tone
 * doesn't touch the rest of the component (Open/Closed).
 */
export function Badge({ children, tone = "neutral", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-sm font-semibold ${TONE_CLASSES[tone]} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
