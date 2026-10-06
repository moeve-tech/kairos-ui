export interface SpinnerProps {
  /** Accessible label announced to screen readers (visually hidden). */
  label?: string;
  className?: string;
}

/**
 * Loading indicator for `loading.tsx` screens and other async states.
 * The ring is purely decorative (`aria-hidden`) - the accessible name comes
 * from the `sr-only` label next to it, and `role="status"` on the wrapper
 * lets assistive tech announce it as a live region without stealing focus.
 * Respects `prefers-reduced-motion` like the rest of the library's motion.
 */
export function Spinner({ label = "Cargando", className = "" }: SpinnerProps) {
  return (
    <div role="status" className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-brand-primary motion-reduce:animate-none"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
