import type { Meta, StoryObj } from "@storybook/react";
import { CompetitorRow } from "./CompetitorRow";

const meta: Meta<typeof CompetitorRow> = {
  title: "Molecules/CompetitorRow",
  component: CompetitorRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof CompetitorRow>;

const BASE = {
  name: "Oxxo Gas - Suc. Madero",
  avatarLetter: "O",
  avatarBgClassName: "bg-danger-bg",
  avatarTextClassName: "text-danger-dark",
  distanceKm: 0.8,
  price: "$23.55",
};

export const TrendUp: Story = {
  args: { ...BASE, trend: "up", trendLabel: "Hace 5h" },
  render: (args) => (
    <div className="w-96">
      <CompetitorRow {...args} />
    </div>
  ),
};

export const TrendDown: Story = {
  args: { ...BASE, trend: "down", trendLabel: "Hace 2h" },
  render: (args) => (
    <div className="w-96">
      <CompetitorRow {...args} />
    </div>
  ),
};

export const Stable: Story = {
  args: { ...BASE, trend: "stable", trendLabel: "Sin cambios (24h)" },
  render: (args) => (
    <div className="w-96">
      <CompetitorRow {...args} />
    </div>
  ),
};
