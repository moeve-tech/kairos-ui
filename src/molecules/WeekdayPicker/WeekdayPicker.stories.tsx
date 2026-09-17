import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { WeekdayPicker } from "./WeekdayPicker";

const LABELS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

const meta: Meta<typeof WeekdayPicker> = {
  title: "Molecules/WeekdayPicker",
  component: WeekdayPicker,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof WeekdayPicker>;

export const Empty: Story = {
  args: { labels: LABELS, selected: [] },
};

export const SomeSelected: Story = {
  args: { labels: LABELS, selected: [0, 1, 2, 3, 4] },
};

export const Interactive: Story = {
  render: () => {
    function Wrapper() {
      const [selected, setSelected] = useState<number[]>([1, 3]);
      return (
        <WeekdayPicker
          labels={LABELS}
          selected={selected}
          onToggle={(day) => setSelected((prev) => (prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()))}
        />
      );
    }
    return <Wrapper />;
  },
};
