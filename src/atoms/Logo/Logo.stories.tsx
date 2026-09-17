import type { Meta, StoryObj } from "@storybook/react";
import { Logo } from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Atoms/Logo",
  component: Logo,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const TwoTone: Story = {
  args: { accent: "RED", text: "DISPLAY", className: "text-2xl" },
};

export const SingleTone: Story = {
  args: { text: "FLUXER", className: "text-2xl" },
};

export const OnDarkBackground: Story = {
  args: { accent: "RED", text: "DISPLAY", textClassName: "text-white", className: "text-2xl" },
  parameters: { backgrounds: { default: "sidebar" } },
  render: (args) => (
    <div className="bg-brand-sidebar p-6">
      <Logo {...args} />
    </div>
  ),
};
