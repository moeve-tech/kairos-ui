// Single entry point of the library - "@moeve-ui/ui" imports from here.
//
// Tier-based structure following Atomic Design (Brad Frost): atoms -> molecules
// -> organisms. Each component still lives in its own self-contained folder
// with its own exported props interface (Fractal Component Design) - the only
// thing that changed is which folder it lives in based on its composition
// tier, not the shape of the file itself:
//
//   atoms/      - do not compose any other component in the library
//                 (Avatar, Badge, Button, Card, Logo, ProgressBar, Snackbar)
//   molecules/  - compose 1+ atoms, or are a simple self-contained control
//                 (SegmentedTabs, NavItem, StatTile, DecisionFactorRow,
//                  CompetitorRow, PriceRangeSlider, MiniMapCard,
//                  WeekdayPicker, SelectableCard, FileDropzone,
//                  DateRangePicker)
//   organisms/  - compose molecule(s)/atom(s) into a full screen section
//                 (Sidebar, TopBar, ConfirmDialog)
//
// tokens/ and icons/ are not "components" (they have no props/JSX of their
// own in the UI sense) and stay outside the hierarchy, as in most Atomic
// Design libraries.

export * from "./tokens/colors";
export * from "./icons";

// atoms
export * from "./atoms/Avatar/Avatar";
export * from "./atoms/Badge/Badge";
export * from "./atoms/Button/Button";
export * from "./atoms/Card/Card";
export * from "./atoms/Logo/Logo";
export * from "./atoms/ProgressBar/ProgressBar";
export * from "./atoms/Snackbar/Snackbar";

// molecules
export * from "./molecules/SegmentedTabs/SegmentedTabs";
export * from "./molecules/NavItem/NavItem";
export * from "./molecules/StatTile/StatTile";
export * from "./molecules/DecisionFactorRow/DecisionFactorRow";
export * from "./molecules/CompetitorRow/CompetitorRow";
export * from "./molecules/PriceRangeSlider/PriceRangeSlider";
export * from "./molecules/MiniMapCard/MiniMapCard";
export * from "./molecules/WeekdayPicker/WeekdayPicker";
export * from "./molecules/SelectableCard/SelectableCard";
export * from "./molecules/FileDropzone/FileDropzone";
export * from "./molecules/DateRangePicker/DateRangePicker";

// organisms
export * from "./organisms/Sidebar/Sidebar";
export * from "./organisms/TopBar/TopBar";
export * from "./organisms/ConfirmDialog/ConfirmDialog";
