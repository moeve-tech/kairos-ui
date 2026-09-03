import type { Meta, StoryObj } from "@storybook/react";
import { DecisionFactorRow } from "./DecisionFactorRow";

const meta: Meta<typeof DecisionFactorRow> = {
  title: "Molecules/DecisionFactorRow",
  component: DecisionFactorRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof DecisionFactorRow>;

export const Elasticity: Story = {
  args: {
    label: "Elasticidad",
    statusText: "Alta",
    value: 78,
    description: "La demanda es sensible a cambios de precio en esta estación.",
  },
  render: (args) => (
    <div className="w-96">
      <DecisionFactorRow {...args} />
    </div>
  ),
};

export const SupplyCost: Story = {
  args: {
    label: "Costo de Suministro",
    statusText: "Estable",
    value: 50,
    segments: 3,
    description: "Sin variaciones relevantes en las últimas 24 horas.",
  },
  render: (args) => (
    <div className="w-96">
      <DecisionFactorRow {...args} />
    </div>
  ),
};
