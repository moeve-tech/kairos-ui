import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { RefreshIcon } from "../../icons";

const meta: Meta<typeof Button> = {
  title: "Atoms/Button",
  component: Button,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    variant: { control: "radio", options: ["primary", "ghost", "text"] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { children: "Confirmar y aplicar", variant: "primary" } };
export const Ghost: Story = { args: { children: "Ghost", variant: "ghost" } };
export const Text: Story = { args: { children: "Cancelar", variant: "text" } };
export const WithIcon: Story = {
  args: { children: "Actualizar datos", variant: "primary", icon: <RefreshIcon className="size-4" /> },
};
export const Disabled: Story = {
  args: { children: "Confirmar y aplicar", variant: "primary", disabled: true },
};
