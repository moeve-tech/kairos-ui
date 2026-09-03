import type { Meta, StoryObj } from "@storybook/react";
import { NavItem } from "./NavItem";
import { BoltIcon } from "../../icons";

const meta: Meta<typeof NavItem> = {
  title: "Molecules/NavItem",
  component: NavItem,
  tags: ["autodocs"],
  parameters: { layout: "padded", backgrounds: { default: "sidebar" } },
};

export default meta;
type Story = StoryObj<typeof NavItem>;

export const Inactive: Story = {
  args: { icon: <BoltIcon className="size-5" />, label: "Pricing", active: false },
  render: (args) => (
    <div className="w-64">
      <NavItem {...args} />
    </div>
  ),
};

export const Active: Story = {
  args: { icon: <BoltIcon className="size-5" />, label: "Pricing", active: true },
  render: (args) => (
    <div className="w-64">
      <NavItem {...args} />
    </div>
  ),
};
