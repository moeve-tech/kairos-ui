import { defineConfig } from "tsup";

// Build config for the two published entry points ("." and "./tailwind.preset",
// see package.json "exports"). Emits ESM + CJS + .d.ts to dist/, so consumers
// no longer need to know how to transpile our TS themselves (see README).
export default defineConfig({
  entry: {
    index: "src/index.ts",
    "tailwind.preset": "tailwind.preset.ts",
  },
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  // React is a peer dependency, not a dependency - never bundle it.
  external: ["react", "react-dom"],
});
