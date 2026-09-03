import type { ReactNode } from "react";

export interface AvatarProps {
  /** letter or icon shown inside the circle */
  children: ReactNode;
  /** background color of the circle (hex or another Tailwind class via className) */
  className?: string;
  size?: "sm" | "md";
}

const SIZE_CLASSES: Record<NonNullable<AvatarProps["size"]>, string> = {
  sm: "size-8 text-sm",
  md: "size-10 text-base",
};

/**
 * Avatar/initials circle - used both by the session user (sidebar) and
 * each competitor in the "Nearby Competitors" list. It does not decide
 * the background OR text color: it receives them via className
 * (e.g. "bg-danger-bg text-danger-dark" or "bg-success text-white"), so
 * the same component works for any combination without having to touch it.
 */
export function Avatar({ children, className = "", size = "md" }: AvatarProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-bold ${SIZE_CLASSES[size]} ${className}`.trim()}
    >
      {children}
    </div>
  );
}
