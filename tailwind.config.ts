import type { Config } from "tailwindcss";
import preset from "./tailwind.preset";

/**
 * Used ONLY to run Storybook locally - Storybook's own Vite/PostCSS
 * pipeline needs a real Tailwind config, not just the preset that
 * consumer apps apply in their own tailwind.config. Not part of the
 * published package (see .npmignore) - consumers never see this file,
 * they just do `presets: [require("@kairos/ui/tailwind.preset")]`.
 */
const config: Config = {
  presets: [preset],
  content: ["./src/**/*.{ts,tsx}", "./.storybook/**/*.{ts,tsx}"],
};

export default config;
