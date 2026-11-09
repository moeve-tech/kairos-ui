import type { Config } from "tailwindcss";
import { colors } from "./src/tokens/colors";
import { fontFamily } from "./src/tokens/typography";

/**
 * Preset de Tailwind de la librería - lo consume apps/web (y cualquier
 * app futura) via `presets: [require("@kairos/ui/tailwind.preset")]` en
 * su propio tailwind.config. Los colores vienen de tokens/colors.ts, no
 * están repetidos aquí: un solo lugar para cambiar la marca.
 */
const preset: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        brand: colors.brand,
        surface: colors.surface,
        text: colors.text,
        success: colors.success,
        danger: colors.danger,
        info: colors.info,
        border: colors.border,
      },
      fontFamily: {
        sans: fontFamily.sans,
      },
      boxShadow: {
        card: "0px 4px 6px -1px rgba(0,0,0,0.1), 0px 2px 4px -2px rgba(0,0,0,0.1)",
        tab: "0px 1px 1px rgba(0,0,0,0.05)",
        header: "0px 1px 8px 0px rgba(0,70,86,0.04)",
        tooltip: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
        modal: "0px 20px 25px -5px rgba(0,0,0,0.1), 0px 8px 10px -6px rgba(0,0,0,0.1)",
      },
    },
  },
};

export default preset;
