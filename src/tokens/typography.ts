/**
 * Typography tokens - match the official site (moeve.es), which sets
 * `font-family: moevelight, "Century Gothic", Helvetica, Arial, sans-serif`
 * and loads the corporate typeface Moeve Sans via @font-face.
 *
 * Moeve Sans is a proprietary typeface, so the library does NOT ship the
 * font files. It only names the family; each consumer app registers it with
 * its own @font-face (see README "Typography"). Until then, browsers fall
 * back to Century Gothic, the same fallback the official site uses.
 *
 * - "Moeve Sans": the family name apps should register (one family, several
 *   weights: 300/400/500/700).
 * - "moevelight": the name moeve.es uses, in case an app reuses that CSS.
 */
export const fontFamily = {
  sans: [
    '"Moeve Sans"',
    "moevelight",
    '"Century Gothic"',
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
};
