import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { SelectableCard } from "./SelectableCard";
import { FuelIcon } from "../../icons";

const meta: Meta<typeof SelectableCard> = {
  title: "Molecules/SelectableCard",
  component: SelectableCard,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
};

export default meta;
type Story = StoryObj<typeof SelectableCard>;

export const Unselected: Story = {
  args: {
    icon: <FuelIcon className="size-5" />,
    title: "Estación Norte",
    subtitle: "Monterrey, NL",
    selected: false,
  },
  render: (args) => (
    <div className="w-80">
      <SelectableCard {...args} />
    </div>
  ),
};

export const Selected: Story = {
  args: {
    icon: <FuelIcon className="size-5" />,
    title: "Estación Norte",
    subtitle: "Monterrey, NL",
    selected: true,
  },
  render: (args) => (
    <div className="w-80">
      <SelectableCard {...args} />
    </div>
  ),
};

export const List: Story = {
  render: () => {
    function Wrapper() {
      const [selectedId, setSelectedId] = useState(1);
      const stations = [
        { id: 1, name: "Estación Norte", location: "Monterrey, NL" },
        { id: 2, name: "Estación Centro", location: "CDMX" },
        { id: 3, name: "Estación Sur", location: "Guadalajara, JAL" },
      ];
      return (
        <div className="flex w-80 flex-col gap-2">
          {stations.map((s) => (
            <SelectableCard
              key={s.id}
              icon={<FuelIcon className="size-5" />}
              title={s.name}
              subtitle={s.location}
              selected={selectedId === s.id}
              onClick={() => setSelectedId(s.id)}
            />
          ))}
        </div>
      );
    }
    return <Wrapper />;
  },
};
