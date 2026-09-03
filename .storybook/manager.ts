import { addons } from "@storybook/manager-api";
import { create } from "@storybook/theming/create";

// Ajusta brandUrl/brandImage si quieren un logo o link propio de Moeve.
const moeveTheme = create({
  base: "light",
  brandTitle: "Moeve UI",
  colorPrimary: "#006395",
  colorSecondary: "#047dba",
});

addons.setConfig({
  theme: moeveTheme,
});
