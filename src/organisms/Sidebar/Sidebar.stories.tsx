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
