import type { ReactNode } from "react";

export interface NavItemProps {
  icon: ReactNode;
  label: string;
  active?: boolean;
  href?: string;
}

/**
 * A sidebar navigation link. `active` is the only variant -
 * the rest of the appearance (icon, text) is composed from outside.
 */
export function NavItem({ icon, label, active = false, href = "#" }: NavItemProps) {
  return (
    <a
      href={href}
      className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-base font-bold transition-colors ${
        active ? "bg-brand-accent text-white" : "text-white/70 hover:bg-white/5"
      }`}
    >
      {icon}
      {label}
    </a>
  );
}
