import type { ReactNode, ChangeEvent } from "react";
import { NavItem } from "../../molecules/NavItem/NavItem";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { BoltIcon, MapPinIcon, ChevronDownIcon, UserCircleIcon, LogOutIcon } from "../../icons";

export interface SidebarStation {
  id: string;
  label: string;
}

export interface SidebarNavItem {
  key: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  href?: string;
}

export interface SidebarUser {
  name: string;
  role: string;
}

export interface SidebarProps {
  /** String simple o un nodo enriquecido (ej. <Logo/> con su wordmark de dos tonos) - ambos se renderizan tal cual junto al ícono. */
  brandName?: ReactNode;
  /**
   * Opcional: el selector de estación es un concepto de operador (gasolinero,
   * superadmin - "qué estación estoy administrando"), no universal. Omitilo
   * (o pasá un array vacío) en un consumidor sin ese concepto (ej. la cuenta
   * de un anunciante) y el bloque completo del selector no se renderiza, en
   * vez de quedar un dropdown vacío sin opciones.
   */
  stations?: SidebarStation[];
  selectedStationId?: string;
  onSelectStation?: (stationId: string) => void;
  navItems: SidebarNavItem[];
  user: SidebarUser;
  onLogout?: () => void;
}

/**
 * The fixed 260px sidebar. It receives EVERYTHING via props - stations,
 * nav items, user - instead of having anything hardcoded (beyond the
 * default brand name). This is what lets it serve "multiple users":
 * whoever uses it decides which user/stations to show, this component
 * just knows how to render them. The station list currently uses a
 * native <select> instead of a custom dropdown - it's the simplest and
 * most accessible option; it can be replaced by a more elaborate menu
 * without touching the rest of the screen.
 */
export function Sidebar({
  brandName = "Redinamic",
  stations = [],
  selectedStationId = "",
  onSelectStation = () => {},
  navItems,
  user,
  onLogout,
}: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-[260px] flex-col justify-between bg-brand-sidebar pb-2 pt-8">
      <div className="flex flex-col gap-6 px-4 pb-6">
        <div className="flex items-center gap-3 px-2">
          <div className="flex size-8 items-center justify-center rounded bg-brand-logo">
            <BoltIcon className="size-4 text-brand-sidebar" />
          </div>
          <span className="text-2xl font-semibold tracking-tight text-white">{brandName}</span>
        </div>

        {stations.length > 0 && (
          <div className="relative">
            <MapPinIcon className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white" />
            <select
              value={selectedStationId}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => onSelectStation(event.target.value)}
              className="w-full appearance-none rounded-xl border border-white/10 bg-white/10 py-2.5 pl-10 pr-9 text-sm font-semibold text-white outline-none"
            >
              {stations.map((station) => (
                <option key={station.id} value={station.id} className="text-text-primary">
                  {station.label}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 size-3 -translate-y-1/2 text-white" />
          </div>
        )}
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => (
          <NavItem key={item.key} icon={item.icon} label={item.label} active={item.active} href={item.href} />
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 pt-4">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="bg-brand-primary text-white">
            <UserCircleIcon className="size-4" />
          </Avatar>
          <div>
            <p className="text-sm font-semibold text-white">{user.name}</p>
            <p className="text-xs text-white/60">{user.role}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-2 text-sm font-semibold text-white/50 transition-colors hover:text-white/80"
        >
          <LogOutIcon className="size-4" />
          Cerrar Sesión
        </button>
      </div>
    </aside>
  );
}
