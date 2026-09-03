import { MapPinIcon } from "../../icons";

export interface MiniMapCardProps {
  overlayTitle: string;
  /** text already assembled with the count included, e.g. "Basado en 3 competidores clave" - don't repeat it in competitorCount. */
  overlayLinkLabel: string;
  /** used only for accessibility (aria-label), not rendered on screen again - overlayLinkLabel already has the number in the right place in the sentence. */
  competitorCount: number;
}

/**
 * The decorative map card below "Decision Factors".
 *
 * *** PLACEHOLDER ***: the design uses a screenshot of a real map; here an
 * abstract SVG map is drawn instead (no dependencies or API key) that
 * occupies the same space and keeps the text overlay identical. Once a
 * real integration (Google Maps / Mapbox) exists with the location and
 * geolocated competitors, this is the component that gets replaced -
 * the rest of the screen doesn't change because it only depends on this
 * interface.
 */
export function MiniMapCard({ overlayTitle, overlayLinkLabel, competitorCount }: MiniMapCardProps) {
  return (
    <div className="relative h-64 w-full overflow-hidden rounded-xl bg-white p-2 shadow-tab">
      <div className="relative h-full w-full overflow-hidden rounded-lg bg-[#dbe9ee]">
        <svg viewBox="0 0 320 220" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
          <rect width="320" height="220" fill="#dbe9ee" />
          {Array.from({ length: 9 }).map((_, i) => (
            <line key={`v${i}`} x1={i * 40} y1="0" x2={i * 40} y2="220" stroke="#c5dbe2" strokeWidth="1" />
          ))}
          {Array.from({ length: 7 }).map((_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 36} x2="320" y2={i * 36} stroke="#c5dbe2" strokeWidth="1" />
          ))}
          <circle cx="160" cy="110" r="10" fill="#006395" />
          <circle cx="100" cy="70" r="6" fill="#404850" />
          <circle cx="220" cy="60" r="6" fill="#404850" />
          <circle cx="235" cy="150" r="6" fill="#404850" />
        </svg>
      </div>

      <div className="absolute inset-x-4 bottom-4 flex flex-col gap-1 rounded-lg bg-surface-page/90 p-3 shadow-modal backdrop-blur-sm">
        <div className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-text-primary">
          <MapPinIcon className="size-3.5" />
          {overlayTitle}
        </div>
        <p className="text-sm font-semibold text-brand-primary" aria-label={`${overlayLinkLabel} - ${competitorCount} en total`}>
          {overlayLinkLabel}
        </p>
      </div>
    </div>
  );
}
