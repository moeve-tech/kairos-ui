# @moeve-ui/ui

Moeve/Redinamic component library, published as `@moeve-ui/ui` under the `moeve-ui` npm organization. This is an **independent** project, not tied to any particular app - today it's used by `kairos-frontend` (Impact Simulator), but it's meant to be reused across future projects, the same way an equivalent Vite + MUI library was built before.

It's built with [`tsup`](https://tsup.egoist.dev/) into a compiled `dist/` (ESM + CJS + `.d.ts`), so consumers just `npm install @moeve-ui/ui` like any other package - no `transpilePackages` or knowledge of our TS setup required on their end.

## ⚠️ About this delivery's tests (read before running `npm test`)

Same as with the rest of the project, this was written without access to the npm registry (blocked in the environment I work in), so **I was never able to install vitest or @testing-library, and I never actually ran a single one of these 15 tests.** I'm not going to tell you "it's tested" without having seen it pass.

What I did do:

- Wrote each test by reading the actual code of the component it tests (no invented behavior) - assertions based on the classes/text the component actually renders.
- Built a minimal type shim for `vitest` and `@testing-library/react` (in the same manual type-checker I use for the whole project) and ran `tsc --noEmit` over the 15 tests - 0 syntax/type errors.
- That review already found and fixed 3 real issues before delivering this to you:
  1. **A real bug in `MiniMapCard`**: it rendered `{overlayLinkLabel} ({competitorCount})`, and whoever uses it in `kairos-frontend` (`DecisionFactorsCard.tsx`) already includes the count inside `overlayLinkLabel` - the result on screen was `"Basado en 3 competidores clave (3)"`, duplicated. The component was fixed (see `src/molecules/MiniMapCard/MiniMapCard.tsx`).
  2. One of my `CompetitorRow` tests had the `trend` color inverted (I assumed "competitor's price going up = bad = red", but the component intentionally paints it the other way around: if the competitor raises their price it's a good competitive signal for us = green). I fixed it to reflect the real behavior, not what I expected.
  3. A `PriceRangeSlider` test with `value` equal to `currentPrice` would have failed with "multiple elements found" (the component renders that number twice on screen - the tooltip and the current price). Just like a real UI bug, only in the test.

What I **couldn't** verify: that the tests actually pass (`vitest run`), or that the type shim captures 100% of those libraries' real API. Run `npm install && npm test` on your Mac (regular Terminal) and let me know what breaks - at this level of review I expect it to be little, but I won't claim it without having run it.

## What's included

- **Design tokens** (`src/tokens/colors.ts`) - the single source of truth for brand colors, extracted from the "Redinamic-tec" Figma file. `tailwind.preset.ts` exposes them as a Tailwind preset.
- **Custom icon set** (`src/icons/`) - plain SVG, no external dependencies.
- **15 components organized by Atomic Design** (Brad Frost) - see the section below.

## Structure: Atomic Design (atoms / molecules / organisms)

```
src/
├── atoms/       Avatar, Badge, Button, Card, ProgressBar
├── molecules/   SegmentedTabs, NavItem, StatTile, DecisionFactorRow,
│                CompetitorRow, PriceRangeSlider, MiniMapCard
└── organisms/   Sidebar, TopBar, ConfirmDialog
```

- **atoms/** - don't compose any other component in the library. The smallest building blocks: a button, a badge, an avatar circle.
- **molecules/** - compose 1 or more atoms (`StatTile` uses `Badge` + `ProgressBar`; `CompetitorRow` uses `Avatar`), or are a self-contained control with its own interaction logic (`PriceRangeSlider`, `SegmentedTabs`).
- **organisms/** - assemble a full screen section by combining molecules/atoms (`Sidebar` = `NavItem` × N + `Avatar`; `ConfirmDialog` = a complete modal with `Button`).

`tokens/` and `icons/` are deliberately left out of this hierarchy - they aren't "components" in the Atomic Design sense (they have no visual composition of their own; they're the raw materials the atoms/molecules/organisms consume).

**This doesn't contradict Fractal Component Design (FCD)**: each component still lives in its own self-contained file, with the same shape (props interface + responsibility comment + the component), regardless of which folder it's in - the only thing that changed is that folder now also documents its composition tier. See `../kairos-frontend/ARCHITECTURE.md` for the rest of the principles (SOLID, Clean Code) with examples.

## Tests

Each component has its test right next to it (`Badge.tsx` + `Badge.test.tsx` in the same folder) using [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/react). What actually matters about each one was tested: what it renders, which classes it applies based on its props/variants, and that callbacks (`onClick`, `onChange`, etc.) fire with the correct arguments - no giant snapshots, no testing internal implementation.

```bash
npm test        # runs all tests once
npm run test:watch
```

## How a consuming project installs it

Published to the public npm registry under the `moeve-ui` org:

```bash
npm install @moeve-ui/ui
```

```jsonc
// package.json of the project that consumes it
{
  "dependencies": {
    "@moeve-ui/ui": "^0.1.0"
  }
}
```

Its Tailwind preset is a separate entry point:

```js
// tailwind.config.js of the consuming project
module.exports = {
  presets: [require("@moeve-ui/ui/tailwind.preset")],
  // ...
};
```

### Typography (Moeve Sans)

The preset's `font-sans` matches moeve.es: `"Moeve Sans", moevelight, "Century Gothic", Helvetica, Arial, sans-serif` (see `src/tokens/typography.ts`).

Moeve Sans is Moeve's proprietary corporate typeface, so **this package does not ship the font files**. Each app registers it with its own `@font-face`, using the font files provided by the brand team, under a single family name with one rule per weight:

```css
@font-face {
  font-family: "Moeve Sans";
  font-weight: 300;
  font-style: normal;
  font-display: swap;
  src: url("/fonts/MoeveSans/MoeveSans-Light.woff2") format("woff2");
}
/* repeat for 400 (Regular), 500 (Medium), 700 (Bold) with their files */
```

Without those files, browsers fall back to Century Gothic (installed on Windows/macOS), the same fallback the official site uses.

### Local development against an unpublished change

While iterating on a change here before publishing a new version, a consumer can still point at this folder instead of the registry:

```jsonc
{
  "dependencies": {
    "@moeve-ui/ui": "file:../kairos-ui"
  }
}
```

Run `npm run build` here first (the consumer picks up `dist/`, not `src/`), then `npm install` again on their side after each change.

## Development

```bash
npm install       # installs devDependencies: React, TS, Tailwind, Vitest, Testing Library, tsup, Storybook
npm run typecheck # tsc --noEmit
npm test          # vitest run
npm run build     # tsup -> dist/ (index + tailwind.preset, ESM + CJS + .d.ts)
npm run storybook # visual playground on http://localhost:6006
```

## Publishing a new version

```bash
npm login                        # once per machine, needs to be a member of the moeve-ui org
npm version patch                # or minor/major - bumps package.json + creates a git tag
npm publish                      # runs prepublishOnly (typecheck + test + build) automatically
```

`publishConfig.access` is set to `"public"` in `package.json`, so the scoped package publishes as public (free on npm - a *private* scoped package needs a paid npm org plan). If that's not what you want, override it once with `npm publish --access restricted`.
