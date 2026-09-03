import type { Meta, StoryObj } from "@storybook/react";
import { Card } from "./Card";

const meta: Meta<typeof Card> = {
  title: "Atoms/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: { children: <p className="text-text-primary">Contenido de la card</p> },
};

export const NoPadding: Story = {
  args: {
    noPadding: true,
    children: <p className="p-4 text-text-primary">Contenido sin padding propio de la Card</p>,
  },
};
