import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmDialog } from "./ConfirmDialog";

const meta: Meta<typeof ConfirmDialog> = {
  title: "Organisms/ConfirmDialog",
  component: ConfirmDialog,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
};

export default meta;
type Story = StoryObj<typeof ConfirmDialog>;

export const Open: Story = {
  args: {
    open: true,
    onClose: () => {},
    onConfirm: () => {},
    title: "Aplicar precio recomendado",
    productLabel: "Regular",
    description: "Vas a actualizar el precio vigente.",
    currentPrice: "$23.69",
    newPrice: "$23.89",
    marginImpactLabel: "+$120.00",
    volumeImpactLabel: "+250L",
  },
};

export const Confirming: Story = {
  args: { ...Open.args, confirming: true },
};
