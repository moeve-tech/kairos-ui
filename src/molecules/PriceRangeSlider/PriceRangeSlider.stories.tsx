import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { PriceRangeSlider, type PriceRangeSliderProps } from "./PriceRangeSlider";

const currencyFormatter = (value: number) =>
  new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(value);

// PriceRangeSlider is fully controlled (see the component's own doc comment) -
// it has no state of its own, so the story needs to hold `value` itself to
// let you actually drag the slider in the canvas.
function ControlledPriceRangeSlider(args: PriceRangeSliderProps) {
  const [value, setValue] = useState(args.value);
  return <PriceRangeSlider {...args} value={value} onChange={setValue} />;
}

const meta: Meta<typeof PriceRangeSlider> = {
  title: "Molecules/PriceRangeSlider",
  component: PriceRangeSlider,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof PriceRangeSlider>;

export const Interactive: Story = {
  args: {
    min: 22.19,
    max: 25.19,
    value: 24.1,
    currentPrice: 23.69,
    recommendedPrice: 23.89,
    currencyFormatter,
    onChange: () => {},
  },
  render: (args) => (
    <div className="w-[420px]">
      <ControlledPriceRangeSlider {...args} />
    </div>
  ),
};
