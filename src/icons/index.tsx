import type { SVGProps } from "react";

/**
 * Custom icon set, in plain SVG (no external library like
 * lucide-react/heroicons) - so packages/ui doesn't depend on anything but
 * React, and there's no separate icon package to install/update.
 *
 * NOTE ON DESIGN FIDELITY: the Figma design ships its own icons exported
 * as images; those assets live on Figma's servers and the URLs expire in
 * ~7 days, so they can't be "committed" as-is. These are an equivalent set
 * (same visual meaning - pin, arrow, check, etc.) redrawn by hand in SVG,
 * not an exact pixel-for-pixel copy of the original vector. If the exact
 * Figma set is wanted later on, it can be exported as SVG from the file
 * and used to replace these.
 *
 * All of them accept the standard SVG props (className, etc.) so size/color
 * can be controlled with Tailwind from wherever they're used.
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function BoltIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function MapPinIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M12 21s7-6.5 7-11.5A7 7 0 0 0 5 9.5C5 14.5 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.25" />
    </svg>
  );
}

export function ChevronDownIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function ArrowUpIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M12 19V5" />
      <path d="m6 11 6-6 6 6" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M12 5v14" />
      <path d="m6 13 6 6 6-6" />
    </svg>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M21 12a9 9 0 1 1-2.64-6.36" />
      <path d="M21 3v6h-6" />
    </svg>
  );
}

export function UserCircleIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="10" r="3" />
      <path d="M6.5 19a6 6 0 0 1 11 0" />
    </svg>
  );
}

export function LogOutIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

export function TagIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M20.59 13.41 12 22l-9-9V4a1 1 0 0 1 1-1h9l7.59 7.59a2 2 0 0 1 0 2.82Z" />
      <circle cx="7.5" cy="7.5" r="1.25" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TrendUpIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="m3 17 6-6 4 4 8-8" />
      <path d="M15 7h6v6" />
    </svg>
  );
}

export function TrendDownIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="m3 7 6 6 4-4 8 8" />
      <path d="M15 17h6v-6" />
    </svg>
  );
}

export function FuelIcon(props: IconProps) {
  // The hand-drawn paths below aren't centered in a plain 0 0 24 24 viewBox
  // (their ink spans x:[2,19] y:[4,22], so the geometric center is (10.5,
  // 13), not (12, 12)). Shifting the viewBox origin to match that center
  // keeps the glyph visually centered inside round containers (e.g. map
  // pins) without altering any path point, which would subtly change the
  // drawing.
  return (
    <svg {...base} viewBox="-1.5 1 24 24" stroke="currentColor" {...props}>
      <path d="M3 22V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M3 12h10" />
      <path d="M13 7h2l3.5 3.5a1.5 1.5 0 0 1 .5 1.1V17a1.5 1.5 0 0 1-3 0v-1" />
      <path d="M2 22h12" />
    </svg>
  );
}

export function WalletIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v3" />
      <path d="M3 7v11a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-4" />
      <path d="M16 13h4a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-4a2 2 0 0 1 0-4Z" />
    </svg>
  );
}

export function CheckCircleIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 5-5" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <line x1="8" y1="3" x2="8" y2="7" />
      <line x1="16" y1="3" x2="16" y2="7" />
    </svg>
  );
}

export function UploadIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base} stroke="currentColor" {...props}>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </svg>
  );
}

/**
 * Solid/filled icon set, exported directly from the "Redinamic-tec" Figma
 * file (the "Gestion de Precios" stat cards) - unlike the outline set
 * above, these are pixel-accurate copies of the Figma vectors, not
 * hand-redrawn equivalents. Each keeps its own natural viewBox/aspect
 * ratio instead of being forced into the outline set's 24x24 grid.
 */

export function FuelPumpSolidIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 33 36" fill="currentColor" {...props}>
      <path d="M0 36V4C0 2.9 0.391667 1.95833 1.175 1.175C1.95833 0.391667 2.9 0 4 0H16C17.1 0 18.0417 0.391667 18.825 1.175C19.6083 1.95833 20 2.9 20 4V18H22C23.1 18 24.0417 18.3917 24.825 19.175C25.6083 19.9583 26 20.9 26 22V31C26 31.5667 26.1917 32.0417 26.575 32.425C26.9583 32.8083 27.4333 33 28 33C28.5667 33 29.0417 32.8083 29.425 32.425C29.8083 32.0417 30 31.5667 30 31V16.6C29.7 16.7667 29.3833 16.875 29.05 16.925C28.7167 16.975 28.3667 17 28 17C26.6 17 25.4167 16.5167 24.45 15.55C23.4833 14.5833 23 13.4 23 12C23 10.9333 23.2917 9.975 23.875 9.125C24.4583 8.275 25.2333 7.66667 26.2 7.3L22 3.1L24.1 1L31.5 8.2C32 8.7 32.375 9.28333 32.625 9.95C32.875 10.6167 33 11.3 33 12V31C33 32.4 32.5167 33.5833 31.55 34.55C30.5833 35.5167 29.4 36 28 36C26.6 36 25.4167 35.5167 24.45 34.55C23.4833 33.5833 23 32.4 23 31V21H20V36H0ZM4 14H16V4H4V14ZM28 14C28.5667 14 29.0417 13.8083 29.425 13.425C29.8083 13.0417 30 12.5667 30 12C30 11.4333 29.8083 10.9583 29.425 10.575C29.0417 10.1917 28.5667 10 28 10C27.4333 10 26.9583 10.1917 26.575 10.575C26.1917 10.9583 26 11.4333 26 12C26 12.5667 26.1917 13.0417 26.575 13.425C26.9583 13.8083 27.4333 14 28 14Z" />
    </svg>
  );
}

export function WalletSolidIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 44 32" fill="currentColor" {...props}>
      <path d="M4 32C2.9 32 1.95833 31.6083 1.175 30.825C0.391667 30.0417 0 29.1 0 28V6H4V28H38V32H4ZM12 24C10.9 24 9.95833 23.6083 9.175 22.825C8.39167 22.0417 8 21.1 8 20V4C8 2.9 8.39167 1.95833 9.175 1.175C9.95833 0.391667 10.9 0 12 0H40C41.1 0 42.0417 0.391667 42.825 1.175C43.6083 1.95833 44 2.9 44 4V20C44 21.1 43.6083 22.0417 42.825 22.825C42.0417 23.6083 41.1 24 40 24H12ZM16 20C16 18.9 15.6083 17.9583 14.825 17.175C14.0417 16.3917 13.1 16 12 16V20H16ZM36 20H40V16C38.9 16 37.9583 16.3917 37.175 17.175C36.3917 17.9583 36 18.9 36 20ZM26 18C27.6667 18 29.0833 17.4167 30.25 16.25C31.4167 15.0833 32 13.6667 32 12C32 10.3333 31.4167 8.91667 30.25 7.75C29.0833 6.58333 27.6667 6 26 6C24.3333 6 22.9167 6.58333 21.75 7.75C20.5833 8.91667 20 10.3333 20 12C20 13.6667 20.5833 15.0833 21.75 16.25C22.9167 17.4167 24.3333 18 26 18ZM12 8C13.1 8 14.0417 7.60833 14.825 6.825C15.6083 6.04167 16 5.1 16 4H12V8ZM40 8V4H36C36 5.1 36.3917 6.04167 37.175 6.825C37.9583 7.60833 38.9 8 40 8Z" />
    </svg>
  );
}

export function TrendUpSolidIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" fill="currentColor" {...props}>
      <path d="M0 36V32L4 28V36H0ZM8 36V24L12 20V36H8ZM16 36V20L20 24.05V36H16ZM24 36V24.05L28 20.05V36H24ZM32 36V16L36 12V36H32ZM0 25.65V20L14 6L22 14L36 0V5.65L22 19.65L14 11.65L0 25.65Z" />
    </svg>
  );
}
