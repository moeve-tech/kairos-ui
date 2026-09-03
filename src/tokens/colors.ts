/**
 * Design tokens - extracted directly from the "Redinamic-tec" Figma file
 * (get_design_context on the "Simulador de Impacto" node), not made up.
 *
 * This is the ONLY source of truth for the library's colors. The Tailwind
 * preset (`packages/ui/tailwind.preset.ts`) reads from here, so a brand
 * change happens in a single place and propagates through the whole app -
 * it's the same Open/Closed principle: extend by adding/changing tokens,
 * not by editing every component that uses a color.
 */

export const colors = {
  brand: {
    sidebar: "#004656",
    sidebarHover: "#005a6e",
    accent: "#047dba",
    primary: "#006395",
    logo: "#8af9b5",
  },
  surface: {
    page: "#f4fafe",
    card: "#ffffff",
    subtle: "#eef4f8",
    muted: "#e9eff3",
  },
  text: {
    primary: "#161c1f",
    secondary: "#404850",
    tertiary: "#707881",
    onDark: "#ffffff",
    onDarkMuted: "rgba(255,255,255,0.6)",
    onDarkFaint: "rgba(255,255,255,0.5)",
  },
  success: {
    DEFAULT: "#008851",
    dark: "#006c3f",
    bg: "#8af9b5",
  },
  danger: {
    DEFAULT: "#ba1a1a",
    dark: "#93000a",
    bg: "#ffdad6",
  },
  info: {
    DEFAULT: "#006395",
    dark: "#2e6576",
  },
  border: {
    DEFAULT: "#dde3e7",
  },
} as const;

export type ColorTokens = typeof colors;
