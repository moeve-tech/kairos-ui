import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Atoms/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    tone: { control: "radio", options: ["success", "danger", "neutral"] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Success: Story = { args: { children: "+0.7%", tone: "success" } };
export const Danger: Story = { args: { children: "-800L", tone: "danger" } };
export const Neutral: Story = { args: { children: "Sin cambios", tone: "neutral" } };
