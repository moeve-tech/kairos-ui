import { useState } from "react";
import type { ReactNode, ChangeEvent } from "react";
import { NavItem } from "../../molecules/NavItem/NavItem";
import { Avatar } from "../../atoms/Avatar/Avatar";
import { BoltIcon, MapPinIcon, ChevronDownIcon, UserCircleIcon, LogOutIcon, MenuIcon, XIcon } from "../../icons";

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
  /** Opcional (default true): el chip con el rayo junto al nombre. Pasá false si el consumidor ya trae su propio wordmark y no quiere el ícono genérico. */
  showLogoMark?: boolean;
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
 *
 * Below `md` the fixed panel has no room to live permanently, so it
 * collapses into a hamburger button (top-left, same height as the
 * TopBar) that opens this same content as a drawer over a backdrop.
 * That open/close state is internal (uncontrolled) - no new required
 * prop - since no consumer needs to drive it from outside today.
 */
export function Sidebar({
  brandName = "Redinamic",
  showLogoMark = true,
  stations = [],
  selectedStationId = "",
  onSelectStation = () => {},
  navItems,
  user,
  onLogout,
}: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const closeMobile = () => setMobileOpen(false);

  const content = (
    <>
      <div className="flex flex-col gap-6 px-4 pb-6">
        <div className="flex items-center gap-3 px-2">
          {showLogoMark && (
            <div className="flex size-8 items-center justify-center rounded bg-brand-logo">
              <BoltIcon className="size-4 text-brand-sidebar" />
            </div>
          )}
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
          <NavItem
            key={item.key}
            icon={item.icon}
            label={item.label}
            active={item.active}
            href={item.href}
            onClick={closeMobile}
          />
        ))}
      </nav>

      <div className="border-t border-white/10 px-4 pt-4">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="bg-brand-primary text-white">
            <UserCircleIcon className="size-4" />
          </Avatar>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white" title={user.name}>
              {user.name}
            </p>
            <p className="truncate text-xs text-white/60" title={user.role}>
              {user.role}
            </p>
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
    </>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        aria-label="Abrir menú"
        className="fixed left-0 top-0 z-20 flex h-14 w-14 items-center justify-center bg-brand-sidebar text-white md:hidden"
      >
        <MenuIcon className="size-6" />
      </button>

      <aside className="fixed left-0 top-0 hidden h-screen w-[260px] flex-col justify-between bg-brand-sidebar pb-2 pt-8 md:flex">
        {content}
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-30 md:hidden">
          <div
            data-testid="sidebar-mobile-backdrop"
            aria-hidden="true"
            onClick={closeMobile}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="relative flex h-screen w-[260px] flex-col justify-between bg-brand-sidebar pb-2 pt-8">
            <button
              type="button"
              onClick={closeMobile}
              aria-label="Cerrar menú"
              className="absolute right-3 top-3 text-white/70 transition-colors hover:text-white"
            >
              <XIcon className="size-5" />
            </button>
            {content}
          </aside>
        </div>
      )}
    </>
  );
}
