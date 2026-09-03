import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "ghost" | "text";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-primary text-white shadow-card hover:bg-brand-sidebarHover disabled:opacity-50 disabled:cursor-not-allowed",
  ghost:
    "bg-surface-muted text-text-primary hover:bg-border disabled:opacity-50 disabled:cursor-not-allowed",
  text: "bg-transparent text-brand-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed p-0",
};

/**
 * Single button with 3 variants (the ones that appear in the design: the
 * solid blue pill for "Aplicar precio"/"Actualizar datos", the text link
 * for "Restablecer a Actual", and a "ghost" variant for future cases).
 * Same as Badge: extending the set of variants doesn't require touching
 * the rest of the component.
 */
export function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  ...rest
}: ButtonProps) {
  const shape = variant === "text" ? "" : "rounded-full px-6 py-2.5";
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 text-sm font-semibold tracking-[0.14px] transition-colors ${shape} ${VARIANT_CLASSES[variant]} ${className}`.trim()}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
}
