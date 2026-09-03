import type { Meta, StoryObj } from "@storybook/react";
import { Avatar } from "./Avatar";
import { UserCircleIcon } from "../../icons";

const meta: Meta<typeof Avatar> = {
  title: "Atoms/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Letter: Story = {
  args: { children: "O", className: "bg-danger-bg text-danger-dark" },
};

export const Icon: Story = {
  args: { children: <UserCircleIcon className="size-4" />, className: "bg-brand-primary text-white" },
};

export const Small: Story = {
  args: { children: "M", className: "bg-brand-primary text-white", size: "sm" },
};
