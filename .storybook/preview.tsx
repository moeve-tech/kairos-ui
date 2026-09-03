import type { Preview } from "@storybook/react";

// Tailwind, compiled with the library's own preset (see ../tailwind.config.ts).
// This file is Storybook-only - consumer apps bring their own Tailwind build
// and apply tailwind.preset.ts themselves; the library never ships CSS.
import "./tailwind.css";

const preview: Preview = {
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "page",
      values: [
        { name: "page", value: "#f4fafe" },
        { name: "white", value: "#ffffff" },
        { name: "sidebar", value: "#004656" },
      ],
    },
  },
};

export default preview;
