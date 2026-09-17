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

export const WithMedia: Story = {
  args: {
    icon: <FuelIcon className="size-4" />,
    title: "Estación Norte",
    subtitle: "Monterrey, NL",
    media: (
      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-accent/30 text-text-tertiary">
        (mapa u otra imagen real aquí)
      </div>
    ),
  },
  render: (args) => (
    <div className="w-72">
      <SelectableCard {...args} />
    </div>
  ),
};

export const Grid: Story = {
  render: () => {
    function Wrapper() {
      const [selectedId, setSelectedId] = useState(1);
      const stations = [
        { id: 1, name: "Estación Norte", location: "Monterrey, NL" },
        { id: 2, name: "Estación Centro", location: "CDMX" },
        { id: 3, name: "Estación Sur", location: "Guadalajara, JAL" },
      ];
      return (
        <div className="grid w-full max-w-3xl grid-cols-3 gap-4">
          {stations.map((s) => (
            <SelectableCard
              key={s.id}
              icon={<FuelIcon className="size-4" />}
              title={s.name}
              subtitle={s.location}
              selected={selectedId === s.id}
              onClick={() => setSelectedId(s.id)}
              media={
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-primary/20 to-brand-accent/30 text-xs text-text-tertiary">
                  mapa
                </div>
              }
            />
          ))}
        </div>
      );
    }
    return <Wrapper />;
  },
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
