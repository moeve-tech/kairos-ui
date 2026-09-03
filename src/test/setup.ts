// Loaded once before running the tests (see vitest.config.ts,
// test.setupFiles). Adds the jest-dom matchers (toBeInTheDocument,
// toHaveClass, etc.) to Vitest's `expect`.
import "@testing-library/jest-dom/vitest";

import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// vitest.config.ts doesn't set test.globals, so React Testing Library's
// automatic afterEach(cleanup) detection never kicks in - without this,
// every render() from every test in a file stays mounted, and later
// tests in the same file see duplicated elements from earlier tests.
afterEach(() => {
  cleanup();
});
