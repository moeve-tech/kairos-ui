import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SegmentedTabs, type SegmentedTabsProps } from "./SegmentedTabs";

const OPTIONS = [
  { value: "REGULAR", label: "Regular" },
  { value: "PREMIUM", label: "Premium" },
  { value: "DIESEL", label: "Diesel" },
];

function ControlledSegmentedTabs(args: SegmentedTabsProps) {
  const [value, setValue] = useState(args.value);
  return <SegmentedTabs {...args} value={value} onChange={setValue} />;
}

const meta: Meta<typeof SegmentedTabs> = {
  title: "Molecules/SegmentedTabs",
  component: SegmentedTabs,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof SegmentedTabs>;

export const Interactive: Story = {
  args: { options: OPTIONS, value: "REGULAR", onChange: () => {} },
  render: (args) => <ControlledSegmentedTabs {...args} />,
};
