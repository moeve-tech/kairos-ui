import type { Meta, StoryObj } from "@storybook/react";
import { ProgressBar } from "./ProgressBar";

const meta: Meta<typeof ProgressBar> = {
  title: "Atoms/ProgressBar",
  component: ProgressBar,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const Default: Story = {
  args: { value: 42 },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Segmented: Story = {
  args: { value: 50, segments: 3, fillClassName: "bg-info" },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};

export const Clamped: Story = {
  args: { value: 150 },
  render: (args) => (
    <div className="w-64">
      <ProgressBar {...args} />
    </div>
  ),
};
