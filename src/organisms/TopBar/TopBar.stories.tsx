import type { Meta, StoryObj } from "@storybook/react";
import { TopBar } from "./TopBar";

const meta: Meta<typeof TopBar> = {
  title: "Organisms/TopBar",
  component: TopBar,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const Default: Story = {
  args: {
    stationName: "CDMX - Estación Central",
    lastUpdatedLabel: "Última actualización: hoy, 14:32",
  },
};

export const Refreshing: Story = {
  args: { ...Default.args, refreshing: true },
};
