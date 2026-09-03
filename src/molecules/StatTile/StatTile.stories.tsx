import type { Meta, StoryObj } from "@storybook/react";
import { StatTile } from "./StatTile";
import { WalletIcon, FuelIcon, TargetIcon } from "../../icons";

const meta: Meta<typeof StatTile> = {
  title: "Molecules/StatTile",
  component: StatTile,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof StatTile>;

export const VolumeProjected: Story = {
  args: {
    icon: <FuelIcon className="size-14" />,
    label: "Volumen Proyectado (Hoy)",
    value: "14,250",
    unit: "L",
    delta: "+2.4% vs prom. diario",
    deltaTone: "success",
  },
  render: (args) => (
    <div className="w-72">
      <StatTile {...args} />
    </div>
  ),
};

export const WithProgress: Story = {
  args: {
    icon: <WalletIcon className="size-14" />,
    label: "Margen Bruto Proy.",
    value: "$120.00",
    delta: "+0.7%",
    deltaTone: "success",
    progressValue: 68,
  },
  render: (args) => (
    <div className="w-72">
      <StatTile {...args} />
    </div>
  ),
};

export const NegativeDelta: Story = {
  args: {
    icon: <FuelIcon className="size-14" />,
    label: "Volumen Est.",
    value: "250",
    unit: "L",
    delta: "-800L vs ayer",
    deltaTone: "danger",
  },
  render: (args) => (
    <div className="w-72">
      <StatTile {...args} />
    </div>
  ),
};

export const NoDelta: Story = {
  args: {
    icon: <TargetIcon className="size-14" />,
    label: "Ganancia Proyectada",
    value: "$4,200.00",
  },
  render: (args) => (
    <div className="w-72">
      <StatTile {...args} />
    </div>
  ),
};
