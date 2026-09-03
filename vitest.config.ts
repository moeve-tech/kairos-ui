import { defineConfig } from "vitest/config";

/**
 * Test config for the library. Uses esbuild's JSX transform directly
 * ("automatic", the same runtime as "jsx": "react-jsx" in tsconfig.json)
 * instead of @vitejs/plugin-react - so that extra dependency isn't needed
 * just to transform JSX in the tests.
 */
export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: false,
  },
});
