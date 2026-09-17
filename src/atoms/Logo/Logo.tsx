export interface LogoProps {
  /** Primer segmento del wordmark en el color de acento (ej. "RED" de "Redisplay") - opcional, se omite si la marca no tiene ese wordplay (ej. "Fluxer"). */
  accent?: string;
  /** Resto del wordmark, o el nombre completo si `accent` se omite. */
  text: string;
  /** Clase de color para `accent` - default pensado para fondos claros. */
  accentClassName?: string;
  /** Clase de color para `text` - default pensado para fondos claros; pasar algo como "text-white" sobre fondos oscuros (ej. el Sidebar). */
  textClassName?: string;
  className?: string;
}

/**
 * Wordmark en negrita itálica, todo mayúsculas, tracking cerrado - el
 * mismo lenguaje que usan logotipos tipo "marca deportiva/energética"
 * (ver referencia visual del pedido original). Texto real, no un SVG
 * estático: se mantiene nítido a cualquier tamaño y hereda el sistema de
 * color de marca (brand.primary, ya dinámico por marca vía CSS custom
 * properties en las apps que lo consumen) en vez de tener que exportar
 * un asset distinto por marca.
 */
export function Logo({ accent, text, accentClassName = "text-brand-primary", textClassName = "text-text-primary", className = "" }: LogoProps) {
  return (
    <span className={`inline-flex whitespace-nowrap font-black italic uppercase tracking-tight ${className}`.trim()}>
      {accent && <span className={accentClassName}>{accent}</span>}
      <span className={textClassName}>{text}</span>
    </span>
  );
}
