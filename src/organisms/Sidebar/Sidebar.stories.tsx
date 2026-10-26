import type { Meta, StoryObj } from "@storybook/react";
import { Sidebar } from "./Sidebar";
import { BoltIcon } from "../../icons";

const meta: Meta<typeof Sidebar> = {
  title: "Organisms/Sidebar",
  component: Sidebar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
  args: {
    stations: [
      { id: "EST-001", label: "Monterrey - Estación Central" },
      { id: "EST-002", label: "Guadalajara - Estación Central" },
    ],
    selectedStationId: "EST-001",
    onSelectStation: () => {},
    navItems: [
      { key: "pricing", label: "Pricing", icon: <BoltIcon className="size-5" />, active: true },
    ],
    user: { name: "Admin User", role: "Supervisor" },
    onLogout: () => {},
  },
};

/** No station-selector: for a consumer with no "which station am I managing" concept (e.g. an advertiser's own account). */
export const WithoutStationSelector: Story = {
  args: {
    navItems: [
      { key: "orders", label: "Anuncios", icon: <BoltIcon className="size-5" />, active: true },
    ],
    user: { name: "Cliente", role: "Anunciante" },
    onLogout: () => {},
  },
};

/**
 * Below `md` the fixed panel collapses into a hamburger button (top-left);
 * clicking it opens the same content as a drawer over a backdrop (open state
 * is internal to the component, so click the button in the canvas to see it).
 */
export const Mobile: Story = {
  args: Default.args,
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
